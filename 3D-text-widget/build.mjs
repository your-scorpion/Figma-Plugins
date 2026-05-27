import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

function stripModuleSyntax(source) {
  return source
    .replace(/^\s*export\s+(?=(function|const|let|class))/gm, '')
    .replace(/^\s*export\s*\{[^}]+\};?\s*$/gm, '');
}

function bundleJsModule(entryPath, seen = new Set()) {
  const normalizedPath = path.resolve(entryPath);

  if (seen.has(normalizedPath)) {
    return '';
  }

  seen.add(normalizedPath);

  let source = fs.readFileSync(normalizedPath, 'utf8').trimEnd();
  let dependencies = '';

  source = source.replace(
    /^\s*import\s+\{[^}]+\}\s+from\s+['"](\.\/?[^'"]+)['"];?\s*$/gm,
    (match, specifier) => {
      const resolvedPath = path.resolve(path.dirname(normalizedPath), specifier);
      const modulePath = path.extname(resolvedPath) ? resolvedPath : `${resolvedPath}.js`;
      dependencies += `${bundleJsModule(modulePath, seen)}\n`;
      return '';
    },
  );

  if (/^\s*import\s+/m.test(source)) {
    throw new Error(`Unsupported import syntax in ${normalizedPath}`);
  }

  return `${dependencies}${stripModuleSyntax(source).trim()}\n`;
}

const codeTemplate = fs.readFileSync(path.join(srcDir, 'code.js'), 'utf8');
const uiHtml = fs.readFileSync(path.join(srcDir, 'ui.html'), 'utf8');
const uiCss = fs.readFileSync(path.join(srcDir, 'ui.css'), 'utf8').trimEnd();
const nouiSliderCss = fs.readFileSync(path.join(rootDir, 'node_modules', 'nouislider', 'dist', 'nouislider.min.css'), 'utf8').trimEnd();
const nouiSliderJs = fs.readFileSync(path.join(rootDir, 'node_modules', 'nouislider', 'dist', 'nouislider.min.js'), 'utf8').trimEnd();
const uiJs = bundleJsModule(path.join(srcDir, 'ui.js')).trimEnd();
const buttonSvg = fs.readFileSync(path.join(srcDir, 'button.svg'), 'utf8').trimEnd();

const bundledHtml = uiHtml
  .replace(
    ' <link rel="stylesheet" href="./ui.css" />',
    ` <style>\n${nouiSliderCss}\n${uiCss}\n</style>`,
  )
  .replace(
    ' <script type="module" src="./ui.js"></script>',
    ` <script>\n${nouiSliderJs}\n</script>\n  <script type="module">\n${uiJs}\n</script>`,
  );

const bundledCode = codeTemplate
  .replace('__HTML__', JSON.stringify(bundledHtml))
  .replace('__BUTTON_SVG__', JSON.stringify(buttonSvg));

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'code.js'), bundledCode);

console.log(`Built ${path.join(distDir, 'code.js')}`);