import { clamp } from './ui-utils.js';

export const PREVIEW_PERSPECTIVE = 1200;

export function getRotationRadians(state) {
  return {
    x: (state.rotateX * Math.PI) / 180,
    y: (state.rotateY * Math.PI) / 180,
    z: (state.rotateZ * Math.PI) / 180,
  };
}

export function getDepthMetrics(state) {
  const layerCount = clamp(Math.round(state.shadowCount ?? 12), 0, 48);
  const depthStep = layerCount === 0
    ? 0
    : 0.9 + clamp(state.shadowDistance ?? 4, 0, 18) * 0.16;

  return {
    layerCount,
    depthStep,
  };
}

export function getLayerOpacity(state, layer, layerCount) {
  if (layerCount <= 0) {
    return 0;
  }

  const maxOpacity = clamp((state.shadowOpacity ?? 78) / 100, 0, 1);
  const ratio = layerCount === 1 ? 1 : (layer - 1) / (layerCount - 1);

  // Exponential: lower exponent keeps farther layers more visible for denser stacks.
  return clamp(Math.pow(1 - ratio, 1.45) * maxOpacity, 0, 1);
}

export function getShadowTrailMetrics(state, rotation) {
  const distance = clamp(state.shadowDistance ?? 4, 0, 18);
  // UI sliders expose direction in the -200..200 range.
  // Normalize with the same range so the full control affects the preview.
  const directionX = clamp(state.shadowDirectionX ?? 0, -200, 200) / 200;
  const directionY = clamp(state.shadowDirectionY ?? 0, -200, 200) / 200;
  const baseX = Math.sin(rotation.y) * 0.9 + directionX * 1.1;
  const baseY = 0.34 - Math.sin(rotation.x) * 0.72 + directionY * 1.1;

  return {
    stepX: clamp(baseX, -1.8, 1.8) * distance,
    stepY: clamp(baseY, -1.8, 1.8) * distance,
  };
}

export function getLayerOrigin(layer, stepX, stepY, depthStep) {
  return {
    x: stepX * layer,
    y: stepY * layer,
    z: -depthStep * layer,
  };
}

export function getScene3D(state) {
  const rotation = getRotationRadians(state);
  const { layerCount, depthStep } = getDepthMetrics(state);
  const { stepX, stepY } = getShadowTrailMetrics(state, rotation);

  return {
    rotation,
    layerCount,
    depthStep,
    stepX,
    stepY,
    perspective: PREVIEW_PERSPECTIVE,
  };
}

function rotateZ(point, radians) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
    z: point.z,
  };
}

function rotateY(point, radians) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: point.x * cos + point.z * sin,
    y: point.y,
    z: -point.x * sin + point.z * cos,
  };
}

function rotateX(point, radians) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: point.x,
    y: point.y * cos - point.z * sin,
    z: point.y * sin + point.z * cos,
  };
}

export function rotatePoint(point, rotation) {
  const afterZ = rotateZ(point, rotation.z);
  const afterY = rotateY(afterZ, rotation.y);

  return rotateX(afterY, rotation.x);
}

export function projectPoint(point, perspective = PREVIEW_PERSPECTIVE) {
  const denominator = Math.max(1, perspective - point.z);
  const scale = clamp(perspective / denominator, 0.05, 8);

  return {
    x: point.x * scale,
    y: point.y * scale,
    scale,
  };
}

export function getFaceProjection(origin, rotation, perspective = PREVIEW_PERSPECTIVE) {
  const worldOrigin = rotatePoint(origin, rotation);
  const worldX = rotatePoint({ x: origin.x + 1, y: origin.y, z: origin.z }, rotation);
  const worldY = rotatePoint({ x: origin.x, y: origin.y + 1, z: origin.z }, rotation);

  const projectedOrigin = projectPoint(worldOrigin, perspective);
  const projectedX = projectPoint(worldX, perspective);
  const projectedY = projectPoint(worldY, perspective);

  const basisX = {
    x: projectedX.x - projectedOrigin.x,
    y: projectedX.y - projectedOrigin.y,
  };
  const basisY = {
    x: projectedY.x - projectedOrigin.x,
    y: projectedY.y - projectedOrigin.y,
  };
  const averageScale = Math.max(
    0.05,
    (Math.hypot(basisX.x, basisX.y) + Math.hypot(basisY.x, basisY.y)) / 2,
  );

  return {
    origin: projectedOrigin,
    basisX,
    basisY,
    averageScale,
  };
}
