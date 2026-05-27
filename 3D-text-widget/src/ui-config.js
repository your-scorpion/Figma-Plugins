export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 768;

export const fonts = [
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Arial Black', value: '"Arial Black", Arial, sans-serif' },
  { label: 'Avenir Next', value: '"Avenir Next", Avenir, "Helvetica Neue", sans-serif' },
  { label: 'Baskerville', value: 'Baskerville, "Times New Roman", serif' },
  { label: 'Calibri', value: 'Calibri, "Segoe UI", sans-serif' },
  { label: 'Cambria', value: 'Cambria, Georgia, serif' },
  { label: 'Candara', value: 'Candara, "Segoe UI", sans-serif' },
  { label: 'Consolas', value: 'Consolas, "Courier New", monospace' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Futura', value: 'Futura, "Trebuchet MS", sans-serif' },
  { label: 'Garamond', value: 'Garamond, Georgia, serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Gill Sans', value: '"Gill Sans", "Trebuchet MS", sans-serif' },
  { label: 'Helvetica Neue', value: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { label: 'Impact', value: 'Impact, "Arial Black", sans-serif' },
  { label: 'Menlo', value: 'Menlo, Consolas, monospace' },
  { label: 'Optima', value: 'Optima, Candara, sans-serif' },
  { label: 'Palatino', value: 'Palatino, "Palatino Linotype", Georgia, serif' },
  { label: 'Segoe UI', value: '"Segoe UI", Tahoma, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, Verdana, sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", Verdana, sans-serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
];

export function createDefaultState() {
  return {
    text: 'Editable\n3D Text',
    font: fonts[0].value,
    size: 180,
    textOpacity: 100,
    shadowCount: 12,
    shadowDistance: 4,
    shadowOpacity: 78,
    shadowSoftness: 58,
    shadowDepth: 100,
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