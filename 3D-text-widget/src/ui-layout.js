import { CANVAS_WIDTH, CANVAS_HEIGHT } from './ui-config.js';

export function injectStyles() {
  const style = document.createElement('style');

  style.textContent = `
    :root {
      color-scheme: dark;
    }

    html,
    body {
      height: 100%;
    }

    body {
      margin: 0;
      min-height: 100vh;
      overflow: hidden;
      font-family: Inter, "Segoe UI", sans-serif;
      color: #eef6ff;
      background:
        radial-gradient(circle at top, rgba(63, 168, 255, 0.45), transparent 45%),
        linear-gradient(180deg, #17324d 0%, #0c1c2d 55%, #08131f 100%);
    }

    #root {
      height: 100vh;
      min-height: 100vh;
    }

    .editor-shell {
      position: relative;
      display: grid;
      grid-template-columns: 360px minmax(0, 1fr);
      height: 100vh;
      min-height: 100vh;
      overflow: hidden;
    }

    .editor-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 0;
      padding: 20px;
      overflow: hidden;
      background: rgba(6, 18, 30, 0.72);
      border-right: 1px solid rgba(126, 198, 255, 0.15);
      backdrop-filter: blur(18px);
    }

    .editor-panel__scroll {
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      padding-right: 8px;
      margin-right: -8px;
    }

    .editor-panel__scroll::-webkit-scrollbar {
      width: 10px;
    }

    .editor-panel__scroll::-webkit-scrollbar-thumb {
      border: 2px solid transparent;
      border-radius: 999px;
      background: rgba(126, 198, 255, 0.22);
      background-clip: padding-box;
    }

    .editor-heading h1 {
      margin: 0;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(208, 229, 255, 0.5);
    }

    .editor-heading p {
      display: none;
    }

    .editor-group {
      display: grid;
      gap: 10px;
    }

    .editor-field {
      display: grid;
      gap: 6px;
    }

    .editor-field label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(208, 229, 255, 0.78);
    }

    .editor-field textarea,
    .editor-field select,
    .editor-field input[type="color"] {
      width: 100%;
    }

    .editor-field .noui-slider {
      width: 100%;
      height: 22px;
      margin: 0;
      padding: 0;
      background: transparent;
      border: 0;
      border-radius: 999px;
      touch-action: pan-y;
    }

    .editor-field .noui-target {
      background: transparent;
      border: 0;
      border-radius: 999px;
      box-shadow: none;
    }

    .editor-field .noui-base {
      height: 6px;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(79, 198, 255, 0.64), rgba(79, 198, 255, 0.2));
      border: 1px solid rgba(126, 198, 255, 0.2);
    }

    .editor-field .noui-connect {
      background: linear-gradient(90deg, rgba(79, 198, 255, 0.82), rgba(79, 198, 255, 0.54));
      border-radius: 999px;
    }

    .editor-field .noui-handle {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #ffffff, #9ddfff 60%, #3aa8f3 100%);
      border: 1px solid rgba(255, 255, 255, 0.85);
      box-shadow: 0 0 0 2px rgba(79, 198, 255, 0.22), 0 2px 8px rgba(0, 0, 0, 0.35);
      cursor: grab;
      transition: transform 90ms ease, box-shadow 120ms ease;
    }

    .editor-field .noui-handle:active {
      cursor: grabbing;
    }

    .editor-field .noui-handle:hover {
      transform: scale(1.08);
      box-shadow: 0 0 0 4px rgba(79, 198, 255, 0.22), 0 4px 10px rgba(0, 0, 0, 0.34);
    }

    .editor-field .noui-handle:focus {
      outline: none;
    }

    .editor-field .noui-target:focus-within .noui-base {
      border-color: rgba(153, 222, 255, 0.9);
      box-shadow: 0 0 0 3px rgba(79, 198, 255, 0.25);
    }

    .editor-field textarea,
    .editor-field select {
      appearance: none;
      border: 1px solid rgba(126, 198, 255, 0.18);
      border-radius: 14px;
      padding: 12px 14px;
      background: rgba(255, 255, 255, 0.06);
      color: inherit;
      font: inherit;
    }

    .editor-field textarea {
      min-height: 124px;
      resize: vertical;
      line-height: 1.4;
    }

    .editor-field--font select {
      min-height: 30px;
      padding: 5px 9px;
      border-radius: 10px;
      font-size: 11px;
      line-height: 1.2;
      letter-spacing: 0.01em;
    }

    .editor-range-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .editor-controller {
      display: block;
      padding: 10px;
      border-radius: 16px;
      border: 1px solid rgba(126, 198, 255, 0.16);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }

    .editor-controller__layout {
      display: grid;
      gap: 8px;
    }

    .editor-controller__pad {
      position: relative;
      border-radius: 14px;
      overflow: hidden;
      background: rgba(3, 12, 22, 0.58);
      border: 1px solid rgba(126, 198, 255, 0.12);
      outline: none;
      user-select: none;
      touch-action: none;
      cursor: grab;
    }

    .editor-controller__pad:active {
      cursor: grabbing;
    }

    .editor-controller__pad {
      min-height: 128px;
      background:
        linear-gradient(rgba(126, 198, 255, 0.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(126, 198, 255, 0.12) 1px, transparent 1px),
        radial-gradient(circle at center, rgba(79, 198, 255, 0.16), transparent 58%),
        rgba(3, 12, 22, 0.58);
      background-size: 25% 25%, 25% 25%, 100% 100%, 100% 100%;
    }

    .editor-controller__crosshair {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .editor-controller__crosshair::before,
    .editor-controller__crosshair::after {
      content: '';
      position: absolute;
      background: rgba(126, 198, 255, 0.22);
    }

    .editor-controller__crosshair::before {
      left: 50%;
      top: 0;
      bottom: 0;
      width: 1px;
      transform: translateX(-50%);
    }

    .editor-controller__crosshair::after {
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      transform: translateY(-50%);
    }

    .editor-controller__knob {
      position: absolute;
      width: 22px;
      height: 22px;
      margin-left: -11px;
      margin-top: -11px;
      border-radius: 999px;
      background: radial-gradient(circle at 35% 35%, #f8fbff, #4fc6ff 55%, #1570ef 100%);
      border: 1px solid rgba(255, 255, 255, 0.65);
      box-shadow: 0 0 0 3px rgba(79, 198, 255, 0.18), 0 12px 18px rgba(0, 0, 0, 0.25);
      pointer-events: none;
    }

    .editor-controller__pad-labels {
      position: absolute;
      inset: 8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      pointer-events: none;
      color: rgba(208, 229, 255, 0.54);
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .editor-controller__pad-labels span:last-child {
      align-self: flex-end;
    }

    .editor-controller__meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      font-size: 11px;
      color: rgba(208, 229, 255, 0.72);
    }

    .editor-controller__readout {
      font-variant-numeric: tabular-nums;
      color: #f8fbff;
    }

    .editor-controller__reset {
      appearance: none;
      border: 1px solid rgba(126, 198, 255, 0.18);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.05);
      color: inherit;
      font: inherit;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 8px 10px;
      cursor: pointer;
    }

    .editor-controller__sliders {
      display: grid;
      gap: 6px;
      padding: 8px;
      border-radius: 12px;
      background: rgba(3, 12, 22, 0.42);
      border: 1px solid rgba(126, 198, 255, 0.12);
    }

    .editor-controller__slider-row {
      display: grid;
      grid-template-columns: 16px minmax(0, 1fr) 34px;
      align-items: center;
      gap: 6px;
    }

    .editor-controller__slider-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(208, 229, 255, 0.64);
    }

    .editor-controller__slider-input {
      width: 100%;
      margin: 0;
    }

    .editor-controller__slider-input.noui-target {
      background: transparent;
      border: 0;
      box-shadow: none;
      height: auto;
    }

    .editor-controller__slider-input .noui-base {
      height: 6px;
      background: linear-gradient(90deg, rgba(79, 198, 255, 0.54), rgba(79, 198, 255, 0.2));
      border: 1px solid rgba(126, 198, 255, 0.18);
    }

    .editor-controller__slider-input .noui-connect {
      background: linear-gradient(90deg, rgba(79, 198, 255, 0.72), rgba(79, 198, 255, 0.38));
    }

    .editor-controller__slider-input .noui-handle {
      width: 14px;
      height: 14px;
      background: radial-gradient(circle at 35% 35%, #f0f8ff, #8dd5ff 60%, #3aa8f3 100%);
      border: 1px solid rgba(255, 255, 255, 0.82);
      box-shadow: 0 0 0 2px rgba(79, 198, 255, 0.18), 0 2px 6px rgba(0, 0, 0, 0.32);
    }

    .editor-controller__slider-input .noui-handle:hover {
      transform: scale(1.06);
      box-shadow: 0 0 0 3px rgba(79, 198, 255, 0.2), 0 2px 6px rgba(0, 0, 0, 0.32);
    }

    .editor-controller__slider-output {
      font-size: 10px;
      font-variant-numeric: tabular-nums;
      text-align: right;
      color: #f8fbff;
    }

    .editor-color-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
    }

    .editor-swatch {
      display: grid;
      gap: 8px;
      padding: 9px;
      border-radius: 12px;
      border: 1px solid rgba(126, 198, 255, 0.16);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
      font-size: 12px;
      color: rgba(208, 229, 255, 0.78);
    }

    .editor-swatch__head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .editor-swatch__value {
      font-size: 10px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: rgba(208, 229, 255, 0.72);
      font-variant-numeric: tabular-nums;
    }

    .editor-swatch input {
      height: 34px;
      padding: 0;
      border: 1px solid rgba(126, 198, 255, 0.24);
      border-radius: 10px;
      background: transparent;
    }

    .editor-range-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: rgba(208, 229, 255, 0.78);
    }

    .editor-range-meta output {
      font-variant-numeric: tabular-nums;
      color: #f8fbff;
    }

    .editor-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      flex: 0 0 auto;
      padding-top: 14px;
      border-top: 1px solid rgba(126, 198, 255, 0.16);
      background: linear-gradient(180deg, rgba(6, 18, 30, 0), rgba(6, 18, 30, 0.84) 22%, rgba(6, 18, 30, 0.96) 100%);
    }

    .editor-button {
      appearance: none;
      border: 0;
      border-radius: 999px;
      width: 100%;
      padding: 12px 18px;
      font: inherit;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
      transition: transform 120ms ease, opacity 120ms ease, background 120ms ease;
    }

    .editor-button:hover {
      transform: translateY(-1px);
    }

    .editor-button:active {
      transform: translateY(0);
      opacity: 0.92;
    }

    .editor-button-primary {
      background: linear-gradient(135deg, #4fc6ff 0%, #1570ef 100%);
      color: white;
      box-shadow: 0 12px 28px rgba(21, 112, 239, 0.35);
    }

    .editor-button-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #dbe8f8;
    }

    .editor-resize-handle {
      position: absolute;
      right: 10px;
      bottom: 10px;
      z-index: 5;
      width: 34px;
      height: 34px;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: nwse-resize;
      touch-action: none;
    }

    .editor-resize-handle::before,
    .editor-resize-handle::after,
    .editor-resize-handle span {
      content: '';
      position: absolute;
      right: 2px;
      bottom: 2px;
      width: 10px;
      height: 10px;
      border-right: 2px solid rgba(208, 229, 255, 0.82);
      border-bottom: 2px solid rgba(208, 229, 255, 0.82);
      border-radius: 0 0 3px 0;
      pointer-events: none;
      opacity: 0.82;
    }

    .editor-resize-handle::before {
      transform: translate(-14px, -14px);
      opacity: 0.32;
    }

    .editor-resize-handle::after {
      transform: translate(-7px, -7px);
      opacity: 0.56;
    }

    .editor-resize-handle:hover::before,
    .editor-resize-handle:hover::after,
    .editor-resize-handle:hover span {
      opacity: 1;
    }

    .editor-stage {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 0;
      padding: 28px;
      min-width: 0;
      overflow: auto;
    }

    .editor-preview {
      position: relative;
      width: min(100%, 920px);
      aspect-ratio: 4 / 3;
      overflow: hidden;
      perspective: 9999px;
      transform-style: preserve-3d;
      isolation: isolate;
    }

    .editor-preview-object {
      position: absolute;
      left: 50%;
      top: 50%;
      transform-style: preserve-3d;
      will-change: transform;
    }

    .editor-preview-face {
      position: absolute;
      left: 0;
      top: 0;
      display: grid;
      gap: 0.02em;
      text-align: center;
      white-space: pre;
      line-height: 0.88;
      font-weight: 700;
      letter-spacing: -0.035em;
      transform-style: preserve-3d;
      user-select: none;
    }

    .editor-preview-line {
      display: block;
      white-space: pre;
    }

    .editor-preview-face--front {
      text-shadow:
        0 0 24px rgba(47, 199, 255, 0.5),
        0 14px 30px rgba(0, 0, 0, 0.28);
    }

    .editor-export-canvas {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;
      inset: 0;
    }

    .editor-preview canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    @media (max-width: 900px) {
      .editor-shell {
        grid-template-columns: 1fr;
      }

      .editor-panel {
        border-right: 0;
        border-bottom: 1px solid rgba(126, 198, 255, 0.15);
      }
    }

    @media (max-width: 760px) {
      .editor-actions {
        grid-template-columns: 1fr;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .editor-field .noui-handle,
      .editor-controller__slider-input .noui-handle {
        transition: none;
      }
    }
  `;

  document.head.appendChild(style);
}

export function createMarkup() {
  const root = document.getElementById('root');

  root.innerHTML = `
    <div class="editor-shell">
      <aside class="editor-panel">
        <div class="editor-panel__scroll">
          <div class="editor-heading">
          </div>

          <div class="editor-group">
            <div class="editor-field">
              <label for="text-input">Text</label>
              <textarea id="text-input" spellcheck="false"></textarea>
            </div>

            <div class="editor-field editor-field--font">
              <label for="font-input">Font</label>
              <select id="font-input"></select>
            </div>

            <div class="editor-color-row">
              <div class="editor-swatch">
                <div class="editor-swatch__head">
                  <label for="text-color-input">Text</label>
                  <output id="text-color-output" class="editor-swatch__value"></output>
                </div>
                <input id="text-color-input" type="color" />
              </div>

              <div class="editor-swatch">
                <div class="editor-swatch__head">
                  <label for="border-color-input">Border</label>
                  <output id="border-color-output" class="editor-swatch__value"></output>
                </div>
                <input id="border-color-input" type="color" />
              </div>

              <div class="editor-swatch">
                <div class="editor-swatch__head">
                  <label for="shadow-color-input">Shadow</label>
                  <output id="shadow-color-output" class="editor-swatch__value"></output>
                </div>
                <input id="shadow-color-input" type="color" />
              </div>
            </div>

            <div class="editor-range-row">
              <div class="editor-field">
                <div class="editor-range-meta">
                  <label for="size-input">Size</label>
                  <output id="size-output"></output>
                </div>
                <div id="size-input" class="noui-slider"></div>
              </div>

              <div class="editor-field">
                <div class="editor-range-meta">
                  <label for="text-opacity-input">Text opacity</label>
                  <output id="text-opacity-output"></output>
                </div>
                <div id="text-opacity-input" class="noui-slider"></div>
              </div>
            </div>

            <div class="editor-range-row">
              <div class="editor-field">
                <div class="editor-range-meta">
                  <label for="shadow-count-input">Shadows</label>
                  <output id="shadow-count-output"></output>
                </div>
                <div id="shadow-count-input" class="noui-slider"></div>
              </div>

              <div class="editor-field">
                <div class="editor-range-meta">
                  <label for="shadow-distance-input">Distance</label>
                  <output id="shadow-distance-output"></output>
                </div>
                <div id="shadow-distance-input" class="noui-slider"></div>
              </div>
            </div>

            <div class="editor-range-row">
              <div class="editor-field">
                <div class="editor-range-meta">
                  <label for="shadow-softness-input">Shadow</label>
                  <output id="shadow-softness-output"></output>
                </div>
                <div id="shadow-softness-input" class="noui-slider"></div>
              </div>

              <div class="editor-field">
                <div class="editor-range-meta">
                  <label for="shadow-opacity-input">Shadow opacity</label>
                  <output id="shadow-opacity-output"></output>
                </div>
                <div id="shadow-opacity-input" class="noui-slider"></div>
              </div>
            </div>

            <div class="editor-range-row">
              <div class="editor-field">
                <div class="editor-range-meta">
                  <label for="shadow-depth-input">Shadow depth</label>
                  <output id="shadow-depth-output"></output>
                </div>
                <div id="shadow-depth-input" class="noui-slider"></div>
              </div>

              <div class="editor-field">
                <div class="editor-range-meta">
                  <label for="border-width-input">Border width</label>
                  <output id="border-width-output"></output>
                </div>
                <div id="border-width-input" class="noui-slider"></div>
              </div>
            </div>

            <div class="editor-field">
              <div class="editor-range-meta">
                <label for="rotation-pad">XY Controller</label>
                <output id="xyz-output">X 0deg Y 0deg Z 0deg</output>
              </div>
              <div class="editor-controller">
                <div class="editor-controller__layout">
                  <div
                    id="rotation-pad"
                    class="editor-controller__pad"
                    tabindex="0"
                    role="slider"
                    aria-label="Rotation X and Y controller"
                    aria-valuemin="-70"
                    aria-valuemax="70"
                  >
                    <div class="editor-controller__crosshair"></div>
                    <div class="editor-controller__pad-labels">
                      <span>Y</span>
                      <span>X</span>
                    </div>
                    <div id="rotation-pad-knob" class="editor-controller__knob"></div>
                  </div>
                  <div class="editor-controller__meta">
                    <span class="editor-controller__readout" id="rotation-pad-readout">X 0deg Y 0deg</span>
                    <button id="rotation-reset" class="editor-controller__reset" type="button">Reset XYZ</button>
                  </div>
                  <div class="editor-controller__sliders">
                    <div class="editor-controller__slider-row">
                      <label class="editor-controller__slider-label" for="rotate-z-input">Z</label>
                      <div class="editor-controller__slider-input" id="rotate-z-input"></div>
                      <output id="rotate-z-output" class="editor-controller__slider-output"></output>
                    </div>
                    <div class="editor-controller__slider-row">
                      <label class="editor-controller__slider-label" for="rotate-y-input">Y</label>
                      <div class="editor-controller__slider-input" id="rotate-y-input"></div>
                      <output id="rotate-y-output" class="editor-controller__slider-output"></output>
                    </div>
                    <div class="editor-controller__slider-row">
                      <label class="editor-controller__slider-label" for="rotate-x-input">X</label>
                      <div class="editor-controller__slider-input" id="rotate-x-input"></div>
                      <output id="rotate-x-output" class="editor-controller__slider-output"></output>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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