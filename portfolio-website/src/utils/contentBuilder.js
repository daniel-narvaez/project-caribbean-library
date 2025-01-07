const createSection = (type, content) => ({ type, content });

export const projectContent = {
  heading: (content) => createSection('heading', content),
  subheading: (content) => createSection('subheading', content),
  paragraph: (content) => createSection('paragraph', content),
  figure: (src, alt, caption) => createSection('figure', { src, alt, caption }),
  gallery: (images) => createSection('gallery', { images }),
  bulletList: (items) => createSection('bulletList', items),  
}