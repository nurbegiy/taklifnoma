import DarkTheme from './dark/DarkTheme.jsx';
import WarmTheme from './warm/WarmTheme.jsx';
import LightTheme from './light/LightTheme.jsx';

const THEME_MAP = {
  dark: DarkTheme,
  warm: WarmTheme,
  light: LightTheme,
};

export function InvitationRenderer({ data, previewMode = false }) {
  const Theme = THEME_MAP[data?.design] || THEME_MAP.dark;
  return <Theme data={data} previewMode={previewMode} />;
}

export const AVAILABLE_DESIGNS = Object.keys(THEME_MAP);
