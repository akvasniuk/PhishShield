import './global.css';

import { Router } from './routes/sections.jsx';

import { useScrollToTop } from './hooks/use-scroll-to-top.js';

import { ThemeProvider } from './theme/theme-provider.jsx';

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
