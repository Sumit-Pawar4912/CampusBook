import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';
import { ToastProvider } from './components/ToastProvider.jsx';

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </div>
    </ToastProvider>
  );
}

export default App;
