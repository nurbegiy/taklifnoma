import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Countdown from '../../components/invitation/Countdown.jsx';
import Gallery from '../../components/invitation/Gallery.jsx';
import MapButton from '../../components/invitation/MapButton.jsx';
import MusicPlayer from '../../components/invitation/MusicPlayer.jsx';
import Reveal from '../../components/invitation/Reveal.jsx';
import EnvelopeSeal from '../../components/invitation/EnvelopeSeal.jsx';
import { formatDateLong, formatTime, combineDateTime } from '../../lib/utils';
import './light-theme.css';

export default function LightTheme({ data, previewMode }) {
  const [introDone, setIntroDone] = useState(previewMode ? true : false);
  const musicRef = useRef(null);
  const heroPhoto = data.photos?.find((p) => p.kind === 'hero')?.url;
  const gallery = data.photos?.filter((p) => p.kind === 'gallery') || [];
  const targetDate = combineDateTime(data.wedding_date, data.wedding_time);

  return (
    <div className="theme-light">
      {!introDone && (
        <EnvelopeSeal
          brideName={data.bride_name}
          groomName={data.groom_name}
          onSeal={() => musicRef.current?.play()}
          onFinished={() => setIntroDone(true)}
        />
      )}

      <div className="light-hero">
        <div className="light-hero-photo-wrap">
          {heroPhoto ? <img className="light-hero-photo" src={heroPhoto} alt="" /> : <div className="light-photo-placeholder" />}
          <svg className="light-hero-wave" viewBox="0 0 500 80" preserveAspectRatio="none">
            <path d="M0 40C120 90 380 -10 500 40V80H0V40Z" fill="var(--inv-bg)" />
          </svg>
        </div>

        <motion.div
          className="light-hero-content"
          initial={{ opacity: 0, y: 18 }}
          animate={introDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <span className="light-eyebrow">Welcome &#8226; The wedding of</span>
          <h1 className="light-names">
            {data.bride_name || 'Bride'} <span>&amp;</span> {data.groom_name || 'Groom'}
          </h1>
          <span className="light-date">{formatDateLong(data.wedding_date)}</span>
        </motion.div>
      </div>

      {data.invitation_text && (
        <Reveal className="light-section light-text-section">
          <p className="light-invite-text">{data.invitation_text}</p>
        </Reveal>
      )}

      {targetDate && (
        <Reveal className="light-section light-countdown-section">
          <span className="light-section-eyebrow">Sanaga qolgan vaqt</span>
          <Countdown targetDate={targetDate} />
        </Reveal>
      )}

      <Reveal className="light-section light-info-section">
        <span className="light-section-eyebrow">Tafsilotlar</span>
        <div className="light-info-cards">
          <div className="light-info-card">
            <span className="light-info-label">Sana &amp; vaqt</span>
            <span className="light-info-value">{formatDateLong(data.wedding_date)}</span>
            <span className="light-info-value">{formatTime(data.wedding_time)}</span>
          </div>
          <div className="light-info-card">
            <span className="light-info-label">Manzil</span>
            <span className="light-info-value">{data.venue_name}</span>
            <span className="light-info-sub">{data.venue_address}</span>
          </div>
        </div>
        <MapButton href={data.maps_link} />
      </Reveal>

      {gallery.length > 0 && (
        <Reveal className="light-section light-gallery-section">
          <span className="light-section-eyebrow">Gallereya</span>
          <Gallery photos={gallery} />
        </Reveal>
      )}

      <Reveal className="light-section light-rsvp-section">
        <span className="light-section-eyebrow">Aloqa</span>
        <div className="light-contact">
          <span>{data.contact_name}</span>
          <span>{data.contact_phone}</span>
        </div>
      </Reveal>

      <Reveal className="light-section light-final-section">
        <span className="light-final-text">Sizni ushbu quvonchli kunimizda ko&#8217;rishdan mamnun bo&#8217;lamiz</span>
        <span className="light-final-names">
          {data.bride_name} &amp; {data.groom_name}
        </span>
      </Reveal>

      <MusicPlayer ref={musicRef} src={data.music_url} />
    </div>
  );
}
