import { createRoot } from 'react-dom/client';
import App from './components/App';

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('react-page');
  if (!container) return;
  const root = createRoot(container);
  root.render(<App />);
});
