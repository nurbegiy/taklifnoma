import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Countdown from '../../components/invitation/Countdown.jsx';
import Gallery from '../../components/invitation/Gallery.jsx';
import MapButton from '../../components/invitation/MapButton.jsx';
import MusicPlayer from '../../components/invitation/MusicPlayer.jsx';
import Reveal from '../../components/invitation/Reveal.jsx';
import EnvelopeSeal from '../../components/invitation/EnvelopeSeal.jsx';
import { formatDateLong, formatTime, combineDateTime } from '../../lib/utils';
import './warm-theme.css';

export default function WarmTheme({ data, previewMode }) {
  const [introDone, setIntroDone] = useState(previewMode ? true : false);
  const musicRef = useRef(null);
  const heroPhoto = data.photos?.find((p) => p.kind === 'hero')?.url;
  const gallery = data.photos?.filter((p) => p.kind === 'gallery') || [];
  const targetDate = combineDateTime(data.wedding_date, data.wedding_time);

  return (
    <div className="theme-warm">
      {!introDone && (
        <EnvelopeSeal
          brideName={data.bride_name}
          groomName={data.groom_name}
          onSeal={() => musicRef.current?.play()}
          onFinished={() => setIntroDone(true)}
        />
      )}

      <div className="warm-hero">
        <div className="warm-hero-leaves warm-hero-leaves--tl" aria-hidden="true" />
        <div className="warm-hero-leaves warm-hero-leaves--br" aria-hidden="true" />

        <motion.span
          className="warm-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={introDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          You&#8217;re invited to
        </motion.span>
        <motion.span
          className="warm-of"
          initial={{ opacity: 0 }}
          animate={introDone ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          The Wedding Of
        </motion.span>

        <motion.div
          className="warm-photo-arch"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={introDone ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {heroPhoto ? <img src={heroPhoto} alt="" /> : <div className="warm-photo-placeholder" />}
        </motion.div>

        <motion.h1
          className="warm-names"
          initial={{ opacity: 0, y: 16 }}
          animate={introDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {data.bride_name || 'Bride'} <span>&amp;</span> {data.groom_name || 'Groom'}
        </motion.h1>

        <motion.div
          className="warm-hero-meta"
          initial={{ opacity: 0 }}
          animate={introDone ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.65 }}
        >
          <span>{formatTime(data.wedding_time)}</span>
          <span className="warm-dot">&#8226;</span>
          <span>{formatDateLong(data.wedding_date)}</span>
        </motion.div>
      </div>

      {data.invitation_text && (
        <Reveal className="warm-section warm-text-section">
          <p className="warm-invite-text">{data.invitation_text}</p>
        </Reveal>
      )}

      {targetDate && (
        <Reveal className="warm-section warm-countdown-section">
          <span className="warm-section-eyebrow">To&#8217;yga qolgan vaqt</span>
          <Countdown targetDate={targetDate} />
        </Reveal>
      )}

      <Reveal className="warm-section warm-info-section">
        <span className="warm-section-eyebrow">Tafsilotlar</span>
        <div className="warm-info-row">
          <div className="warm-info-item">
            <span className="warm-info-label">Sana &amp; Vaqt</span>
            <span className="warm-info-value">{formatDateLong(data.wedding_date)}, {formatTime(data.wedding_time)}</span>
          </div>
          <div className="warm-info-item">
            <span className="warm-info-label">Manzil</span>
            <span className="warm-info-value">{data.venue_name}</span>
            <span className="warm-info-sub">{data.venue_address}</span>
          </div>
        </div>
        <MapButton href={data.maps_link} />
      </Reveal>

      {gallery.length > 0 && (
        <Reveal className="warm-section warm-gallery-section">
          <span className="warm-section-eyebrow">Xotiralar</span>
          <Gallery photos={gallery} />
        </Reveal>
      )}

      <Reveal className="warm-section warm-rsvp-section">
        <span className="warm-section-eyebrow">Aloqa</span>
        <div className="warm-contact">
          <span>{data.contact_name}</span>
          <span>{data.contact_phone}</span>
        </div>
      </Reveal>

      <Reveal className="warm-section warm-final-section">
        <span className="warm-final-text">Nikoh to&#8217;yimizda ishtirok etishingizni istardik</span>
        <span className="warm-final-names">
          {data.bride_name} &amp; {data.groom_name}
        </span>
      </Reveal>

      <MusicPlayer ref={musicRef} src={data.music_url} />
    </div>
  );
}
