import { Db, MongoClient } from 'mongodb';

const CONNECT_TIMEOUT_MS = 10_000;
// After a failed connection, skip straight to fallback content for a while instead of making every visitor wait.
const RETRY_AFTER_MS = 30_000;

// One client per server process. Serverless functions and dev hot-reloads reuse it instead of opening new pools.
const globalForMongo = globalThis as unknown as { gacMongoClient?: Promise<MongoClient>; gacMongoFailedAt?: number };

const getClient = () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  const failedAt = globalForMongo.gacMongoFailedAt;
  if (!globalForMongo.gacMongoClient && failedAt && Date.now() - failedAt < RETRY_AFTER_MS) {
    return Promise.reject(new Error('MongoDB was unreachable moments ago; retrying shortly.'));
  }

  if (!globalForMongo.gacMongoClient) {
    const client = new MongoClient(uri, { appName: 'gac-auto-tech', maxPoolSize: 10, serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS });
    let timer: ReturnType<typeof setTimeout> | undefined;
    // The SRV/TXT DNS lookup is not covered by the driver's own timeouts, so cap the whole connect.
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`MongoDB did not connect within ${CONNECT_TIMEOUT_MS / 1000}s`)), CONNECT_TIMEOUT_MS);
    });
    globalForMongo.gacMongoClient = Promise.race([client.connect(), timeout])
      .then((connected) => {
        clearTimeout(timer);
        globalForMongo.gacMongoFailedAt = undefined;
        return connected;
      })
      .catch((err) => {
        clearTimeout(timer);
        client.close().catch(() => undefined);
        // Forget the failed attempt so a later request retries rather than failing forever.
        globalForMongo.gacMongoClient = undefined;
        globalForMongo.gacMongoFailedAt = Date.now();
        throw err;
      });
  }
  return globalForMongo.gacMongoClient;
};

export const getDb = async (): Promise<Db> => (await getClient()).db(process.env.MONGODB_DB || 'gac_auto_tech');
