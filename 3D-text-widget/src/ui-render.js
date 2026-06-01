import { CANVAS_WIDTH, CANVAS_HEIGHT } from './ui-config.js';
import {
  getFaceProjection,
  getLayerOpacity,
  getLayerOrigin,
  getScene3D,
} from './ui-3d.js';
import { clamp, rgba, shade } from './ui-utils.js';

const SHADOW_DEPTH_SCALE = 1.3;

function getTextOpacity(state) {
  return clamp((state.textOpacity ?? 100) / 100, 0, 1);
}

function getShadowOpacity(state) {
  return clamp((state.shadowOpacity ?? 78) / 100, 0, 1);
}

function makeShadow2State(state) {
  return {
    ...state,
    shadowCount: state.shadow2Count ?? 10,
    shadowDistance: state.shadow2Distance ?? 8,
    shadowSoftness: state.shadow2Softness ?? 90,
    shadowOpacity: state.shadow2Opacity ?? 35,
    shadowColor: state.shadow2Color ?? '#000000',
  };
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

function getShadowMetrics(state, fontSize, scene) {
  const softness = clamp(state.shadowSoftness ?? 58, 0, 100);
  const softnessRatio = softness / 100;
  const sharpnessRatio = 1 - softnessRatio;
  const { stepX, stepY } = scene;
  const { x: rotateX, y: rotateY } = scene.rotation;
  const shadowCount = clamp(Math.round(state.shadowCount ?? 12), 0, 48);
  const shadowOpacity = getShadowOpacity(state);
  const depthProjection = scene.depthStep * scene.layerCount * 0.55 * SHADOW_DEPTH_SCALE;
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
    (0.26 + sharpnessRatio * 0.32 + (shadowCount + (state.shadowDistance ?? 0)) / 120) * shadowOpacity,
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
  const scene = getScene3D(state);
  const previewFontSize = Math.round(Math.max(48, state.size * 0.62));
  const shadow = getShadowMetrics(state, previewFontSize, scene);
  const state2 = makeShadow2State(state);
  const scene2 = getScene3D(state2);
  const shadow2 = getShadowMetrics(state2, previewFontSize, scene2);
  const textOpacity = getTextOpacity(state);

  surface.style.background = 'transparent';
  surface.style.perspective = `${scene.perspective}px`;
  object.innerHTML = '';
  object.style.fontFamily = state.font;
  object.style.fontSize = `${previewFontSize}px`;
  object.style.transform = `translate(-50%, -50%) rotateX(${state.rotateX}deg) rotateY(${state.rotateY}deg) rotateZ(${state.rotateZ}deg)`;
  object.style.filter = [
    `drop-shadow(${shadow2.x.toFixed(1)}px ${shadow2.y.toFixed(1)}px ${shadow2.blur.toFixed(1)}px ${shadow2.color})`,
    `drop-shadow(${shadow.x.toFixed(1)}px ${shadow.y.toFixed(1)}px ${shadow.blur.toFixed(1)}px ${shadow.color})`,
  ].join(' ');

  function createFace(color, x, y, z, opacity, isFront) {
    const face = document.createElement('div');
    face.className = `editor-preview-face${isFront ? ' editor-preview-face--front' : ''}`;
    face.style.color = color;
    face.style.opacity = String(opacity);
    face.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px)`;

    if (isFront) {
      // Double width so only the outer half shows (inside is covered by text fill)
      const strokeWidth = clamp(state.borderWidth ?? 0, 0, 24) * (previewFontSize / 180) * 2;
      face.style.webkitTextStrokeWidth = `${strokeWidth.toFixed(2)}px`;
      face.style.webkitTextStrokeColor = state.edgeColor;
      face.style.paintOrder = 'stroke fill';
    }

    lines.forEach((line) => {
      const lineNode = document.createElement('span');
      lineNode.className = 'editor-preview-line';
      lineNode.textContent = line || ' ';
      face.appendChild(lineNode);
    });

    return face;
  }

  // Shadow B layers (drawn first, underneath)
  for (let layer = state2.shadowCount; layer >= 1; layer -= 1) {
    const shadeAmount = -Math.round((layer / state2.shadowCount) * 46);
    const origin2 = getLayerOrigin(layer, scene2.stepX, scene2.stepY, scene2.depthStep);
    const face2 = createFace(
      shade(state2.shadowColor ?? state2.edgeColor, shadeAmount),
      origin2.x,
      origin2.y,
      origin2.z,
      getLayerOpacity(state2, layer, state2.shadowCount),
      false,
    );
    object.appendChild(face2);
  }

  // Shadow A layers (drawn on top of B)
  for (let layer = scene.layerCount; layer >= 1; layer -= 1) {
    const shadeAmount = -Math.round((layer / scene.layerCount) * 46);
    const origin = getLayerOrigin(layer, scene.stepX, scene.stepY, scene.depthStep);
    const face = createFace(
      shade(state.shadowColor ?? state.edgeColor, shadeAmount),
      origin.x,
      origin.y,
      origin.z,
      getLayerOpacity(state, layer, scene.layerCount),
      false,
    );
    object.appendChild(face);
  }

  object.appendChild(createFace(state.textColor, 0, 0, 0, textOpacity, true));
}

export function drawScene(state, ctx) {
  const lines = state.text.split(/\r?\n/);
  const scene = getScene3D(state);
  const state2 = makeShadow2State(state);
  const scene2 = getScene3D(state2);

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const fontSize = fitFontSize(ctx, lines, state);
  const lineHeight = fontSize * 0.92;
  const shadow = getShadowMetrics(state, fontSize, scene);
  const textOpacity = getTextOpacity(state);
  const strokeWidth = clamp(state.borderWidth ?? 0, 0, 24);
  const centerLineOffset = (lines.length - 1) / 2;

  function drawFace(origin, drawStyle) {
    const projection = getFaceProjection(origin, scene.rotation, scene.perspective);

    ctx.save();
    ctx.transform(
      projection.basisX.x,
      projection.basisX.y,
      projection.basisY.x,
      projection.basisY.y,
      projection.origin.x,
      projection.origin.y,
    );

    if (drawStyle.shadow) {
      ctx.shadowColor = drawStyle.shadow.color;
      ctx.shadowBlur = drawStyle.shadow.blur / projection.averageScale;
      ctx.shadowOffsetX = drawStyle.shadow.x / projection.averageScale;
      ctx.shadowOffsetY = drawStyle.shadow.y / projection.averageScale;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    if (drawStyle.strokeWidth > 0) {
      // Double lineWidth so the inner half is hidden by the fill pass (outside stroke)
      ctx.lineWidth = drawStyle.strokeWidth * 2;
      ctx.strokeStyle = drawStyle.strokeColor;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;

      lines.forEach((line, index) => {
        const y = (index - centerLineOffset) * lineHeight;
        ctx.strokeText(line || ' ', 0, y);
      });
    }

    ctx.fillStyle = drawStyle.fill;
    lines.forEach((line, index) => {
      const y = (index - centerLineOffset) * lineHeight;
      ctx.fillText(line || ' ', 0, y);
    });

    ctx.restore();
  }

  ctx.save();
  ctx.translate(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${fontSize}px ${state.font}`;

  // Shadow B layers (drawn first, underneath)
  for (let layer = scene2.layerCount; layer >= 1; layer -= 1) {
    const layerColor2 = shade(
      state2.shadowColor ?? state2.edgeColor,
      -Math.round((layer / scene2.layerCount) * 46),
    );

    drawFace(
      getLayerOrigin(layer, scene2.stepX, scene2.stepY, scene2.depthStep),
      {
        fill: rgba(layerColor2, getLayerOpacity(state2, layer, scene2.layerCount)),
        strokeWidth: 0,
      },
    );
  }

  // Shadow A layers (drawn on top of B)
  for (let layer = scene.layerCount; layer >= 1; layer -= 1) {
    const layerColor = shade(
      state.shadowColor ?? state.edgeColor,
      -Math.round((layer / scene.layerCount) * 46),
    );

    drawFace(
      getLayerOrigin(layer, scene.stepX, scene.stepY, scene.depthStep),
      {
        fill: rgba(layerColor, getLayerOpacity(state, layer, scene.layerCount)),
        strokeWidth: 0,
      },
    );
  }

  drawFace(
    { x: 0, y: 0, z: 0 },
    {
      fill: rgba(state.textColor, textOpacity),
      strokeWidth,
      strokeColor: state.edgeColor,
      shadow,
    },
  );

  ctx.restore();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
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