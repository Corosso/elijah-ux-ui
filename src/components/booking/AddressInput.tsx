import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, LoaderIcon } from 'lucide-react';
import { geocodeAutocomplete } from '../../api/googleMaps';
import type { GeocodeSuggestion } from '../../api/googleMaps';
import { useDebounce } from '../../hooks/useDebounce';

interface AddressInputProps {
  label: string;
  placeholder: string;
  onSelect: (s: GeocodeSuggestion) => void;
}

export function AddressInput({ label, placeholder, onSelect }: AddressInputProps) {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const [error, setError] = useState('');
  const debouncedText = useDebounce(text, 400);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) return;
    if (!debouncedText || debouncedText.length < 3) { setSuggestions([]); return; }
    let cancelled = false;
    setLoading(true);
    geocodeAutocomplete(debouncedText)
      .then((r) => { if (!cancelled) { setSuggestions(r); setIsOpen(r.length > 0); setError(''); } })
      .catch(() => { if (!cancelled) { setSuggestions([]); setError('Address lookup failed. Please try again.'); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedText, selected]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-eyebrow-sm text-gold mb-1 block">{label}</label>
      <div className="relative flex items-center">
        <MapPinIcon className="absolute left-3 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          value={text}
          onChange={(e) => { setText(e.target.value); setSelected(false); setIsOpen(true); setError(''); }}
          onFocus={() => { if (!selected && suggestions.length > 0) setIsOpen(true); }}
          placeholder={placeholder}
          className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 rounded py-2.5 pl-10 pr-10 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-caption"
        />
        {loading && <LoaderIcon className="absolute right-3 w-4 h-4 text-text-secondary animate-spin" />}
      </div>
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-bg-primary dark:bg-bg-elevated border border-border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto"
          >
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => { setText(s.label); setSelected(true); setIsOpen(false); setSuggestions([]); onSelect(s); }}
                className="px-4 py-2.5 text-caption text-text-primary hover:bg-gold/10 cursor-pointer transition-colors border-b border-border last:border-b-0"
              >{s.label}</li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {error && <p className="text-micro text-red-500 mt-1">{error}</p>}
    </div>
  );
}
