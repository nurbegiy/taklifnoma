export default function ErrorState({ title = 'Xatolik yuz berdi', message, onRetry }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        minHeight: '40vh',
        padding: 24,
        textAlign: 'center',
        color: '#eef0f3',
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
      {message && (
        <div style={{ fontSize: 13, color: '#9aa1ad', maxWidth: 420 }}>{message}</div>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: 8,
            padding: '8px 18px',
            borderRadius: 8,
            border: '1px solid #2a2f3a',
            background: '#1f232c',
            color: '#eef0f3',
            fontSize: 13,
          }}
        >
          Qayta urinish
        </button>
      )}
    </div>
  );
}
