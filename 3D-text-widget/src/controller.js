export function createRotationController(options) {
  const {
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
    onChange,
    onResizeWindow,
  } = options;

  function setRotation(nextRotateX, nextRotateY, nextRotateZ = state.rotateZ) {
    state.rotateX = clamp(Math.round(nextRotateX), -70, 70);
    state.rotateY = clamp(Math.round(nextRotateY), -70, 70);
    state.rotateZ = clamp(Math.round(nextRotateZ), -45, 45);
  }

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

  function resizeWindow(nextWidth, nextHeight) {
    setWindowSize(nextWidth, nextHeight);
    onResizeWindow(state.windowWidth, state.windowHeight);
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
      resizeWindow(
        startWidth + (moveEvent.clientX - startX),
        startHeight + (moveEvent.clientY - startY),
      );
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