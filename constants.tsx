
import { FontConfig, PaperType } from './types';

export const HANDWRITING_FONTS: FontConfig[] = [
  { id: 'courgette', name: 'Courgette (Readable)', family: "'Courgette', cursive" },
  { id: 'marck', name: 'Marck Script (Clear Cursive)', family: "'Marck Script', cursive" },
  { id: 'handlee', name: 'Handlee (Neat Print)', family: "'Handlee', cursive" },
  { id: 'architect', name: 'Architects Daughter', family: "'Architects Daughter', cursive" },
  { id: 'caveat', name: 'Caveat', family: "'Caveat', cursive" },
  { id: 'dancing', name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { id: 'sacramento', name: 'Sacramento', family: "'Sacramento', cursive" },
  { id: 'indie', name: 'Indie Flower', family: "'Indie Flower', cursive" },
  { id: 'shadows', name: 'Shadows Into Light', family: "'Shadows Into Light', cursive" },
  { id: 'homemade', name: 'Homemade Apple', family: "'Homemade Apple', cursive" },
  { id: 'gloria', name: 'Gloria Hallelujah', family: "'Gloria Hallelujah', cursive" },
  { id: 'satisfy', name: 'Satisfy', family: "'Satisfy', cursive" },
  { id: 'pacifico', name: 'Pacifico', family: "'Pacifico', cursive" },
  { id: 'alex', name: 'Alex Brush', family: "'Alex Brush', cursive" },
  { id: 'pinyon', name: 'Pinyon Script', family: "'Pinyon Script', cursive" },
  { id: 'haviland', name: 'Mr De Haviland', family: "'Mr De Haviland', cursive" },
  { id: 'cedarville', name: 'Cedarville Cursive', family: "'Cedarville Cursive', cursive" },
  { id: 'tangerine', name: 'Tangerine', family: "'Tangerine', cursive" },
  { id: 'greatvibes', name: 'Great Vibes', family: "'Great Vibes', cursive" },
];

export const INK_COLORS = [
  { name: 'Classic Blue', value: '#1d4ed8' },
  { name: 'Midnight Black', value: '#18181b' },
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Deep Red', value: '#991b1b' },
  { name: 'Emerald Green', value: '#065f46' },
];

export const INITIAL_STATE = {
  text: "Importance of Education\n\nEducation plays a very important role in our life. It is the foundation of personal and social development. Education helps us gain knowledge, improve our understanding, and shape our character.\n\nA well-educated person is respected in society. Education teaches us good manners, discipline, and moral values. It helps us develop confidence and positive thinking. Through education, we learn how to behave properly with others and how to face challenges in life. An educated person can think clearly and take correct decisions.",
  fontFamily: HANDWRITING_FONTS[0].family,
  fontSize: 24,
  inkColor: INK_COLORS[0].value,
  paperType: PaperType.RULED,
  lineHeight: 1.5,
  letterSpacing: 0,
  fullPage: false,
};
