import { useCountdown } from '../../hooks/useCountdown';

const LABELS = {
  days: 'Kun',
  hours: 'Soat',
  minutes: 'Daqiqa',
  seconds: 'Soniya',
};

export default function Countdown({ targetDate }) {
  const t = useCountdown(targetDate);

  if (t.done) {
    return <div className="inv-countdown inv-countdown--done">Bugun ularning to&#8217;yi! &#10084;</div>;
  }

  return (
    <div className="inv-countdown">
      {['days', 'hours', 'minutes', 'seconds'].map((key) => (
        <div className="inv-countdown-unit" key={key}>
          <span className="inv-countdown-value">{String(t[key]).padStart(2, '0')}</span>
          <span className="inv-countdown-label">{LABELS[key]}</span>
        </div>
      ))}
    </div>
  );
}
