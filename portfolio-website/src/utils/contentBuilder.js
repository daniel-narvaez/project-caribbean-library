/**
 * @typedef {Object} ImageConfig
 * @property {string} src - The source path of the image
 * @property {string} alt - Alternative text for the image
 */

/**
 * @typedef {Object} ProjectContent
 * @property {(logo: ImageConfig, moneyShot: ImageConfig) => any} titleFrame
 * @property {(items: Array<{key: string, value: string}>) => any} details
 * @property {(content: string) => any} heading
 * @property {(content: string) => any} subheading
 * @property {(content: string) => any} paragraph
 * @property {(items: Array<{src: string, alt: string, figId: string, caption: string}>) => any} figureSet
 * @property {(config: {src: string, title: string, width?: string, height?: string}) => any} video
 * @property {(config: {figId: string, caption: string, items: Array<{type: string, url: string, alt: string}>}) => any} gallery
 * @property {(config: {type: 'bullet' | 'numbered', items: string[]}) => any} list
 */

const createElement = (type, content) => ({ type, content });

/** @type {ProjectContent} */
export const projectContent = {
    titleFrame: (logo, moneyShot) => createElement('titleFrame', {
        logo: {
            src: logo.src || '',
            alt: logo.alt || '',
        },
        moneyShot: {
            src: moneyShot.src || '',
            alt: moneyShot.alt || ''
        }
    }),

    details: (items) => createElement('details', items),

    heading: (content) => createElement('heading', content),

    subheading: (content) => createElement('subheading', content),

    paragraph: (content) => createElement('paragraph', content),

    figureSet: (items) => createElement('figureSet', items),

    video: ({ src, title, ...props }) => createElement('video', { src, title, ...props }),

    gallery: ({ figId, caption, items}) => createElement('gallery', { figId, caption, items }),

    list: (content) => createElement('list', content),
};