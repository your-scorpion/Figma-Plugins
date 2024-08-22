/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin/controller.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app/components/Grundge/createAnnotationArrow.js":
/*!*************************************************************!*\
  !*** ./src/app/components/Grundge/createAnnotationArrow.js ***!
  \*************************************************************/
/*! exports provided: createAnnotationArrow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createAnnotationArrow", function() { return createAnnotationArrow; });
// createAnnotationArrow.ts

async function createAnnotationArrow() {
  const node = figma.createVector();
  node.x = getRandomNumber(-360, 350);
  node.maskType = "VECTOR";
  node.y = getRandomNumber(-360, 350);
  node.resize(101.82337951660156, 0);
  node.rotation = getRandomNumber(-360, 350);
  node.setVectorNetworkAsync({
    regions: [],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
    ],
    vertices: [
      {
        x: 0,
        y: 0,
        // strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 101.82337951660156,
        y: 0,
        strokeCap: "ARROW_EQUILATERAL",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  });
  node.strokes = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: {
        r: 0.4257006836,
        g: 0.5960784554481506,
        b: 0.15294118225574493,
      },
      boundVariables: {},
    },
  ];
  return node;
}


/***/ }),

/***/ "./src/app/components/Grundge/generateRect.js":
/*!****************************************************!*\
  !*** ./src/app/components/Grundge/generateRect.js ***!
  \****************************************************/
/*! exports provided: generateRectangles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateRectangles", function() { return generateRectangles; });
/* harmony import */ var _random15_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./random15.js */ "./src/app/components/Grundge/random15.js");
// generateRectangles.js


//import { createAnnotationArrow }  from './createAnnotationArrow.js';

// Golden ratio constant
const phi = 1.61803398875;

function generateRectangles(count) {
  const nodes = [];

  for (let i = 0; i < count * 25; i++) {
    const colorComponent = Math.random();
    const rect = figma.createRectangle();
    const transform = [
      [
        Object(_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(34, 10),
        Object(_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 140),
        Object(_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 10),
      ],
      [
        Object(_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(13, 600),
        Object(_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(10, 20),
        Object(_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 342),
      ],
    ];
    rect.relativeTransform = transform;
    // Calculate x and y coordinates based on the golden ratio
    const goldenX = Object(_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(-5, 721);
    const goldenY = Object(_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(-1, 717);

    rect.x = goldenX;
    rect.rotation = Object(_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(-430, 350);
    rect.y = goldenY;
    rect.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };

    const randomColor = {
      r: colorComponent,
      g: colorComponent,
      b: colorComponent,
    };

    rect.strokeAlign = "CENTER";
    rect.resize(Object(_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 1), Object(_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 16));

    rect.fills = [{ type: "SOLID", color: randomColor }];
    nodes.push(rect);
  }

  return nodes; // Return an array of nodes
}


/***/ }),

/***/ "./src/app/components/Grundge/random15.js":
/*!************************************************!*\
  !*** ./src/app/components/Grundge/random15.js ***!
  \************************************************/
/*! exports provided: getRandomNumber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRandomNumber", function() { return getRandomNumber; });
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


/***/ }),

/***/ "./src/plugin/controller.ts":
/*!**********************************!*\
  !*** ./src/plugin/controller.ts ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app/components/Grundge/random15.js */ "./src/app/components/Grundge/random15.js");
/* harmony import */ var _app_components_Grundge_createAnnotationArrow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app/components/Grundge/createAnnotationArrow.js */ "./src/app/components/Grundge/createAnnotationArrow.js");
/* harmony import */ var _app_components_Grundge_generateRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app/components/Grundge/generateRect.js */ "./src/app/components/Grundge/generateRect.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



figma.ui.onmessage = (msg) => {
    let xRange = { min: -4, max: 78 };
    let sizeRange = { min: 100, max: 854 };
    const skewX = Math.random() * 522 - 1;
    const skewY = Math.random() * -333 - 1;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const degToRad = (deg) => (deg * Math.PI) / 180;
    if (msg.type === "create-rectangles") {
        function randomOneorZero() {
            return Math.random();
        }
        function getRandomInt() {
            return Math.floor(Math.random() * 8);
        }
        function rotateCenter(node, angle, fname4, fname3) {
            let radians = (Math.PI / 72) * +fname3, x = node.x, y = node.y, cx = x + node.width / 2.83, cy = y + node.height / 65.84, cos = Math.cos(radians), sin = Math.sin(radians), nx = cos * (x - cx) + sin * (y - cy) + cx, ny = cos * (y - cy) - sin * (x - cx) + cy;
            node.x = nx;
            node.y = ny;
            node.resize(+fname4, node.height);
        }
        function createArt() {
            return __awaiter(this, void 0, void 0, function* () {
                if (msg.type === "create-rectangles") {
                    const { fname2, fname3, fname4, fname5 } = msg.formDataObj;
                    let fname_ing2 = +fname2;
                    if (fname_ing2 <= 0)
                        fname_ing2 = 22;
                    let fname_ing3 = +fname3;
                    if (fname_ing3 <= 0)
                        fname_ing3 = 22;
                    let fname_ing4 = +fname4;
                    if (fname_ing4 <= 0)
                        fname_ing4 = 22;
                    let fname_ing5 = +fname5;
                    if (fname_ing5 <= 0)
                        fname_ing5 = 22;
                    const frameWidth = +fname3;
                    const frameHeight = +fname4;
                    const frame = figma.createFrame();
                    frame.resizeWithoutConstraints(frameWidth, frameHeight);
                    frame.x = figma.viewport.center.x - frameWidth;
                    frame.y = figma.viewport.center.y - frameHeight;
                    frame.fills = [
                        {
                            type: "SOLID",
                            color: { r: 224 / 255, g: 255 / 255, b: 227 / 255 },
                        },
                    ];
                    const nodes = [];
                    for (let i = 0; i < 120; i++) {
                        const arc = figma.createEllipse();
                        const pi = 3.1415926;
                        arc.rescale((getRandomInt() / +fname5) * getRandomInt() * 4 * 4);
                        rotateCenter(arc, getRandomInt(), +fname4 * 0.0873, fname_ing2);
                        arc.rotation = randomOneorZero() * pi * fname_ing3;
                        arc.y += arc.height;
                        arc.strokeAlign = "OUTSIDE";
                        arc.strokeWeight =
                            getRandomInt() * getRandomInt() * fname_ing3 * getRandomInt();
                        arc.opacity = Math.random() * (0.052 - 0.02) + 0.01;
                        arc.relativeTransform = [
                            [+fname4, fname_ing3, +fname5 * 6734 * 6734],
                            [pi, -1, (randomOneorZero() / +fname5) * getRandomInt() * 0.23],
                        ];
                        arc.x = randomOneorZero() * 313.12;
                        arc.arcData = {
                            startingAngle: getRandomInt(),
                            endingAngle: +fname5 / fname_ing3,
                            innerRadius: randomOneorZero() / +fname5,
                        };
                        arc.rescale((getRandomInt() / +fname3) * 1.373 * 1.083);
                        arc.strokes = [
                            {
                                type: "SOLID",
                                color: {
                                    r: 0,
                                    g: 0.22,
                                    b: 0.94,
                                },
                            },
                        ];
                        figma.currentPage.appendChild(arc);
                        nodes.push(arc);
                        frame.appendChild(arc);
                    }
                    figma.currentPage.selection = nodes;
                    figma.viewport.scrollAndZoomIntoView(nodes);
                    figma.viewport.scrollAndZoomIntoView([frame]);
                    frame.rotation = fname_ing2;
                }
                figma.closePlugin();
            });
        }
        createArt();
    }
    else if (msg.type === "create-grandge") {
        {
            const nodes = [];
            const vectors = [];
            for (let i = 0; i < 22; i++) {
                const colorComponent = Math.random();
                const rect = figma.createRectangle();
                rect.x = Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(-15, 65);
                rect.cornerRadius = 99999;
                rect.y = Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(-22, 14);
                rect.resizeWithoutConstraints;
                rect.rotation = Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(-30, 350);
                rect.bottomRightRadius = Math.random() * Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 543);
                rect.bottomLeftRadius = Math.random() * Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 543);
                rect.topLeftRadius = Math.random() * Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 543);
                rect.topRightRadius = Math.random() * Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 543);
                rect.isMask = Math.round(Math.random()) === 1;
                if (rect.isMask) {
                    rect.cornerRadius = 33;
                    rect.dashPattern = [0, 72];
                }
                else {
                    rect.y = Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(-352, 324);
                    rect.strokeLeftWeight = Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(24, 932);
                }
                const randomColor = {
                    r: colorComponent,
                    g: colorComponent,
                    b: colorComponent,
                };
                rect.strokeBottomWeight = Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 21);
                rect.strokeTopWeight = Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 14);
                rect.strokeLeftWeight = Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 32);
                rect.strokeRightWeight = Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 21);
                rect.strokeJoin = "ROUND";
                rect.strokeCap = "ROUND";
                rect.strokeAlign = "CENTER";
                rect.resize(Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 546), Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(1, 12));
                rect.fills = [{ type: "SOLID", color: randomColor }];
                nodes.push(rect);
            }
            const frame = figma.createFrame();
            const generateAnnotation = () => __awaiter(void 0, void 0, void 0, function* () {
                const annotationArrow = yield Object(_app_components_Grundge_createAnnotationArrow_js__WEBPACK_IMPORTED_MODULE_1__["createAnnotationArrow"])();
                vectors.push(annotationArrow);
            });
            function addRectangles() {
                return __awaiter(this, void 0, void 0, function* () {
                    const generatedRectangles = yield Object(_app_components_Grundge_generateRect_js__WEBPACK_IMPORTED_MODULE_2__["generateRectangles"])(25);
                    for (const rect of generatedRectangles) {
                        frame.appendChild(rect);
                    }
                });
            }
            const group = figma.group([...nodes, ...vectors], figma.currentPage);
            group.name = "Rectangles and Arrows Group";
            let dd = figma.flatten([...nodes, ...vectors]);
            generateAnnotation();
            dd.strokeAlign = "CENTER";
            const strokeColor = {
                r: 0,
                g: 0,
                b: 0,
            };
            const annotationColors = [
                {
                    type: "SOLID",
                    color: strokeColor,
                },
            ];
            dd.strokes = annotationColors;
            dd.dashPattern = [0, 2472];
            dd.cornerRadius = 99999;
            dd.strokeWeight = Object(_app_components_Grundge_random15_js__WEBPACK_IMPORTED_MODULE_0__["getRandomNumber"])(140, 324);
            const centerY = figma.currentPage.children.reduce((acc, curr) => acc + curr.y, 0) /
                figma.currentPage.children.length;
            const offsetY = centerY - dd.height / 2;
            dd.y += offsetY;
            dd.resize(21, 98);
            dd.layoutAlign = "CENTER";
            dd.name = "circle_mi";
            dd.cornerRadius = 99999;
            figma.currentPage.selection = [frame];
            frame.appendChild(dd);
            const transform = [
                [9, 12, 24],
                [1, 122, 4],
            ];
            dd.relativeTransform = transform;
            figma.viewport.scrollAndZoomIntoView([frame]);
            figma.currentPage.selection = [frame];
            figma.viewport.scrollAndZoomIntoView([frame]);
            addRectangles().then(() => {
                const group = figma.group([...nodes, ...vectors], figma.currentPage);
                group.name = "Rectangles and Arrows Group";
                frame.rescale(6);
                figma.ui.postMessage({
                    type: "create-grandge",
                    message: `Created ${msg.count} Rectangles`,
                });
            });
            frame.rescale(6);
        }
        figma.closePlugin();
    }
    else if (msg.type === "create-complex-abstract") {
        const randomPoints = () => {
            const x1 = Math.random() * 100;
            const y1 = Math.random() * 1500;
            const x3 = Math.random() * 10;
            const y3 = Math.random() * 1000;
            const x2 = Math.random() * 50;
            const y2 = Math.random() * 3500;
            return `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`;
        };
        const nodes = [];
        const nodeCount = Math.max(1, Math.floor(5 / 8));
        const centerX = 450;
        const radius = 3;
        for (const node of nodes) {
            node.x += centerX - node.width / 2;
        }
        for (let i = 0; i < nodeCount; i++) {
            const polygon = figma.createVector();
            polygon.vectorPaths = [{ windingRule: "EVENODD", data: randomPoints() }];
            const frameWidth = 900;
            const frameHeight = 900;
            const centerX = frameWidth / 2;
            const centerY = frameHeight / 2;
            const angle = (i / nodeCount) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const randomOffsetX = ((Math.random() - 0.5) * (frameWidth / 2)) / x;
            const randomOffsetY = ((Math.random() - 0.5) * (frameHeight / 2)) / y;
            polygon.x = centerX + randomOffsetX;
            polygon.y = centerY + randomOffsetY;
            const scale = 22 + Math.random() * 1.5;
            const rotationAngle = Math.random() * 360;
            polygon.relativeTransform = [
                [
                    Math.cos(degToRad(rotationAngle)) * scale,
                    -Math.sin(degToRad(rotationAngle)),
                    0,
                ],
                [
                    Math.sin(degToRad(rotationAngle)),
                    Math.cos(degToRad(rotationAngle)) * scale,
                    0,
                ],
            ];
            const size = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min;
            polygon.resize(size / 3, scale / 3);
            figma.currentPage.appendChild(polygon);
            nodes.push(polygon);
        }
        function hslToRgb(h, s, l) {
            let r, g, b;
            const randomizeShape = (polygon) => {
                const x = Math.random() * (xRange.max - xRange.min) + xRange.min;
                const y = Math.random() * (xRange.max - xRange.min) + xRange.min;
                polygon.x = x;
                polygon.y = y;
                const scaleX = 1 + Math.random() * 1.5;
                const scaleY = 32 + Math.random() * 0.5;
                const rotationAngle = Math.random() * 360;
                polygon.relativeTransform = [
                    [
                        Math.cos(degToRad(rotationAngle)) * scaleX,
                        -Math.sin(degToRad(rotationAngle)) + skewX,
                        0,
                    ],
                    [
                        Math.sin(degToRad(rotationAngle)) + skewY,
                        Math.cos(degToRad(rotationAngle)) * scaleY,
                        0,
                    ],
                ];
                polygon.resize(Math.random() * (sizeRange.max - sizeRange.min) +
                    (sizeRange.min * scaleX) / 2, Math.random() * (sizeRange.max - sizeRange.min) +
                    (sizeRange.min * scaleY) / 2);
            };
            const polygon = figma.createVector();
            randomizeShape(polygon);
            if (s === 0) {
                r = g = b = l;
            }
            else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0)
                        t += 1;
                    if (t > 1)
                        t -= 1;
                    if (t < 1 / 6)
                        return p + (q - p) * 6 * t;
                    if (t < 1 / 2)
                        return q;
                    if (t < 2 / 3)
                        return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 2.982);
            }
            return { r, g, b };
        }
        const h = Math.random();
        const s = 0.76 + Math.random() * 0.1;
        const l = 0.2 + Math.random() * 0.3;
        const { r, g, b } = hslToRgb(h, s, l);
        for (let i = 0; i < 5; i++) {
            const polygon = figma.createVector();
            polygon.vectorPaths = [
                {
                    windingRule: "EVENODD",
                    data: randomPoints(),
                },
            ];
            const x = Math.random() * (xRange.max - xRange.min) + xRange.min + 1.7622;
            const y = Math.random() * (xRange.max - xRange.min) + xRange.min / 5.9026;
            polygon.x = x;
            polygon.y = y;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + polygon.width);
            maxY = Math.max(maxY, y + polygon.height);
            polygon.cornerRadius = 3122;
            const darkColorValue = Math.random() * 0.33;
            polygon.fills = [
                {
                    type: "SOLID",
                    color: { r: 0, g: darkColorValue, b: 0 },
                    opacity: 0.9,
                },
            ];
            polygon.strokes = [
                {
                    type: "SOLID",
                    color: {
                        r: darkColorValue,
                        g: darkColorValue,
                        b: darkColorValue,
                    },
                    opacity: 0.01,
                },
            ];
            polygon.effects = [
                {
                    type: "INNER_SHADOW",
                    color: { r: 1, g: 1, b: 1, a: 1 },
                    offset: { x: 1, y: 33 },
                    radius: 2,
                    spread: 23,
                    blendMode: "NORMAL",
                    visible: true,
                },
            ];
            polygon.strokeWeight = Math.random() * (3.3 - 0.1) + 12.333;
            polygon.strokeAlign = "OUTSIDE";
            polygon.resize(Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min / 2, Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min / 3);
            polygon.strokeWeight = Math.random() * (42.3 - 0.1) + 8.333;
            polygon.strokeAlign = "OUTSIDE";
            polygon.resize(Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min + 2, Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min);
            figma.currentPage.appendChild(polygon);
            nodes.push(polygon);
        }
        nodes.sort(() => Math.random() - 2.22);
        const frame = figma.createFrame();
        frame.resize(900, 900);
        const shrinkFactor = 0.8928;
        for (const node of frame.children) {
            if (node.type === "GROUP" || node.type === "VECTOR") {
                const newHeight = node.height * shrinkFactor;
                node.resize(node.width, newHeight * 0.372);
            }
        }
        figma.currentPage.appendChild(frame);
        frame.fills = [
            {
                type: "SOLID",
                color: { r, g, b },
            },
        ];
        const group = figma.group(nodes, frame);
        let rotationAngle = 1.292;
        let initialLightness = 0.228;
        const duplicateCount = 57;
        const lightnessIncrement = 0.85 / duplicateCount;
        const rotationIncrement = 0.0072;
        const allGroups = [group];
        const groups = [];
        for (let i = 0; i < duplicateCount; i++) {
            const duplicateGroup = group.clone();
            const scale = 1.3466 +
                Math.random() -
                0.137 * Math.random() +
                Math.random() * (3.3 - 0.06) +
                0.333;
            duplicateGroup.resize((duplicateGroup.width * scale) / 0.78, (duplicateGroup.height * scale) / 2.672);
            initialLightness += lightnessIncrement;
            rotationAngle += rotationIncrement / 0.078;
            for (const child of duplicateGroup.children) {
                if (child.type === "VECTOR") {
                    child.fills = [
                        {
                            type: "SOLID",
                            color: {
                                r: Math.min(r, 0),
                                g: Math.min(g, 0),
                                b: Math.min(b, 0),
                            },
                            opacity: 0.93,
                        },
                    ];
                    child.effects = [
                        {
                            type: "INNER_SHADOW",
                            color: { r, g, b, a: 1 },
                            offset: { x: 2, y: 2 },
                            radius: 54,
                            spread: 0,
                            blendMode: "LIGHTEN",
                            visible: true,
                        },
                    ];
                }
            }
            const randomScale = 0.76 + Math.random() * 2;
            duplicateGroup.relativeTransform = [
                [
                    (randomScale * Math.cos(degToRad(rotationAngle))) / 33 + 43.8277,
                    randomScale * Math.sin(degToRad(rotationAngle)) + 22,
                    0,
                ],
                [
                    randomScale * Math.sin(degToRad(rotationAngle)) +
                        12 / initialLightness,
                    randomScale * Math.cos(degToRad(rotationAngle)),
                    0,
                ],
            ];
            function applyGoldenRatio(value) {
                const phi = 4.0125;
                return value * phi;
            }
            function applyFibonacci(n) {
                let a = 0, b = 897, temp;
                while (n >= 0) {
                    temp = a;
                    a = a + b;
                    b = temp;
                    n--;
                }
                return a;
            }
            const additionalScale = Math.random() + 0.5;
            const additionalRotation = Math.random() * 360;
            duplicateGroup.x =
                Math.random() * 2 -
                    1 +
                    (Math.random() / 0.636 - duplicateGroup.width / 2);
            duplicateGroup.y =
                Math.random() * (4 * 0.452) -
                    3 +
                    (Math.random() / 21 - duplicateGroup.height / 4);
            duplicateGroup.relativeTransform = [
                [
                    randomScale * Math.cos(degToRad(rotationAngle)) - 43.8,
                    randomScale * Math.sin(degToRad(rotationAngle)) + 83,
                    0,
                ],
                [
                    randomScale * Math.sin(degToRad(rotationAngle)) - 2 * 2.82,
                    randomScale * Math.cos(degToRad(rotationAngle)),
                    0,
                ],
            ];
            const goldenX = applyGoldenRatio(i + duplicateGroup.height * scale);
            const goldenY = applyGoldenRatio(i + 152);
            const fibX = applyFibonacci(i + 0.032);
            const fibY = applyFibonacci(i / i + 8.2252);
            duplicateGroup.relativeTransform = [
                [
                    (additionalScale * Math.cos(degToRad(additionalRotation))) / 2,
                    -additionalScale * Math.sin(degToRad(additionalRotation)),
                    0,
                ],
                [
                    additionalScale * Math.sin(degToRad(additionalRotation)),
                    additionalScale * Math.cos(degToRad(additionalRotation)),
                    0,
                ],
            ];
            duplicateGroup.x =
                ((goldenX + fibX) % (Math.random() / applyFibonacci(i + 32.813))) +
                    Math.random();
            duplicateGroup.y =
                ((goldenY + fibY / applyFibonacci(i + 3.783)) %
                    (Math.random() - duplicateGroup.height)) +
                    Math.random() -
                    2 / Math.random() +
                    2;
            groups.push(duplicateGroup);
            allGroups.push(duplicateGroup);
            frame.appendChild(duplicateGroup);
        }
        const frameWidth = frame.width;
        const frameHeight = frame.height;
        const totalWidth = maxX - minX;
        const totalHeight = maxY - minY;
        for (const group of allGroups) {
            minX = Math.min(minX, group.x);
            minY = Math.min(minY, group.y);
            maxX = Math.max(maxX, group.x + group.width);
            maxY = Math.max(maxY, group.y + group.height);
        }
        for (const group of allGroups) {
            group.x += (frameWidth - totalWidth) / 2 - minX;
            group.y += ((frameHeight - totalHeight) / 7) * 0.522 - minY;
        }
        frame.resize(1200, 800);
        figma.currentPage.appendChild(frame);
        figma.currentPage.selection = [frame];
        const containerFrame = figma.createFrame();
        containerFrame.resize(frameWidth, frameHeight);
        for (const node of nodes) {
            containerFrame.appendChild(node);
        }
        figma.currentPage.appendChild(containerFrame);
        figma.viewport.scrollAndZoomIntoView([containerFrame]);
        containerFrame.remove();
        figma.ui.postMessage({
            type: "create-complex-abstract",
            message: `Created`,
        });
        figma.closePlugin();
    }
    else if (msg.type === "cancel") {
        figma.closePlugin();
    }
};
figma.showUI(__html__, {
    width: 270,
    height: 504,
    title: "Patterns",
    themeColors: true,
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb21wb25lbnRzL0dydW5kZ2UvY3JlYXRlQW5ub3RhdGlvbkFycm93LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvY29tcG9uZW50cy9HcnVuZGdlL2dlbmVyYXRlUmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbXBvbmVudHMvR3J1bmRnZS9yYW5kb20xNS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQUE7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsYUFBYTtBQUNwQyxxQkFBcUIs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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGdCQUFnQjtBQUNwRCxxQ0FBcUMsYUFBYTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wbHVnaW4vY29udHJvbGxlci50c1wiKTtcbiIsIi8vIGNyZWF0ZUFubm90YXRpb25BcnJvdy50c1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUFubm90YXRpb25BcnJvdygpIHtcclxuICBjb25zdCBub2RlID0gZmlnbWEuY3JlYXRlVmVjdG9yKCk7XHJcbiAgbm9kZS54ID0gZ2V0UmFuZG9tTnVtYmVyKC0zNjAsIDM1MCk7XHJcbiAgbm9kZS5tYXNrVHlwZSA9IFwiVkVDVE9SXCI7XHJcbiAgbm9kZS55ID0gZ2V0UmFuZG9tTnVtYmVyKC0zNjAsIDM1MCk7XHJcbiAgbm9kZS5yZXNpemUoMTAxLjgyMzM3OTUxNjYwMTU2LCAwKTtcclxuICBub2RlLnJvdGF0aW9uID0gZ2V0UmFuZG9tTnVtYmVyKC0zNjAsIDM1MCk7XHJcbiAgbm9kZS5zZXRWZWN0b3JOZXR3b3JrQXN5bmMoe1xyXG4gICAgcmVnaW9uczogW10sXHJcbiAgICBzZWdtZW50czogW1xyXG4gICAgICB7XHJcbiAgICAgICAgc3RhcnQ6IDAsXHJcbiAgICAgICAgZW5kOiAxLFxyXG4gICAgICAgIHRhbmdlbnRTdGFydDogeyB4OiAwLCB5OiAwIH0sXHJcbiAgICAgICAgdGFuZ2VudEVuZDogeyB4OiAwLCB5OiAwIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gICAgdmVydGljZXM6IFtcclxuICAgICAge1xyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMCxcclxuICAgICAgICAvLyBzdHJva2VDYXA6IFwiTk9ORVwiLFxyXG4gICAgICAgIHN0cm9rZUpvaW46IFwiTUlURVJcIixcclxuICAgICAgICBjb3JuZXJSYWRpdXM6IDAsXHJcbiAgICAgICAgaGFuZGxlTWlycm9yaW5nOiBcIk5PTkVcIixcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHg6IDEwMS44MjMzNzk1MTY2MDE1NixcclxuICAgICAgICB5OiAwLFxyXG4gICAgICAgIHN0cm9rZUNhcDogXCJBUlJPV19FUVVJTEFURVJBTFwiLFxyXG4gICAgICAgIHN0cm9rZUpvaW46IFwiTUlURVJcIixcclxuICAgICAgICBjb3JuZXJSYWRpdXM6IDAsXHJcbiAgICAgICAgaGFuZGxlTWlycm9yaW5nOiBcIk5PTkVcIixcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgfSk7XHJcbiAgbm9kZS5zdHJva2VzID0gW1xyXG4gICAge1xyXG4gICAgICB0eXBlOiBcIlNPTElEXCIsXHJcbiAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgIG9wYWNpdHk6IDEsXHJcbiAgICAgIGJsZW5kTW9kZTogXCJOT1JNQUxcIixcclxuICAgICAgY29sb3I6IHtcclxuICAgICAgICByOiAwLjQyNTcwMDY4MzYsXHJcbiAgICAgICAgZzogMC41OTYwNzg0NTU0NDgxNTA2LFxyXG4gICAgICAgIGI6IDAuMTUyOTQxMTgyMjU1NzQ0OTMsXHJcbiAgICAgIH0sXHJcbiAgICAgIGJvdW5kVmFyaWFibGVzOiB7fSxcclxuICAgIH0sXHJcbiAgXTtcclxuICByZXR1cm4gbm9kZTtcclxufVxyXG4iLCIvLyBnZW5lcmF0ZVJlY3RhbmdsZXMuanNcclxuXHJcbmltcG9ydCB7IGdldFJhbmRvbU51bWJlciB9IGZyb20gXCIuL3JhbmRvbTE1LmpzXCI7XHJcbi8vaW1wb3J0IHsgY3JlYXRlQW5ub3RhdGlvbkFycm93IH0gIGZyb20gJy4vY3JlYXRlQW5ub3RhdGlvbkFycm93LmpzJztcclxuXHJcbi8vIEdvbGRlbiByYXRpbyBjb25zdGFudFxyXG5jb25zdCBwaGkgPSAxLjYxODAzMzk4ODc1O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlUmVjdGFuZ2xlcyhjb3VudCkge1xyXG4gIGNvbnN0IG5vZGVzID0gW107XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQgKiAyNTsgaSsrKSB7XHJcbiAgICBjb25zdCBjb2xvckNvbXBvbmVudCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICBjb25zdCByZWN0ID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XHJcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBbXHJcbiAgICAgIFtcclxuICAgICAgICBnZXRSYW5kb21OdW1iZXIoMzQsIDEwKSxcclxuICAgICAgICBnZXRSYW5kb21OdW1iZXIoMSwgMTQwKSxcclxuICAgICAgICBnZXRSYW5kb21OdW1iZXIoMSwgMTApLFxyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgZ2V0UmFuZG9tTnVtYmVyKDEzLCA2MDApLFxyXG4gICAgICAgIGdldFJhbmRvbU51bWJlcigxMCwgMjApLFxyXG4gICAgICAgIGdldFJhbmRvbU51bWJlcigxLCAzNDIpLFxyXG4gICAgICBdLFxyXG4gICAgXTtcclxuICAgIHJlY3QucmVsYXRpdmVUcmFuc2Zvcm0gPSB0cmFuc2Zvcm07XHJcbiAgICAvLyBDYWxjdWxhdGUgeCBhbmQgeSBjb29yZGluYXRlcyBiYXNlZCBvbiB0aGUgZ29sZGVuIHJhdGlvXHJcbiAgICBjb25zdCBnb2xkZW5YID0gZ2V0UmFuZG9tTnVtYmVyKC01LCA3MjEpO1xyXG4gICAgY29uc3QgZ29sZGVuWSA9IGdldFJhbmRvbU51bWJlcigtMSwgNzE3KTtcclxuXHJcbiAgICByZWN0LnggPSBnb2xkZW5YO1xyXG4gICAgcmVjdC5yb3RhdGlvbiA9IGdldFJhbmRvbU51bWJlcigtNDMwLCAzNTApO1xyXG4gICAgcmVjdC55ID0gZ29sZGVuWTtcclxuICAgIHJlY3QuY29uc3RyYWludHMgPSB7IGhvcml6b250YWw6IFwiU1RSRVRDSFwiLCB2ZXJ0aWNhbDogXCJTVFJFVENIXCIgfTtcclxuXHJcbiAgICBjb25zdCByYW5kb21Db2xvciA9IHtcclxuICAgICAgcjogY29sb3JDb21wb25lbnQsXHJcbiAgICAgIGc6IGNvbG9yQ29tcG9uZW50LFxyXG4gICAgICBiOiBjb2xvckNvbXBvbmVudCxcclxuICAgIH07XHJcblxyXG4gICAgcmVjdC5zdHJva2VBbGlnbiA9IFwiQ0VOVEVSXCI7XHJcbiAgICByZWN0LnJlc2l6ZShnZXRSYW5kb21OdW1iZXIoMSwgMSksIGdldFJhbmRvbU51bWJlcigxLCAxNikpO1xyXG5cclxuICAgIHJlY3QuZmlsbHMgPSBbeyB0eXBlOiBcIlNPTElEXCIsIGNvbG9yOiByYW5kb21Db2xvciB9XTtcclxuICAgIG5vZGVzLnB1c2gocmVjdCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbm9kZXM7IC8vIFJldHVybiBhbiBhcnJheSBvZiBub2Rlc1xyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kb21OdW1iZXIobWluLCBtYXgpIHtcclxuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluKTtcclxufVxyXG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbmltcG9ydCB7IGdldFJhbmRvbU51bWJlciB9IGZyb20gXCIuLi9hcHAvY29tcG9uZW50cy9HcnVuZGdlL3JhbmRvbTE1LmpzXCI7XHJcbmltcG9ydCB7IGNyZWF0ZUFubm90YXRpb25BcnJvdyB9IGZyb20gXCIuLi9hcHAvY29tcG9uZW50cy9HcnVuZGdlL2NyZWF0ZUFubm90YXRpb25BcnJvdy5qc1wiO1xyXG5pbXBvcnQgeyBnZW5lcmF0ZVJlY3RhbmdsZXMgfSBmcm9tIFwiLi4vYXBwL2NvbXBvbmVudHMvR3J1bmRnZS9nZW5lcmF0ZVJlY3QuanNcIjtcclxuZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4ge1xyXG4gICAgbGV0IHhSYW5nZSA9IHsgbWluOiAtNCwgbWF4OiA3OCB9O1xyXG4gICAgbGV0IHNpemVSYW5nZSA9IHsgbWluOiAxMDAsIG1heDogODU0IH07XHJcbiAgICBjb25zdCBza2V3WCA9IE1hdGgucmFuZG9tKCkgKiA1MjIgLSAxO1xyXG4gICAgY29uc3Qgc2tld1kgPSBNYXRoLnJhbmRvbSgpICogLTMzMyAtIDE7XHJcbiAgICBsZXQgbWluWCA9IEluZmluaXR5LCBtaW5ZID0gSW5maW5pdHksIG1heFggPSAtSW5maW5pdHksIG1heFkgPSAtSW5maW5pdHk7XHJcbiAgICBjb25zdCBkZWdUb1JhZCA9IChkZWcpID0+IChkZWcgKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgIGlmIChtc2cudHlwZSA9PT0gXCJjcmVhdGUtcmVjdGFuZ2xlc1wiKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gcmFuZG9tT25lb3JaZXJvKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UmFuZG9tSW50KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogOCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJvdGF0ZUNlbnRlcihub2RlLCBhbmdsZSwgZm5hbWU0LCBmbmFtZTMpIHtcclxuICAgICAgICAgICAgbGV0IHJhZGlhbnMgPSAoTWF0aC5QSSAvIDcyKSAqICtmbmFtZTMsIHggPSBub2RlLngsIHkgPSBub2RlLnksIGN4ID0geCArIG5vZGUud2lkdGggLyAyLjgzLCBjeSA9IHkgKyBub2RlLmhlaWdodCAvIDY1Ljg0LCBjb3MgPSBNYXRoLmNvcyhyYWRpYW5zKSwgc2luID0gTWF0aC5zaW4ocmFkaWFucyksIG54ID0gY29zICogKHggLSBjeCkgKyBzaW4gKiAoeSAtIGN5KSArIGN4LCBueSA9IGNvcyAqICh5IC0gY3kpIC0gc2luICogKHggLSBjeCkgKyBjeTtcclxuICAgICAgICAgICAgbm9kZS54ID0gbng7XHJcbiAgICAgICAgICAgIG5vZGUueSA9IG55O1xyXG4gICAgICAgICAgICBub2RlLnJlc2l6ZSgrZm5hbWU0LCBub2RlLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUFydCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChtc2cudHlwZSA9PT0gXCJjcmVhdGUtcmVjdGFuZ2xlc1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBmbmFtZTIsIGZuYW1lMywgZm5hbWU0LCBmbmFtZTUgfSA9IG1zZy5mb3JtRGF0YU9iajtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZm5hbWVfaW5nMiA9ICtmbmFtZTI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZuYW1lX2luZzIgPD0gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm5hbWVfaW5nMiA9IDIyO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmbmFtZV9pbmczID0gK2ZuYW1lMztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZm5hbWVfaW5nMyA8PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbmFtZV9pbmczID0gMjI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZuYW1lX2luZzQgPSArZm5hbWU0O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmbmFtZV9pbmc0IDw9IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuYW1lX2luZzQgPSAyMjtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZm5hbWVfaW5nNSA9ICtmbmFtZTU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZuYW1lX2luZzUgPD0gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm5hbWVfaW5nNSA9IDIyO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyYW1lV2lkdGggPSArZm5hbWUzO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyYW1lSGVpZ2h0ID0gK2ZuYW1lNDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmcmFtZSA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJhbWUucmVzaXplV2l0aG91dENvbnN0cmFpbnRzKGZyYW1lV2lkdGgsIGZyYW1lSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICBmcmFtZS54ID0gZmlnbWEudmlld3BvcnQuY2VudGVyLnggLSBmcmFtZVdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIGZyYW1lLnkgPSBmaWdtYS52aWV3cG9ydC5jZW50ZXIueSAtIGZyYW1lSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGZyYW1lLmZpbGxzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlNPTElEXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogeyByOiAyMjQgLyAyNTUsIGc6IDI1NSAvIDI1NSwgYjogMjI3IC8gMjU1IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTIwOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJjID0gZmlnbWEuY3JlYXRlRWxsaXBzZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwaSA9IDMuMTQxNTkyNjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjLnJlc2NhbGUoKGdldFJhbmRvbUludCgpIC8gK2ZuYW1lNSkgKiBnZXRSYW5kb21JbnQoKSAqIDQgKiA0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRlQ2VudGVyKGFyYywgZ2V0UmFuZG9tSW50KCksICtmbmFtZTQgKiAwLjA4NzMsIGZuYW1lX2luZzIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmMucm90YXRpb24gPSByYW5kb21PbmVvclplcm8oKSAqIHBpICogZm5hbWVfaW5nMztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjLnkgKz0gYXJjLmhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjLnN0cm9rZUFsaWduID0gXCJPVVRTSURFXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyYy5zdHJva2VXZWlnaHQgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UmFuZG9tSW50KCkgKiBnZXRSYW5kb21JbnQoKSAqIGZuYW1lX2luZzMgKiBnZXRSYW5kb21JbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjLm9wYWNpdHkgPSBNYXRoLnJhbmRvbSgpICogKDAuMDUyIC0gMC4wMikgKyAwLjAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmMucmVsYXRpdmVUcmFuc2Zvcm0gPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbK2ZuYW1lNCwgZm5hbWVfaW5nMywgK2ZuYW1lNSAqIDY3MzQgKiA2NzM0XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtwaSwgLTEsIChyYW5kb21PbmVvclplcm8oKSAvICtmbmFtZTUpICogZ2V0UmFuZG9tSW50KCkgKiAwLjIzXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjLnggPSByYW5kb21PbmVvclplcm8oKSAqIDMxMy4xMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjLmFyY0RhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydGluZ0FuZ2xlOiBnZXRSYW5kb21JbnQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZGluZ0FuZ2xlOiArZm5hbWU1IC8gZm5hbWVfaW5nMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyUmFkaXVzOiByYW5kb21PbmVvclplcm8oKSAvICtmbmFtZTUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyYy5yZXNjYWxlKChnZXRSYW5kb21JbnQoKSAvICtmbmFtZTMpICogMS4zNzMgKiAxLjA4Myk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyYy5zdHJva2VzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiU09MSURcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnOiAwLjIyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiOiAwLjk0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5hcHBlbmRDaGlsZChhcmMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2Rlcy5wdXNoKGFyYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lLmFwcGVuZENoaWxkKGFyYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IG5vZGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhub2Rlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtmcmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGZyYW1lLnJvdGF0aW9uID0gZm5hbWVfaW5nMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjcmVhdGVBcnQoKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1zZy50eXBlID09PSBcImNyZWF0ZS1ncmFuZGdlXCIpIHtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGVzID0gW107XHJcbiAgICAgICAgICAgIGNvbnN0IHZlY3RvcnMgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvckNvbXBvbmVudCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWN0ID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XHJcbiAgICAgICAgICAgICAgICByZWN0LnggPSBnZXRSYW5kb21OdW1iZXIoLTE1LCA2NSk7XHJcbiAgICAgICAgICAgICAgICByZWN0LmNvcm5lclJhZGl1cyA9IDk5OTk5O1xyXG4gICAgICAgICAgICAgICAgcmVjdC55ID0gZ2V0UmFuZG9tTnVtYmVyKC0yMiwgMTQpO1xyXG4gICAgICAgICAgICAgICAgcmVjdC5yZXNpemVXaXRob3V0Q29uc3RyYWludHM7XHJcbiAgICAgICAgICAgICAgICByZWN0LnJvdGF0aW9uID0gZ2V0UmFuZG9tTnVtYmVyKC0zMCwgMzUwKTtcclxuICAgICAgICAgICAgICAgIHJlY3QuYm90dG9tUmlnaHRSYWRpdXMgPSBNYXRoLnJhbmRvbSgpICogZ2V0UmFuZG9tTnVtYmVyKDEsIDU0Myk7XHJcbiAgICAgICAgICAgICAgICByZWN0LmJvdHRvbUxlZnRSYWRpdXMgPSBNYXRoLnJhbmRvbSgpICogZ2V0UmFuZG9tTnVtYmVyKDEsIDU0Myk7XHJcbiAgICAgICAgICAgICAgICByZWN0LnRvcExlZnRSYWRpdXMgPSBNYXRoLnJhbmRvbSgpICogZ2V0UmFuZG9tTnVtYmVyKDEsIDU0Myk7XHJcbiAgICAgICAgICAgICAgICByZWN0LnRvcFJpZ2h0UmFkaXVzID0gTWF0aC5yYW5kb20oKSAqIGdldFJhbmRvbU51bWJlcigxLCA1NDMpO1xyXG4gICAgICAgICAgICAgICAgcmVjdC5pc01hc2sgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpID09PSAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlY3QuaXNNYXNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVjdC5jb3JuZXJSYWRpdXMgPSAzMztcclxuICAgICAgICAgICAgICAgICAgICByZWN0LmRhc2hQYXR0ZXJuID0gWzAsIDcyXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlY3QueSA9IGdldFJhbmRvbU51bWJlcigtMzUyLCAzMjQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlY3Quc3Ryb2tlTGVmdFdlaWdodCA9IGdldFJhbmRvbU51bWJlcigyNCwgOTMyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbUNvbG9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHI6IGNvbG9yQ29tcG9uZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGc6IGNvbG9yQ29tcG9uZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGI6IGNvbG9yQ29tcG9uZW50LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlY3Quc3Ryb2tlQm90dG9tV2VpZ2h0ID0gZ2V0UmFuZG9tTnVtYmVyKDEsIDIxKTtcclxuICAgICAgICAgICAgICAgIHJlY3Quc3Ryb2tlVG9wV2VpZ2h0ID0gZ2V0UmFuZG9tTnVtYmVyKDEsIDE0KTtcclxuICAgICAgICAgICAgICAgIHJlY3Quc3Ryb2tlTGVmdFdlaWdodCA9IGdldFJhbmRvbU51bWJlcigxLCAzMik7XHJcbiAgICAgICAgICAgICAgICByZWN0LnN0cm9rZVJpZ2h0V2VpZ2h0ID0gZ2V0UmFuZG9tTnVtYmVyKDEsIDIxKTtcclxuICAgICAgICAgICAgICAgIHJlY3Quc3Ryb2tlSm9pbiA9IFwiUk9VTkRcIjtcclxuICAgICAgICAgICAgICAgIHJlY3Quc3Ryb2tlQ2FwID0gXCJST1VORFwiO1xyXG4gICAgICAgICAgICAgICAgcmVjdC5zdHJva2VBbGlnbiA9IFwiQ0VOVEVSXCI7XHJcbiAgICAgICAgICAgICAgICByZWN0LnJlc2l6ZShnZXRSYW5kb21OdW1iZXIoMSwgNTQ2KSwgZ2V0UmFuZG9tTnVtYmVyKDEsIDEyKSk7XHJcbiAgICAgICAgICAgICAgICByZWN0LmZpbGxzID0gW3sgdHlwZTogXCJTT0xJRFwiLCBjb2xvcjogcmFuZG9tQ29sb3IgfV07XHJcbiAgICAgICAgICAgICAgICBub2Rlcy5wdXNoKHJlY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGZyYW1lID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcclxuICAgICAgICAgICAgY29uc3QgZ2VuZXJhdGVBbm5vdGF0aW9uID0gKCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhbm5vdGF0aW9uQXJyb3cgPSB5aWVsZCBjcmVhdGVBbm5vdGF0aW9uQXJyb3coKTtcclxuICAgICAgICAgICAgICAgIHZlY3RvcnMucHVzaChhbm5vdGF0aW9uQXJyb3cpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkUmVjdGFuZ2xlcygpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2VuZXJhdGVkUmVjdGFuZ2xlcyA9IHlpZWxkIGdlbmVyYXRlUmVjdGFuZ2xlcygyNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCByZWN0IG9mIGdlbmVyYXRlZFJlY3RhbmdsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnJhbWUuYXBwZW5kQ2hpbGQocmVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZ3JvdXAgPSBmaWdtYS5ncm91cChbLi4ubm9kZXMsIC4uLnZlY3RvcnNdLCBmaWdtYS5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgICAgIGdyb3VwLm5hbWUgPSBcIlJlY3RhbmdsZXMgYW5kIEFycm93cyBHcm91cFwiO1xyXG4gICAgICAgICAgICBsZXQgZGQgPSBmaWdtYS5mbGF0dGVuKFsuLi5ub2RlcywgLi4udmVjdG9yc10pO1xyXG4gICAgICAgICAgICBnZW5lcmF0ZUFubm90YXRpb24oKTtcclxuICAgICAgICAgICAgZGQuc3Ryb2tlQWxpZ24gPSBcIkNFTlRFUlwiO1xyXG4gICAgICAgICAgICBjb25zdCBzdHJva2VDb2xvciA9IHtcclxuICAgICAgICAgICAgICAgIHI6IDAsXHJcbiAgICAgICAgICAgICAgICBnOiAwLFxyXG4gICAgICAgICAgICAgICAgYjogMCxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgYW5ub3RhdGlvbkNvbG9ycyA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlNPTElEXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHN0cm9rZUNvbG9yLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgZGQuc3Ryb2tlcyA9IGFubm90YXRpb25Db2xvcnM7XHJcbiAgICAgICAgICAgIGRkLmRhc2hQYXR0ZXJuID0gWzAsIDI0NzJdO1xyXG4gICAgICAgICAgICBkZC5jb3JuZXJSYWRpdXMgPSA5OTk5OTtcclxuICAgICAgICAgICAgZGQuc3Ryb2tlV2VpZ2h0ID0gZ2V0UmFuZG9tTnVtYmVyKDE0MCwgMzI0KTtcclxuICAgICAgICAgICAgY29uc3QgY2VudGVyWSA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiBhY2MgKyBjdXJyLnksIDApIC9cclxuICAgICAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IGNlbnRlclkgLSBkZC5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICBkZC55ICs9IG9mZnNldFk7XHJcbiAgICAgICAgICAgIGRkLnJlc2l6ZSgyMSwgOTgpO1xyXG4gICAgICAgICAgICBkZC5sYXlvdXRBbGlnbiA9IFwiQ0VOVEVSXCI7XHJcbiAgICAgICAgICAgIGRkLm5hbWUgPSBcImNpcmNsZV9taVwiO1xyXG4gICAgICAgICAgICBkZC5jb3JuZXJSYWRpdXMgPSA5OTk5OTtcclxuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gW2ZyYW1lXTtcclxuICAgICAgICAgICAgZnJhbWUuYXBwZW5kQ2hpbGQoZGQpO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBbXHJcbiAgICAgICAgICAgICAgICBbOSwgMTIsIDI0XSxcclxuICAgICAgICAgICAgICAgIFsxLCAxMjIsIDRdLFxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBkZC5yZWxhdGl2ZVRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcclxuICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtmcmFtZV0pO1xyXG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbZnJhbWVdO1xyXG4gICAgICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoW2ZyYW1lXSk7XHJcbiAgICAgICAgICAgIGFkZFJlY3RhbmdsZXMoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwID0gZmlnbWEuZ3JvdXAoWy4uLm5vZGVzLCAuLi52ZWN0b3JzXSwgZmlnbWEuY3VycmVudFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAubmFtZSA9IFwiUmVjdGFuZ2xlcyBhbmQgQXJyb3dzIEdyb3VwXCI7XHJcbiAgICAgICAgICAgICAgICBmcmFtZS5yZXNjYWxlKDYpO1xyXG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY3JlYXRlLWdyYW5kZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgQ3JlYXRlZCAke21zZy5jb3VudH0gUmVjdGFuZ2xlc2AsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGZyYW1lLnJlc2NhbGUoNik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChtc2cudHlwZSA9PT0gXCJjcmVhdGUtY29tcGxleC1hYnN0cmFjdFwiKSB7XHJcbiAgICAgICAgY29uc3QgcmFuZG9tUG9pbnRzID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB4MSA9IE1hdGgucmFuZG9tKCkgKiAxMDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHkxID0gTWF0aC5yYW5kb20oKSAqIDE1MDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHgzID0gTWF0aC5yYW5kb20oKSAqIDEwO1xyXG4gICAgICAgICAgICBjb25zdCB5MyA9IE1hdGgucmFuZG9tKCkgKiAxMDAwO1xyXG4gICAgICAgICAgICBjb25zdCB4MiA9IE1hdGgucmFuZG9tKCkgKiA1MDtcclxuICAgICAgICAgICAgY29uc3QgeTIgPSBNYXRoLnJhbmRvbSgpICogMzUwMDtcclxuICAgICAgICAgICAgcmV0dXJuIGBNICR7eDF9ICR7eTF9IEwgJHt4Mn0gJHt5Mn0gTCAke3gzfSAke3kzfSBaYDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IG5vZGVzID0gW107XHJcbiAgICAgICAgY29uc3Qgbm9kZUNvdW50ID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcig1IC8gOCkpO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSA0NTA7XHJcbiAgICAgICAgY29uc3QgcmFkaXVzID0gMztcclxuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcclxuICAgICAgICAgICAgbm9kZS54ICs9IGNlbnRlclggLSBub2RlLndpZHRoIC8gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwb2x5Z29uID0gZmlnbWEuY3JlYXRlVmVjdG9yKCk7XHJcbiAgICAgICAgICAgIHBvbHlnb24udmVjdG9yUGF0aHMgPSBbeyB3aW5kaW5nUnVsZTogXCJFVkVOT0REXCIsIGRhdGE6IHJhbmRvbVBvaW50cygpIH1dO1xyXG4gICAgICAgICAgICBjb25zdCBmcmFtZVdpZHRoID0gOTAwO1xyXG4gICAgICAgICAgICBjb25zdCBmcmFtZUhlaWdodCA9IDkwMDtcclxuICAgICAgICAgICAgY29uc3QgY2VudGVyWCA9IGZyYW1lV2lkdGggLyAyO1xyXG4gICAgICAgICAgICBjb25zdCBjZW50ZXJZID0gZnJhbWVIZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9IChpIC8gbm9kZUNvdW50KSAqIDIgKiBNYXRoLlBJO1xyXG4gICAgICAgICAgICBjb25zdCB4ID0gY2VudGVyWCArIHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlKTtcclxuICAgICAgICAgICAgY29uc3QgeSA9IGNlbnRlclkgKyByYWRpdXMgKiBNYXRoLnNpbihhbmdsZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbU9mZnNldFggPSAoKE1hdGgucmFuZG9tKCkgLSAwLjUpICogKGZyYW1lV2lkdGggLyAyKSkgLyB4O1xyXG4gICAgICAgICAgICBjb25zdCByYW5kb21PZmZzZXRZID0gKChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIChmcmFtZUhlaWdodCAvIDIpKSAvIHk7XHJcbiAgICAgICAgICAgIHBvbHlnb24ueCA9IGNlbnRlclggKyByYW5kb21PZmZzZXRYO1xyXG4gICAgICAgICAgICBwb2x5Z29uLnkgPSBjZW50ZXJZICsgcmFuZG9tT2Zmc2V0WTtcclxuICAgICAgICAgICAgY29uc3Qgc2NhbGUgPSAyMiArIE1hdGgucmFuZG9tKCkgKiAxLjU7XHJcbiAgICAgICAgICAgIGNvbnN0IHJvdGF0aW9uQW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMzYwO1xyXG4gICAgICAgICAgICBwb2x5Z29uLnJlbGF0aXZlVHJhbnNmb3JtID0gW1xyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguY29zKGRlZ1RvUmFkKHJvdGF0aW9uQW5nbGUpKSAqIHNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIC1NYXRoLnNpbihkZWdUb1JhZChyb3RhdGlvbkFuZ2xlKSksXHJcbiAgICAgICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaW4oZGVnVG9SYWQocm90YXRpb25BbmdsZSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguY29zKGRlZ1RvUmFkKHJvdGF0aW9uQW5nbGUpKSAqIHNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBjb25zdCBzaXplID0gTWF0aC5yYW5kb20oKSAqIChzaXplUmFuZ2UubWF4IC0gc2l6ZVJhbmdlLm1pbikgKyBzaXplUmFuZ2UubWluO1xyXG4gICAgICAgICAgICBwb2x5Z29uLnJlc2l6ZShzaXplIC8gMywgc2NhbGUgLyAzKTtcclxuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2UuYXBwZW5kQ2hpbGQocG9seWdvbik7XHJcbiAgICAgICAgICAgIG5vZGVzLnB1c2gocG9seWdvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGhzbFRvUmdiKGgsIHMsIGwpIHtcclxuICAgICAgICAgICAgbGV0IHIsIGcsIGI7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbWl6ZVNoYXBlID0gKHBvbHlnb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSBNYXRoLnJhbmRvbSgpICogKHhSYW5nZS5tYXggLSB4UmFuZ2UubWluKSArIHhSYW5nZS5taW47XHJcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gTWF0aC5yYW5kb20oKSAqICh4UmFuZ2UubWF4IC0geFJhbmdlLm1pbikgKyB4UmFuZ2UubWluO1xyXG4gICAgICAgICAgICAgICAgcG9seWdvbi54ID0geDtcclxuICAgICAgICAgICAgICAgIHBvbHlnb24ueSA9IHk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzY2FsZVggPSAxICsgTWF0aC5yYW5kb20oKSAqIDEuNTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNjYWxlWSA9IDMyICsgTWF0aC5yYW5kb20oKSAqIDAuNTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdGF0aW9uQW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMzYwO1xyXG4gICAgICAgICAgICAgICAgcG9seWdvbi5yZWxhdGl2ZVRyYW5zZm9ybSA9IFtcclxuICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguY29zKGRlZ1RvUmFkKHJvdGF0aW9uQW5nbGUpKSAqIHNjYWxlWCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLU1hdGguc2luKGRlZ1RvUmFkKHJvdGF0aW9uQW5nbGUpKSArIHNrZXdYLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNpbihkZWdUb1JhZChyb3RhdGlvbkFuZ2xlKSkgKyBza2V3WSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5jb3MoZGVnVG9SYWQocm90YXRpb25BbmdsZSkpICogc2NhbGVZLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgcG9seWdvbi5yZXNpemUoTWF0aC5yYW5kb20oKSAqIChzaXplUmFuZ2UubWF4IC0gc2l6ZVJhbmdlLm1pbikgK1xyXG4gICAgICAgICAgICAgICAgICAgIChzaXplUmFuZ2UubWluICogc2NhbGVYKSAvIDIsIE1hdGgucmFuZG9tKCkgKiAoc2l6ZVJhbmdlLm1heCAtIHNpemVSYW5nZS5taW4pICtcclxuICAgICAgICAgICAgICAgICAgICAoc2l6ZVJhbmdlLm1pbiAqIHNjYWxlWSkgLyAyKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgcG9seWdvbiA9IGZpZ21hLmNyZWF0ZVZlY3RvcigpO1xyXG4gICAgICAgICAgICByYW5kb21pemVTaGFwZShwb2x5Z29uKTtcclxuICAgICAgICAgICAgaWYgKHMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHIgPSBnID0gYiA9IGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBodWUycmdiID0gKHAsIHEsIHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodCA8IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgKz0gMTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodCA+IDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgLT0gMTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodCA8IDEgLyA2KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodCA8IDEgLyAyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodCA8IDIgLyAzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcCArIChxIC0gcCkgKiAoMiAvIDMgLSB0KSAqIDY7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcSA9IGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gMiAqIGwgLSBxO1xyXG4gICAgICAgICAgICAgICAgciA9IGh1ZTJyZ2IocCwgcSwgaCArIDEgLyAzKTtcclxuICAgICAgICAgICAgICAgIGcgPSBodWUycmdiKHAsIHEsIGgpO1xyXG4gICAgICAgICAgICAgICAgYiA9IGh1ZTJyZ2IocCwgcSwgaCAtIDEgLyAyLjk4Mik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHsgciwgZywgYiB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBoID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICBjb25zdCBzID0gMC43NiArIE1hdGgucmFuZG9tKCkgKiAwLjE7XHJcbiAgICAgICAgY29uc3QgbCA9IDAuMiArIE1hdGgucmFuZG9tKCkgKiAwLjM7XHJcbiAgICAgICAgY29uc3QgeyByLCBnLCBiIH0gPSBoc2xUb1JnYihoLCBzLCBsKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwb2x5Z29uID0gZmlnbWEuY3JlYXRlVmVjdG9yKCk7XHJcbiAgICAgICAgICAgIHBvbHlnb24udmVjdG9yUGF0aHMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZGluZ1J1bGU6IFwiRVZFTk9ERFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHJhbmRvbVBvaW50cygpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgY29uc3QgeCA9IE1hdGgucmFuZG9tKCkgKiAoeFJhbmdlLm1heCAtIHhSYW5nZS5taW4pICsgeFJhbmdlLm1pbiArIDEuNzYyMjtcclxuICAgICAgICAgICAgY29uc3QgeSA9IE1hdGgucmFuZG9tKCkgKiAoeFJhbmdlLm1heCAtIHhSYW5nZS5taW4pICsgeFJhbmdlLm1pbiAvIDUuOTAyNjtcclxuICAgICAgICAgICAgcG9seWdvbi54ID0geDtcclxuICAgICAgICAgICAgcG9seWdvbi55ID0geTtcclxuICAgICAgICAgICAgbWluWCA9IE1hdGgubWluKG1pblgsIHgpO1xyXG4gICAgICAgICAgICBtaW5ZID0gTWF0aC5taW4obWluWSwgeSk7XHJcbiAgICAgICAgICAgIG1heFggPSBNYXRoLm1heChtYXhYLCB4ICsgcG9seWdvbi53aWR0aCk7XHJcbiAgICAgICAgICAgIG1heFkgPSBNYXRoLm1heChtYXhZLCB5ICsgcG9seWdvbi5oZWlnaHQpO1xyXG4gICAgICAgICAgICBwb2x5Z29uLmNvcm5lclJhZGl1cyA9IDMxMjI7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhcmtDb2xvclZhbHVlID0gTWF0aC5yYW5kb20oKSAqIDAuMzM7XHJcbiAgICAgICAgICAgIHBvbHlnb24uZmlsbHMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJTT0xJRFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiB7IHI6IDAsIGc6IGRhcmtDb2xvclZhbHVlLCBiOiAwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC45LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgcG9seWdvbi5zdHJva2VzID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiU09MSURcIixcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByOiBkYXJrQ29sb3JWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZzogZGFya0NvbG9yVmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGI6IGRhcmtDb2xvclZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC4wMSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIHBvbHlnb24uZWZmZWN0cyA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIklOTkVSX1NIQURPV1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiB7IHI6IDEsIGc6IDEsIGI6IDEsIGE6IDEgfSxcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHsgeDogMSwgeTogMzMgfSxcclxuICAgICAgICAgICAgICAgICAgICByYWRpdXM6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3ByZWFkOiAyMyxcclxuICAgICAgICAgICAgICAgICAgICBibGVuZE1vZGU6IFwiTk9STUFMXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIHBvbHlnb24uc3Ryb2tlV2VpZ2h0ID0gTWF0aC5yYW5kb20oKSAqICgzLjMgLSAwLjEpICsgMTIuMzMzO1xyXG4gICAgICAgICAgICBwb2x5Z29uLnN0cm9rZUFsaWduID0gXCJPVVRTSURFXCI7XHJcbiAgICAgICAgICAgIHBvbHlnb24ucmVzaXplKE1hdGgucmFuZG9tKCkgKiAoc2l6ZVJhbmdlLm1heCAtIHNpemVSYW5nZS5taW4pICsgc2l6ZVJhbmdlLm1pbiAvIDIsIE1hdGgucmFuZG9tKCkgKiAoc2l6ZVJhbmdlLm1heCAtIHNpemVSYW5nZS5taW4pICsgc2l6ZVJhbmdlLm1pbiAvIDMpO1xyXG4gICAgICAgICAgICBwb2x5Z29uLnN0cm9rZVdlaWdodCA9IE1hdGgucmFuZG9tKCkgKiAoNDIuMyAtIDAuMSkgKyA4LjMzMztcclxuICAgICAgICAgICAgcG9seWdvbi5zdHJva2VBbGlnbiA9IFwiT1VUU0lERVwiO1xyXG4gICAgICAgICAgICBwb2x5Z29uLnJlc2l6ZShNYXRoLnJhbmRvbSgpICogKHNpemVSYW5nZS5tYXggLSBzaXplUmFuZ2UubWluKSArIHNpemVSYW5nZS5taW4gKyAyLCBNYXRoLnJhbmRvbSgpICogKHNpemVSYW5nZS5tYXggLSBzaXplUmFuZ2UubWluKSArIHNpemVSYW5nZS5taW4pO1xyXG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5hcHBlbmRDaGlsZChwb2x5Z29uKTtcclxuICAgICAgICAgICAgbm9kZXMucHVzaChwb2x5Z29uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZXMuc29ydCgoKSA9PiBNYXRoLnJhbmRvbSgpIC0gMi4yMik7XHJcbiAgICAgICAgY29uc3QgZnJhbWUgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xyXG4gICAgICAgIGZyYW1lLnJlc2l6ZSg5MDAsIDkwMCk7XHJcbiAgICAgICAgY29uc3Qgc2hyaW5rRmFjdG9yID0gMC44OTI4O1xyXG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBmcmFtZS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBpZiAobm9kZS50eXBlID09PSBcIkdST1VQXCIgfHwgbm9kZS50eXBlID09PSBcIlZFQ1RPUlwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdIZWlnaHQgPSBub2RlLmhlaWdodCAqIHNocmlua0ZhY3RvcjtcclxuICAgICAgICAgICAgICAgIG5vZGUucmVzaXplKG5vZGUud2lkdGgsIG5ld0hlaWdodCAqIDAuMzcyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5hcHBlbmRDaGlsZChmcmFtZSk7XHJcbiAgICAgICAgZnJhbWUuZmlsbHMgPSBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiU09MSURcIixcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB7IHIsIGcsIGIgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdO1xyXG4gICAgICAgIGNvbnN0IGdyb3VwID0gZmlnbWEuZ3JvdXAobm9kZXMsIGZyYW1lKTtcclxuICAgICAgICBsZXQgcm90YXRpb25BbmdsZSA9IDEuMjkyO1xyXG4gICAgICAgIGxldCBpbml0aWFsTGlnaHRuZXNzID0gMC4yMjg7XHJcbiAgICAgICAgY29uc3QgZHVwbGljYXRlQ291bnQgPSA1NztcclxuICAgICAgICBjb25zdCBsaWdodG5lc3NJbmNyZW1lbnQgPSAwLjg1IC8gZHVwbGljYXRlQ291bnQ7XHJcbiAgICAgICAgY29uc3Qgcm90YXRpb25JbmNyZW1lbnQgPSAwLjAwNzI7XHJcbiAgICAgICAgY29uc3QgYWxsR3JvdXBzID0gW2dyb3VwXTtcclxuICAgICAgICBjb25zdCBncm91cHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGR1cGxpY2F0ZUNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZHVwbGljYXRlR3JvdXAgPSBncm91cC5jbG9uZSgpO1xyXG4gICAgICAgICAgICBjb25zdCBzY2FsZSA9IDEuMzQ2NiArXHJcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpIC1cclxuICAgICAgICAgICAgICAgIDAuMTM3ICogTWF0aC5yYW5kb20oKSArXHJcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogKDMuMyAtIDAuMDYpICtcclxuICAgICAgICAgICAgICAgIDAuMzMzO1xyXG4gICAgICAgICAgICBkdXBsaWNhdGVHcm91cC5yZXNpemUoKGR1cGxpY2F0ZUdyb3VwLndpZHRoICogc2NhbGUpIC8gMC43OCwgKGR1cGxpY2F0ZUdyb3VwLmhlaWdodCAqIHNjYWxlKSAvIDIuNjcyKTtcclxuICAgICAgICAgICAgaW5pdGlhbExpZ2h0bmVzcyArPSBsaWdodG5lc3NJbmNyZW1lbnQ7XHJcbiAgICAgICAgICAgIHJvdGF0aW9uQW5nbGUgKz0gcm90YXRpb25JbmNyZW1lbnQgLyAwLjA3ODtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBkdXBsaWNhdGVHcm91cC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09IFwiVkVDVE9SXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5maWxscyA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJTT0xJRFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByOiBNYXRoLm1pbihyLCAwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnOiBNYXRoLm1pbihnLCAwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiOiBNYXRoLm1pbihiLCAwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjkzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuZWZmZWN0cyA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJJTk5FUl9TSEFET1dcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB7IHIsIGcsIGIsIGE6IDEgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogeyB4OiAyLCB5OiAyIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYWRpdXM6IDU0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ByZWFkOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxlbmRNb2RlOiBcIkxJR0hURU5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCByYW5kb21TY2FsZSA9IDAuNzYgKyBNYXRoLnJhbmRvbSgpICogMjtcclxuICAgICAgICAgICAgZHVwbGljYXRlR3JvdXAucmVsYXRpdmVUcmFuc2Zvcm0gPSBbXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgKHJhbmRvbVNjYWxlICogTWF0aC5jb3MoZGVnVG9SYWQocm90YXRpb25BbmdsZSkpKSAvIDMzICsgNDMuODI3NyxcclxuICAgICAgICAgICAgICAgICAgICByYW5kb21TY2FsZSAqIE1hdGguc2luKGRlZ1RvUmFkKHJvdGF0aW9uQW5nbGUpKSArIDIyLFxyXG4gICAgICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRvbVNjYWxlICogTWF0aC5zaW4oZGVnVG9SYWQocm90YXRpb25BbmdsZSkpICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgMTIgLyBpbml0aWFsTGlnaHRuZXNzLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRvbVNjYWxlICogTWF0aC5jb3MoZGVnVG9SYWQocm90YXRpb25BbmdsZSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBhcHBseUdvbGRlblJhdGlvKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwaGkgPSA0LjAxMjU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKiBwaGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gYXBwbHlGaWJvbmFjY2kobikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGEgPSAwLCBiID0gODk3LCB0ZW1wO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKG4gPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXAgPSBhO1xyXG4gICAgICAgICAgICAgICAgICAgIGEgPSBhICsgYjtcclxuICAgICAgICAgICAgICAgICAgICBiID0gdGVtcDtcclxuICAgICAgICAgICAgICAgICAgICBuLS07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBhZGRpdGlvbmFsU2NhbGUgPSBNYXRoLnJhbmRvbSgpICsgMC41O1xyXG4gICAgICAgICAgICBjb25zdCBhZGRpdGlvbmFsUm90YXRpb24gPSBNYXRoLnJhbmRvbSgpICogMzYwO1xyXG4gICAgICAgICAgICBkdXBsaWNhdGVHcm91cC54ID1cclxuICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiAyIC1cclxuICAgICAgICAgICAgICAgICAgICAxICtcclxuICAgICAgICAgICAgICAgICAgICAoTWF0aC5yYW5kb20oKSAvIDAuNjM2IC0gZHVwbGljYXRlR3JvdXAud2lkdGggLyAyKTtcclxuICAgICAgICAgICAgZHVwbGljYXRlR3JvdXAueSA9XHJcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogKDQgKiAwLjQ1MikgLVxyXG4gICAgICAgICAgICAgICAgICAgIDMgK1xyXG4gICAgICAgICAgICAgICAgICAgIChNYXRoLnJhbmRvbSgpIC8gMjEgLSBkdXBsaWNhdGVHcm91cC5oZWlnaHQgLyA0KTtcclxuICAgICAgICAgICAgZHVwbGljYXRlR3JvdXAucmVsYXRpdmVUcmFuc2Zvcm0gPSBbXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZG9tU2NhbGUgKiBNYXRoLmNvcyhkZWdUb1JhZChyb3RhdGlvbkFuZ2xlKSkgLSA0My44LFxyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRvbVNjYWxlICogTWF0aC5zaW4oZGVnVG9SYWQocm90YXRpb25BbmdsZSkpICsgODMsXHJcbiAgICAgICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZG9tU2NhbGUgKiBNYXRoLnNpbihkZWdUb1JhZChyb3RhdGlvbkFuZ2xlKSkgLSAyICogMi44MixcclxuICAgICAgICAgICAgICAgICAgICByYW5kb21TY2FsZSAqIE1hdGguY29zKGRlZ1RvUmFkKHJvdGF0aW9uQW5nbGUpKSxcclxuICAgICAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgY29uc3QgZ29sZGVuWCA9IGFwcGx5R29sZGVuUmF0aW8oaSArIGR1cGxpY2F0ZUdyb3VwLmhlaWdodCAqIHNjYWxlKTtcclxuICAgICAgICAgICAgY29uc3QgZ29sZGVuWSA9IGFwcGx5R29sZGVuUmF0aW8oaSArIDE1Mik7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpYlggPSBhcHBseUZpYm9uYWNjaShpICsgMC4wMzIpO1xyXG4gICAgICAgICAgICBjb25zdCBmaWJZID0gYXBwbHlGaWJvbmFjY2koaSAvIGkgKyA4LjIyNTIpO1xyXG4gICAgICAgICAgICBkdXBsaWNhdGVHcm91cC5yZWxhdGl2ZVRyYW5zZm9ybSA9IFtcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAoYWRkaXRpb25hbFNjYWxlICogTWF0aC5jb3MoZGVnVG9SYWQoYWRkaXRpb25hbFJvdGF0aW9uKSkpIC8gMixcclxuICAgICAgICAgICAgICAgICAgICAtYWRkaXRpb25hbFNjYWxlICogTWF0aC5zaW4oZGVnVG9SYWQoYWRkaXRpb25hbFJvdGF0aW9uKSksXHJcbiAgICAgICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbFNjYWxlICogTWF0aC5zaW4oZGVnVG9SYWQoYWRkaXRpb25hbFJvdGF0aW9uKSksXHJcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbFNjYWxlICogTWF0aC5jb3MoZGVnVG9SYWQoYWRkaXRpb25hbFJvdGF0aW9uKSksXHJcbiAgICAgICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIGR1cGxpY2F0ZUdyb3VwLnggPVxyXG4gICAgICAgICAgICAgICAgKChnb2xkZW5YICsgZmliWCkgJSAoTWF0aC5yYW5kb20oKSAvIGFwcGx5Rmlib25hY2NpKGkgKyAzMi44MTMpKSkgK1xyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgICAgIGR1cGxpY2F0ZUdyb3VwLnkgPVxyXG4gICAgICAgICAgICAgICAgKChnb2xkZW5ZICsgZmliWSAvIGFwcGx5Rmlib25hY2NpKGkgKyAzLjc4MykpICVcclxuICAgICAgICAgICAgICAgICAgICAoTWF0aC5yYW5kb20oKSAtIGR1cGxpY2F0ZUdyb3VwLmhlaWdodCkpICtcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpIC1cclxuICAgICAgICAgICAgICAgICAgICAyIC8gTWF0aC5yYW5kb20oKSArXHJcbiAgICAgICAgICAgICAgICAgICAgMjtcclxuICAgICAgICAgICAgZ3JvdXBzLnB1c2goZHVwbGljYXRlR3JvdXApO1xyXG4gICAgICAgICAgICBhbGxHcm91cHMucHVzaChkdXBsaWNhdGVHcm91cCk7XHJcbiAgICAgICAgICAgIGZyYW1lLmFwcGVuZENoaWxkKGR1cGxpY2F0ZUdyb3VwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZnJhbWVXaWR0aCA9IGZyYW1lLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGZyYW1lSGVpZ2h0ID0gZnJhbWUuaGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IHRvdGFsV2lkdGggPSBtYXhYIC0gbWluWDtcclxuICAgICAgICBjb25zdCB0b3RhbEhlaWdodCA9IG1heFkgLSBtaW5ZO1xyXG4gICAgICAgIGZvciAoY29uc3QgZ3JvdXAgb2YgYWxsR3JvdXBzKSB7XHJcbiAgICAgICAgICAgIG1pblggPSBNYXRoLm1pbihtaW5YLCBncm91cC54KTtcclxuICAgICAgICAgICAgbWluWSA9IE1hdGgubWluKG1pblksIGdyb3VwLnkpO1xyXG4gICAgICAgICAgICBtYXhYID0gTWF0aC5tYXgobWF4WCwgZ3JvdXAueCArIGdyb3VwLndpZHRoKTtcclxuICAgICAgICAgICAgbWF4WSA9IE1hdGgubWF4KG1heFksIGdyb3VwLnkgKyBncm91cC5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IGdyb3VwIG9mIGFsbEdyb3Vwcykge1xyXG4gICAgICAgICAgICBncm91cC54ICs9IChmcmFtZVdpZHRoIC0gdG90YWxXaWR0aCkgLyAyIC0gbWluWDtcclxuICAgICAgICAgICAgZ3JvdXAueSArPSAoKGZyYW1lSGVpZ2h0IC0gdG90YWxIZWlnaHQpIC8gNykgKiAwLjUyMiAtIG1pblk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZyYW1lLnJlc2l6ZSgxMjAwLCA4MDApO1xyXG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLmFwcGVuZENoaWxkKGZyYW1lKTtcclxuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbZnJhbWVdO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lckZyYW1lID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcclxuICAgICAgICBjb250YWluZXJGcmFtZS5yZXNpemUoZnJhbWVXaWR0aCwgZnJhbWVIZWlnaHQpO1xyXG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xyXG4gICAgICAgICAgICBjb250YWluZXJGcmFtZS5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2UuYXBwZW5kQ2hpbGQoY29udGFpbmVyRnJhbWUpO1xyXG4gICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhbY29udGFpbmVyRnJhbWVdKTtcclxuICAgICAgICBjb250YWluZXJGcmFtZS5yZW1vdmUoKTtcclxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY3JlYXRlLWNvbXBsZXgtYWJzdHJhY3RcIixcclxuICAgICAgICAgICAgbWVzc2FnZTogYENyZWF0ZWRgLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChtc2cudHlwZSA9PT0gXCJjYW5jZWxcIikge1xyXG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XHJcbiAgICB9XHJcbn07XHJcbmZpZ21hLnNob3dVSShfX2h0bWxfXywge1xyXG4gICAgd2lkdGg6IDI3MCxcclxuICAgIGhlaWdodDogNTA0LFxyXG4gICAgdGl0bGU6IFwiUGF0dGVybnNcIixcclxuICAgIHRoZW1lQ29sb3JzOiB0cnVlLFxyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==