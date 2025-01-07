import styles from './GameProjectPage.module.css';
import { formatText } from '../../utils/formatText';

export function GameProjectPage({ game }) {
  const renderContent = (section) => {
    switch (section.type) {
      case 'heading':
        return <h2>{section.content}</h2>;

      case 'subheading':
        return <h3>{section.content}</h3>;
        
      case 'paragraph':
        return <p>{formatText(section.content)}</p>;
        
      case 'bulletList':
        return (
          <ul>
            {section.content.map((item, index) => (
              <li key={index}>{formatText(item)}</li>
            ))}
          </ul>
        );
      
      case 'figure':
        return (
          <figure>
            <figcaption>{section.content.caption}</figcaption>
            <img 
              src={section.content.src}
              alt={section.content.alt} 
            />
          </figure>
        );
    }
  }
  return (
    <div className={styles.GameProjectPage}>
      This is a Game Project page.
    </div>
  )
}