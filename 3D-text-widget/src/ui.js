import { createRotationController } from './controller.js';
import { createDefaultState, fonts } from './ui-config.js';
import { injectStyles, createMarkup } from './ui-layout.js';
import { renderPreview } from './ui-render.js';
import { clamp, normalizeAxis } from './ui-utils.js';
import { createSlider } from './ui-slider.js';

const state = createDefaultState();

function postMessage(message) {
  parent.postMessage({ pluginMessage: message }, '*');
}

function bindUi() {
  const textInput = document.getElementById('text-input');
  const fontInput = document.getElementById('font-input');
  const sizeInput = document.getElementById('size-input');
  const textOpacityInput = document.getElementById('text-opacity-input');
  const shadowCountInput = document.getElementById('shadow-count-input');
  const shadowDistanceInput = document.getElementById('shadow-distance-input');
  const shadowSoftnessInput = document.getElementById('shadow-softness-input');
  const shadowOpacityInput = document.getElementById('shadow-opacity-input');
  const shadowDepthInput = document.getElementById('shadow-depth-input');
  const borderWidthInput = document.getElementById('border-width-input');
  const rotateZInput = document.getElementById('rotate-z-input');
  const rotateXInput = document.getElementById('rotate-x-input');
  const rotateYInput = document.getElementById('rotate-y-input');
  const textColorInput = document.getElementById('text-color-input');
  const borderColorInput = document.getElementById('border-color-input');
  const shadowColorInput = document.getElementById('shadow-color-input');
  const textColorOutput = document.getElementById('text-color-output');
  const borderColorOutput = document.getElementById('border-color-output');
  const shadowColorOutput = document.getElementById('shadow-color-output');
  const sizeOutput = document.getElementById('size-output');
  const textOpacityOutput = document.getElementById('text-opacity-output');
  const shadowCountOutput = document.getElementById('shadow-count-output');
  const shadowDistanceOutput = document.getElementById('shadow-distance-output');
  const shadowSoftnessOutput = document.getElementById('shadow-softness-output');
  const shadowOpacityOutput = document.getElementById('shadow-opacity-output');
  const shadowDepthOutput = document.getElementById('shadow-depth-output');
  const borderWidthOutput = document.getElementById('border-width-output');
  const rotateZOutput = document.getElementById('rotate-z-output');
  const rotateXOutput = document.getElementById('rotate-x-output');
  const rotateYOutput = document.getElementById('rotate-y-output');
  const xyzOutput = document.getElementById('xyz-output');
  const insertButton = document.getElementById('insert-button');
  const resetSettingsButton = document.getElementById('reset-settings-button');
  const windowResizeHandle = document.getElementById('window-resize-handle');
  const rotationPad = document.getElementById('rotation-pad');
  const rotationPadKnob = document.getElementById('rotation-pad-knob');
  const rotationPadReadout = document.getElementById('rotation-pad-readout');
  const rotationReset = document.getElementById('rotation-reset');
  const previewSurface = document.getElementById('preview-surface');
  const previewObject = document.getElementById('preview-object');
  const canvas = document.getElementById('preview-canvas');
  let updateFrame = 0;

  function requestUpdate() {
    if (updateFrame) {
      return;
    }

    updateFrame = requestAnimationFrame(() => {
      updateFrame = 0;
      update();
    });
  }

  // Initialize noUiSlider instances FIRST
  const sizeSlider = createSlider(sizeInput, {
    start: state.size,
    min: 72,
    max: 260,
    step: 2,
    onChange: (value) => {
      state.size = value;
      sizeOutput.value = `${value}px`;
      requestUpdate();
    },
  });

  const textOpacitySlider = createSlider(textOpacityInput, {
    start: state.textOpacity,
    min: 0,
    max: 100,
    step: 1,
    onChange: (value) => {
      state.textOpacity = value;
      textOpacityOutput.value = `${value}%`;
      requestUpdate();
    },
  });

  const shadowCountSlider = createSlider(shadowCountInput, {
    start: state.shadowCount,
    min: 0,
    max: 24,
    step: 1,
    onChange: (value) => {
      state.shadowCount = value;
      shadowCountOutput.value = `${value}`;
      requestUpdate();
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
      requestUpdate();
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
      requestUpdate();
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
      requestUpdate();
    },
  });

  const shadowDepthSlider = createSlider(shadowDepthInput, {
    start: state.shadowDepth,
    min: 0,
    max: 200,
    step: 1,
    onChange: (value) => {
      state.shadowDepth = value;
      shadowDepthOutput.value = `${value}%`;
      requestUpdate();
    },
  });

  const borderWidthSlider = createSlider(borderWidthInput, {
    start: state.borderWidth,
    min: 0,
    max: 24,
    step: 1,
    onChange: (value) => {
      state.borderWidth = value;
      borderWidthOutput.value = `${value}px`;
      requestUpdate();
    },
  });

  const rotateZSlider = createSlider(rotateZInput, {
    start: state.rotateZ,
    min: -45,
    max: 45,
    step: 1,
    onChange: (value) => {
      state.rotateZ = clamp(Math.round(value), -45, 45);
      requestUpdate();
    },
  });

  const rotateYSlider = createSlider(rotateYInput, {
    start: state.rotateY,
    min: -70,
    max: 70,
    step: 1,
    onChange: (value) => {
      state.rotateY = clamp(Math.round(value), -70, 70);
      requestUpdate();
    },
  });

  const rotateXSlider = createSlider(rotateXInput, {
    start: state.rotateX,
    min: -70,
    max: 70,
    step: 1,
    onChange: (value) => {
      state.rotateX = clamp(Math.round(value), -70, 70);
      requestUpdate();
    },
  });

  fonts.forEach((font) => {
    const option = document.createElement('option');
    option.textContent = font.label;
    option.value = font.value;
    fontInput.appendChild(option);
  });

  // NOW create the rotation controller with slider references
  const rotationController = createRotationController({
    state,
    clamp,
    normalizeAxis,
    rotateZSlider,
    rotateXSlider,
    rotateYSlider,
    rotateZOutput,
    rotateXOutput,
    rotateYOutput,
    xyzOutput,
    rotationPad,
    rotationPadKnob,
    rotationPadReadout,
    rotationReset,
    windowResizeHandle,
    onChange: requestUpdate,
    onResizeWindow: (width, height) => {
      postMessage({
        type: 'resize-ui',
        width,
        height,
      });
    },
  });

  function syncInputs() {
    textInput.value = state.text;
    fontInput.value = state.font;
    sizeSlider.set(state.size);
    textOpacitySlider.set(state.textOpacity);
    shadowCountSlider.set(state.shadowCount);
    shadowDistanceSlider.set(state.shadowDistance);
    shadowSoftnessSlider.set(state.shadowSoftness);
    shadowOpacitySlider.set(state.shadowOpacity);
    shadowDepthSlider.set(state.shadowDepth);
    borderWidthSlider.set(state.borderWidth);
    rotateZSlider.set(state.rotateZ);
    rotateYSlider.set(state.rotateY);
    rotateXSlider.set(state.rotateX);
    textColorInput.value = state.textColor;
    borderColorInput.value = state.edgeColor;
    shadowColorInput.value = state.shadowColor;
  }

  function syncOutputs() {
    sizeOutput.value = `${state.size}px`;
    textOpacityOutput.value = `${state.textOpacity}%`;
    shadowCountOutput.value = `${state.shadowCount}`;
    shadowDistanceOutput.value = `${state.shadowDistance}px`;
    shadowSoftnessOutput.value = `${state.shadowSoftness}%`;
    shadowOpacityOutput.value = `${state.shadowOpacity}%`;
    shadowDepthOutput.value = `${state.shadowDepth}%`;
    borderWidthOutput.value = `${state.borderWidth}px`;
    textColorOutput.value = state.textColor.toUpperCase();
    borderColorOutput.value = state.edgeColor.toUpperCase();
    shadowColorOutput.value = state.shadowColor.toUpperCase();
    rotationController.sync();
  }

  function update() {
    syncOutputs();
    renderPreview(state, canvas, previewSurface, previewObject);
  }

  syncInputs();

  textInput.addEventListener('input', () => {
    state.text = textInput.value || ' ';
    requestUpdate();
  });

  fontInput.addEventListener('change', () => {
    state.font = fontInput.value;
    requestUpdate();
  });

  textColorInput.addEventListener('input', () => {
    state.textColor = textColorInput.value;
    requestUpdate();
  });

  borderColorInput.addEventListener('input', () => {
    state.edgeColor = borderColorInput.value;
    requestUpdate();
  });

  shadowColorInput.addEventListener('input', () => {
    state.shadowColor = shadowColorInput.value;
    requestUpdate();
  });

  insertButton.addEventListener('click', () => {
    renderPreview(state, canvas, previewSurface, previewObject);
    postMessage({
      type: 'create-rectangles',
      base64Image: canvas.toDataURL('image/png'),
    });
  });

  resetSettingsButton.addEventListener('click', () => {
    Object.assign(state, createDefaultState());
    syncInputs();
    postMessage({
      type: 'resize-ui',
      width: state.windowWidth,
      height: state.windowHeight,
    });
    requestUpdate();
  });

  update();
}

injectStyles();
createMarkup();
bindUi();