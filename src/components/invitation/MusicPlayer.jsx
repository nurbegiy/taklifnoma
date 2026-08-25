import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

/**
 * Music player for the invitation.
 *
 * Exposes an imperative `play()` method via ref so a parent component can
 * start playback from *inside* a user click handler (e.g. tapping the wax
 * seal to open the envelope). Browsers only allow audio-with-sound to start
 * automatically if it's triggered synchronously by a real user gesture, so
 * the seal click doubles as that permission.
 *
 * The visible button still lets the guest pause/resume manually at any time.
 */
const MusicPlayer = forwardRef(function MusicPlayer({ src }, ref) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    play() {
      const audio = audioRef.current;
      if (!audio) return;
      const result = audio.play();
      if (result && typeof result.then === 'function') {
        result.then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else {
        setPlaying(true);
      }
    },
    pause() {
      audioRef.current?.pause();
      setPlaying(false);
    },
  }));

  if (!src) return null;

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      const result = audio.play();
      if (result && typeof result.then === 'function') {
        result.then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else {
        setPlaying(true);
      }
    }
  }

  return (
    <button type="button" className={`inv-music-toggle ${playing ? 'is-playing' : ''}`} onClick={toggle} aria-label="Musiqa">
      <audio ref={audioRef} src={src} loop preload="none" />
      <span className="inv-music-bars">
        <i /><i /><i />
      </span>
    </button>
  );
});

export default MusicPlayer;
