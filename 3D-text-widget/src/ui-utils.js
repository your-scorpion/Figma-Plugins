export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((part) => part + part).join('')
    : normalized;

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

export function shade(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const next = [r, g, b]
    .map((channel) => clamp(channel + amount, 0, 255))
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('');

  return `#${next}`;
}

export function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);

  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
}

export function normalizeAxis(value, min, max) {
  return (clamp(value, min, max) - min) / (max - min);
}