import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import '@/app/styles/reset.scss';
import '@/app/styles/global.scss';
import '@/app/styles/fonts.scss'

createRoot(document.getElementById('root')!).render(<App />);
