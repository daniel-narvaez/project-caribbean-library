/**
 * App.jsx
 * =======
 * 
 * Main application component that handles routing and context providers.
 * Dynamically generates routes for game project pages from gameProjectsData.
 * 
 * Route Structure:
 * - "/" and "/home" => Home component
 * - "/{project-url}" => Individual GameProjectPage components
 * 
 * Context Providers:
 * - ScreenSizeProvider: Handles responsive design
 * - TypographyProvider: Manages font loading and text styles
 * - ChaptersProvider: Manages chapter navigation
 */

import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics, track } from "@vercel/analytics/react"

import Navbar from '../../components/Navbar/Navbar';
import { AnimatedCursor, SplashEffect } from '../../components/Cursor/Cursor';

import { ScreenSizeProvider } from '../../contexts/ScreenSize';
import { TypographyProvider } from '../../contexts/Typography';
import { ChaptersProvider } from '../../contexts/ChaptersContext';

import Home from '../Home/Home';
import Resume from '../Resume/Resume';
import Contact from '../Contact/Contact';
import { GameProjectPage } from '../GameProjects/GameProjectPage';

import { gameProjectsData } from '../../data/gameProjects';

import styles from './App.module.css';
/**
 * Main App Component
 * Wraps the application in necessary providers and generates routes
 * 
 * Route Generation:
 * Takes gameProjectsData object and generates individual routes for each project.
 * Each project route renders a GameProjectPage component with the project data.
 * 
 * Example:
 * gameProjectsData = {
 *   projectA: { urls: { portfolio: "/project-a" }, ... },
 *   projectB: { urls: { portfolio: "/project-b" }, ... }
 * }
 * 
 * Generates:
 * <Route path="/project-a" element={<GameProjectPage game={projectA} />} />
 * <Route path="/project-b" element={<GameProjectPage game={projectB} />} />
 */
function App() {
  // Generate project routes from game projects data
  const gameProjectRoutes = Object.values(gameProjectsData).map((gameProject) => (
    <Route
      key={gameProject.path}
      path={gameProject.urls.portfolio}
      element={<GameProjectPage game={gameProject} />}
    />
  ));

  useEffect(() => {
    const source = new URLSearchParams(window.location.search).get('utm_source') || 'direct';
    track('Visit', {
      source: source,
      path: window.location.pathname
    });
  }, []);

  return (
    <ScreenSizeProvider>
      <TypographyProvider>
        <ChaptersProvider>
          <div className={styles.App}>
            <Analytics />
            <Navbar />
            <BrowserRouter>
              <SplashEffect />
              <AnimatedCursor />
              <Routes>
                {/* Static routes */}
                <Route key="root" path="/" element={<Home />} />
                <Route key="home" path="/home" element={<Home />} />
                <Route key="resume" path="/resume" element={<Resume />} />
                <Route key="contact" path="/contact" element={<Contact />} />
                
                {/* Dynamic project routes */}
                {gameProjectRoutes}
              </Routes>
            </BrowserRouter>
          </div>
        </ChaptersProvider>
      </TypographyProvider>
    </ScreenSizeProvider>
  );
}

export default App;