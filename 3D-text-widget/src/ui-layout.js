import { CANVAS_WIDTH, CANVAS_HEIGHT } from './ui-config.js';
import { createTextAppearanceSection } from './components/text-appearance.js';
import { createShadowSection } from './components/shadow.js';
import { createBorderSection } from './components/border.js';
import { createRotationSection } from './components/rotation-controller.js';

export function createMarkup() {
  const root = document.getElementById('root');

  root.innerHTML = `
    <div class="editor-shell">
      <aside class="editor-panel">
        <div class="editor-panel__scroll">
          <div class="editor-heading">
          </div>

          <div class="editor-group">
            ${createTextAppearanceSection()}
                        ${createRotationSection()}
            ${createShadowSection()}
            ${createBorderSection()}


          </div>
        </div>

        <div class="editor-actions">
          <button id="insert-button" class="editor-button editor-button-primary" type="button">Add</button>
          <button id="reset-settings-button" class="editor-button editor-button-secondary" type="button">Reset Settings</button>
        </div>
      </aside>

      <section class="editor-stage">
        <div class="editor-preview" id="preview-surface">
          <div class="editor-preview-object" id="preview-object"></div>
          <canvas class="editor-export-canvas" id="preview-canvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
        </div>
      </section>

      <button id="window-resize-handle" class="editor-resize-handle" type="button" aria-label="Resize plugin window">
        <span></span>
      </button>
    </div>
  `;
}
