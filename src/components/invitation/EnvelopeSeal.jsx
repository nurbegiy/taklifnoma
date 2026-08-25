import { useRef, useState } from 'react';
import './envelope-seal.css';

/**
 * Wax-seal envelope opening screen, shared by every theme.
 *
 * Stages: closed -> cracking -> opening -> gone
 * - "closed": envelope sits still, seal gently pulses to invite a tap.
 * - "cracking": the seal presses in, cracks and flies apart.
 * - "opening": the envelope flap swings open.
 * - "gone": the whole scene fades out; parent unmounts it via onFinished.
 *
 * `onSeal` fires the instant the seal is tapped (synchronously, inside the
 * click handler) so a parent can start audio playback right then, while the
 * gesture still "counts" for the browser's autoplay permission.
 */
export default function EnvelopeSeal({
  brideName,
  groomName,
  eyebrow = 'Nikoh to\u2018yiga taklif',
  hint = 'Ochish uchun muhrga bosing',
  onSeal,
  onFinished,
}) {
  const [stage, setStage] = useState('closed');
  const firedRef = useRef(false);

  const initials = `${(brideName || 'B').trim().charAt(0)}${(groomName || 'G').trim().charAt(0)}`.toUpperCase();

  function handleOpen() {
    if (firedRef.current) return;
    firedRef.current = true;

    // Fire immediately, synchronously, inside the click — this is what lets
    // audio autoplay with sound.
    onSeal?.();

    setStage('cracking');
    window.setTimeout(() => setStage('opening'), 360);
    window.setTimeout(() => setStage('gone'), 360 + 720);
    window.setTimeout(() => onFinished?.(), 360 + 720 + 560);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  }

  return (
    <div className={`env-scene env-stage-${stage}`}>
      <div className="env-card">
        <div className="env-flap" aria-hidden="true" />
        <div className="env-shade" aria-hidden="true" />

        <div className="env-content">
          <span className="env-eyebrow">{eyebrow}</span>
          <h1 className="env-names">
            {brideName || 'Kelin'} <span className="env-amp">&amp;</span> {groomName || 'Kuyov'}
          </h1>
          <span className="env-hint">{hint}</span>
        </div>

        <button
          type="button"
          className="env-seal"
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          aria-label="Taklifnomani ochish"
          disabled={stage !== 'closed'}
        >
          <span className="env-seal-ring" />
          <span className="env-seal-glyph">{initials}</span>
        </button>
        <div className="env-seal-shard env-seal-shard--a" aria-hidden="true" />
        <div className="env-seal-shard env-seal-shard--b" aria-hidden="true" />
        <div className="env-seal-shard env-seal-shard--c" aria-hidden="true" />
      </div>
    </div>
  );
}
