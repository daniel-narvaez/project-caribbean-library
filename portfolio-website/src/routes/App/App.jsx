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

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScreenSizeProvider } from '../../contexts/ScreenSize';
import { TypographyProvider } from '../../contexts/Typography';
import { ChaptersProvider } from '../../contexts/ChaptersContext';
import { AnimatedCursor, SplashEffect } from '../../components/Cursor/Cursor';
import Home from '../Home/Home';
import styles from './App.module.css';
import { gameProjectsData } from '../../data/gameProjects';
import { GameProjectPage } from '../GameProjects/GameProjectPage';
import Resume from '../Resume/Resume';
import Navbar from '../../components/Navbar/Navbar';

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
    const projectRoutes = Object.values(gameProjectsData).map((gameProject) => (
        <Route
            key={gameProject.path}
            path={gameProject.urls.portfolio}
            element={<GameProjectPage game={gameProject} />}
        />
    ));

    return (
        <ScreenSizeProvider>
            <TypographyProvider>
                <ChaptersProvider>
                    <div className={styles.App}>
                        <Navbar />
                        <BrowserRouter>
                            <SplashEffect />
                            <AnimatedCursor />
                            <Routes>
                                {/* Static routes */}
                                <Route key="root" path="/" element={<Home />} />
                                <Route key="home" path="/home" element={<Home />} />
                                <Route key="resume" path="/resume" element={<Resume />} />
                                
                                {/* Dynamic project routes */}
                                {projectRoutes}
                            </Routes>
                        </BrowserRouter>
                    </div>
                </ChaptersProvider>
            </TypographyProvider>
        </ScreenSizeProvider>
    );
}

export default App;