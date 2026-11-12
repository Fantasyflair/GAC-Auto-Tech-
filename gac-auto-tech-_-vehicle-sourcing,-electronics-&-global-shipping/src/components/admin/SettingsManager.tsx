'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { SiteSettings } from '../../types';
import { buildWhatsAppUrl } from '../../data/mockData';
import { adminFetch, fieldClass, jsonInit, labelClass } from './adminApi';
import { Panel, useAdminUi } from './ui';

const SOCIAL_FIELDS: { key: keyof SiteSettings['social']; label: string; placeholder: string }[] = [
  { key: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/yourpage' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://www.facebook.com/yourpage' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://www.tiktok.com/@yourpage' },
  { key: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/yourpage' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/company/yourpage' },
];

export const SettingsManager: React.FC<{ onUnauthorized: () => void }> = ({ onUnauthorized }) => {
  const { notify } = useAdminUi();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    adminFetch<{ settings: SiteSettings }>('/api/admin/settings').then((result) => {
      if (result.ok) setSettings(result.data.settings);
      else if (result.status === 401) onUnauthorized();
      else setMessage(result.error);
    });
  }, [onUnauthorized]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    const result = await adminFetch('/api/admin/settings', jsonInit('PUT', settings));
    setSaving(false);
    if (!result.ok && result.status === 401) return onUnauthorized();
    notify(result.ok ? 'Contact details saved. The website now uses them everywhere.' : result.error, result.ok ? 'success' : 'error');
  };

  if (!settings) {
    return (
      <p className="mt-10 flex items-center justify-center gap-2 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        {message || 'Loading contact details…'}
      </p>
    );
  }

  return (
    <form onSubmit={save} className="grid gap-5 xl:grid-cols-2">
      <Panel title="Contact" description="Used by every WhatsApp button on the website.">
        <label className="block">
          <span className={labelClass}>WhatsApp number</span>
          <input
            value={settings.whatsappNumber}
            onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
            placeholder="233201234567"
            inputMode="tel"
            className={fieldClass}
          />
          <span className="mt-1.5 block text-sm text-muted">Include the country code, without + or spaces (Ghana starts with 233, Canada with 1).</span>
        </label>
        <a
          href={buildWhatsAppUrl(settings.whatsappNumber, 'Test message from the GAC Auto Tech admin dashboard.')}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-bold underline underline-offset-4"
        >
          Test this number in WhatsApp
        </a>
        <label className="mt-5 block">
          <span className={labelClass}>Email (optional)</span>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            placeholder="sales@gacautotech.com"
            className={fieldClass}
          />
        </label>
      </Panel>

      <Panel title="Social media" description="Leave a link empty to hide that icon on the website.">
        <div className="grid gap-4">
          {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
            <label key={key} className="block">
              <span className={labelClass}>{label}</span>
              <input
                type="url"
                value={settings.social[key]}
                onChange={(e) => setSettings({ ...settings, social: { ...settings.social, [key]: e.target.value } })}
                placeholder={placeholder}
                className={fieldClass}
              />
            </label>
          ))}
        </div>
      </Panel>

      <div className="xl:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="btn-theme inline-flex w-full items-center justify-center gap-2 rounded-control px-6 py-3.5 text-sm font-bold disabled:opacity-70 cursor-pointer sm:w-auto"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save contact details
        </button>
      </div>
    </form>
  );
};
