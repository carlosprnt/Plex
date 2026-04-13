import { useState, useCallback, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Country, ViewMode } from './types';
import { useIsDesktop } from './hooks/useMediaQuery';
import Starfield from './components/background/Starfield';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ViewToggle from './components/controls/ViewToggle';
import SeasonFilter from './components/controls/SeasonFilter';
import ListView from './components/list/ListView';
import CountryDetail from './components/detail/CountryDetail';
import styles from './App.module.css';

const GlobeView = lazy(() => import('./components/globe/GlobeView'));

function GlobeLoader() {
  return (
    <div className={styles.loader}>
      <div className={styles.loaderSpinner} />
      <p className={styles.loaderText}>Cargando globo 3D...</p>
    </div>
  );
}

export default function App() {
  const isDesktop = useIsDesktop();
  const [viewMode, setViewMode] = useState<ViewMode>(isDesktop ? 'globe' : 'list');
  const [activeSeasons, setActiveSeasons] = useState<Set<number>>(new Set([1, 2, 3]));
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  return (
    <>
      <Starfield />

      <div className={styles.app}>
        <Header />

        <div className={styles.controls}>
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />
          <SeasonFilter activeSeasons={activeSeasons} onChange={setActiveSeasons} />
        </div>

        <main className={styles.main}>
          <AnimatePresence mode="wait">
            {viewMode === 'globe' ? (
              <motion.div
                key="globe"
                className={styles.viewContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<GlobeLoader />}>
                  <GlobeView
                    activeSeasons={activeSeasons}
                    onCountrySelect={handleCountrySelect}
                  />
                </Suspense>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ListView
                  activeSeasons={activeSeasons}
                  onCountrySelect={handleCountrySelect}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Footer />
      </div>

      <CountryDetail country={selectedCountry} onClose={handleCloseDetail} />
    </>
  );
}
