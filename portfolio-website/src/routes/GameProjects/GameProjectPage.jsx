import React from 'react';

import { Navbar } from '../../components/Navbar/Navbar';
import { Background } from '../../components/Background/Background';

import { formatText } from '../../utils/formatText';
import styles from './GameProjectPage.module.css';
import Chapter from '../../components/Chapter/Chapter';
import { Footer, FooterNav } from '../../components/Footer/Footer';
import ScrollAnchor from '../../components/ScrollAnchor/ScrollAnchor';
import { useChapters } from '../../contexts/ChaptersContext';

export function GameProjectPage({ game }) {

  const renderContent = (element, key, ...props) => {
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
        return <p key={key}>{formatText(typeof element.content === 'function' ? element.content({ urls: game.urls }) : element.content )}</p>;
        
      case 'list':
        return (
          element.content.type === 'bullet' ?
          <ul 
            className={styles.bulletList} 
            key={key}
          >
            {element.content.items.map((item, index) => (
              <li key={index}>{formatText(item)}</li>
            ))}
          </ul> : 
          <ol
            className={styles.bulletList} 
            key={key}
          >
            {element.content.items.map((item, index) => (
              <li key={index}>{formatText(item)}</li>
            ))}
          </ol>
        );
      
      case 'figureSet':
        return (
          <div 
            className={styles.figureSet}
            key={key}
          >
            {element.content.map((item, index) => (
              <figure 
                className={styles.figure}
                key={index}
              >
                <figcaption><b>Figure {item.figId}:</b> <i>{item.caption}</i></figcaption>
                <img 
                  src={item.src}
                  alt={item.alt} 
                />
              </figure>
            ))}
          </div>
        );

        case 'video':
          return (
            <div 
              key={key}
              className={`${styles.iframeWrapper} external-context`}
            >
              <iframe
                className={styles.video}
                {...element.content}
                src={element.content.src}
                title={element.content.title}
                allow="fullscreen"
                allowFullScreen
              />
            </div>
          );
    }
  }

  return (
    <div className={styles.GameProjectPage}>
      <Navbar />
      <main>
        <Chapter id='moneyShot'>
          {console.log('Rendering moneyShot chapter')}
          {renderContent(game.projectPage.main)}
        </Chapter>
      </main>
      <Background>
        <ScrollAnchor />
        <div className={styles.walkthrough}>
          {game.projectPage.walkthrough.map((chapter, cIndex) => {
            console.log(`Rendering chapter-${cIndex + 1}`);
            return (
              <Chapter 
                key={cIndex} 
                className={styles.chapter}
                id={`chapter-${cIndex + 1}`}
              >
                {renderContent(chapter.heading, `heading-${cIndex}`)}
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
            )
          })}
        </div>
        <Footer>
          <FooterNav />
        </Footer>
      </Background>
    </div>
  )
}