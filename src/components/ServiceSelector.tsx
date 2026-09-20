import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

interface ServiceSelectorProps {
  services: string[];
  setServices: React.Dispatch<React.SetStateAction<string[]>>;
}

const SERVICE_OPTIONS = ['Brand', 'Digital', 'Campaign', 'Other'];

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  setServices,
}) => {
  const toggleService = (service: string) => {
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service]
    );
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Prompt Title & Subtitle */}
      <h2 className="text-2xl font-medium tracking-tight mb-2">
        What sort of service?
      </h2>
      <p className="opacity-85 text-[#738273] mb-8">Select all that apply</p>

      {/* Service Pills Container */}
      <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
        {SERVICE_OPTIONS.map((service) => {
          const isSelected = services.includes(service);
          return (
            <motion.button
              key={service}
              type="button"
              onClick={() => toggleService(service)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-base sm:text-lg font-medium cursor-pointer transition-all duration-200 select-none ${
                isSelected
                  ? 'bg-[#1C2E1E] text-white shadow-md shadow-emerald-950/5 transform'
                  : 'bg-white text-[#1C2E1E] border border-[#F1F3F1] hover:bg-[#F1F3F1]/55'
              }`}
            >
              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0, width: 0, marginRight: 0 }}
                    animate={{ scale: 1, opacity: 1, width: 'auto', marginRight: 8 }}
                    exit={{ scale: 0, opacity: 0, width: 0, marginRight: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="inline-flex items-center justify-center overflow-hidden"
                  >
                    <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  </motion.span>
                )}
              </AnimatePresence>
              <span>{service}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Contingent Feedback Status Banner */}
      <div className="min-h-[70px]">
        <AnimatePresence mode="wait">
          {services.length === 0 ? (
            <motion.p
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="opacity-50 italic text-xs text-[#738273]"
            >
              Please click to select services above.
            </motion.p>
          ) : (
            <motion.div
              key="selection-banner"
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="overflow-hidden"
            >
              <div className="bg-[#FAFBF9] border border-[#E5E9E4] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-sm sm:text-base text-[#1C2E1E] font-normal">
                    Ready to inquire about:{' '}
                    <span className="font-semibold text-[#1C2E1E]">
                      {services.join(', ')}
                    </span>
                  </span>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C2E1E] text-white hover:bg-[#2A432D] transition-colors self-start sm:self-auto cursor-pointer group shadow-sm"
                >
                  <span className="text-[#4D6D47] uppercase text-xs font-semibold tracking-wider group-hover:text-[#6FA067] transition-colors">
                    Let's Go
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#4D6D47] group-hover:text-[#6FA067] group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
