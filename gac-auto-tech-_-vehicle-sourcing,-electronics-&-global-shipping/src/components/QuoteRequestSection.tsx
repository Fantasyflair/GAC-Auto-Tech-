import React, { useState, useEffect } from 'react';
import { CURRENCIES, getWhatsAppUrl } from '../data/mockData';
import { ServiceType, QuoteFormData } from '../types';
import { MessageCircle, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface QuoteRequestSectionProps {
  initialService?: ServiceType;
  initialItemTitle?: string;
  onOpenPrivacy: () => void;
}

export const QuoteRequestSection: React.FC<QuoteRequestSectionProps> = ({
  initialService = 'vehicle_sourcing',
  initialItemTitle = '',
  onOpenPrivacy
}) => {
  const { theme } = useTheme();
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
    electronicsModelAndQty: initialItemTitle ? initialItemTitle : '',
    merchandiseDescriptionOrLink: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialService) {
      setFormData(prev => ({
        ...prev,
        serviceRequired: initialService,
        requirements: initialItemTitle ? `Enquiry regarding: ${initialItemTitle}` : prev.requirements,
        electronicsModelAndQty: initialService === 'electronics_enquiry' && initialItemTitle ? initialItemTitle : prev.electronicsModelAndQty,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate real UI transition
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 900);
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
      electronicsModelAndQty: '',
      merchandiseDescriptionOrLink: ''
    });
    setErrors({});
  };

  return (
    <section id="quote-form" className={`py-20 lg:py-28 border-b transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#09090B] border-[#26262A] text-white' : 'bg-[#F6F7F9] border-[#E4E6EB] text-[#18181B]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          
          {/* Left Column: Context & Alternative Channel */}
          <div className="lg:col-span-5 flex flex-col items-start pt-2">
            
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full dot-accent" />
              <span className="text-xs font-bold tracking-[0.2em] text-muted uppercase">
                GET IN TOUCH
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5 text-balance">
              Let’s Discuss What You Need.
            </h2>

            <p className="text-base text-muted leading-relaxed mb-10">
              Tell us about your vehicle, electronics, merchandise, or shipping requirements. 
              Share the details below so we can review your enquiry.
            </p>

            {/* WhatsApp Alternative */}
            <div className={`w-full p-6 rounded-3xl border shadow-sm ${
              theme === 'dark' ? 'bg-[#141416] border-[#26262A]' : 'bg-white border-[#E4E6EB]'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    Prefer a conversation?
                  </h3>
                  <span className="text-xs text-muted">
                    Chat with our team directly
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted mb-4 leading-relaxed">
                Send vehicle links, electronics specs, or shipping questions directly on WhatsApp for real-time discussion.
              </p>

              <a
                href={getWhatsAppUrl('Hello GAC Auto Tech, I would like to discuss my requirements.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#141416] hover:bg-[#0B0B0D] border border-[#26262A] rounded-full transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="lg:col-span-7">
            <div className={`rounded-3xl p-6 sm:p-9 border shadow-xl ${
              theme === 'dark' ? 'bg-[#141416] border-[#26262A]' : 'bg-white border-[#E4E6EB]'
            } relative`}>
              
              {isSuccess ? (
                /* Successful Submission Visual State */
                <div className="py-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#18181B] mb-2">
                    Thank you. Your enquiry has been received.
                  </h3>
                  
                  <p className="text-sm text-[#606570] max-w-md leading-relaxed mb-8">
                    Our team will review your specifications regarding{' '}
                    <strong className="text-[#18181B]">
                      {formData.serviceRequired.replace('_', ' ')}
                    </strong>{' '}
                    and get back to you at <span className="font-mono text-xs">{formData.email}</span>.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href={getWhatsAppUrl(`Hello GAC Auto Tech, I submitted an enquiry for ${formData.fullName} regarding ${formData.serviceRequired}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#18181B] hover:bg-black rounded-xl transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Follow Up on WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-5 py-2.5 text-xs font-semibold text-[#606570] hover:text-[#18181B] rounded-xl hover:bg-[#F6F7F9] transition-colors cursor-pointer"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  
                  <div className="border-b border-[#F0F2F5] pb-4 mb-2">
                    <h3 className="text-lg font-bold text-[#18181B]">
                      Enquiry Details
                    </h3>
                    <p className="text-xs text-muted">
                      Fields marked with <span className="text-accent">*</span> are required.
                    </p>
                  </div>

                  {/* Name and Email in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-semibold text-[#18181B] mb-1.5">
                        Full Name <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border ${
                          errors.fullName ? 'border-[#C9A8A8] bg-[#FBF7F7]' : 'border-[#E4E6EB]'
                        } focus:border-[#09090B] focus:ring-1 focus:ring-[#09090B]/15 transition-colors placeholder:text-[#BFC2C8]`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-accent flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-[#18181B] mb-1.5">
                        Email Address <span className="text-accent">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@example.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border ${
                          errors.email ? 'border-[#C9A8A8] bg-[#FBF7F7]' : 'border-[#E4E6EB]'
                        } focus:border-[#09090B] focus:ring-1 focus:ring-[#09090B]/15 transition-colors placeholder:text-[#BFC2C8]`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-accent flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* WhatsApp Number & Destination Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="whatsappNumber" className="block text-xs font-semibold text-[#18181B] mb-1.5">
                        WhatsApp Number <span className="text-muted font-normal">(Optional, include country code)</span>
                      </label>
                      <input
                        type="tel"
                        id="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                        placeholder="+1 (555) 000-0000 or +233 ..."
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#E4E6EB] focus:border-[#09090B] focus:ring-1 focus:ring-[#09090B]/15 transition-colors placeholder:text-[#BFC2C8]"
                      />
                    </div>

                    <div>
                      <label htmlFor="destinationCountry" className="block text-xs font-semibold text-[#18181B] mb-1.5">
                        Destination Country <span className="text-muted font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="destinationCountry"
                        value={formData.destinationCountry}
                        onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                        placeholder="e.g. Ghana, Canada, UK, USA"
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#E4E6EB] focus:border-[#09090B] focus:ring-1 focus:ring-[#09090B]/15 transition-colors placeholder:text-[#BFC2C8]"
                      />
                    </div>
                  </div>

                  {/* Service Required Dropdown */}
                  <div>
                    <label htmlFor="serviceRequired" className="block text-xs font-semibold text-[#18181B] mb-1.5">
                      Service Required <span className="text-accent">*</span>
                    </label>
                    <select
                      id="serviceRequired"
                      value={formData.serviceRequired}
                      onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value as ServiceType })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#E4E6EB] focus:border-[#09090B] focus:ring-1 focus:ring-[#09090B]/15 transition-colors cursor-pointer text-[#18181B]"
                    >
                      <option value="vehicle_sourcing">Vehicle Sourcing (Auctions & Export)</option>
                      <option value="electronics_enquiry">Electronics Enquiry (Retail & Wholesale)</option>
                      <option value="shipping_quote">Shipping Quote (International Freight)</option>
                      <option value="general_merchandise">General Merchandise Sourcing</option>
                    </select>
                  </div>

                  {/* Conditional Field Previews depending on selected service */}
                  {formData.serviceRequired === 'vehicle_sourcing' && (
                    <div className="p-3.5 bg-[#F6F7F9] rounded-xl border border-[#E4E6EB]">
                      <label htmlFor="vehicleMakeModelOrLink" className="block text-xs font-semibold text-[#18181B] mb-1">
                        Preferred Make / Model or Auction Listing Link
                      </label>
                      <input
                        type="text"
                        id="vehicleMakeModelOrLink"
                        value={formData.vehicleMakeModelOrLink}
                        onChange={(e) => setFormData({ ...formData, vehicleMakeModelOrLink: e.target.value })}
                        placeholder="e.g. 2022 Audi Q5 or Copart Lot #12345678"
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white border border-[#E4E6EB] focus:border-[#09090B] focus:ring-1 focus:ring-[#09090B]/15 transition-colors placeholder:text-[#BFC2C8]"
                      />
                      <span className="block mt-1 text-[11px] text-muted">
                        Mention Copart or IAAI lot numbers if already identified.
                      </span>
                    </div>
                  )}

                  {formData.serviceRequired === 'shipping_quote' && (
                    <div className="p-3.5 bg-[#F6F7F9] rounded-xl border border-[#E4E6EB]">
                      <label htmlFor="shippingOriginAndCargo" className="block text-xs font-semibold text-[#18181B] mb-1">
                        Origin Country & Cargo Description
                      </label>
                      <input
                        type="text"
                        id="shippingOriginAndCargo"
                        value={formData.shippingOriginAndCargo}
                        onChange={(e) => setFormData({ ...formData, shippingOriginAndCargo: e.target.value })}
                        placeholder="e.g. Origin: Toronto, Canada · Cargo: 1 vehicle & 2 barrels"
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white border border-[#E4E6EB] focus:border-[#09090B] focus:ring-1 focus:ring-[#09090B]/15 transition-colors placeholder:text-[#BFC2C8]"
                      />
                    </div>
                  )}

                  {formData.serviceRequired === 'electronics_enquiry' && (
                    <div className="p-3.5 bg-[#F6F7F9] rounded-xl border border-[#E4E6EB]">
                      <label htmlFor="electronicsModelAndQty" className="block text-xs font-semibold text-[#18181B] mb-1">
                        Product & Desired Quantity
                      </label>
                      <input
                        type="text"
                        id="electronicsModelAndQty"
                        value={formData.electronicsModelAndQty}
                        onChange={(e) => setFormData({ ...formData, electronicsModelAndQty: e.target.value })}
                        placeholder="e.g. 5x iPhone 15 Pro Max 256GB, Brand New"
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white border border-[#E4E6EB] focus:border-[#09090B] focus:ring-1 focus:ring-[#09090B]/15 transition-colors placeholder:text-[#BFC2C8]"
                      />
                    </div>
                  )}

                  {formData.serviceRequired === 'general_merchandise' && (
                    <div className="p-3.5 bg-[#F6F7F9] rounded-xl border border-[#E4E6EB]">
                      <label htmlFor="merchandiseDescriptionOrLink" className="block text-xs font-semibold text-[#18181B] mb-1">
                        Item Description or Product Reference Link
                      </label>
                      <input
                        type="text"
                        id="merchandiseDescriptionOrLink"
                        value={formData.merchandiseDescriptionOrLink}
                        onChange={(e) => setFormData({ ...formData, merchandiseDescriptionOrLink: e.target.value })}
                        placeholder="e.g. Industrial tools, specialized parts, or store web URL"
                        className="w-full px-3 py-2 rounded-lg text-xs bg-white border border-[#E4E6EB] focus:border-[#09090B] focus:ring-1 focus:ring-[#09090B]/15 transition-colors placeholder:text-[#BFC2C8]"
                      />
                    </div>
                  )}

                  {/* Budget Amount and Currency Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                      Budget & Preferred Currency <span className="text-muted font-normal">(Optional)</span>
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-[#E4E6EB] focus-within:border-[#09090B] focus-within:ring-1 focus-within:ring-[#09090B]/15">
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="bg-[#F6F7F9] text-xs font-bold text-[#18181B] px-3 py-2.5 border-r border-[#E4E6EB] focus:outline-none cursor-pointer"
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
                        className="flex-1 px-3.5 py-2.5 text-sm bg-white focus:outline-none placeholder:text-[#BFC2C8]"
                      />
                    </div>
                  </div>

                  {/* Requirements or Message */}
                  <div>
                    <label htmlFor="requirements" className="block text-xs font-semibold text-[#18181B] mb-1.5">
                      Requirements or Message <span className="text-accent">*</span>
                    </label>
                    <textarea
                      id="requirements"
                      rows={3}
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="Please describe your specific purchase, condition requirements, or timeline..."
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border ${
                        errors.requirements ? 'border-[#C9A8A8] bg-[#FBF7F7]' : 'border-[#E4E6EB]'
                      } focus:border-[#09090B] focus:ring-1 focus:ring-[#09090B]/15 transition-colors placeholder:text-[#BFC2C8]`}
                    />
                    {errors.requirements && (
                      <p className="mt-1 text-xs text-accent flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.requirements}</span>
                      </p>
                    )}
                  </div>

                  {/* Consent Checkbox */}
                  <div>
                    <label className="flex items-start gap-2.5 text-xs text-[#606570] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.consentAgreed}
                        onChange={(e) => setFormData({ ...formData, consentAgreed: e.target.checked })}
                        className="mt-0.5 rounded text-accent focus:ring-[#09090B]/15 border-[#E4E6EB]"
                      />
                      <span>
                        I agree that GAC Auto Tech may contact me about this enquiry.{' '}
                        <button
                          type="button"
                          onClick={onOpenPrivacy}
                          className="text-accent hover:underline font-medium inline"
                        >
                          See the Privacy Policy.
                        </button>
                      </span>
                    </label>
                    {errors.consentAgreed && (
                      <p className="mt-1 text-xs text-accent flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.consentAgreed}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-bold btn-theme disabled:opacity-70 rounded-xl transition-all shadow-sm shadow-black/10 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting enquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Send My Enquiry</span>
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
