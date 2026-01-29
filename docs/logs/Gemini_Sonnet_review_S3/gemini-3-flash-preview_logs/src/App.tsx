import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThemeProvider from './contexts/ThemeContext';
import LanguageProvider from './contexts/LanguageContext';
import OfflineProvider from './contexts/OfflineContext';

import Header from './components/Header';
import DevToolbar from './components/DevToolbar';

import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import UploadPage from './pages/UploadPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';

import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <OfflineProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
              <Header />
              
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>

              <DevToolbar />
            </div>
          </BrowserRouter>
        </OfflineProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

