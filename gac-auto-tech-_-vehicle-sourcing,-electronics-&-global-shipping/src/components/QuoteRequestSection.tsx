import React, { useState, useEffect } from 'react';
import { CURRENCIES } from '../data/mockData';
import { useSite } from './SiteShell';
import { submitEnquiry } from '../data/enquiries';
import { ServiceType, QuoteFormData } from '../types';
import { MessageCircle, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface QuoteRequestSectionProps {
  initialService?: ServiceType;
  initialItemTitle?: string;
  onOpenPrivacy: () => void;
}

/* Inputs stay at text-base (17px) so focusing one never triggers the iOS zoom. */
const inputBase =
  'w-full rounded-control border bg-transparent px-3.5 py-3 text-base transition-colors placeholder:text-[#78787f] focus:outline-none focus:border-black/50 dark:focus:border-white/55';
const labelBase = 'mb-1.5 block text-sm font-bold';

export const QuoteRequestSection: React.FC<QuoteRequestSectionProps> = ({
  initialService = 'vehicle_sourcing',
  initialItemTitle = '',
  onOpenPrivacy
}) => {
  const { whatsappUrl } = useSite();
  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: '',
    email: '',
    whatsappNumber: '',
    serviceRequired: initialService,
    destinationCountry: '',
    budgetAmount: '',
    currency: 'USD',
    requirements: initialItemTitle ? `Enquiry regarding: ${initialItemTitle}` : '',
    consentAgreed: false,
    vehicleMakeModelOrLink: '',
    shippingOriginAndCargo: '',
    merchandiseDescriptionOrLink: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (initialService) {
      setFormData(prev => ({
        ...prev,
        serviceRequired: initialService,
        requirements: initialItemTitle ? `Enquiry regarding: ${initialItemTitle}` : prev.requirements,
        vehicleMakeModelOrLink: initialService === 'vehicle_sourcing' && initialItemTitle ? initialItemTitle : prev.vehicleMakeModelOrLink
      }));
    }
  }, [initialService, initialItemTitle]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof QuoteFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.serviceRequired) {
      newErrors.serviceRequired = 'Please select a service.';
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Please specify your requirements or message.';
    }

    if (!formData.consentAgreed) {
      newErrors.consentAgreed = 'You must agree to be contacted regarding this enquiry.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');
    const specificDetail =
      formData.vehicleMakeModelOrLink ||
      formData.shippingOriginAndCargo ||
      formData.merchandiseDescriptionOrLink ||
      '';
    try {
      await submitEnquiry({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        whatsapp: formData.whatsappNumber.trim(),
        service: formData.serviceRequired,
        destination: formData.destinationCountry.trim(),
        budget: formData.budgetAmount ? `${formData.currency} ${formData.budgetAmount}` : '',
        details: [specificDetail.trim(), formData.requirements.trim()].filter(Boolean).join(' — '),
      });
      setIsSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'We could not send your enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      fullName: '',
      email: '',
      whatsappNumber: '',
      serviceRequired: 'vehicle_sourcing',
      destinationCountry: '',
      budgetAmount: '',
      currency: 'USD',
      requirements: '',
      consentAgreed: false,
      vehicleMakeModelOrLink: '',
      shippingOriginAndCargo: '',
      merchandiseDescriptionOrLink: ''
    });
    setErrors({});
  };

  return (
    <section id="quote-form" className="ui-canvas border-t ui-divider py-14 text-[#111113] sm:py-20 lg:py-24 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Context & Alternative Channel */}
          <div className="lg:col-span-5">
            <p className="eyebrow text-muted">Get in touch</p>

            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Let's discuss what you need
            </h2>

            <p className="mt-4 text-base text-muted">
              Tell us about your vehicle, merchandise, or shipping requirements.
              Share the details below so we can review your enquiry.
            </p>

            {/* WhatsApp Alternative */}
            <div className="ui-card mt-8 w-full rounded-panel p-6">
              <div className="flex items-center gap-3">
                <span className="ui-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-media">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold">Prefer a conversation?</h3>
                  <p className="text-sm text-muted">Chat with our team directly</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-muted">
                Send vehicle links, item details, or shipping questions directly on WhatsApp for real-time discussion.
              </p>

              <a
                href={whatsappUrl('Hello GAC Auto Tech, I would like to discuss my requirements.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-theme mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="lg:col-span-7">
            <div className="ui-card relative rounded-panel p-6 sm:p-8">
              
              {isSuccess ? (
                /* Successful Submission Visual State */
                <div className="py-10 text-center flex flex-col items-center">
                  <span className="ui-icon mb-5 flex h-16 w-16 items-center justify-center rounded-full">
                    <CheckCircle2 className="w-8 h-8" />
                  </span>

                  <h3 className="font-display text-2xl">Thank you. Your enquiry has been received.</h3>

                  <p className="mt-3 mb-8 max-w-md text-base text-muted">
                    Our team will review your specifications regarding{' '}
                    <strong className="font-bold text-[#111113] dark:text-white">
                      {formData.serviceRequired.replace('_', ' ')}
                    </strong>{' '}
                    and get back to you at <span className="font-bold">{formData.email}</span>.
                  </p>

                  <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                    <a
                      href={whatsappUrl(`Hello GAC Auto Tech, I submitted an enquiry for ${formData.fullName} regarding ${formData.serviceRequired}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-theme inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Follow up on WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-full border ui-divider px-5 py-3 text-sm font-bold transition-colors hover:bg-black/5 cursor-pointer dark:hover:bg-white/10"
                    >
                      Submit another enquiry
                    </button>
                  </div>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-5">

                  <div className="border-b ui-divider pb-4">
                    <h3 className="font-display text-lg">Enquiry details</h3>
                    <p className="text-sm text-muted">
                      Fields marked with <span className="text-accent font-bold">*</span> are required.
                    </p>
                  </div>

                  {/* Name and Email in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className={labelBase}>
                        Full name <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className={`${inputBase} ${errors.fullName ? 'border-blush' : 'ui-divider'}`}
                      />
                      {errors.fullName && (
                        <p className="mt-1.5 text-sm font-medium text-accent flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className={labelBase}>
                        Email address <span className="text-accent">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@example.com"
                        className={`${inputBase} ${errors.email ? 'border-blush' : 'ui-divider'}`}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-sm font-medium text-accent flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* WhatsApp Number & Destination Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="whatsappNumber" className={labelBase}>
                        WhatsApp number <span className="text-muted font-medium">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        id="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                        placeholder="+1 (555) 000-0000 or +233 ..."
                        className={`${inputBase} ui-divider`}
                      />
                    </div>

                    <div>
                      <label htmlFor="destinationCountry" className={labelBase}>
                        Destination country <span className="text-muted font-medium">(optional)</span>
                      </label>
                      <input
                        type="text"
                        id="destinationCountry"
                        value={formData.destinationCountry}
                        onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                        placeholder="e.g. Ghana, Canada, UK, USA"
                        className={`${inputBase} ui-divider`}
                      />
                    </div>
                  </div>

                  {/* Service, plus the one follow-up field that service needs. */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="serviceRequired" className={labelBase}>
                        Service required <span className="text-accent">*</span>
                      </label>
                      <select
                        id="serviceRequired"
                        value={formData.serviceRequired}
                        onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value as ServiceType })}
                        className={`${inputBase} ui-divider cursor-pointer`}
                      >
                        <option value="vehicle_sourcing">Vehicle sourcing</option>
                        <option value="shipping_quote">Shipping quote</option>
                        <option value="general_merchandise">General merchandise</option>
                      </select>
                    </div>

                    {formData.serviceRequired === 'vehicle_sourcing' && (
                      <div>
                        <label htmlFor="vehicleMakeModelOrLink" className={labelBase}>
                          Make / model or auction link
                        </label>
                        <input
                          type="text"
                          id="vehicleMakeModelOrLink"
                          value={formData.vehicleMakeModelOrLink}
                          onChange={(e) => setFormData({ ...formData, vehicleMakeModelOrLink: e.target.value })}
                          placeholder="e.g. 2022 Audi Q5 or a listing link"
                          className={`${inputBase} ui-divider`}
                        />
                      </div>
                    )}

                    {formData.serviceRequired === 'shipping_quote' && (
                      <div>
                        <label htmlFor="shippingOriginAndCargo" className={labelBase}>
                          Origin and cargo
                        </label>
                        <input
                          type="text"
                          id="shippingOriginAndCargo"
                          value={formData.shippingOriginAndCargo}
                          onChange={(e) => setFormData({ ...formData, shippingOriginAndCargo: e.target.value })}
                          placeholder="e.g. Toronto · 1 vehicle and 2 barrels"
                          className={`${inputBase} ui-divider`}
                        />
                      </div>
                    )}

                    {formData.serviceRequired === 'general_merchandise' && (
                      <div>
                        <label htmlFor="merchandiseDescriptionOrLink" className={labelBase}>
                          Item description or link
                        </label>
                        <input
                          type="text"
                          id="merchandiseDescriptionOrLink"
                          value={formData.merchandiseDescriptionOrLink}
                          onChange={(e) => setFormData({ ...formData, merchandiseDescriptionOrLink: e.target.value })}
                          placeholder="e.g. Industrial tools or a store URL"
                          className={`${inputBase} ui-divider`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Budget Amount and Currency Selector */}
                  <div>
                    <label htmlFor="budgetAmount" className={labelBase}>
                      Budget and currency <span className="text-muted font-medium">(optional)</span>
                    </label>
                    <div className="flex overflow-hidden rounded-control border ui-divider focus-within:border-black/50 dark:focus-within:border-white/55">
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="border-r ui-divider bg-transparent px-3 py-3 text-sm font-bold focus:outline-none cursor-pointer"
                        aria-label="Currency"
                      >
                        {CURRENCIES.map((curr) => (
                          <option key={curr.code} value={curr.code}>
                            {curr.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        id="budgetAmount"
                        value={formData.budgetAmount}
                        onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
                        placeholder="e.g. 15000"
                        className="flex-1 bg-transparent px-3.5 py-3 text-base placeholder:text-[#78787f] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Requirements or Message */}
                  <div>
                    <label htmlFor="requirements" className={labelBase}>
                      Requirements or message <span className="text-accent">*</span>
                    </label>
                    <textarea
                      id="requirements"
                      rows={4}
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="Please describe your specific purchase, condition requirements, or timeline..."
                      className={`${inputBase} ${errors.requirements ? 'border-blush' : 'ui-divider'}`}
                    />
                    {errors.requirements && (
                      <p className="mt-1.5 text-sm font-medium text-accent flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.requirements}</span>
                      </p>
                    )}
                  </div>

                  {/* Consent Checkbox */}
                  <div>
                    <label className="flex items-start gap-3 text-sm text-muted cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.consentAgreed}
                        onChange={(e) => setFormData({ ...formData, consentAgreed: e.target.checked })}
                        className="mt-0.5 h-5 w-5 shrink-0 rounded accent-[#111113] dark:accent-white"
                      />
                      <span>
                        I agree that GAC Auto Tech may contact me about this enquiry.{' '}
                        <button
                          type="button"
                          onClick={onOpenPrivacy}
                          className="text-accent font-bold hover:underline inline cursor-pointer"
                        >
                          See the privacy policy.
                        </button>
                      </span>
                    </label>
                    {errors.consentAgreed && (
                      <p className="mt-1.5 text-sm font-medium text-accent flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.consentAgreed}</span>
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <p role="alert" className="flex items-start gap-2 rounded-control border border-black/15 px-3.5 py-3 text-sm font-semibold dark:border-white/20">
                      <AlertCircle className="mt-0.5 w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-theme w-full flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold disabled:opacity-70 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting enquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Send my enquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
