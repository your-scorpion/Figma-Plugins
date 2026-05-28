import { createDefaultState } from './ui-config.js';
import { createMarkup } from './ui-layout.js';
import { renderPreview } from './ui-render.js';
import { clamp } from './ui-utils.js';
import { bindTextAppearance } from './components/text-appearance.js';
import { bindShadow } from './components/shadow.js';
import { bindBorder } from './components/border.js';
import { bindRotationController } from './components/rotation-controller.js';

const state = createDefaultState();

function postMessage(message) {
  parent.postMessage({ pluginMessage: message }, '*');
}

function bindUi() {
  const insertButton = document.getElementById('insert-button');
  const resetSettingsButton = document.getElementById('reset-settings-button');
  const previewSurface = document.getElementById('preview-surface');
  const previewObject = document.getElementById('preview-object');
  const canvas = document.getElementById('preview-canvas');
  let updateFrame = 0;
  let lastRotationSignature = `${state.rotateX}|${state.rotateY}|${state.rotateZ}`;

  function syncShadowDirectionWithRotation(force = false) {
    const rotationSignature = `${state.rotateX}|${state.rotateY}|${state.rotateZ}`;
    if (!force && rotationSignature === lastRotationSignature) {
      return;
    }

    lastRotationSignature = rotationSignature;

    const rotateXRatio = state.rotateX / 70;
    const rotateYRatio = state.rotateY / 70;
    const rotateZRatio = state.rotateZ / 45;

    const perspectiveX = rotateYRatio * 160 + rotateZRatio * 30;
    const perspectiveY = -rotateXRatio * 150 + rotateZRatio * 20;

    state.shadowDirectionX = clamp(Math.round(perspectiveX), -200, 200);
    state.shadowDirectionY = clamp(Math.round(perspectiveY), -200, 200);
  }

  function requestUpdate() {
    if (updateFrame) {
      return;
    }

    updateFrame = requestAnimationFrame(() => {
      updateFrame = 0;
      update();
    });
  }

  const textAppearance = bindTextAppearance(state, requestUpdate);
  const shadow = bindShadow(state, requestUpdate);
  const border = bindBorder(state, requestUpdate);
  const rotation = bindRotationController(state, requestUpdate, (width, height) => {
    postMessage({ type: 'resize-ui', width, height });
  });

  function update() {
    syncShadowDirectionWithRotation();
    textAppearance.sync();
    shadow.sync();
    border.sync();
    rotation.sync();
    renderPreview(state, canvas, previewSurface, previewObject);
  }

  syncShadowDirectionWithRotation(true);
  textAppearance.sync();
  shadow.sync();
  border.sync();
  rotation.sync();

  insertButton.addEventListener('click', () => {
    renderPreview(state, canvas, previewSurface, previewObject);
    postMessage({
      type: 'create-rectangles',
      base64Image: canvas.toDataURL('image/png'),
    });
  });

  resetSettingsButton.addEventListener('click', () => {
    Object.assign(state, createDefaultState());
    syncShadowDirectionWithRotation(true);
    textAppearance.sync();
    shadow.sync();
    border.sync();
    rotation.sync();
    postMessage({
      type: 'resize-ui',
      width: state.windowWidth,
      height: state.windowHeight,
    });
    requestUpdate();
  });

  update();
}

createMarkup();
bindUi();