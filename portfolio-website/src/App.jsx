import styles from './App.module.css'

import { ScreenSizeProvider } from './contexts/ScreenSize';
import { Navbar } from './components/Navbar/Navbar';

function App() {

  return (
    <ScreenSizeProvider>
        <div className={styles.App}>
            <Navbar/>
        </div>
    </ScreenSizeProvider>
  )
}

export default App
