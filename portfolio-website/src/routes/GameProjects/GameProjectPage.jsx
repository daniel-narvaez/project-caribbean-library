/**
 * GameProjectPage.jsx
 * =================
 * 
 * A dynamic project page component that renders different types of content
 * based on provided game data structure.
 */

import { useContext, memo } from 'react';
import { Helmet } from 'react-helmet';
import { Background } from '../../components/Background/Background';
import { formatText } from '../../utils/formatText';
import Chapter from '../../components/Chapter/Chapter';
import { Footer, FooterNav } from '../../components/Footer/Footer';
import ScrollAnchor from '../../components/ScrollAnchor/ScrollAnchor';
import { Slideshow } from '../../components/Slideshow/Slideshow';
import { DeviceContext } from '../../contexts/DeviceContext';
import styles from './GameProjectPage.module.css';
import typographies from '../../typography.module.css';


/**
 * Utility to combine class names with size variant
 * @param {string} baseClass - Base class name
 * @param {string} size - Screen size variant
 * @param {string} [additional] - Additional classes
 */
const getClasses = (baseClass, size, additional = '') => {
  const classes = [styles[baseClass], styles[size]];
  if (additional) classes.push(additional);
  return classes.filter(Boolean).join(' ');
};

/**
 * Content renderers for different element types
 */
const contentRenderers = {
  titleFrame: (element, key, size, game) => (
    <div className={getClasses('titleFrame', size)} key={key}>
      <div className={getClasses('moneyShotContainer', size)}>
        <img
          className={getClasses('moneyShot', size)}
          src={element.content.moneyShot.src}
          alt={element.content.moneyShot.alt}
        />
      </div>
      <div className={getClasses('contentOverlay', size)}>
        {element.content.logo.src ? (
          <>
            <img
              className={getClasses('logo', size)}
              src={element.content.logo.src}
              alt={element.content.logo.alt || `${game.title} logo`}
            />
            <h1 className="sr-only">{game.title}</h1>
          </>
        ) : (
          <h1 className={styles.title}>{game.title}</h1>
        )}
      </div>
    </div>
  ),

  details: (element, key, size, game) => (
    <table className={getClasses('projectDetails', size)} key={key}>
      <tbody>
        {element.content.map((item, index) => (
          <tr key={index}>
            <td 
              className={`${typographies.b2} ${getClasses('detail', size)}`} 
              style={{fontWeight: '700'}}
            >
              {formatText(item.key)}:
            </td>
            <td className={`${typographies.b2} ${getClasses('detail', size)}`}>
              {formatText(
                typeof item.value === 'function' 
                  ? item.value({ urls: game.urls }) 
                  : item.value
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),

  heading2: (element, key, size) => (
    <h2 className={`${typographies.h2} ${getClasses('', size)}`} key={key}>
      {element.content}
    </h2>
  ),

  heading3: (element, key, size) => (
    <h3 className={`${typographies.h3} ${getClasses('', size)}`} key={key}>
      {element.content}
    </h3>
  ),

  paragraph: (element, key, size, game) => (
    <p className={`${typographies.b2}`} key={key}>
      {formatText(
        typeof element.content === 'function' 
          ? element.content({ urls: game.urls })
          : element.content
      )}
    </p>
  ),

  list: (element, key, size) => (
    element.content.type === 'bullet' ? (
      <ul className={`${getClasses('list', size)}`} key={key}>
          {element.content.items.map((item, index) => (
            <li className={`${typographies.b2}`} key={index}>{formatText(item)}</li>
          ))}
      </ul>
    ) : (
      <ol className={`${getClasses('list', size)}`} key={key}>
        {element.content.items.map((item, index) => (
          <li className={`${typographies.b2}`} key={index}>{formatText(item)}</li>
        ))}
      </ol>
    )
  ),

  figureSet: (element, key, size) => (
    <div className={getClasses('figureSet', size)} key={key}>
      {element.content.map((item, index) => (
        <figure className={getClasses('figure', size)} key={index}>
          <img src={item.src} alt={item.alt} />
          <figcaption className={`${typographies.b3}`}>
            <b>Figure {item.figId}:</b> <i>{item.caption}</i>
          </figcaption>
        </figure>
      ))}
    </div>
  ),

  gallery: (element, key, size) => (
    <figure className={getClasses('figure', size)} key={key}>
      <figcaption className={`${typographies.b3}`}>
        <b>Figure {element.content.figId}:</b> <i>{element.content.caption}</i>
      </figcaption>
      <Slideshow slides={element.content.items} playbackMode="manual" />
    </figure>
  ),

  video: (element, key, size) => (
    <div 
      key={key}
      className={getClasses('iframeWrapper', size, `external-context ${size}`)}
    >
      <iframe
        className={getClasses('video', size)}
        {...element.content}
        src={element.content.src}
        title={element.content.title}
        allow="fullscreen"
        allowFullScreen
      />
    </div>
  ),
};

/**
 * Renders content based on element type
 * @param {Object} element - Content element to render
 * @param {string} key - React key
 * @param {Object} game - Game data
 * @param {string} size - Screen size
 */
const renderContent = (element, key, game, size) => {
  const renderer = contentRenderers[element.type];
  if (!renderer) {
      console.warn(`Unknown content type: ${element.type}`);
      return null;
  }
  return renderer(element, key, size, game);
};

/**
* Main game project page component
* @param {Object} props
* @param {Object} props.game - Game project data
*/
export const GameProjectPage = memo(({ game }) => {
  const { device } = useContext(DeviceContext);

  return (
    <>
    <Helmet>
      <title>{`${game.title} | Daniel Narvaez`}</title>
    </Helmet>
    <div className={getClasses('GameProjectPage', device)}>
      <main>
        <h1 className='sr-only'>{game.title} Daniel Narvaez</h1>
        <Chapter id="moneyShot">
            {renderContent(game.projectPage.main, 'main', game, device)}
        </Chapter>
      </main>
      <Background>
        <ScrollAnchor />
        <div className={getClasses('walkthrough', device)}>
          {game.projectPage.walkthrough.map((chapter, cIndex) => (
            <Chapter 
                key={cIndex}
                className={getClasses('chapter', device)}
                id={`chapter-${cIndex + 1}`}
            >
              {renderContent(
                chapter.heading,
                `heading-${cIndex}`,
                game,
                device
              )}
              <div className={getClasses('content', device)}>
                <div className={styles.left}>
                  {chapter.content.left.map((element, eIndex) => (
                    renderContent(
                      element,
                      `left-${cIndex}-${eIndex}`,
                      game,
                      device
                    )
                  ))}
                </div>
                {chapter.content.right && chapter.content.right.length > 0 && (
                  <div className={styles.right} style={{ flexDirection: chapter.content.flexDir || 'auto'}}>
                    {chapter.content.right.map((element, eIndex) => (
                      renderContent(
                        element,
                        `right-${cIndex}-${eIndex}`,
                        game,
                        device
                      )
                    ))}
                  </div>
                )}
              </div>
            </Chapter>
          ))}
        </div>
        <Footer>
          <FooterNav />
        </Footer>
      </Background>
    </div>
    </>
  );
});