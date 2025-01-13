/**
 * formatText.jsx
 * =============
 * 
 * Overview:
 * A utility function that converts markdown-like syntax in text to React elements.
 * Handles links, bold text, and italics using custom syntax.
 * 
 * Supported Syntax:
 * - Links: [text](url)
 * - Bold: **text**
 * - Italics: *text*
 */

import { getLinkAttributes } from './externalUrls';

// Pre-compiled regex patterns for better performance
const PATTERNS = {
    SPLIT: /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*)/,
    LINK: /\[(.*?)\]\((.*?)\)/,
    BOLD: /\*\*(.*?)\*\*/,
    ITALICS: /\*(.*?)\*/
};

/**
 * Formats text by converting markdown-like syntax to React elements
 * 
 * @param {string} text - The text to format
 * @returns {Array} Array of React elements and strings
 * @throws {Error} If text is not a string
 * 
 * @example
 * formatText("Click [here](https://example.com) for **more** info")
 * // Returns: ["Click ", <a href="https://example.com">here</a>, " for ", <b>more</b>, " info"]
 */
export const formatText = (text) => {
    // Input validation
    if (typeof text !== 'string') {
        throw new Error('formatText requires a string input');
    }

    // Handle empty or whitespace-only strings
    if (!text.trim()) {
        return [text];
    }

    return text
        .split(PATTERNS.SPLIT)
        .map((segment, index) => {
            // Skip empty segments
            if (!segment) return null;

            // Handle links with proper attributes
            const linkMatch = segment.match(PATTERNS.LINK);
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

            // Handle bold text
            const boldMatch = segment.match(PATTERNS.BOLD);
            if (boldMatch) {
                return <b key={`bold-${index}`}>{boldMatch[1]}</b>;
            }

            // Handle italics (only if not part of a bold pattern)
            const italicsMatch = segment.match(PATTERNS.ITALICS);
            if (italicsMatch && !segment.includes('**')) {
                return <i key={`italic-${index}`}>{italicsMatch[1]}</i>;
            }

            // Return plain text segment
            return segment;
        })
        .filter(Boolean); // Remove null/undefined segments
};