import { CheckCircleIcon, CircleIcon } from 'lucide-react';

interface StepProgressProps {
  current: number;
}

const steps = [
  { num: 1, label: 'Ride Information' },
  { num: 2, label: 'Vehicle Class' },
  { num: 3, label: 'Login' },
  { num: 4, label: 'Booking Details' },
  { num: 5, label: 'Payment' },
];

export function StepProgress({ current }: StepProgressProps) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-3 flex-wrap">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center gap-1 sm:gap-3">
          <div className="flex items-center gap-1.5">
            {current > s.num ? (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            ) : current === s.num ? (
              <div className="w-5 h-5 rounded-full bg-gold text-white flex items-center justify-center text-micro font-bold">{s.num}</div>
            ) : (
              <CircleIcon className="w-5 h-5 text-text-secondary/30" />
            )}
            <span className={`text-caption font-medium hidden sm:inline ${current >= s.num ? 'text-text-primary' : 'text-text-secondary/40'}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && <div className="w-4 sm:w-8 h-px bg-border" />}
        </div>
      ))}
    </div>
  );
}
