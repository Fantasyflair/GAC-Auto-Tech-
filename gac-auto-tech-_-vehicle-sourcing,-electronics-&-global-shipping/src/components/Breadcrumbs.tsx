import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs: React.FC<{ items: { label: string; href?: string }[] }> = ({ items }) => (
  <nav aria-label="Breadcrumb">
    <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
      {items.map((item, i) => (
        <li key={item.label} className="flex min-w-0 items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />}
          {item.href ? (
            <Link href={item.href} className="font-medium underline-offset-4 hover:text-[#111113] hover:underline dark:hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="truncate font-semibold text-[#111113] dark:text-white" aria-current="page">
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);
