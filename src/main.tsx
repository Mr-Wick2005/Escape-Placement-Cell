import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/orbitron/600.css';
import '@fontsource/inter/400.css';
import '@fontsource/jetbrains-mono/400.css';
import './styles/globals.css';
import App from './app/App';
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
