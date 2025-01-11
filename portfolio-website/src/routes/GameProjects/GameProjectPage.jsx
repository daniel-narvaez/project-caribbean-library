import React from 'react';

import { Navbar } from '../../components/Navbar/Navbar';
import { Background } from '../../components/Background/Background';

import { formatText } from '../../utils/formatText';
import styles from './GameProjectPage.module.css';
import Chapter from '../../components/Chapter/Chapter';

export function GameProjectPage({ game }) {
  const renderContent = (element, key, props) => {
    switch (element.type) {
      case 'titleFrame':
        return (
          <div 
            className={styles.titleFrame}
            key={key}
          >
            {/* Fixed content layer */}
            <div className={styles.moneyShotContainer}>
              <img
                className={styles.moneyShot}
                src={element.content.moneyShot.src}
                alt={element.content.moneyShot.alt}
              />
            </div>

            {/* Scrollable content layer */}
            <div className={styles.contentOverlay}>
              { element.content.logo.src ? (
                <>
                  <img
                    className={styles.logo}
                    src={element.content.logo.src}
                    alt= {element.content.logo.alt || `${game.title} logo`}
                  />
                  <h1 className='sr-only'>{game.title}</h1>
                </>
              ) : (
                <h1 className={styles.title}>{game.title}</h1>
              )}
            </div>
          </div>
        );

      case 'details':
        return (
          <table
            className={styles.projectDetails}
            key={key}
          >
            <tbody>
              {element.content.map((item, index) => (
                <tr key={index}>
                  <td className={styles.detail} style={{fontWeight: '700'}}>
                    {`${formatText(item.key)}:`}
                  </td>
                  <td className={styles.detail}>
                  {formatText(typeof item.value === 'function' ? 
                    item.value({ urls: game.urls }) : 
                    item.value
                  )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'heading':
        return (
          <h2 
            className={styles.heading}
            key={key}
          >
            {element.content}
          </h2>
        );

      case 'subheading':
        return (
          <h3 
            className={styles.subheading}
            key={key}
          >
            {element.content}
          </h3>
        );
        
      case 'paragraph':
        return <p>{formatText(element.content)}</p>;
        
      case 'bulletList':
        return (
          <ul className={styles.bulletList} key={key}>
            {element.content.map((item, index) => (
              <li key={index}>{formatText(item)}</li>
            ))}
          </ul>
        );
      
      case 'figure':
        return (
          <figure>
            <figcaption>{element.content.caption}</figcaption>
            <img 
              src={element.content.src}
              alt={element.content.alt} 
            />
          </figure>
        );
    }
  }

  return (
    <div className={styles.GameProjectPage}>
      <Navbar />
      <main>
        <Chapter>
          {renderContent(game.projectPage.main)}
        </Chapter>
      </main>
      <Background>
        <div className={styles.walkthrough}>
          {game.projectPage.walkthrough.map((chapter, cIndex) => (
            <Chapter key={cIndex} className={styles.chapter}>
              {renderContent(chapter.heading)}
              <div className={styles.content}>
                <div className={styles.left}>
                  {chapter.content.left.map((element, eIndex) => (
                    renderContent(element, `left-${cIndex}-${eIndex}`)
                  ))}
                </div>
                <div className={styles.right}>
                  {chapter.content.right.map((element, eIndex) => (
                    renderContent(element, `right-${cIndex}-${eIndex}`)
                  ))}
                </div>
              </div>
            </Chapter>
          ))}
        </div>
      </Background>
    </div>
  )
}