import { createSlider } from './slider.js';
import { clamp, normalizeAxis } from '../ui-utils.js';

export function createRotationSection() {
  return `
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
  `;
}

export function bindRotationController(state, onChange, onResizeWindow) {
  const rotateZInput = document.getElementById('rotate-z-input');
  const rotateXInput = document.getElementById('rotate-x-input');
  const rotateYInput = document.getElementById('rotate-y-input');
  const rotateZOutput = document.getElementById('rotate-z-output');
  const rotateXOutput = document.getElementById('rotate-x-output');
  const rotateYOutput = document.getElementById('rotate-y-output');
  const xyzOutput = document.getElementById('xyz-output');
  const rotationPad = document.getElementById('rotation-pad');
  const rotationPadKnob = document.getElementById('rotation-pad-knob');
  const rotationPadReadout = document.getElementById('rotation-pad-readout');
  const rotationReset = document.getElementById('rotation-reset');
  const windowResizeHandle = document.getElementById('window-resize-handle');

  function setRotation(nextRotateX, nextRotateY, nextRotateZ = state.rotateZ) {
    state.rotateX = clamp(Math.round(nextRotateX), -70, 70);
    state.rotateY = clamp(Math.round(nextRotateY), -70, 70);
    state.rotateZ = clamp(Math.round(nextRotateZ), -45, 45);
  }

  const rotateZSlider = createSlider(rotateZInput, {
    start: state.rotateZ,
    min: -45,
    max: 45,
    step: 1,
    onChange: (value) => {
      state.rotateZ = clamp(Math.round(value), -45, 45);
      onChange();
    },
  });

  const rotateYSlider = createSlider(rotateYInput, {
    start: state.rotateY,
    min: -70,
    max: 70,
    step: 1,
    onChange: (value) => {
      state.rotateY = clamp(Math.round(value), -70, 70);
      onChange();
    },
  });

  const rotateXSlider = createSlider(rotateXInput, {
    start: state.rotateX,
    min: -70,
    max: 70,
    step: 1,
    onChange: (value) => {
      state.rotateX = clamp(Math.round(value), -70, 70);
      onChange();
    },
  });

  function sync() {
    const padX = normalizeAxis(state.rotateY, -70, 70) * 100;
    const padY = normalizeAxis(state.rotateX, -70, 70) * 100;
    const xyzLabel = `X ${state.rotateX}deg Y ${state.rotateY}deg Z ${state.rotateZ}deg`;

    rotateZSlider.set(state.rotateZ);
    rotateXSlider.set(state.rotateX);
    rotateYSlider.set(state.rotateY);
    rotateZOutput.value = `${state.rotateZ}deg`;
    rotateXOutput.value = `${state.rotateX}deg`;
    rotateYOutput.value = `${state.rotateY}deg`;

    rotationPadKnob.style.left = `${padX}%`;
    rotationPadKnob.style.top = `${padY}%`;
    rotationPadReadout.textContent = `X ${state.rotateX}deg Y ${state.rotateY}deg`;
    xyzOutput.value = xyzLabel;
    rotationPad.setAttribute('aria-valuetext', `Rotate X ${state.rotateX} degrees, rotate Y ${state.rotateY} degrees`);
  }

  function setWindowSize(nextWidth, nextHeight = state.windowHeight) {
    state.windowWidth = clamp(Math.round(nextWidth), 640, 1600);
    state.windowHeight = clamp(Math.round(nextHeight), 480, 1400);
  }

  function updateRotationFromPad(clientX, clientY) {
    const rect = rotationPad.getBoundingClientRect();
    const nextX = clamp((clientX - rect.left) / rect.width, 0, 1);
    const nextY = clamp((clientY - rect.top) / rect.height, 0, 1);

    setRotation(nextY * 140 - 70, nextX * 140 - 70);
    onChange();
  }

  function bindDrag(target, onMove) {
    target.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      target.setPointerCapture(event.pointerId);
      onMove(event);

      const handleMove = (moveEvent) => {
        onMove(moveEvent);
      };

      const handleEnd = () => {
        target.removeEventListener('pointermove', handleMove);
        target.removeEventListener('pointerup', handleEnd);
        target.removeEventListener('pointercancel', handleEnd);
      };

      target.addEventListener('pointermove', handleMove);
      target.addEventListener('pointerup', handleEnd);
      target.addEventListener('pointercancel', handleEnd);
    });
  }

  bindDrag(rotationPad, (event) => {
    updateRotationFromPad(event.clientX, event.clientY);
  });

  rotationPad.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 8 : 3;
    let handled = true;

    switch (event.key) {
      case 'ArrowUp':
        setRotation(state.rotateX - step, state.rotateY, state.rotateZ);
        break;
      case 'ArrowDown':
        setRotation(state.rotateX + step, state.rotateY, state.rotateZ);
        break;
      case 'ArrowLeft':
        setRotation(state.rotateX, state.rotateY - step, state.rotateZ);
        break;
      case 'ArrowRight':
        setRotation(state.rotateX, state.rotateY + step, state.rotateZ);
        break;
      default:
        handled = false;
    }

    if (handled) {
      event.preventDefault();
      onChange();
    }
  });

  rotationReset.addEventListener('click', () => {
    setRotation(0, 0, 0);
    onChange();
  });

  windowResizeHandle.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    windowResizeHandle.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = state.windowWidth;
    const startHeight = state.windowHeight;

    const handleMove = (moveEvent) => {
      setWindowSize(startWidth + (moveEvent.clientX - startX), startHeight + (moveEvent.clientY - startY));
      onResizeWindow(state.windowWidth, state.windowHeight);
    };

    const handleEnd = () => {
      windowResizeHandle.removeEventListener('pointermove', handleMove);
      windowResizeHandle.removeEventListener('pointerup', handleEnd);
      windowResizeHandle.removeEventListener('pointercancel', handleEnd);
    };

    windowResizeHandle.addEventListener('pointermove', handleMove);
    windowResizeHandle.addEventListener('pointerup', handleEnd);
    windowResizeHandle.addEventListener('pointercancel', handleEnd);
  });

  return {
    setRotation,
    setWindowSize,
    sync,
  };
}
