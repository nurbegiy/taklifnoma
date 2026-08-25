export default function LoadingSpinner({ label = 'Yuklanmoqda...', fullScreen = true }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        width: '100%',
        height: fullScreen ? '100vh' : '100%',
        minHeight: fullScreen ? '100vh' : 120,
        background: 'var(--admin-bg, #0f1115)',
        color: 'var(--admin-text-dim, #9aa1ad)',
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '2px solid rgba(201,168,106,0.25)',
          borderTopColor: '#c9a86a',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span style={{ fontSize: 13, letterSpacing: 0.3 }}>{label}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
