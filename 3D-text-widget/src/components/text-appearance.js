import { createSlider } from './slider.js';
import { fonts } from '../ui-config.js';
import { clamp } from '../ui-utils.js';

export function createTextAppearanceSection() {
  return `
    <div class="editor-block">
      <div class="editor-block__head">
        <h2>Text</h2>
        <p>Content and style</p>
      </div>

      <div class="editor-block__body">
        <div class="editor-subgroup">
          <div class="editor-subgroup__title">Content</div>

          <div class="editor-field">
            <label for="text-input">Text</label>
            <textarea id="text-input" spellcheck="false"></textarea>
          </div>

          <div class="editor-range-row editor-range-row--font-size additional-effects">
            <div class="editor-field editor-field--font">
              <label for="font-input">Font</label>
              <select id="font-input"></select>
            </div>

            <div class="editor-field">
              <div class="editor-range-meta">
                <label for="size-value-input">Size</label>
                <output id="size-output"></output>
              </div>
              <input
                id="size-value-input"
                class="editor-size-row__input"
                type="number"
                min="72"
                step="2"
                inputmode="numeric"
              />
            </div>
          </div>
        </div>

        <div class="editor-subgroup">
          <div class="editor-subgroup__title">Color and opacity</div>

          <div class="editor-range-row additional-effects">
            <div class="editor-swatch">
              <div class="editor-swatch__head">
                <label for="text-color-input">Text color</label>
                <output id="text-color-output" class="editor-swatch__value"></output>
              </div>
              <input id="text-color-input" type="color" />
            </div>

            <div class="editor-field">
              <div class="editor-range-meta">
                <label for="text-opacity-input">Text opacity</label>
                <output id="text-opacity-output"></output>
              </div>
              <div id="text-opacity-input" class="noui-slider"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindTextAppearance(state, onChange) {
  const textInput = document.getElementById('text-input');
  const fontInput = document.getElementById('font-input');
  const sizeValueInput = document.getElementById('size-value-input');
  const sizeOutput = document.getElementById('size-output');
  const textColorInput = document.getElementById('text-color-input');
  const textColorOutput = document.getElementById('text-color-output');
  const textOpacityInput = document.getElementById('text-opacity-input');
  const textOpacityOutput = document.getElementById('text-opacity-output');

  const textOpacitySlider = createSlider(textOpacityInput, {
    start: state.textOpacity,
    min: 0,
    max: 100,
    step: 1,
    label: 'Text opacity',
    unit: '%',
    onChange: (value) => {
      state.textOpacity = value;
      textOpacityOutput.value = `${value}%`;
      onChange();
    },
  });

  fonts.forEach((font) => {
    const option = document.createElement('option');
    option.textContent = font.label;
    option.value = font.value;
    fontInput.appendChild(option);
  });

  textInput.addEventListener('input', () => {
    state.text = textInput.value || ' ';
    onChange();
  });

  sizeValueInput.addEventListener('input', () => {
    const nextSize = Math.max(72, Number.parseInt(sizeValueInput.value || '0', 10));
    state.size = Number.isNaN(nextSize) ? state.size : nextSize;
    state.size = clamp(state.size, 3, 655);
    sizeValueInput.value = `${state.size}`;
    onChange();
  });

  fontInput.addEventListener('change', () => {
    state.font = fontInput.value;
    onChange();
  });

  textColorInput.addEventListener('input', () => {
    state.textColor = textColorInput.value;
    onChange();
  });

  return {
    sync() {
      textInput.value = state.text;
      fontInput.value = state.font;
      sizeValueInput.value = `${state.size}`;
      sizeOutput.value = `${state.size}px`;
      textOpacitySlider.set(state.textOpacity);
      textOpacityOutput.value = `${state.textOpacity}%`;
      textColorInput.value = state.textColor;
      textColorOutput.value = state.textColor.toUpperCase();
    },
  };
}
