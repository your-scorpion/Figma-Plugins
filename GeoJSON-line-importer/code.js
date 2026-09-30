var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a;
const TOOL_ID = "4b8603a0-2df8-49b6-82f2-ea93ab179898";
const DISPLAY_NAME = "GeoJSON line importer";
const ATTACH_KEY = TOOL_ID + ":state";
const DEFAULTS = { geojson: null, maxSize: 800, strokeWidth: 2, strokeColor: { "r": 0.08, "g": 0.11, "b": 0.16, "a": 1 } };
let latestParams = DEFAULTS;
let isExecuting = false;
function finiteNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function normalizeColor(value, fallback) {
  if (typeof value !== "object" || value === null) return fallback;
  const obj = value;
  return {
    r: clamp(finiteNumber(obj.r, fallback.r), 0, 1),
    g: clamp(finiteNumber(obj.g, fallback.g), 0, 1),
    b: clamp(finiteNumber(obj.b, fallback.b), 0, 1),
    a: clamp(finiteNumber(obj.a, fallback.a), 0, 1)
  };
}
function normalizeParams(input) {
  var _a2;
  const value = input != null ? input : {};
  return {
    geojson: (_a2 = value.geojson) != null ? _a2 : DEFAULTS.geojson,
    maxSize: clamp(finiteNumber(value.maxSize, DEFAULTS.maxSize), 10, 1e4),
    strokeWidth: clamp(finiteNumber(value.strokeWidth, DEFAULTS.strokeWidth), 0.25, 20),
    strokeColor: normalizeColor(value.strokeColor, DEFAULTS.strokeColor)
  };
}
function placeNodeCentered(node, point) {
  const positioned = node;
  positioned.x = point.x - positioned.width / 2;
  positioned.y = point.y - positioned.height / 2;
}
function solidPaint(color) {
  return {
    type: "SOLID",
    color: { r: color.r, g: color.g, b: color.b },
    opacity: color.a
  };
}
class VectorPathBuilder {
  constructor() {
    __publicField(this, "commands", []);
  }
  // Guard against NaN/Infinity (a non-finite token crashes the path parser),
  // then 2-decimal round at emit time so control-point math stays full precision.
  coord(value) {
    const safe = Number.isFinite(value) ? value : 0;
    return Number.isInteger(safe) ? String(safe) : Number(safe.toFixed(2)).toString();
  }
  moveTo(x, y) {
    this.commands.push("M", this.coord(x), this.coord(y));
    return this;
  }
  lineTo(x, y) {
    this.commands.push("L", this.coord(x), this.coord(y));
    return this;
  }
  curveTo(c1x, c1y, c2x, c2y, x, y) {
    this.commands.push(
      "C",
      this.coord(c1x),
      this.coord(c1y),
      this.coord(c2x),
      this.coord(c2y),
      this.coord(x),
      this.coord(y)
    );
    return this;
  }
  quadraticCurveTo(cx, cy, x, y) {
    this.commands.push("Q", this.coord(cx), this.coord(cy), this.coord(x), this.coord(y));
    return this;
  }
  close() {
    this.commands.push("Z");
    return this;
  }
  toPathData() {
    return this.commands.join(" ");
  }
  toVectorPath(windingRule = "NONZERO") {
    return { windingRule, data: this.toPathData() };
  }
}
function htmlEscapeAttribute(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
function colorToHex(color) {
  const channel = (value) => Math.round(clamp(value, 0, 1) * 255).toString(16).padStart(2, "0").toUpperCase();
  return "#" + channel(color.r) + channel(color.g) + channel(color.b) + channel(color.a);
}
function projectPosition(position) {
  const longitude = position[0];
  const latitude = Math.max(-85.05112878, Math.min(85.05112878, position[1]));
  const latitudeRadians = latitude * Math.PI / 180;
  return {
    x: (longitude + 180) / 360,
    y: (1 - Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) / Math.PI) / 2
  };
}
function planarPosition(position) {
  return { x: position[0], y: -position[1] };
}
function uniqueSceneNodes(nodes) {
  return [...new Set(nodes)].filter((node) => !node.removed);
}
function attachRelaunch(nodes) {
  const unique = uniqueSceneNodes(nodes);
  if (unique.length > 0) {
    for (const node of unique) node.setRelaunchData({ [TOOL_ID]: DISPLAY_NAME });
  } else {
    figma.root.setRelaunchData({ [TOOL_ID]: DISPLAY_NAME });
  }
}
function singleSelectedTarget() {
  var _a2;
  const selection = figma.currentPage.selection;
  return selection.length === 1 ? (_a2 = selection[0]) != null ? _a2 : null : null;
}
function readAttachment(node) {
  var _a2;
  try {
    const parsed = JSON.parse(node.getPluginData(ATTACH_KEY));
    if ((parsed == null ? void 0 : parsed.version) !== 1) return null;
    return {
      version: 1,
      params: normalizeParams(parsed.params),
      state: (_a2 = parsed.state) != null ? _a2 : null
    };
  } catch (e) {
    return null;
  }
}
function storableParams(params) {
  return __spreadProps(__spreadValues({}, params), { geojson: null });
}
function writeAttachment(node, params, state) {
  node.setPluginData(ATTACH_KEY, JSON.stringify({ version: 1, params: storableParams(params), state }));
}
function actionTarget_import() {
  return null;
}
async function action_import(params, target, _previousState) {
  const affectedNodes = target != null ? [target] : [];
  (() => {
    var _a2;
    if (params.geojson == null) return;
    const paths = params.geojson.paths;
    if (paths.length === 0) throw new Error("No supported line or polygon geometry was found in this file.");
    const transform = params.geojson.geographic ? projectPosition : planarPosition;
    const projected = paths.map((path) => ({ closed: path.closed, label: path.label, points: path.points.map(transform) }));
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const path of projected) {
      for (const point of path.points) {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      }
    }
    const sourceWidth = Math.max(maxX - minX, 1e-12);
    const sourceHeight = Math.max(maxY - minY, 1e-12);
    const scale = params.maxSize / Math.max(sourceWidth, sourceHeight);
    const outputWidth = Math.max(1, sourceWidth * scale);
    const outputHeight = Math.max(1, sourceHeight * scale);
    const frame = figma.createFrame();
    frame.name = params.geojson.name.replace(/\.(geojson|json|kmz|shp)$/i, "") || "Imported vectors";
    frame.fills = [];
    frame.clipsContent = false;
    frame.resize(outputWidth, outputHeight);
    placeNodeCentered(frame, figma.viewport.center);
    for (let index = 0; index < projected.length; index += 1) {
      const path = projected[index];
      if (path == null || path.points.length < 2) continue;
      const builder = new VectorPathBuilder();
      const first = path.points[0];
      if (first == null) continue;
      builder.moveTo((first.x - minX) * scale, (first.y - minY) * scale);
      for (let pointIndex = 1; pointIndex < path.points.length; pointIndex += 1) {
        const point = path.points[pointIndex];
        if (point != null) builder.lineTo((point.x - minX) * scale, (point.y - minY) * scale);
      }
      if (path.closed) builder.close();
      const vector = figma.createVector();
      vector.name = (_a2 = path.label) != null ? _a2 : path.closed ? `Polygon ${index + 1}` : `Line ${index + 1}`;
      frame.appendChild(vector);
      vector.vectorPaths = [builder.toVectorPath("NONZERO")];
      vector.fills = [];
      vector.strokes = [solidPaint(params.strokeColor)];
      vector.strokeWeight = params.strokeWidth;
      vector.strokeCap = "ROUND";
      vector.strokeJoin = "ROUND";
      affectedNodes.push(vector);
    }
    affectedNodes.push(frame);
  })();
  return { affectedNodes, state: null };
}
async function runAction_import(target, notify) {
  isExecuting = true;
  try {
    const result = await action_import(latestParams, target, null);
    if (target != null) writeAttachment(target, latestParams, result.state);
    attachRelaunch(result.affectedNodes);
    const created = result.affectedNodes.filter((node) => node !== target);
    const vectorCount = created.filter((node) => node.type === "VECTOR").length;
    if (notify && created.length > 0) {
      if (target == null) figma.currentPage.selection = created.filter((node) => node.type === "FRAME");
      figma.viewport.scrollAndZoomIntoView(created);
    }
    figma.ui.postMessage({ type: "import-result", ok: true, count: vectorCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    figma.notify(message, { error: true });
    figma.ui.postMessage({ type: "import-result", ok: false, error: message });
  } finally {
    isExecuting = false;
  }
}
const initialTarget = singleSelectedTarget();
const initialAttachment = initialTarget != null ? readAttachment(initialTarget) : null;
const initialParams = (_a = initialAttachment == null ? void 0 : initialAttachment.params) != null ? _a : DEFAULTS;
latestParams = initialParams;
let html = __html__;
html = html.replace(/(id="maxSize"[^>]*\bvalue=")[^"]*(")/g, "$1" + htmlEscapeAttribute(String(initialParams.maxSize)) + "$2");
html = html.replace(/(id="strokeWidth"[^>]*\bvalue=")[^"]*(")/g, "$1" + htmlEscapeAttribute(String(initialParams.strokeWidth)) + "$2");
html = html.replace(/(id="strokeColor"[^>]*\bvalue=")[^"]*(")/g, "$1" + htmlEscapeAttribute(colorToHex(initialParams.strokeColor)) + "$2");
figma.root.setRelaunchData({ [TOOL_ID]: DISPLAY_NAME });
figma.showUI(html, { width: 720, height: 600, themeColors: true });
figma.ui.onmessage = (msg) => {
  if (msg.type === "resize") {
    figma.ui.resize(720, Math.max(48, Math.min(900, Math.round(msg.height))));
    return;
  }
  if (msg.type === "action") {
    if (msg.id === "import") {
      const target = actionTarget_import();
      latestParams = normalizeParams(msg.params);
      void runAction_import(target, true);
      return;
    }
    return;
  }
};
