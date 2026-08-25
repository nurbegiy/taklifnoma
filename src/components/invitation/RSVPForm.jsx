import { useState } from 'react';
import { submitRsvp } from '../../services/invitationService';

export default function RSVPForm({ invitationId, previewMode }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState(true);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (previewMode) return;
    setStatus('sending');
    try {
      await submitRsvp(invitationId, { guestName: name, guestPhone: phone, attending, message });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return <div className="inv-rsvp inv-rsvp--done">Rahmat! Javobingiz qabul qilindi.</div>;
  }

  return (
    <form className="inv-rsvp" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ismingiz"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Telefon raqamingiz"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <div className="inv-rsvp-toggle">
        <button type="button" className={attending ? 'active' : ''} onClick={() => setAttending(true)}>
          Albatta boraman
        </button>
        <button type="button" className={!attending ? 'active' : ''} onClick={() => setAttending(false)}>
          Bora olmayman
        </button>
      </div>
      <textarea
        placeholder="Tabrik so‘zi (ixtiyoriy)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
      />
      <button type="submit" className="inv-rsvp-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Yuborilmoqda...' : 'Yuborish'}
      </button>
      {status === 'error' && <div className="inv-rsvp-error">Xatolik. Qayta urinib ko&#8217;ring.</div>}
    </form>
  );
}
