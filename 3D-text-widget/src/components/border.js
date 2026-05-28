import { createSlider } from './slider.js';

export function createBorderSection() {
  return `
    <div class="editor-block">
      <div class="editor-block__head">
        <h2>Border</h2>
        <p>Width and color</p>
      </div>

      <div class="editor-range-row">
        <div class="editor-field">
          <div class="editor-range-meta">
            <label for="border-width-input">Border width</label>
            <output id="border-width-output"></output>
          </div>
          <div id="border-width-input" class="noui-slider"></div>
        </div>

        <div class="editor-swatch">
          <div class="editor-swatch__head">
            <label for="border-color-input">Border color</label>
            <output id="border-color-output" class="editor-swatch__value"></output>
          </div>
          <input id="border-color-input" type="color" />
        </div>
      </div>
    </div>
  `;
}

export function bindBorder(state, onChange) {
  const borderWidthInput = document.getElementById('border-width-input');
  const borderWidthOutput = document.getElementById('border-width-output');
  const borderColorInput = document.getElementById('border-color-input');
  const borderColorOutput = document.getElementById('border-color-output');

  const borderWidthSlider = createSlider(borderWidthInput, {
    start: state.borderWidth,
    min: 0,
    max: 24,
    step: 1,
    onChange: (value) => {
      state.borderWidth = value;
      borderWidthOutput.value = `${value}px`;
      onChange();
    },
  });

  borderColorInput.addEventListener('input', () => {
    state.edgeColor = borderColorInput.value;
    onChange();
  });

  return {
    sync() {
      borderWidthSlider.set(state.borderWidth);
      borderWidthOutput.value = `${state.borderWidth}px`;
      borderColorInput.value = state.edgeColor;
      borderColorOutput.value = state.edgeColor.toUpperCase();
    },
  };
}
