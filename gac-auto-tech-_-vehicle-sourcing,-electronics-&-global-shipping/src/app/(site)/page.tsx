import App from '../../App';
import { getHeroSlides, getVehicles } from '../../lib/content';

export default async function Page() {
  const [vehicles, heroSlides] = await Promise.all([getVehicles(), getHeroSlides()]);
  return <App vehicles={vehicles} heroSlides={heroSlides} />;
}
