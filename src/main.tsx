import { LazyMotion, domAnimation } from 'framer-motion';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ToastProvider } from '@/components/Toaster';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root is missing from index.html');

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      {/*
        LazyMotion + the `m` component instead of `motion`: this loads only the
        DOM animation feature set, cutting framer-motion from 40KB to 28KB
        gzipped on the critical path. `strict` makes a stray `motion.*` import
        throw in development rather than silently pulling the full bundle back in.
      */}
      <LazyMotion features={domAnimation} strict>
        <ToastProvider>
          <App />
        </ToastProvider>
      </LazyMotion>
    </BrowserRouter>
  </StrictMode>,
);
