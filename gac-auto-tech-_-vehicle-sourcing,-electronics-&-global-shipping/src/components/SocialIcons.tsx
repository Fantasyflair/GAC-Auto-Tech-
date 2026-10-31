import React from 'react';
import { SOCIAL_LINKS, getWhatsAppUrl } from '../data/mockData';
import { WhatsAppIcon } from './WhatsAppIcon';

type IconProps = { className?: string };

const InstagramIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" />
  </svg>
);

const XIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z" />
  </svg>
);

const TikTokIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.7a5.8 5.8 0 1 0 4.9 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z" />
  </svg>
);

const LinkedInIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M6.9 8.9H3.6V20h3.3V8.9zM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM20.4 13.6c0-3-1.6-4.9-4.3-4.9-1.4 0-2.4.8-2.8 1.5V8.9H10V20h3.3v-5.6c0-1.5.3-2.9 2.1-2.9s1.8 1.7 1.8 3V20h3.3v-6.4z" />
  </svg>
);

const networks = [
  { label: 'Instagram', href: SOCIAL_LINKS.instagram, Icon: InstagramIcon },
  { label: 'Facebook', href: SOCIAL_LINKS.facebook, Icon: FacebookIcon },
  { label: 'X', href: SOCIAL_LINKS.x, Icon: XIcon },
  { label: 'TikTok', href: SOCIAL_LINKS.tiktok, Icon: TikTokIcon },
  { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin, Icon: LinkedInIcon },
];

interface SocialIconsProps {
  className?: string;
  itemClassName?: string;
}

export const SocialIcons: React.FC<SocialIconsProps> = ({
  className = '',
  itemClassName = 'bg-[#111113] text-white hover:bg-black dark:bg-white dark:text-[#111113] dark:hover:bg-white/90',
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {networks.map(({ label, href, Icon }) => (
      <a
        key={label}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`GAC Auto Tech on ${label}`}
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${itemClassName}`}
      >
        <Icon className="w-4 h-4" />
      </a>
    ))}
    <a
      href={getWhatsAppUrl('Hello GAC Auto Tech, I found you through your website.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with GAC Auto Tech on WhatsApp"
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${itemClassName}`}
    >
      <WhatsAppIcon className="w-4 h-4" />
    </a>
  </div>
);
