interface RouteSummaryProps {
  origin: string;
  destination: string;
  date: string;
  time: string;
  vehicleName?: string;
  onEdit: () => void;
}

export function RouteSummary({ origin, destination, date, time, vehicleName, onEdit }: RouteSummaryProps) {
  const dateObj = new Date(date + 'T' + time);
  const fmt = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const tmFmt = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1.5 mb-5 sm:mb-8 pb-4 sm:pb-6 border-b border-border">
      <div>
        <span className="text-eyebrow-sm text-gold block mb-0.5">Pickup</span>
        <span className="text-caption text-text-primary font-medium">{origin}</span>
      </div>
      <div>
        <span className="text-eyebrow-sm text-gold block mb-0.5">Destination</span>
        <span className="text-caption text-text-primary font-medium">{destination}</span>
      </div>
      <div>
        <span className="text-eyebrow-sm text-gold block mb-0.5">Date & Time</span>
        <span className="text-caption text-text-primary font-medium">{fmt} {tmFmt}</span>
      </div>
      {vehicleName && (
        <div>
          <span className="text-eyebrow-sm text-gold block mb-0.5">Car Type</span>
          <span className="text-caption text-text-primary font-medium">{vehicleName}</span>
        </div>
      )}
      <button onClick={onEdit} className="ml-auto text-caption font-semibold text-gold hover:text-gold-hover transition-colors uppercase tracking-wider">EDIT</button>
    </div>
  );
}
