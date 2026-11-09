import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  CarFront,
  MonitorSmartphone,
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
  title: string;
  copy: string;
  action: string;
}[] = [
  {
    id: 'vehicle_sourcing',
    anchor: 'vehicle-sourcing',
    icon: CarFront,
    title: 'Vehicle sourcing',
    copy: 'Auction and dealer cars from Canada, the USA and the UK, checked and prepared for export.',
    action: 'See vehicles',
  },
  {
    id: 'electronics_enquiry',
    icon: MonitorSmartphone,
    title: 'Electronics',
    copy: 'Laptops, phones, consoles and accessories, as single units or wholesale orders.',
    action: 'Start an enquiry',
  },
  {
    id: 'shipping_quote',
    anchor: 'shipping',
    icon: Container,
    title: 'Shipping',
    copy: 'RoRo and container freight to Tema and other ports, with export paperwork handled.',
    action: 'Get a quote',
  },
  {
    id: 'general_merchandise',
    icon: Boxes,
    title: 'General goods',
    copy: 'Equipment, spare parts and personal goods, combined with your other items in one shipment.',
    action: 'Request an item',
  },
];

const steps = [
  { title: 'Share what you need', copy: 'Send the vehicle, product or cargo you want, plus your budget and destination.' },
  { title: 'Review the options', copy: 'We confirm sourcing options, condition reports and the full landed cost before anything is bought.' },
  { title: 'Agree the details', copy: 'Scope, payment and timing are confirmed in writing before we proceed.' },
  { title: 'We coordinate it', copy: 'Purchase, export and shipping are arranged through to collection in Ghana.' },
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
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Four ways we help</h2>
          </div>
          <p className="text-base text-muted lg:col-span-5 lg:text-right">
            Pick the service you need, or send one enquiry and we will route it to the right desk.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
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
                className="spotlight ui-card group flex h-full items-start gap-4 rounded-panel p-5 text-left cursor-pointer sm:flex-col sm:gap-0 sm:p-6"
              >
                <span className="ui-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-media sm:h-12 sm:w-12">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.6} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col sm:w-full">
                  <h3 className="font-display text-xl sm:mt-5">{service.title}</h3>
                  <p className="mt-1.5 text-base text-muted sm:mt-2">{service.copy}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold sm:pt-5">
                    {service.action}
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* How it works: four plain steps, grouped on one surface rather than four cards. */}
        <Reveal className="ui-card mt-6 rounded-panel p-6 sm:p-8">
          <h3 className="font-display text-xl">How an order works</h3>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, i) => (
              <li key={step.title} className="border-t-2 ui-divider pt-4 lg:border-t-2">
                <span className="font-display text-sm font-bold text-accent">0{i + 1}</span>
                <p className="mt-1 font-display text-base font-bold">{step.title}</p>
                <p className="mt-1.5 text-sm text-muted">{step.copy}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
};
