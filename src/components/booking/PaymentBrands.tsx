function CardIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="h-7 px-2 border border-border rounded flex items-center justify-center" title={label}>
      {children}
    </div>
  );
}

export function PaymentBrands() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Visa */}
      <CardIcon label="Visa">
        <svg viewBox="0 0 48 16" className="h-3.5 w-auto" fill="currentColor" aria-hidden="true">
          <path d="M19.4 1l-3.7 14h-3L16.4 1h3zm15.8 9l1.6-4.4.9 4.4h-2.5zm2.8 5h2.8L38.3 1h-2.5c-.6 0-1 .3-1.2.8L29.9 15h3l.6-1.6h3.7l.3 1.6h.4zm-7.8-4.6c0-3.6-5-3.8-5-5.4 0-.5.5-1 1.5-1.1.5-.1 1.9-.1 3.4.6l.6-2.8A9.3 9.3 0 0027 1c-2.8 0-4.8 1.5-4.8 3.7 0 1.6 1.4 2.5 2.5 3 1.1.6 1.5.9 1.5 1.4 0 .8-.9 1.1-1.7 1.1-1.5 0-2.3-.4-3-.7l-.5 2.8c.7.3 1.9.6 3.2.6 3 0 5-1.5 5-3.8zM17.7 1l-5.5 14H9L6.3 3.8c-.2-.6-.3-.9-.9-1.1C4.5 2.3 3 1.8 1.7 1.5L1.8 1h4.9c.6 0 1.2.4 1.3 1.2l1.2 6.5 3.1-7.7h3.4z" className="text-text-secondary"/>
        </svg>
      </CardIcon>

      {/* Mastercard */}
      <CardIcon label="Mastercard">
        <svg viewBox="0 0 24 16" className="h-4 w-auto" aria-hidden="true">
          <circle cx="8.5" cy="8" r="7" fill="#EB001B" opacity="0.8"/>
          <circle cx="15.5" cy="8" r="7" fill="#F79E1B" opacity="0.8"/>
          <path d="M12 2.4a7 7 0 010 11.2 7 7 0 000-11.2z" fill="#FF5F00" opacity="0.9"/>
        </svg>
      </CardIcon>

      {/* Amex */}
      <CardIcon label="American Express">
        <svg viewBox="0 0 40 14" className="h-3 w-auto" fill="currentColor" aria-hidden="true">
          <text x="0" y="11" className="text-text-secondary" style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em' }}>AMEX</text>
        </svg>
      </CardIcon>

      {/* PSE */}
      <CardIcon label="PSE">
        <svg viewBox="0 0 30 14" className="h-3 w-auto" fill="currentColor" aria-hidden="true">
          <text x="0" y="11" className="text-text-secondary" style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em' }}>PSE</text>
        </svg>
      </CardIcon>
    </div>
  );
}
