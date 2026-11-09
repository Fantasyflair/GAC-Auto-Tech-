import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

/* A native select keeps the phone's own picker, which beats any custom dropdown on touch. */
export const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, options, className = '' }) => (
  <label className={`block min-w-0 ${className}`}>
    <span className="mb-1.5 block text-sm font-bold">{label}</span>
    <span className="relative block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none truncate rounded-control border ui-divider bg-white py-3 pl-3.5 pr-10 text-base font-medium text-[#111113] transition-colors focus:border-black/50 focus:outline-none cursor-pointer dark:bg-[#151517] dark:text-white dark:focus:border-white/55"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </span>
  </label>
);
