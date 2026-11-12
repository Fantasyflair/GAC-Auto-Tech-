import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  CarFront,
  Container,
  Boxes,
} from 'lucide-react';
import { ServiceType } from '../types';
import { Reveal, rise, trackSpotlight } from './Reveal';

interface BentoHomeProps {
  onSelectService: (service: ServiceType) => void;
  onExploreVehicles: () => void;
}

const services: {
  id: ServiceType;
  anchor?: string;
  icon: React.ElementType;
  image: string;
  title: string;
  copy: string;
  action: string;
}[] = [
  {
    id: 'vehicle_sourcing',
    anchor: 'vehicle-sourcing',
    icon: CarFront,
    image: '/images/g-wagon.jpg',
    title: 'Vehicle sourcing',
    copy: 'Auction and dealer cars from Canada, the USA and the UK, checked and prepared for export.',
    action: 'See vehicles',
  },
  {
    id: 'shipping_quote',
    anchor: 'shipping',
    icon: Container,
    image: '/images/port-aerial.jpg',
    title: 'Shipping',
    copy: 'RoRo and container freight to Tema and other ports, with export paperwork handled.',
    action: 'Get a quote',
  },
  {
    id: 'general_merchandise',
    icon: Boxes,
    image: '/images/warehouse-boxes.jpg',
    title: 'General goods',
    copy: 'Equipment, spare parts and personal goods, combined with your other items in one shipment.',
    action: 'Request an item',
  },
];

export const BentoHome: React.FC<BentoHomeProps> = ({
  onSelectService,
  onExploreVehicles,
}) => {
  return (
    <section id="services" className="ui-canvas border-t ui-divider py-14 text-[#111113] sm:py-20 lg:py-24 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="grid gap-4 border-b ui-divider pb-7 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p className="eyebrow text-muted">Services</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Three ways we help</h2>
          </div>
          <p className="text-base text-muted lg:col-span-5 lg:text-right">
            Pick the service you need, or send one enquiry and we will route it to the right desk.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.button
                key={service.id}
                type="button"
                id={service.anchor}
                onClick={() => (service.id === 'vehicle_sourcing' ? onExploreVehicles() : onSelectService(service.id))}
                onMouseMove={trackSpotlight}
                {...rise(i)}
                className="spotlight ui-card group flex h-full overflow-hidden rounded-panel text-left cursor-pointer sm:flex-col"
              >
                <span className="ui-well relative block w-28 shrink-0 overflow-hidden sm:aspect-[4/3] sm:w-full">
                  <img
                    src={service.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </span>
                <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.8} />
                    <h3 className="font-display text-lg sm:text-xl">{service.title}</h3>
                  </div>
                  <p className="mt-1.5 text-sm text-muted sm:text-base">{service.copy}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-bold sm:pt-4">
                    {service.action}
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
