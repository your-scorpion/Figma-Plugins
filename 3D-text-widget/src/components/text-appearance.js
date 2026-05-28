import { createSlider } from './slider.js';
import { fonts } from '../ui-config.js';
import { clamp } from '../ui-utils.js';

export function createTextAppearanceSection() {
  return `
    <div class="editor-field">
      <label for="text-input">Text</label>
      <textarea id="text-input" spellcheck="false"></textarea>
    </div>

    <div class="editor-field editor-field--font additional-effects">
      <label for="font-input">Font</label>
      <select id="font-input"></select>
    </div>

    <div class="editor-field additional-effects">
      <div class="editor-range-meta">
        <label for="size-value-input">Size</label>
      </div>
      <div class="editor-size-row">
        <input
          id="size-value-input"
          class="editor-size-row__input"
          type="number"
          min="72"
          step="2"
          inputmode="numeric"
        />
        <select id="size-preset-input" class="editor-size-row__select" aria-label="Size presets">
          <option value="72">72 px</option>
          <option value="96">96 px</option>
          <option value="120">120 px</option>
          <option value="144">144 px</option>
          <option value="180">180 px</option>
          <option value="220">220 px</option>
          <option value="260">260 px</option>
          <option value="custom">Custom</option>
        </select>
      </div>
    </div>

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
  `;
}

export function bindTextAppearance(state, onChange) {
  const textInput = document.getElementById('text-input');
  const fontInput = document.getElementById('font-input');
  const sizeValueInput = document.getElementById('size-value-input');
  const sizePresetInput = document.getElementById('size-preset-input');
  const sizeOutput = document.getElementById('size-output');
  const textColorInput = document.getElementById('text-color-input');
  const textColorOutput = document.getElementById('text-color-output');
  const textOpacityInput = document.getElementById('text-opacity-input');
  const textOpacityOutput = document.getElementById('text-opacity-output');

  const sizePresets = new Set(['72', '96', '120', '144', '180', '220', '260']);

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
    sizePresetInput.value = sizePresets.has(`${state.size}`) ? `${state.size}` : 'custom';
    onChange();
  });

  sizePresetInput.addEventListener('change', () => {
    if (sizePresetInput.value === 'custom') {
      sizeValueInput.focus();
      sizeValueInput.select();
      return;
    }

    const nextSize = Number.parseInt(sizePresetInput.value, 10);
    if (Number.isNaN(nextSize)) {
      return;
    }

    state.size = clamp(nextSize, 3, 655);
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
      sizePresetInput.value = sizePresets.has(`${state.size}`) ? `${state.size}` : 'custom';
      sizeOutput.value = `${state.size}px`;
      textOpacitySlider.set(state.textOpacity);
      textOpacityOutput.value = `${state.textOpacity}%`;
      textColorInput.value = state.textColor;
      textColorOutput.value = state.textColor.toUpperCase();
    },
  };
}
