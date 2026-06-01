import { createSlider } from './slider.js';
import { clamp } from '../ui-utils.js';

export function createShadowSection() {
  return `
    <div class="editor-block editor-block--shadow">
      <div class="editor-block__head">
        <h2>Shadows</h2>
        <p>Density and direction</p>
      </div>

      <div class="editor-block__body">
        <!-- ── Shadow A ──────────────────────────────────── -->
        <div class="editor-subgroup">
          <div class="editor-shadow-set-label">Shadow A</div>

          <div class="editor-color-row editor-color-row--single">
            <div class="editor-swatch">
              <div class="editor-swatch__head">
                <label for="shadow-color-input">Color</label>
                <output id="shadow-color-output" class="editor-swatch__value"></output>
              </div>
              <input id="shadow-color-input" type="color" />
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
                <label for="shadow-softness-input">Softness</label>
                <output id="shadow-softness-output"></output>
              </div>
              <div id="shadow-softness-input" class="noui-slider"></div>
            </div>

            <div class="editor-field">
              <div class="editor-range-meta">
                <label for="shadow-opacity-input">Opacity</label>
                <output id="shadow-opacity-output"></output>
              </div>
              <div id="shadow-opacity-input" class="noui-slider"></div>
            </div>
          </div>
        </div>

        <!-- ── Shadow B ──────────────────────────────────── -->
        <div class="editor-shadow-set-divider"></div>
        <div class="editor-subgroup">
          <div class="editor-shadow-set-label">Shadow B</div>

          <div class="editor-color-row editor-color-row--single">
            <div class="editor-swatch">
              <div class="editor-swatch__head">
                <label for="shadow2-color-input">Color</label>
                <output id="shadow2-color-output" class="editor-swatch__value"></output>
              </div>
              <input id="shadow2-color-input" type="color" />
            </div>
          </div>

          <div class="editor-range-row">
            <div class="editor-field">
              <div class="editor-range-meta">
                <label for="shadow2-count-input">Shadows</label>
                <output id="shadow2-count-output"></output>
              </div>
              <div id="shadow2-count-input" class="noui-slider"></div>
            </div>

            <div class="editor-field">
              <div class="editor-range-meta">
                <label for="shadow2-distance-input">Distance</label>
                <output id="shadow2-distance-output"></output>
              </div>
              <div id="shadow2-distance-input" class="noui-slider"></div>
            </div>
          </div>

          <div class="editor-range-row">
            <div class="editor-field">
              <div class="editor-range-meta">
                <label for="shadow2-softness-input">Softness</label>
                <output id="shadow2-softness-output"></output>
              </div>
              <div id="shadow2-softness-input" class="noui-slider"></div>
            </div>

            <div class="editor-field">
              <div class="editor-range-meta">
                <label for="shadow2-opacity-input">Opacity</label>
                <output id="shadow2-opacity-output"></output>
              </div>
              <div id="shadow2-opacity-input" class="noui-slider"></div>
            </div>
          </div>
        </div>

        <!-- ── Shared: Direction ─────────────────────────── -->
        <div class="editor-shadow-set-divider"></div>
        <div class="editor-subgroup">
          <div class="editor-subgroup__title">Direction</div>

          <div class="editor-range-row">
            <div class="editor-field">
              <div class="editor-range-meta">
                <label for="shadow-dir-x-input">Direction X</label>
                <output id="shadow-dir-x-output"></output>
              </div>
              <div id="shadow-dir-x-input" class="noui-slider"></div>
            </div>

            <div class="editor-field">
              <div class="editor-range-meta">
                <label for="shadow-dir-y-input">Direction Y</label>
                <output id="shadow-dir-y-output"></output>
              </div>
              <div id="shadow-dir-y-input" class="noui-slider"></div>
            </div>
          </div>
          </div>
      </div>
    </div>
  `;
}

export function bindShadow(state, onChange) {
  // ── Shadow A ─────────────────────────────────────────────────────────────
  const shadowColorInput = document.getElementById('shadow-color-input');
  const shadowColorOutput = document.getElementById('shadow-color-output');
  const shadowCountInput = document.getElementById('shadow-count-input');
  const shadowCountOutput = document.getElementById('shadow-count-output');
  const shadowDistanceInput = document.getElementById('shadow-distance-input');
  const shadowDistanceOutput = document.getElementById('shadow-distance-output');
  const shadowSoftnessInput = document.getElementById('shadow-softness-input');
  const shadowSoftnessOutput = document.getElementById('shadow-softness-output');
  const shadowOpacityInput = document.getElementById('shadow-opacity-input');
  const shadowOpacityOutput = document.getElementById('shadow-opacity-output');

  // ── Shadow B ─────────────────────────────────────────────────────────────
  const shadow2ColorInput = document.getElementById('shadow2-color-input');
  const shadow2ColorOutput = document.getElementById('shadow2-color-output');
  const shadow2CountInput = document.getElementById('shadow2-count-input');
  const shadow2CountOutput = document.getElementById('shadow2-count-output');
  const shadow2DistanceInput = document.getElementById('shadow2-distance-input');
  const shadow2DistanceOutput = document.getElementById('shadow2-distance-output');
  const shadow2SoftnessInput = document.getElementById('shadow2-softness-input');
  const shadow2SoftnessOutput = document.getElementById('shadow2-softness-output');
  const shadow2OpacityInput = document.getElementById('shadow2-opacity-input');
  const shadow2OpacityOutput = document.getElementById('shadow2-opacity-output');

  // ── Shared ────────────────────────────────────────────────────────────────
  const shadowDirXInput = document.getElementById('shadow-dir-x-input');
  const shadowDirXOutput = document.getElementById('shadow-dir-x-output');
  const shadowDirYInput = document.getElementById('shadow-dir-y-input');
  const shadowDirYOutput = document.getElementById('shadow-dir-y-output');

  // ── Shadow A sliders ──────────────────────────────────────────────────────
  const shadowCountSlider = createSlider(shadowCountInput, {
    start: state.shadowCount,
    min: 0,
    max: 48,
    step: 1,
    onChange: (value) => {
      state.shadowCount = value;
      shadowCountOutput.value = `${value}`;
      onChange();
    },
  });

  const shadowDistanceSlider = createSlider(shadowDistanceInput, {
    start: state.shadowDistance,
    min: 0,
    max: 18,
    step: 1,
    onChange: (value) => {
      state.shadowDistance = value;
      shadowDistanceOutput.value = `${value}px`;
      onChange();
    },
  });

  const shadowSoftnessSlider = createSlider(shadowSoftnessInput, {
    start: state.shadowSoftness,
    min: 0,
    max: 100,
    step: 1,
    onChange: (value) => {
      state.shadowSoftness = value;
      shadowSoftnessOutput.value = `${value}%`;
      onChange();
    },
  });

  const shadowOpacitySlider = createSlider(shadowOpacityInput, {
    start: state.shadowOpacity,
    min: 0,
    max: 100,
    step: 1,
    onChange: (value) => {
      state.shadowOpacity = value;
      shadowOpacityOutput.value = `${value}%`;
      onChange();
    },
  });

  // ── Shadow B sliders ──────────────────────────────────────────────────────
  const shadow2CountSlider = createSlider(shadow2CountInput, {
    start: state.shadow2Count,
    min: 0,
    max: 48,
    step: 1,
    onChange: (value) => {
      state.shadow2Count = value;
      shadow2CountOutput.value = `${value}`;
      onChange();
    },
  });

  const shadow2DistanceSlider = createSlider(shadow2DistanceInput, {
    start: state.shadow2Distance,
    min: 0,
    max: 18,
    step: 1,
    onChange: (value) => {
      state.shadow2Distance = value;
      shadow2DistanceOutput.value = `${value}px`;
      onChange();
    },
  });

  const shadow2SoftnessSlider = createSlider(shadow2SoftnessInput, {
    start: state.shadow2Softness,
    min: 0,
    max: 100,
    step: 1,
    onChange: (value) => {
      state.shadow2Softness = value;
      shadow2SoftnessOutput.value = `${value}%`;
      onChange();
    },
  });

  const shadow2OpacitySlider = createSlider(shadow2OpacityInput, {
    start: state.shadow2Opacity,
    min: 0,
    max: 100,
    step: 1,
    onChange: (value) => {
      state.shadow2Opacity = value;
      shadow2OpacityOutput.value = `${value}%`;
      onChange();
    },
  });

  // ── Shared sliders ────────────────────────────────────────────────────────
  const shadowDirXSlider = createSlider(shadowDirXInput, {
    start: state.shadowDirectionX,
    min: -200,
    max: 200,
    step: 1,
    onChange: (value) => {
      state.shadowDirectionX = clamp(Math.round(value), -200, 200);
      onChange();
    },
  });

  const shadowDirYSlider = createSlider(shadowDirYInput, {
    start: state.shadowDirectionY,
    min: -200,
    max: 200,
    step: 1,
    onChange: (value) => {
      state.shadowDirectionY = clamp(Math.round(value), -200, 200);
      onChange();
    },
  });

  shadowColorInput.addEventListener('input', () => {
    state.shadowColor = shadowColorInput.value;
    onChange();
  });

  shadow2ColorInput.addEventListener('input', () => {
    state.shadow2Color = shadow2ColorInput.value;
    onChange();
  });

  return {
    sync() {
      // Shadow A
      shadowColorInput.value = state.shadowColor;
      shadowColorOutput.value = state.shadowColor.toUpperCase();
      shadowCountSlider.set(state.shadowCount);
      shadowCountOutput.value = `${state.shadowCount}`;
      shadowDistanceSlider.set(state.shadowDistance);
      shadowDistanceOutput.value = `${state.shadowDistance}px`;
      shadowSoftnessSlider.set(state.shadowSoftness);
      shadowSoftnessOutput.value = `${state.shadowSoftness}%`;
      shadowOpacitySlider.set(state.shadowOpacity);
      shadowOpacityOutput.value = `${state.shadowOpacity}%`;

      // Shadow B
      shadow2ColorInput.value = state.shadow2Color;
      shadow2ColorOutput.value = state.shadow2Color.toUpperCase();
      shadow2CountSlider.set(state.shadow2Count);
      shadow2CountOutput.value = `${state.shadow2Count}`;
      shadow2DistanceSlider.set(state.shadow2Distance);
      shadow2DistanceOutput.value = `${state.shadow2Distance}px`;
      shadow2SoftnessSlider.set(state.shadow2Softness);
      shadow2SoftnessOutput.value = `${state.shadow2Softness}%`;
      shadow2OpacitySlider.set(state.shadow2Opacity);
      shadow2OpacityOutput.value = `${state.shadow2Opacity}%`;

      // Shared
      shadowDirXSlider.set(state.shadowDirectionX);
      shadowDirXOutput.value = `${state.shadowDirectionX > 0 ? '+' : ''}${state.shadowDirectionX}%`;
      shadowDirYSlider.set(state.shadowDirectionY);
      shadowDirYOutput.value = `${state.shadowDirectionY > 0 ? '+' : ''}${state.shadowDirectionY}%`;
    },
  };
}
