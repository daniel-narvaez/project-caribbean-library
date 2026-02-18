import { getLinkAttributes } from './externalUrls';
import typographies from '../typography.module.css';
import colors from '../color.module.css';

const PATTERNS = {
  SPLIT: /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|__.*?__)/,
  LINK: /\[(.*?)\]\((.*?)\)/,
  BOLD: /\*\*(.*?)\*\*/,
  ITALICS: /\*(.*?)\*/,
  UNDERLINE: /__(.*?)__/
};

export const formatText = (text) => {
  if (typeof text !== 'string') {
    throw new Error('formatText requires a string input');
  }

  if (!text.trim()) {
    return [text];
  }

  return text
    .split(PATTERNS.SPLIT)
    .map((segment, index) => {
      if (!segment) return null;

      const linkMatch = segment.match(PATTERNS.LINK);
      if (linkMatch) {
        const [_, text, url] = linkMatch;
        const linkAttributes = getLinkAttributes(url);
        return (
            <a
              className={`${colors.nav1}`}
              key={`link-${index}`}
              href={url}
              {...linkAttributes}
            >
              {text}
            </a>
        );
      }

      const boldMatch = segment.match(PATTERNS.BOLD);
      if (boldMatch) {
          return <b key={`bold-${index}`}>{boldMatch[1]}</b>;
      }

      const italicsMatch = segment.match(PATTERNS.ITALICS);
      if (italicsMatch && !segment.includes('**')) {
          return <i key={`italic-${index}`}>{italicsMatch[1]}</i>;
      }

      const underlineMatch = segment.match(PATTERNS.UNDERLINE);
      if (underlineMatch) {
          return <u key={`underline-${index}`}>{underlineMatch[1]}</u>;
      }

      return segment;
    })
    .filter(Boolean);
};