const createElement = (type, content) => ({ type, content });

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
  gallery: (images) => createElement('gallery', { images }),
  list: (content) => createElement('list', content),
}