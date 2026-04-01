import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { StepProgress } from './StepProgress';

interface OverlayPortalProps {
  step: number;
  onClose: () => void;
  children: React.ReactNode;
}

export function OverlayPortal({ step, onClose, children }: OverlayPortalProps) {
  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-bg-primary overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-logo text-gold">ELIJAH</span>
            <button onClick={onClose} className="p-1.5 sm:p-2 rounded-full hover:bg-bg-elevated transition-colors text-text-secondary" aria-label="Close">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <StepProgress current={step} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
        {children}
      </div>
    </motion.div>,
    document.body
  );
}
