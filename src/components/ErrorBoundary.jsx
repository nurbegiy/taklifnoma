import { Component } from 'react';

/**
 * Catches any render-time error anywhere below it and shows a friendly
 * "something went wrong, reload" screen instead of leaving the visitor
 * looking at a blank white page — which is what a plain white/blank tab
 * usually is: an uncaught JS error before anything painted.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Taklifnoma crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            padding: 24,
            textAlign: 'center',
            background: '#12151d',
            color: '#f2ede1',
            fontFamily: "'Jost', sans-serif",
          }}
        >
          <p style={{ margin: 0, fontSize: 15, opacity: 0.85 }}>
            Sahifa ochilishida xatolik yuz berdi.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              background: 'transparent',
              border: '1px solid rgba(201,168,106,0.5)',
              color: '#f2ede1',
              padding: '10px 24px',
              borderRadius: 999,
              fontSize: 13,
              letterSpacing: 1,
              cursor: 'pointer',
            }}
          >
            Qayta yuklash
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
