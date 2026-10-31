import React from 'react';
import { motion } from 'motion/react';
import { SAMPLE_VEHICLES } from '../data/mockData';
import { VehicleListing } from '../types';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Reveal, rise, trackSpotlight } from './Reveal';
import { AddToListButton } from './AddToListButton';

interface FeaturedVehiclesProps {
  onViewDetails: (vehicle: VehicleListing) => void;
  onRequestPrice: (vehicle: VehicleListing) => void;
  onBrowseAll: () => void;
}

export const FeaturedVehicles: React.FC<FeaturedVehiclesProps> = ({
  onViewDetails,
  onRequestPrice,
  onBrowseAll
}) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const card = 'ui-card border-transparent';

  return (
    <section id="vehicles" className={`ui-canvas py-16 lg:py-24 ${dark ? 'text-white' : 'text-[#111113]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Featured vehicles</h2>
            <motion.div
              className="mt-3 h-[3px] accent-bar"
              initial={{ width: 0 }}
              whileInView={{ width: 56 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <p className="mt-3 text-sm text-muted">
              Luxury sedans, electrics, and performance SUVs available through Copart and IAAI sourcing.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={onBrowseAll}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-theme text-xs font-semibold cursor-pointer self-start sm:self-auto shrink-0"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {SAMPLE_VEHICLES.map((vehicle, idx) => (
            <motion.article
              key={vehicle.id}
              onMouseMove={trackSpotlight}
              {...rise(idx)}
              className={`spotlight group flex flex-col justify-between rounded-3xl border p-5 sm:p-6 transition-colors duration-300 ${card}`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-muted">
                  <span className="uppercase tracking-[0.14em]">{vehicle.sourceType}</span>
                  <span className="ui-well rounded-full px-2.5 py-1 font-semibold text-accent">
                    {vehicle.availability}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onViewDetails(vehicle)}
                  className="ui-well relative my-5 block aspect-[16/10] w-full overflow-hidden rounded-2xl cursor-pointer"
                >
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.title}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                </button>

                <h3 className="font-display text-lg font-bold leading-snug">{vehicle.title}</h3>

                <dl className="mt-3 space-y-1 text-[12px] text-muted">
                  <div className="flex items-center justify-between gap-3">
                    <dt>Transmission</dt>
                    <dd className={`text-right ${dark ? 'text-white/90' : 'text-[#18181B]'}`}>{vehicle.specs.transmission}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt>Condition</dt>
                    <dd className={`text-right ${dark ? 'text-white/90' : 'text-[#18181B]'}`}>{vehicle.condition.split('·')[0]}</dd>
                  </div>
                </dl>
              </div>

              <div className={`mt-6 flex items-center justify-between gap-2 border-t pt-4 ${dark ? 'border-white/10' : 'border-black/5'}`}>
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-muted">Pricing</span>
                  <span className="text-sm font-semibold text-accent">On enquiry</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AddToListButton
                    item={{
                      id: vehicle.id,
                      title: vehicle.title,
                      reference: vehicle.listingRef,
                      imageUrl: vehicle.imageUrl,
                      service: 'vehicle_sourcing',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onViewDetails(vehicle)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border cursor-pointer transition-colors ${
                      dark ? 'border-white/15 hover:bg-white/10' : 'border-black/15 hover:bg-black/5'
                    }`}
                  >
                    Details
                  </button>
                  <motion.button
                    type="button"
                    onClick={() => onRequestPrice(vehicle)}
                    whileTap={{ scale: 0.95 }}
                    className="px-3.5 py-1.5 text-xs font-semibold btn-theme rounded-full cursor-pointer whitespace-nowrap"
                  >
                    Request price
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
