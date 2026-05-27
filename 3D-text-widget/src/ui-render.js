import { CANVAS_WIDTH, CANVAS_HEIGHT } from './ui-config.js';
import { clamp, rgba, shade } from './ui-utils.js';

function getTextOpacity(state) {
  return clamp((state.textOpacity ?? 100) / 100, 0, 1);
}

function getShadowOpacity(state) {
  return clamp((state.shadowOpacity ?? 78) / 100, 0, 1);
}

function fitFontSize(ctx, lines, state) {
  let fontSize = state.size;
  let maxWidth = 0;
  let totalHeight = 0;

  while (fontSize > 32) {
    ctx.font = `700 ${fontSize}px ${state.font}`;
    maxWidth = Math.max(...lines.map((line) => ctx.measureText(line || ' ').width));
    totalHeight = fontSize + (lines.length - 1) * fontSize * 0.92;

    if (maxWidth <= CANVAS_WIDTH * 0.82 && totalHeight <= CANVAS_HEIGHT * 0.46) {
      break;
    }

    fontSize -= 2;
  }

  return fontSize;
}

function getDepthMetrics(state) {
  const layerCount = clamp(Math.round(state.shadowCount ?? 12), 0, 24);
  const depthStep = layerCount === 0
    ? 0
    : 0.9 + clamp(state.shadowDistance ?? 4, 0, 18) * 0.16;

  return {
    layerCount,
    depthStep,
  };
}

function getLayerOpacity(state, layer, layerCount) {
  if (layerCount <= 0) {
    return 0;
  }

  const maxOpacity = getShadowOpacity(state);
  const minOpacity = maxOpacity * 0.18;
  const ratio = layerCount === 1 ? 1 : (layer - 1) / (layerCount - 1);

  return clamp(minOpacity + ratio * (maxOpacity - minOpacity), 0, 1);
}

function getShadowTrailMetrics(state, rotateX = 0, rotateY = 0) {
  const distance = clamp(state.shadowDistance ?? 4, 0, 18);
  const baseX = Math.sin(rotateY) * 0.9;
  const baseY = 0.34 - Math.sin(rotateX) * 0.72;

  return {
    stepX: baseX * distance,
    stepY: baseY * distance,
  };
}

function getShadowMetrics(state, fontSize, rotateX = 0, rotateY = 0, depthStep = 0, layerCount = 0) {
  const softness = clamp(state.shadowSoftness ?? 58, 0, 100);
  const softnessRatio = softness / 100;
  const sharpnessRatio = 1 - softnessRatio;
  const { stepX, stepY } = getShadowTrailMetrics(state, rotateX, rotateY);
  const shadowCount = clamp(Math.round(state.shadowCount ?? 12), 0, 24);
  const shadowOpacity = getShadowOpacity(state);
  const depthRatio = clamp((state.shadowDepth ?? 100) / 100, 0, 2);
  const depthProjection = depthStep * layerCount * 0.55 * depthRatio;
  const depthX = Math.sin(rotateY) * depthProjection;
  const depthY = (0.5 - Math.sin(rotateX) * 0.6) * depthProjection;
  const shadowX = stepX * Math.max(1, Math.min(shadowCount, 4)) + depthX;
  const shadowY = stepY * Math.max(1, Math.min(shadowCount, 4)) + fontSize * 0.04 + depthY;
  const blur = softness === 0
    ? 0
    : clamp(
      fontSize * (softnessRatio * 0.17)
      + (state.shadowDistance ?? 4) * (0.4 + softnessRatio * 0.45)
      + depthProjection * 0.12,
      1,
      46,
    );
  const alpha = clamp(
    (0.24 + sharpnessRatio * 0.28 + (shadowCount + (state.shadowDistance ?? 0)) / 160) * shadowOpacity,
    0,
    0.86,
  );

  return {
    x: shadowX,
    y: shadowY,
    blur,
    color: rgba(state.shadowColor ?? state.edgeColor, alpha),
  };
}

export function renderCssPreview(state, surface, object) {
  const lines = state.text.split(/\r?\n/);
  const { layerCount, depthStep } = getDepthMetrics(state);
  const previewFontSize = Math.round(clamp(state.size * 0.62, 48, 170));
  const rotateX = (state.rotateX * Math.PI) / 180;
  const rotateY = (state.rotateY * Math.PI) / 180;
  const { stepX, stepY } = getShadowTrailMetrics(state, rotateX, rotateY);
  const shadow = getShadowMetrics(state, previewFontSize, rotateX, rotateY, depthStep, layerCount);
  const textOpacity = getTextOpacity(state);

  surface.style.background = 'transparent';
  object.innerHTML = '';
  object.style.fontFamily = state.font;
  object.style.fontSize = `${previewFontSize}px`;
  object.style.transform = `translate(-50%, -50%) rotateX(${state.rotateX}deg) rotateY(${state.rotateY}deg) rotateZ(${state.rotateZ}deg)`;
  object.style.filter = `drop-shadow(${shadow.x.toFixed(1)}px ${shadow.y.toFixed(1)}px ${shadow.blur.toFixed(1)}px ${shadow.color})`;

  function createFace(color, x, y, z, opacity, isFront) {
    const face = document.createElement('div');
    face.className = `editor-preview-face${isFront ? ' editor-preview-face--front' : ''}`;
    face.style.color = color;
    face.style.opacity = String(opacity);
    face.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px)`;

    if (isFront) {
      const strokeWidth = clamp(state.borderWidth ?? 0, 0, 24) * (previewFontSize / 180);
      face.style.webkitTextStrokeWidth = `${strokeWidth.toFixed(2)}px`;
      face.style.webkitTextStrokeColor = state.edgeColor;
    }

    lines.forEach((line) => {
      const lineNode = document.createElement('span');
      lineNode.className = 'editor-preview-line';
      lineNode.textContent = line || ' ';
      face.appendChild(lineNode);
    });

    return face;
  }

  for (let layer = layerCount; layer >= 1; layer -= 1) {
    const shadeAmount = -Math.round((layer / layerCount) * 46);
    const face = createFace(
      shade(state.shadowColor ?? state.edgeColor, shadeAmount),
      stepX * layer,
      stepY * layer,
      -layer * depthStep,
      getLayerOpacity(state, layer, layerCount),
      false,
    );
    object.appendChild(face);
  }

  object.appendChild(createFace(state.textColor, 0, 0, 0, textOpacity, true));
}

export function drawScene(state, ctx) {
  const lines = state.text.split(/\r?\n/);
  const rotateX = (state.rotateX * Math.PI) / 180;
  const rotateY = (state.rotateY * Math.PI) / 180;
  const rotateZ = (state.rotateZ * Math.PI) / 180;

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const fontSize = fitFontSize(ctx, lines, state);
  const lineHeight = fontSize * 0.92;
  const { layerCount, depthStep } = getDepthMetrics(state);
  const { stepX, stepY } = getShadowTrailMetrics(state, rotateX, rotateY);
  const scaleX = Math.max(0.05, Math.cos(rotateY));
  const scaleY = Math.max(0.05, Math.cos(rotateX));
  const frontOffsetX = 0;
  const frontOffsetY = 0;
  const shadow = getShadowMetrics(state, fontSize, rotateX, rotateY, depthStep, layerCount);
  const textOpacity = getTextOpacity(state);
  const strokeWidth = clamp(state.borderWidth ?? 0, 0, 24);

  ctx.save();
  ctx.translate(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
  ctx.rotate(rotateZ);
  ctx.scale(scaleX, scaleY);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${fontSize}px ${state.font}`;

  // Correct orthographic projection of each depth layer at z3d = -layer * depthStep.
  // In pre-scale drawing coordinates (which ctx.scale(cos θY, cos θX) will project):
  //   x_draw = layer * (stepX - depthStep * tan(θY))
  //   y_draw = layer * (stepY + tan(θX) * (stepX * sin(θY) + depthStep * cos(θY)))
  const tanY = Math.tan(rotateY);
  const tanX = Math.tan(rotateX);

  for (let layer = layerCount; layer >= 1; layer -= 1) {
    const layerColor = shade(state.shadowColor ?? state.edgeColor, -Math.round((layer / layerCount) * 46));
    ctx.fillStyle = rgba(layerColor, getLayerOpacity(state, layer, layerCount));

    const layerX = layer * (stepX - depthStep * tanY);
    const layerYBase = layer * (stepY + tanX * (stepX * Math.sin(rotateY) + depthStep * Math.cos(rotateY)));

    lines.forEach((line, index) => {
      const y = (index - (lines.length - 1) / 2) * lineHeight + layerYBase;
      ctx.fillText(line || ' ', layerX, y);
    });
  }

  ctx.fillStyle = rgba(state.textColor, textOpacity);
  ctx.shadowColor = shadow.color;
  ctx.shadowBlur = shadow.blur;
  ctx.shadowOffsetX = shadow.x;
  ctx.shadowOffsetY = shadow.y;

  if (strokeWidth > 0) {
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = state.edgeColor;
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;

    lines.forEach((line, index) => {
      const y = (index - (lines.length - 1) / 2) * lineHeight + frontOffsetY;
      const x = frontOffsetX;
      ctx.strokeText(line || ' ', x, y);
    });
  }

  lines.forEach((line, index) => {
    const y = (index - (lines.length - 1) / 2) * lineHeight + frontOffsetY;
    const x = frontOffsetX;
    ctx.fillText(line || ' ', x, y);
  });

  ctx.restore();
  ctx.shadowColor = 'transparent';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

export function renderPreview(state, canvas, surface, object) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  drawScene(state, ctx);
  renderCssPreview(state, surface, object);
}