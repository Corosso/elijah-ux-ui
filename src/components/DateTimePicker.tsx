import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClockIcon } from 'lucide-react';

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

const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
const MINUTES_DIAL = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as const;

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

function to12(h24: number) {
  const period: 'AM' | 'PM' = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 || 12;
  return { h12, period };
}

function to24(h12: number, period: 'AM' | 'PM') {
  if (period === 'AM') return h12 === 12 ? 0 : h12;
  return h12 === 12 ? 12 : h12 + 12;
}

/* ── Analog Clock Face ── */
function ClockFace({
  mode, value, onChange, onSwitchToMinutes,
}: {
  mode: 'hour' | 'minute';
  value: number; // hour in 1-12, or minute in 0-55
  onChange: (v: number) => void;
  onSwitchToMinutes: () => void;
}) {
  const faceRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const numbers = mode === 'hour' ? HOURS_12 : MINUTES_DIAL;
  const RADIUS = 100;
  const CENTER = 130;

  const getAngleForValue = (v: number) => {
    if (mode === 'hour') {
      return ((v % 12) / 12) * 360;
    }
    return (v / 60) * 360;
  };

  const getValueFromAngle = (angleDeg: number) => {
    const normalized = ((angleDeg % 360) + 360) % 360;
    if (mode === 'hour') {
      let h = Math.round(normalized / 30);
      if (h === 0) h = 12;
      return h;
    }
    let m = Math.round(normalized / 6);
    if (m === 60) m = 0;
    // Snap to nearest 5
    m = Math.round(m / 5) * 5;
    if (m === 60) m = 0;
    return m;
  };

  const handlePointer = useCallback((clientX: number, clientY: number) => {
    const face = faceRef.current;
    if (!face) return;
    const rect = face.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    onChange(getValueFromAngle(angle));
  }, [mode, onChange]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handlePointer(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    handlePointer(e.clientX, e.clientY);
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (mode === 'hour') {
      onSwitchToMinutes();
    }
  };

  const handAngle = getAngleForValue(value);

  return (
    <div
      ref={faceRef}
      className="relative select-none touch-none"
      style={{ width: CENTER * 2, height: CENTER * 2 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full bg-bg-surface dark:bg-white/5" />

      {/* Clock hand — line from center to number + circle at tip */}
      <div
        className="absolute"
        style={{
          width: 2,
          height: RADIUS,
          left: CENTER - 1,
          top: CENTER - RADIUS,
          transformOrigin: `1px ${RADIUS}px`,
          transform: `rotate(${handAngle}deg)`,
          backgroundColor: 'var(--accent-gold)',
          opacity: 0.7,
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
          style={{ backgroundColor: 'var(--accent-gold)', top: -16 }}
        />
      </div>

      {/* Center dot */}
      <div
        className="absolute w-3 h-3 rounded-full z-10"
        style={{ backgroundColor: 'var(--accent-gold)', left: CENTER - 6, top: CENTER - 6 }}
      />

      {/* Numbers */}
      {numbers.map((n, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x = CENTER + RADIUS * Math.cos(angle + Math.PI / 2);
        const y = CENTER + RADIUS * Math.sin(angle + Math.PI / 2);
        // Shift the angle by -90deg so 12/0 is at top
        const correctedAngle = ((i / 12) * 360);
        const isSelected = n === value;
        const displayLabel = mode === 'minute' ? pad(n) : n;

        // Position using polar coordinates (12 o'clock = top)
        const rad = (correctedAngle - 90) * (Math.PI / 180);
        const px = CENTER + RADIUS * Math.cos(rad);
        const py = CENTER + RADIUS * Math.sin(rad);

        return (
          <button
            key={n}
            type="button"
            className={`absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center rounded-full text-caption font-medium transition-colors z-10 ${
              isSelected
                ? 'text-white'
                : 'text-text-primary hover:bg-gold/10'
            }`}
            style={{ left: px, top: py }}
            onClick={() => {
              onChange(n);
              if (mode === 'hour') setTimeout(onSwitchToMinutes, 200);
            }}
          >
            {displayLabel}
          </button>
        );
      })}
    </div>
  );
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
  const [tempHour24, setTempHour24] = useState(initHour);
  const [tempMinute, setTempMinute] = useState(initMinute);
  const [clockMode, setClockMode] = useState<'hour' | 'minute'>('hour');

  const { h12, period } = to12(tempHour24);

  const setPeriod = (p: 'AM' | 'PM') => {
    setTempHour24(to24(h12, p));
  };

  const setHour12 = (h: number) => {
    setTempHour24(to24(h, period));
  };

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
    // Auto-transition to time picker after selecting a date
    setTimeout(() => setTab('time'), 250);
  };

  const handleOk = () => {
    onTimeChange(`${pad(tempHour24)}:${pad(tempMinute)}`);
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
            <span className="text-eyebrow-sm opacity-80">Pick-up Date / Time</span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-caption opacity-60">{displayYear}</p>
              <p className="text-heading-xs font-bold">{sel ? `${displayMonth} ${displayDay}` : 'Pick a date'}</p>
            </div>
            <p className="text-heading-md font-bold tabular-nums leading-none">{pad(tempHour24)}:{pad(tempMinute)}</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-border">
          {(['date', 'time'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); if (t === 'time') setClockMode('hour'); }}
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
              <span className="text-caption font-medium text-text-primary">{MONTH_NAMES[viewMonth]} {viewYear}</span>
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
                <div key={i} className="text-center text-micro font-semibold text-text-secondary py-1">{d}</div>
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
                      className={`w-full aspect-square flex items-center justify-center text-caption rounded-full transition-colors
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
          <div className="p-5 flex flex-col items-center gap-4">
            {/* Clock face */}
            <ClockFace
              mode={clockMode}
              value={clockMode === 'hour' ? h12 : tempMinute}
              onChange={clockMode === 'hour' ? setHour12 : setTempMinute}
              onSwitchToMinutes={() => setClockMode('minute')}
            />

            {/* AM / PM toggle */}
            <div className="flex items-center gap-2">
              {(['AM', 'PM'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`w-12 h-12 rounded-full text-caption font-bold transition-colors ${
                    period === p
                      ? 'bg-gold text-white'
                      : 'bg-gray-100 dark:bg-white/10 text-text-secondary hover:bg-gold/10'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-6 px-5 py-3.5 border-t border-border">
          <button onClick={onClose} className="text-caption font-semibold text-text-secondary uppercase tracking-wider hover:text-text-primary active:scale-[0.97] transition-all">
            Cancel
          </button>
          <button onClick={handleOk} className="text-caption font-semibold text-gold uppercase tracking-wider hover:text-gold-hover active:scale-[0.97] transition-all">
            OK
          </button>
        </div>
      </motion.div>
    </motion.div>
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
        className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 rounded py-2.5 px-3 text-left text-caption transition-all focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold flex items-center justify-between gap-2"
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
