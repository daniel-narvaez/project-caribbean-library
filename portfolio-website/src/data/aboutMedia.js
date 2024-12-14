export const createAboutItem = ({
  id = 'default',
  src,
  alt
}) => ({
  id,
  src,
  alt
});

export const defaultImage = createAboutItem({
  id: 'default',
  src: '/../../images/about/default.jpg',
  alt: "a portrait image of me smiling in a black polo shirt. Behind me is a wall of grass."
});

export const graduatedImage = createAboutItem({
  id: 'graduated',
  src: '/../../images/about/graduated.jpg',
  alt: "a portrait image of me smiling in my college graduation gown. I'm wearing a stole that reads 'Parsons School of Design' on one end, and bears The New School logo on the other end."
});

export const exhibitingImage = createAboutItem({
  id: 'exhibiting',
  src: '/../../images/about/exhibiting.jpg',
  alt: "an image of me leaning against my exhibition of one of my games at an event. I'm wearing a shirt that reads 'Bad Bunny' and am wearing a medallion with the Puerto Rican flag."
});

export const aboutMedia = [defaultImage, graduatedImage, exhibitingImage];

export const getAboutItem = (id = 'default') => aboutMedia.find(mediaItem => mediaItem.id === id) ?? null;