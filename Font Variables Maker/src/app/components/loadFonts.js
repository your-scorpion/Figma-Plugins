export async function loadFonts() {
  const fontNames = ['Inter', 'Roboto', 'Montserrat', 'Cardo', 'Arial'];

  // Load necessary fonts
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Montserrat', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Cardo', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Arial', style: 'Regular' });

  return fontNames;
}