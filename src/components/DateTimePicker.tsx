import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClockIcon, PencilIcon } from 'lucide-react';

/* ── Types ── */
interface DateTimePickerProps {
  date: string;       // yyyy-MM-dd
  time: string;       // HH:mm
  onDateChange: (d: string) => void;
  onTimeChange: (t: string) => void;
  minDate?: string;
  className?: string;
}

/* ── Constants ── */
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
] as const;
const TIME_PRESETS = ['08:00','09:00','10:00','12:00','14:00','16:00','18:00','20:00'] as const;

/* ── Helpers ── */
const pad = (n: number) => n.toString().padStart(2, '0');
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

function parseDate(s: string) {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

function parseTime(s: string) {
  if (!s) return { hour: 10, minute: 0 };
  const [h, m] = s.split(':').map(Number);
  return { hour: h, minute: m };
}

/* ── Modal (portaled) ── */
function PickerModal({
  date, time, minDate,
  onDateChange, onTimeChange, onClose,
}: {
  date: string; time: string; minDate?: string;
  onDateChange: (d: string) => void;
  onTimeChange: (t: string) => void;
  onClose: () => void;
}) {
  const now = useMemo(() => new Date(), []);
  const sel = parseDate(date);
  const { hour: initHour, minute: initMinute } = parseTime(time);

  const [tab, setTab] = useState<'date' | 'time'>('date');
  const [viewYear, setViewYear] = useState(sel?.year ?? now.getFullYear());
  const [viewMonth, setViewMonth] = useState(sel?.month ?? now.getMonth());
  const [tempHour, setTempHour] = useState(initHour);
  const [tempMinute, setTempMinute] = useState(initMinute);

  // Lock scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const minD = useMemo(() => minDate ? new Date(minDate + 'T00:00:00') : null, [minDate]);

  const isDisabled = useCallback((day: number) => {
    if (!minD) return false;
    return new Date(viewYear, viewMonth, day) < new Date(minD.getFullYear(), minD.getMonth(), minD.getDate());
  }, [minD, viewYear, viewMonth]);

  const handleDayClick = (day: number) => {
    if (isDisabled(day)) return;
    onDateChange(`${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`);
  };

  const handleOk = () => {
    onTimeChange(`${pad(tempHour)}:${pad(tempMinute)}`);
    onClose();
  };

  const prevMonth = () => {
    setViewMonth(m => { if (m === 0) { setViewYear(y => y - 1); return 11; } return m - 1; });
  };
  const nextMonth = () => {
    setViewMonth(m => { if (m === 11) { setViewYear(y => y + 1); return 0; } return m + 1; });
  };

  const days = daysInMonth(viewYear, viewMonth);
  const offset = firstDayOfMonth(viewYear, viewMonth);
  const displayMonth = sel ? MONTH_NAMES[sel.month].slice(0, 3) : '';
  const displayDay = sel?.day ?? 0;
  const displayYear = sel?.year ?? now.getFullYear();

  return (
    <motion.div
      key="dt-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        key="dt-card"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-bg-elevated rounded-xl shadow-2xl w-full max-w-[340px] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="bg-gold text-white px-5 py-4">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest opacity-80">Pick-up Date / Time</span>
            <PencilIcon className="w-3.5 h-3.5 opacity-50" />
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-xs opacity-60">{displayYear}</p>
              <p className="text-2xl font-bold leading-tight">{sel ? `${displayMonth} ${displayDay}` : 'Pick a date'}</p>
            </div>
            <p className="text-4xl font-bold tabular-nums leading-none">{pad(tempHour)}:{pad(tempMinute)}</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-border">
          {(['date', 'time'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 flex items-center justify-center transition-colors ${
                tab === t ? 'text-gold border-b-2 border-gold' : 'text-text-secondary'
              }`}
            >
              {t === 'date' ? <CalendarIcon className="w-5 h-5" /> : <ClockIcon className="w-5 h-5" />}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {tab === 'date' ? (
          <div className="p-4">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-text-primary">{MONTH_NAMES[viewMonth]} {viewYear}</span>
              <div className="flex gap-1">
                <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary">
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary">
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAY_LABELS.map((d, i) => (
                <div key={i} className="text-center text-[11px] font-semibold text-text-secondary py-1">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {Array.from({ length: offset }, (_, i) => <div key={`o${i}`} />)}
              {Array.from({ length: days }, (_, i) => {
                const day = i + 1;
                const disabled = isDisabled(day);
                const selected = sel && sel.year === viewYear && sel.month === viewMonth && sel.day === day;
                const today = viewYear === now.getFullYear() && viewMonth === now.getMonth() && day === now.getDate() && !selected;

                return (
                  <div key={day} className="p-[2px]">
                    <button
                      disabled={disabled}
                      onClick={() => handleDayClick(day)}
                      className={`w-full aspect-square flex items-center justify-center text-sm rounded-full transition-colors
                        ${disabled ? 'text-text-secondary/20 cursor-not-allowed' : 'hover:bg-gold/10 cursor-pointer'}
                        ${selected ? 'bg-gold text-white font-bold' : ''}
                        ${today ? 'ring-1 ring-gold text-gold font-semibold' : ''}
                        ${!selected && !disabled && !today ? 'text-text-primary' : ''}
                      `}
                    >
                      {day}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-5 flex flex-col items-center gap-5">
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Select Time</p>

            <div className="flex items-center gap-4">
              {/* Hours */}
              <Spinner value={tempHour} onChange={setTempHour} min={0} max={23} />
              <span className="text-4xl font-bold text-text-primary">:</span>
              {/* Minutes */}
              <Spinner value={tempMinute} onChange={setTempMinute} min={0} max={55} step={5} />
            </div>

            {/* Quick presets */}
            <div className="flex flex-wrap gap-2 justify-center">
              {TIME_PRESETS.map(t => {
                const active = `${pad(tempHour)}:${pad(tempMinute)}` === t;
                return (
                  <button
                    key={t}
                    onClick={() => { const [h, m] = t.split(':').map(Number); setTempHour(h); setTempMinute(m); }}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      active ? 'border-gold bg-gold/10 text-gold font-semibold' : 'border-border text-text-secondary hover:border-gold/50'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-6 px-5 py-3.5 border-t border-border">
          <button onClick={onClose} className="text-sm font-semibold text-text-secondary uppercase tracking-wider hover:text-text-primary transition-colors">
            Cancel
          </button>
          <button onClick={handleOk} className="text-sm font-semibold text-gold uppercase tracking-wider hover:text-gold-hover transition-colors">
            OK
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Spinner sub-component ── */
function Spinner({ value, onChange, min, max, step = 1 }: {
  value: number; onChange: (v: number) => void; min: number; max: number; step?: number;
}) {
  const inc = () => onChange(value + step > max ? min : value + step);
  const dec = () => onChange(value - step < min ? max : value - step);

  return (
    <div className="flex flex-col items-center gap-2">
      <button onClick={inc} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary">
        <ChevronLeftIcon className="w-5 h-5 rotate-90" />
      </button>
      <span className="text-4xl font-bold text-text-primary tabular-nums w-16 text-center">{pad(value)}</span>
      <button onClick={dec} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary">
        <ChevronRightIcon className="w-5 h-5 rotate-90" />
      </button>
    </div>
  );
}

/* ── Main export ── */
export function DateTimePicker({ date, time, onDateChange, onTimeChange, minDate, className = '' }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  const displayValue = useMemo(() => {
    if (!date) return 'dd/mm/aaaa';
    const d = new Date(date + 'T12:00:00');
    const formatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    if (!time) return formatted;
    const t = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${formatted} ${t}`;
  }, [date, time]);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 rounded py-2.5 px-3 text-left text-sm transition-all focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold flex items-center justify-between gap-2"
      >
        <span className={date ? 'text-text-primary' : 'text-text-secondary'}>{displayValue}</span>
        <CalendarIcon className="w-4 h-4 text-text-secondary flex-shrink-0" />
      </button>

      {/* Portal: AnimatePresence lives INSIDE the portal so exit animations work */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <PickerModal
              date={date}
              time={time}
              minDate={minDate}
              onDateChange={onDateChange}
              onTimeChange={onTimeChange}
              onClose={() => setOpen(false)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
