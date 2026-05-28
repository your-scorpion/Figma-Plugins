export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 768;

const defaultEmojiTexts = [
  '🔷', '📐', '🔵', '🔶', '🔲',
  '✏️', '📏', '🖊️', '📌', '🖋️',
  '🌊', '🌸', '🌿', '🔮', '🌙', '🌟',
  '⬛', '💠', '💎', '🌑',
  '⚡', '💡', '🌐', '🟣', '◾', '🔘', '▪️', '◽', '🔳',
];

function pickDefaultEmojiText() {
  const randomIndex = Math.floor(Math.random() * defaultEmojiTexts.length);
  return defaultEmojiTexts[randomIndex];
}

export const fonts = [
  // Serif
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Baskerville', value: 'Baskerville, "Times New Roman", serif' },
  { label: 'Cambria', value: 'Cambria, Georgia, serif' },
  { label: 'Garamond', value: 'Garamond, Georgia, serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Palatino', value: 'Palatino, "Palatino Linotype", Georgia, serif' },
  { label: 'Didot', value: 'Didot, "Bodoni MT", "Playfair Display", Georgia, serif' },
  { label: 'Bodoni MT', value: '"Bodoni MT", Didot, Georgia, serif' },
  { label: 'Book Antiqua', value: '"Book Antiqua", Palatino, Georgia, serif' },
  { label: 'Hoefler Text', value: '"Hoefler Text", Garamond, Georgia, serif' },
  { label: 'Constantia', value: 'Constantia, Georgia, serif' },
  { label: 'Cochin', value: 'Cochin, Garamond, Georgia, serif' },

  // Sans-Serif
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Arial Black', value: '"Arial Black", Arial, sans-serif' },
  { label: 'Helvetica Neue', value: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Avenir Next', value: '"Avenir Next", Avenir, "Helvetica Neue", sans-serif' },
  { label: 'Avenir', value: 'Avenir, "Avenir Next", "Helvetica Neue", sans-serif' },
  { label: 'Futura', value: 'Futura, "Century Gothic", "Trebuchet MS", sans-serif' },
  { label: 'Century Gothic', value: '"Century Gothic", Futura, "Trebuchet MS", sans-serif' },
  { label: 'Gill Sans', value: '"Gill Sans", "Gill Sans MT", "Trebuchet MS", sans-serif' },
  { label: 'Gill Sans MT', value: '"Gill Sans MT", "Gill Sans", "Trebuchet MS", sans-serif' },
  { label: 'Optima', value: 'Optima, Candara, "Segoe UI", sans-serif' },
  { label: 'Candara', value: 'Candara, "Segoe UI", sans-serif' },
  { label: 'Calibri', value: 'Calibri, "Segoe UI", sans-serif' },
  { label: 'Segoe UI', value: '"Segoe UI", Tahoma, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, Verdana, sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", Verdana, sans-serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Impact', value: 'Impact, "Arial Black", sans-serif' },
  { label: 'Franklin Gothic Medium', value: '"Franklin Gothic Medium", "Franklin Gothic", Arial, sans-serif' },
  { label: 'Myriad Pro', value: '"Myriad Pro", "Helvetica Neue", Arial, sans-serif' },
  { label: 'Frutiger', value: 'Frutiger, "Helvetica Neue", Arial, sans-serif' },
  { label: 'DIN Alternate', value: '"DIN Alternate", "DIN Next", Arial, sans-serif' },
  { label: 'Lucida Grande', value: '"Lucida Grande", "Lucida Sans Unicode", Arial, sans-serif' },
  { label: 'Geneva', value: 'Geneva, Verdana, sans-serif' },

  // Monospace
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Consolas', value: 'Consolas, "Courier New", monospace' },
  { label: 'Menlo', value: 'Menlo, Consolas, monospace' },
  { label: 'Monaco', value: 'Monaco, "Courier New", monospace' },
  { label: 'Andale Mono', value: '"Andale Mono", Consolas, monospace' },
  { label: 'Lucida Console', value: '"Lucida Console", Menlo, monospace' },
  { label: 'SF Mono', value: '"SF Mono", Menlo, Consolas, monospace' },

  // Display / Decorative
  { label: 'Brush Script MT', value: '"Brush Script MT", cursive' },
  { label: 'Papyrus', value: 'Papyrus, fantasy' },
  { label: 'Copperplate', value: 'Copperplate, "Copperplate Gothic Light", fantasy' },
  { label: 'Big Caslon', value: '"Big Caslon", Georgia, serif' },
  { label: 'Rockwell', value: 'Rockwell, "Courier Bold", serif' },
  { label: 'American Typewriter', value: '"American Typewriter", Courier, monospace' },
  { label: 'Zapfino', value: 'Zapfino, cursive' },
  { label: 'Luminari', value: 'Luminari, fantasy' },
  { label: 'Marker Felt', value: '"Marker Felt", fantasy' },
];

export function createDefaultState() {
  return {
    text: pickDefaultEmojiText(),
    font: fonts[0].value,
    size: 180,
    textOpacity: 100,
    shadowCount: 20,
    shadowDistance: 4,
    shadowDirectionX: 0,
    shadowDirectionY: 0,
    shadowOpacity: 84,
    shadowSoftness: 50,
    shadowDepth: 130,
    shadow2Count: 10,
    shadow2Distance: 8,
    shadow2Softness: 90,
    shadow2Opacity: 35,
    shadow2Color: '#000000',
    borderWidth: 0,
    windowWidth: 1024,
    windowHeight: 768,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    textColor: '#f8fbff',
    edgeColor: '#2fc7ff',
    shadowColor: '#1a5fa8',
  };
}