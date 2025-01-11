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
  figure: (src, alt, caption) => createElement('figure', { src, alt, caption }),
  gallery: (images) => createElement('gallery', { images }),
  bulletList: (items) => createElement('bulletList', items),
}