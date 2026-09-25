import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, lazy, Suspense, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "./index.css";
import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/Background";
import { AnimatePresence } from "framer-motion";
import Footer from "./components/Footer";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const importHome = () => import("./Pages/Home");
const importAbout = () => import("./Pages/About");
const importPortofolio = () => import("./Pages/Portofolio");
const importContact = () => import("./Pages/Contact");

const Home = lazy(importHome);
const About = lazy(importAbout);
const Portofolio = lazy(importPortofolio);
const ContactPage = lazy(importContact);
const ProjectDetails = lazy(() => import("./components/ProjectDetail"));
const WelcomeScreen = lazy(() => import("./Pages/WelcomeScreen"));
const NotFoundPage = lazy(() => import("./Pages/404"));

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <Suspense fallback={null}>
            <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          <Navbar />
          <Suspense fallback={<div className="h-20" />}>
            <Home />
            <About />
            <Portofolio />
            <ContactPage />
          </Suspense>
          <Footer />
        </>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <>
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProjectDetails />
    </Suspense>
    <Footer />
  </>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  // Inisialisasi AOS sekali di sini
  useEffect(() => {
    AOS.init({ once: false, offset: 10, duration: 1000, mirror: false });
    
    // Preload halaman di background selagi WelcomeScreen berjalan
    // Ini mencegah lag/patah-patah saat animasi WelcomeScreen selesai
    importHome();
    importAbout();
    importPortofolio();
    importContact();
  }, []);

  return (
    
    <HelmetProvider>
      <div className="pointer-events-none">
  <AnimatedBackground />
</div>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
          <Route
            path="/"
            element={
              <LandingPage
                showWelcome={showWelcome}
                setShowWelcome={setShowWelcome}
              />
            }
          />

          <Route path="/project/:slug" element={<ProjectPageLayout />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />

          {/* ADMIN (PROTECTED) */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <Suspense fallback={null}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;