import { getLinkAttributes } from './externalUrls';

export const formatText = (text) => {
  return text
    .split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*)/)
    .map((segment, index) => {
      // Handle links
      const linkMatch = segment.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const [_, text, url] = linkMatch;
        const linkAttributes = getLinkAttributes(url);
        return (
          <a 
            key={`link-${index}`}
            href={url}
            {...linkAttributes}
          >
            {text}
          </a>
        );
      }

      // Handle bold
      const boldMatch = segment.match(/\*\*(.*?)\*\*/);
      if (boldMatch) {
        return <b key={`bold-${index}`}>{boldMatch[1]}</b>;
      }

      // Handle italics
      const italicsMatch = segment.match(/\*(.*?)\*/);
      if (italicsMatch) {
        return <i key={`italic-${index}`}>{italicsMatch[1]}</i>;
      }

      // Return plain text
      return segment;
    });
};