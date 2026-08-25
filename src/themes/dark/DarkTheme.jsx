import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Countdown from '../../components/invitation/Countdown.jsx';
import Gallery from '../../components/invitation/Gallery.jsx';
import MapButton from '../../components/invitation/MapButton.jsx';
import MusicPlayer from '../../components/invitation/MusicPlayer.jsx';
import Reveal from '../../components/invitation/Reveal.jsx';
import FloralCorner from '../../components/invitation/FloralCorner.jsx';
import EnvelopeSeal from '../../components/invitation/EnvelopeSeal.jsx';
import { formatDateLong, formatTime, combineDateTime } from '../../lib/utils';
import './dark-theme.css';

export default function DarkTheme({ data, previewMode }) {
  const [introDone, setIntroDone] = useState(previewMode ? true : false);
  const musicRef = useRef(null);
  const heroPhoto = data.photos?.find((p) => p.kind === 'hero')?.url;
  const gallery = data.photos?.filter((p) => p.kind === 'gallery') || [];
  const targetDate = combineDateTime(data.wedding_date, data.wedding_time);

  return (
    <div className="theme-dark">
      {!introDone && (
        <EnvelopeSeal
          brideName={data.bride_name}
          groomName={data.groom_name}
          onSeal={() => musicRef.current?.play()}
          onFinished={() => setIntroDone(true)}
        />
      )}

      <div className="dark-hero">
        {heroPhoto && <img className="dark-hero-photo" src={heroPhoto} alt="" />}
        <div className="dark-hero-overlay" />
        <FloralCorner color="#c9a86a" className="dark-corner dark-corner--tl" />
        <FloralCorner color="#c9a86a" className="dark-corner dark-corner--br" />

        <motion.div
          className="dark-hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={introDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          <span className="dark-eyebrow">You&#8217;re invited to</span>
          <h1 className="dark-names">
            {data.bride_name || 'Bride'} <span>&amp;</span> {data.groom_name || 'Groom'}
          </h1>
          <div className="dark-divider" />
          <span className="dark-date">{formatDateLong(data.wedding_date)}</span>
        </motion.div>
      </div>

      {data.invitation_text && (
        <Reveal className="dark-section dark-text-section">
          <p className="dark-invite-text">{data.invitation_text}</p>
        </Reveal>
      )}

      {targetDate && (
        <Reveal className="dark-section dark-countdown-section">
          <span className="dark-section-eyebrow">To&#8217;yga qolgan vaqt</span>
          <Countdown targetDate={targetDate} />
        </Reveal>
      )}

      <Reveal className="dark-section dark-info-section">
        <span className="dark-section-eyebrow">To&#8217;y ma&#8217;lumotlari</span>
        <div className="dark-info-grid">
          <div className="dark-info-item">
            <span className="dark-info-label">Sana</span>
            <span className="dark-info-value">{formatDateLong(data.wedding_date)}</span>
          </div>
          <div className="dark-info-item">
            <span className="dark-info-label">Vaqt</span>
            <span className="dark-info-value">{formatTime(data.wedding_time)}</span>
          </div>
          <div className="dark-info-item">
            <span className="dark-info-label">Manzil</span>
            <span className="dark-info-value">{data.venue_name}</span>
          </div>
          <div className="dark-info-item">
            <span className="dark-info-label">To&#8217;liq manzil</span>
            <span className="dark-info-value">{data.venue_address}</span>
          </div>
        </div>
        <MapButton href={data.maps_link} />
      </Reveal>

      {gallery.length > 0 && (
        <Reveal className="dark-section dark-gallery-section">
          <span className="dark-section-eyebrow">Fotolavha</span>
          <Gallery photos={gallery} />
        </Reveal>
      )}

      <Reveal className="dark-section dark-rsvp-section">
        <span className="dark-section-eyebrow">Aloqa</span>
        <div className="dark-contact">
          <span>{data.contact_name}</span>
          <span>{data.contact_phone}</span>
        </div>
      </Reveal>

      <Reveal className="dark-section dark-final-section">
        <FloralCorner color="#c9a86a" className="dark-corner dark-corner--final" />
        <p className="dark-final-text">Sizni kutamiz</p>
        <span className="dark-final-names">
          {data.bride_name} &amp; {data.groom_name}
        </span>
      </Reveal>

      <MusicPlayer ref={musicRef} src={data.music_url} />
    </div>
  );
}
