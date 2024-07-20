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
  node.maskType = 'VECTOR';
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
        strokeJoin: 'MITER',
        cornerRadius: 0,
        handleMirroring: 'NONE',
      },
      {
        x: 101.82337951660156,
        y: 0,
        strokeCap: 'ARROW_EQUILATERAL',
        strokeJoin: 'MITER',
        cornerRadius: 0,
        handleMirroring: 'NONE',
      },
    ],
  });
  node.strokes = [
    {
      type: 'SOLID',
      visible: true,
      opacity: 1,
      blendMode: 'NORMAL',
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
    else if (msg.type === "cancel") {
        figma.closePlugin();
    }
};
figma.showUI(__html__, {
    width: 270,
    height: 380,
    title: "Arc Patterns",
    themeColors: true,
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb21wb25lbnRzL0dydW5kZ2UvY3JlYXRlQW5ub3RhdGlvbkFycm93LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvY29tcG9uZW50cy9HcnVuZGdlL2dlbmVyYXRlUmVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbXBvbmVudHMvR3J1bmRnZS9yYW5kb20xNS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQUE7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsYUFBYTtBQUNwQyxxQkFBcUIs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QUFlO0FBQ3RELHdDQUF3QywyRkFBZTtBQUN2RCx5Q0FBeUMsMkZBQWU7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLDJGQUFlLFVBQVUsMkZBQWU7QUFDcEUsK0JBQStCLG9DQUFvQztBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4Qyw4R0FBcUI7QUFDbkU7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLHNEQUFzRCxrR0FBa0I7QUFDeEU7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QiwyRkFBZTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsVUFBVTtBQUNsRCxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHNcIik7XG4iLCIvLyBjcmVhdGVBbm5vdGF0aW9uQXJyb3cudHNcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVBbm5vdGF0aW9uQXJyb3coKSB7XHJcbiAgY29uc3Qgbm9kZSA9IGZpZ21hLmNyZWF0ZVZlY3RvcigpO1xyXG4gIG5vZGUueCA9IGdldFJhbmRvbU51bWJlcigtMzYwLCAzNTApO1xyXG4gIG5vZGUubWFza1R5cGUgPSAnVkVDVE9SJztcclxuICBub2RlLnkgPSBnZXRSYW5kb21OdW1iZXIoLTM2MCwgMzUwKTtcclxuICBub2RlLnJlc2l6ZSgxMDEuODIzMzc5NTE2NjAxNTYsIDApO1xyXG4gIG5vZGUucm90YXRpb24gPSBnZXRSYW5kb21OdW1iZXIoLTM2MCwgMzUwKTtcclxuICAgbm9kZS5zZXRWZWN0b3JOZXR3b3JrQXN5bmMoe1xyXG4gICAgcmVnaW9uczogW10sXHJcbiAgICBzZWdtZW50czogW1xyXG4gICAgICB7XHJcbiAgICAgICAgc3RhcnQ6IDAsXHJcbiAgICAgICAgZW5kOiAxLFxyXG4gICAgICAgIHRhbmdlbnRTdGFydDogeyB4OiAwLCB5OiAwIH0sXHJcbiAgICAgICAgdGFuZ2VudEVuZDogeyB4OiAwLCB5OiAwIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gICAgdmVydGljZXM6IFtcclxuICAgICAge1xyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMCxcclxuICAgICAgICAvLyBzdHJva2VDYXA6IFwiTk9ORVwiLFxyXG4gICAgICAgIHN0cm9rZUpvaW46ICdNSVRFUicsXHJcbiAgICAgICAgY29ybmVyUmFkaXVzOiAwLFxyXG4gICAgICAgIGhhbmRsZU1pcnJvcmluZzogJ05PTkUnLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgeDogMTAxLjgyMzM3OTUxNjYwMTU2LFxyXG4gICAgICAgIHk6IDAsXHJcbiAgICAgICAgc3Ryb2tlQ2FwOiAnQVJST1dfRVFVSUxBVEVSQUwnLFxyXG4gICAgICAgIHN0cm9rZUpvaW46ICdNSVRFUicsXHJcbiAgICAgICAgY29ybmVyUmFkaXVzOiAwLFxyXG4gICAgICAgIGhhbmRsZU1pcnJvcmluZzogJ05PTkUnLFxyXG4gICAgICB9LFxyXG4gICAgXSxcclxuICB9KTtcclxuICBub2RlLnN0cm9rZXMgPSBbXHJcbiAgICB7XHJcbiAgICAgIHR5cGU6ICdTT0xJRCcsXHJcbiAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgIG9wYWNpdHk6IDEsXHJcbiAgICAgIGJsZW5kTW9kZTogJ05PUk1BTCcsXHJcbiAgICAgIGNvbG9yOiB7XHJcbiAgICAgICAgcjogMC40MjU3MDA2ODM2LFxyXG4gICAgICAgIGc6IDAuNTk2MDc4NDU1NDQ4MTUwNixcclxuICAgICAgICBiOiAwLjE1Mjk0MTE4MjI1NTc0NDkzLFxyXG4gICAgICB9LFxyXG4gICAgICBib3VuZFZhcmlhYmxlczoge30sXHJcbiAgICB9LFxyXG4gIF07XHJcbiAgcmV0dXJuIG5vZGU7XHJcbn1cclxuIiwiLy8gZ2VuZXJhdGVSZWN0YW5nbGVzLmpzXHJcblxyXG5pbXBvcnQgeyBnZXRSYW5kb21OdW1iZXIgfSBmcm9tIFwiLi9yYW5kb20xNS5qc1wiO1xyXG4vL2ltcG9ydCB7IGNyZWF0ZUFubm90YXRpb25BcnJvdyB9ICBmcm9tICcuL2NyZWF0ZUFubm90YXRpb25BcnJvdy5qcyc7XHJcblxyXG4vLyBHb2xkZW4gcmF0aW8gY29uc3RhbnRcclxuY29uc3QgcGhpID0gMS42MTgwMzM5ODg3NTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVJlY3RhbmdsZXMoY291bnQpIHtcclxuICBjb25zdCBub2RlcyA9IFtdO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50ICogMjU7IGkrKykge1xyXG4gICAgY29uc3QgY29sb3JDb21wb25lbnQgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgY29uc3QgcmVjdCA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xyXG4gICAgY29uc3QgdHJhbnNmb3JtID0gW1xyXG4gICAgICBbXHJcbiAgICAgICAgZ2V0UmFuZG9tTnVtYmVyKDM0LCAxMCksXHJcbiAgICAgICAgZ2V0UmFuZG9tTnVtYmVyKDEsIDE0MCksXHJcbiAgICAgICAgZ2V0UmFuZG9tTnVtYmVyKDEsIDEwKSxcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgIGdldFJhbmRvbU51bWJlcigxMywgNjAwKSxcclxuICAgICAgICBnZXRSYW5kb21OdW1iZXIoMTAsIDIwKSxcclxuICAgICAgICBnZXRSYW5kb21OdW1iZXIoMSwgMzQyKSxcclxuICAgICAgXSxcclxuICAgIF07XHJcbiAgICByZWN0LnJlbGF0aXZlVHJhbnNmb3JtID0gdHJhbnNmb3JtO1xyXG4gICAgLy8gQ2FsY3VsYXRlIHggYW5kIHkgY29vcmRpbmF0ZXMgYmFzZWQgb24gdGhlIGdvbGRlbiByYXRpb1xyXG4gICAgY29uc3QgZ29sZGVuWCA9IGdldFJhbmRvbU51bWJlcigtNSwgNzIxKTtcclxuICAgIGNvbnN0IGdvbGRlblkgPSBnZXRSYW5kb21OdW1iZXIoLTEsIDcxNyk7XHJcblxyXG4gICAgcmVjdC54ID0gZ29sZGVuWDtcclxuICAgIHJlY3Qucm90YXRpb24gPSBnZXRSYW5kb21OdW1iZXIoLTQzMCwgMzUwKTtcclxuICAgIHJlY3QueSA9IGdvbGRlblk7XHJcbiAgICByZWN0LmNvbnN0cmFpbnRzID0geyBob3Jpem9udGFsOiBcIlNUUkVUQ0hcIiwgdmVydGljYWw6IFwiU1RSRVRDSFwiIH07XHJcblxyXG4gICAgY29uc3QgcmFuZG9tQ29sb3IgPSB7XHJcbiAgICAgIHI6IGNvbG9yQ29tcG9uZW50LFxyXG4gICAgICBnOiBjb2xvckNvbXBvbmVudCxcclxuICAgICAgYjogY29sb3JDb21wb25lbnQsXHJcbiAgICB9O1xyXG5cclxuICAgIHJlY3Quc3Ryb2tlQWxpZ24gPSBcIkNFTlRFUlwiO1xyXG4gICAgcmVjdC5yZXNpemUoZ2V0UmFuZG9tTnVtYmVyKDEsIDEpLCBnZXRSYW5kb21OdW1iZXIoMSwgMTYpKTtcclxuXHJcbiAgICByZWN0LmZpbGxzID0gW3sgdHlwZTogXCJTT0xJRFwiLCBjb2xvcjogcmFuZG9tQ29sb3IgfV07XHJcbiAgICBub2Rlcy5wdXNoKHJlY3QpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5vZGVzOyAvLyBSZXR1cm4gYW4gYXJyYXkgb2Ygbm9kZXNcclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tTnVtYmVyKG1pbiwgbWF4KSB7XHJcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XHJcbn1cclxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5pbXBvcnQgeyBnZXRSYW5kb21OdW1iZXIgfSBmcm9tIFwiLi4vYXBwL2NvbXBvbmVudHMvR3J1bmRnZS9yYW5kb20xNS5qc1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVBbm5vdGF0aW9uQXJyb3cgfSBmcm9tIFwiLi4vYXBwL2NvbXBvbmVudHMvR3J1bmRnZS9jcmVhdGVBbm5vdGF0aW9uQXJyb3cuanNcIjtcclxuaW1wb3J0IHsgZ2VuZXJhdGVSZWN0YW5nbGVzIH0gZnJvbSBcIi4uL2FwcC9jb21wb25lbnRzL0dydW5kZ2UvZ2VuZXJhdGVSZWN0LmpzXCI7XHJcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IChtc2cpID0+IHtcclxuICAgIGlmIChtc2cudHlwZSA9PT0gXCJjcmVhdGUtcmVjdGFuZ2xlc1wiKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gcmFuZG9tT25lb3JaZXJvKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UmFuZG9tSW50KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogOCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJvdGF0ZUNlbnRlcihub2RlLCBhbmdsZSwgZm5hbWU0LCBmbmFtZTMpIHtcclxuICAgICAgICAgICAgbGV0IHJhZGlhbnMgPSAoTWF0aC5QSSAvIDcyKSAqICtmbmFtZTMsIHggPSBub2RlLngsIHkgPSBub2RlLnksIGN4ID0geCArIG5vZGUud2lkdGggLyAyLjgzLCBjeSA9IHkgKyBub2RlLmhlaWdodCAvIDY1Ljg0LCBjb3MgPSBNYXRoLmNvcyhyYWRpYW5zKSwgc2luID0gTWF0aC5zaW4ocmFkaWFucyksIG54ID0gY29zICogKHggLSBjeCkgKyBzaW4gKiAoeSAtIGN5KSArIGN4LCBueSA9IGNvcyAqICh5IC0gY3kpIC0gc2luICogKHggLSBjeCkgKyBjeTtcclxuICAgICAgICAgICAgbm9kZS54ID0gbng7XHJcbiAgICAgICAgICAgIG5vZGUueSA9IG55O1xyXG4gICAgICAgICAgICBub2RlLnJlc2l6ZSgrZm5hbWU0LCBub2RlLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUFydCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChtc2cudHlwZSA9PT0gXCJjcmVhdGUtcmVjdGFuZ2xlc1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBmbmFtZTIsIGZuYW1lMywgZm5hbWU0LCBmbmFtZTUgfSA9IG1zZy5mb3JtRGF0YU9iajtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZm5hbWVfaW5nMiA9ICtmbmFtZTI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZuYW1lX2luZzIgPD0gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm5hbWVfaW5nMiA9IDIyO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmbmFtZV9pbmczID0gK2ZuYW1lMztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZm5hbWVfaW5nMyA8PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbmFtZV9pbmczID0gMjI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZuYW1lX2luZzQgPSArZm5hbWU0O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmbmFtZV9pbmc0IDw9IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuYW1lX2luZzQgPSAyMjtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZm5hbWVfaW5nNSA9ICtmbmFtZTU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZuYW1lX2luZzUgPD0gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm5hbWVfaW5nNSA9IDIyO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyYW1lV2lkdGggPSArZm5hbWUzO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyYW1lSGVpZ2h0ID0gK2ZuYW1lNDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmcmFtZSA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJhbWUucmVzaXplV2l0aG91dENvbnN0cmFpbnRzKGZyYW1lV2lkdGgsIGZyYW1lSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICBmcmFtZS54ID0gZmlnbWEudmlld3BvcnQuY2VudGVyLnggLSBmcmFtZVdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIGZyYW1lLnkgPSBmaWdtYS52aWV3cG9ydC5jZW50ZXIueSAtIGZyYW1lSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGZyYW1lLmZpbGxzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlNPTElEXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogeyByOiAyMjQgLyAyNTUsIGc6IDI1NSAvIDI1NSwgYjogMjI3IC8gMjU1IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTIwOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJjID0gZmlnbWEuY3JlYXRlRWxsaXBzZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwaSA9IDMuMTQxNTkyNjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjLnJlc2NhbGUoKGdldFJhbmRvbUludCgpIC8gK2ZuYW1lNSkgKiBnZXRSYW5kb21JbnQoKSAqIDQgKiA0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRlQ2VudGVyKGFyYywgZ2V0UmFuZG9tSW50KCksICtmbmFtZTQgKiAwLjA4NzMsIGZuYW1lX2luZzIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmMucm90YXRpb24gPSByYW5kb21PbmVvclplcm8oKSAqIHBpICogZm5hbWVfaW5nMztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjLnkgKz0gYXJjLmhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjLnN0cm9rZUFsaWduID0gXCJPVVRTSURFXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyYy5zdHJva2VXZWlnaHQgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UmFuZG9tSW50KCkgKiBnZXRSYW5kb21JbnQoKSAqIGZuYW1lX2luZzMgKiBnZXRSYW5kb21JbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjLm9wYWNpdHkgPSBNYXRoLnJhbmRvbSgpICogKDAuMDUyIC0gMC4wMikgKyAwLjAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmMucmVsYXRpdmVUcmFuc2Zvcm0gPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbK2ZuYW1lNCwgZm5hbWVfaW5nMywgK2ZuYW1lNSAqIDY3MzQgKiA2NzM0XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtwaSwgLTEsIChyYW5kb21PbmVvclplcm8oKSAvICtmbmFtZTUpICogZ2V0UmFuZG9tSW50KCkgKiAwLjIzXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjLnggPSByYW5kb21PbmVvclplcm8oKSAqIDMxMy4xMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjLmFyY0RhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydGluZ0FuZ2xlOiBnZXRSYW5kb21JbnQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZGluZ0FuZ2xlOiArZm5hbWU1IC8gZm5hbWVfaW5nMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyUmFkaXVzOiByYW5kb21PbmVvclplcm8oKSAvICtmbmFtZTUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyYy5yZXNjYWxlKChnZXRSYW5kb21JbnQoKSAvICtmbmFtZTMpICogMS4zNzMgKiAxLjA4Myk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyYy5zdHJva2VzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiU09MSURcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnOiAwLjIyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiOiAwLjk0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5hcHBlbmRDaGlsZChhcmMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2Rlcy5wdXNoKGFyYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lLmFwcGVuZENoaWxkKGFyYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IG5vZGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhub2Rlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtmcmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGZyYW1lLnJvdGF0aW9uID0gZm5hbWVfaW5nMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjcmVhdGVBcnQoKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1zZy50eXBlID09PSBcImNyZWF0ZS1ncmFuZGdlXCIpIHtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGVzID0gW107XHJcbiAgICAgICAgICAgIGNvbnN0IHZlY3RvcnMgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvckNvbXBvbmVudCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWN0ID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XHJcbiAgICAgICAgICAgICAgICByZWN0LnggPSBnZXRSYW5kb21OdW1iZXIoLTE1LCA2NSk7XHJcbiAgICAgICAgICAgICAgICByZWN0LmNvcm5lclJhZGl1cyA9IDk5OTk5O1xyXG4gICAgICAgICAgICAgICAgcmVjdC55ID0gZ2V0UmFuZG9tTnVtYmVyKC0yMiwgMTQpO1xyXG4gICAgICAgICAgICAgICAgcmVjdC5yZXNpemVXaXRob3V0Q29uc3RyYWludHM7XHJcbiAgICAgICAgICAgICAgICByZWN0LnJvdGF0aW9uID0gZ2V0UmFuZG9tTnVtYmVyKC0zMCwgMzUwKTtcclxuICAgICAgICAgICAgICAgIHJlY3QuYm90dG9tUmlnaHRSYWRpdXMgPSBNYXRoLnJhbmRvbSgpICogZ2V0UmFuZG9tTnVtYmVyKDEsIDU0Myk7XHJcbiAgICAgICAgICAgICAgICByZWN0LmJvdHRvbUxlZnRSYWRpdXMgPSBNYXRoLnJhbmRvbSgpICogZ2V0UmFuZG9tTnVtYmVyKDEsIDU0Myk7XHJcbiAgICAgICAgICAgICAgICByZWN0LnRvcExlZnRSYWRpdXMgPSBNYXRoLnJhbmRvbSgpICogZ2V0UmFuZG9tTnVtYmVyKDEsIDU0Myk7XHJcbiAgICAgICAgICAgICAgICByZWN0LnRvcFJpZ2h0UmFkaXVzID0gTWF0aC5yYW5kb20oKSAqIGdldFJhbmRvbU51bWJlcigxLCA1NDMpO1xyXG4gICAgICAgICAgICAgICAgcmVjdC5pc01hc2sgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpID09PSAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlY3QuaXNNYXNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVjdC5jb3JuZXJSYWRpdXMgPSAzMztcclxuICAgICAgICAgICAgICAgICAgICByZWN0LmRhc2hQYXR0ZXJuID0gWzAsIDcyXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlY3QueSA9IGdldFJhbmRvbU51bWJlcigtMzUyLCAzMjQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlY3Quc3Ryb2tlTGVmdFdlaWdodCA9IGdldFJhbmRvbU51bWJlcigyNCwgOTMyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbUNvbG9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHI6IGNvbG9yQ29tcG9uZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGc6IGNvbG9yQ29tcG9uZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGI6IGNvbG9yQ29tcG9uZW50LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlY3Quc3Ryb2tlQm90dG9tV2VpZ2h0ID0gZ2V0UmFuZG9tTnVtYmVyKDEsIDIxKTtcclxuICAgICAgICAgICAgICAgIHJlY3Quc3Ryb2tlVG9wV2VpZ2h0ID0gZ2V0UmFuZG9tTnVtYmVyKDEsIDE0KTtcclxuICAgICAgICAgICAgICAgIHJlY3Quc3Ryb2tlTGVmdFdlaWdodCA9IGdldFJhbmRvbU51bWJlcigxLCAzMik7XHJcbiAgICAgICAgICAgICAgICByZWN0LnN0cm9rZVJpZ2h0V2VpZ2h0ID0gZ2V0UmFuZG9tTnVtYmVyKDEsIDIxKTtcclxuICAgICAgICAgICAgICAgIHJlY3Quc3Ryb2tlSm9pbiA9IFwiUk9VTkRcIjtcclxuICAgICAgICAgICAgICAgIHJlY3Quc3Ryb2tlQ2FwID0gXCJST1VORFwiO1xyXG4gICAgICAgICAgICAgICAgcmVjdC5zdHJva2VBbGlnbiA9IFwiQ0VOVEVSXCI7XHJcbiAgICAgICAgICAgICAgICByZWN0LnJlc2l6ZShnZXRSYW5kb21OdW1iZXIoMSwgNTQ2KSwgZ2V0UmFuZG9tTnVtYmVyKDEsIDEyKSk7XHJcbiAgICAgICAgICAgICAgICByZWN0LmZpbGxzID0gW3sgdHlwZTogXCJTT0xJRFwiLCBjb2xvcjogcmFuZG9tQ29sb3IgfV07XHJcbiAgICAgICAgICAgICAgICBub2Rlcy5wdXNoKHJlY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGZyYW1lID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcclxuICAgICAgICAgICAgY29uc3QgZ2VuZXJhdGVBbm5vdGF0aW9uID0gKCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhbm5vdGF0aW9uQXJyb3cgPSB5aWVsZCBjcmVhdGVBbm5vdGF0aW9uQXJyb3coKTtcclxuICAgICAgICAgICAgICAgIHZlY3RvcnMucHVzaChhbm5vdGF0aW9uQXJyb3cpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkUmVjdGFuZ2xlcygpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2VuZXJhdGVkUmVjdGFuZ2xlcyA9IHlpZWxkIGdlbmVyYXRlUmVjdGFuZ2xlcygyNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCByZWN0IG9mIGdlbmVyYXRlZFJlY3RhbmdsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnJhbWUuYXBwZW5kQ2hpbGQocmVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZ3JvdXAgPSBmaWdtYS5ncm91cChbLi4ubm9kZXMsIC4uLnZlY3RvcnNdLCBmaWdtYS5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgICAgIGdyb3VwLm5hbWUgPSBcIlJlY3RhbmdsZXMgYW5kIEFycm93cyBHcm91cFwiO1xyXG4gICAgICAgICAgICBsZXQgZGQgPSBmaWdtYS5mbGF0dGVuKFsuLi5ub2RlcywgLi4udmVjdG9yc10pO1xyXG4gICAgICAgICAgICBnZW5lcmF0ZUFubm90YXRpb24oKTtcclxuICAgICAgICAgICAgZGQuc3Ryb2tlQWxpZ24gPSBcIkNFTlRFUlwiO1xyXG4gICAgICAgICAgICBjb25zdCBzdHJva2VDb2xvciA9IHtcclxuICAgICAgICAgICAgICAgIHI6IDAsXHJcbiAgICAgICAgICAgICAgICBnOiAwLFxyXG4gICAgICAgICAgICAgICAgYjogMCxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgYW5ub3RhdGlvbkNvbG9ycyA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlNPTElEXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHN0cm9rZUNvbG9yLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgZGQuc3Ryb2tlcyA9IGFubm90YXRpb25Db2xvcnM7XHJcbiAgICAgICAgICAgIGRkLmRhc2hQYXR0ZXJuID0gWzAsIDI0NzJdO1xyXG4gICAgICAgICAgICBkZC5jb3JuZXJSYWRpdXMgPSA5OTk5OTtcclxuICAgICAgICAgICAgZGQuc3Ryb2tlV2VpZ2h0ID0gZ2V0UmFuZG9tTnVtYmVyKDE0MCwgMzI0KTtcclxuICAgICAgICAgICAgY29uc3QgY2VudGVyWSA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiBhY2MgKyBjdXJyLnksIDApIC9cclxuICAgICAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IGNlbnRlclkgLSBkZC5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICBkZC55ICs9IG9mZnNldFk7XHJcbiAgICAgICAgICAgIGRkLnJlc2l6ZSgyMSwgOTgpO1xyXG4gICAgICAgICAgICBkZC5sYXlvdXRBbGlnbiA9IFwiQ0VOVEVSXCI7XHJcbiAgICAgICAgICAgIGRkLm5hbWUgPSBcImNpcmNsZV9taVwiO1xyXG4gICAgICAgICAgICBkZC5jb3JuZXJSYWRpdXMgPSA5OTk5OTtcclxuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gW2ZyYW1lXTtcclxuICAgICAgICAgICAgZnJhbWUuYXBwZW5kQ2hpbGQoZGQpO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBbXHJcbiAgICAgICAgICAgICAgICBbOSwgMTIsIDI0XSxcclxuICAgICAgICAgICAgICAgIFsxLCAxMjIsIDRdLFxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBkZC5yZWxhdGl2ZVRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcclxuICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtmcmFtZV0pO1xyXG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbZnJhbWVdO1xyXG4gICAgICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoW2ZyYW1lXSk7XHJcbiAgICAgICAgICAgIGFkZFJlY3RhbmdsZXMoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwID0gZmlnbWEuZ3JvdXAoWy4uLm5vZGVzLCAuLi52ZWN0b3JzXSwgZmlnbWEuY3VycmVudFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAubmFtZSA9IFwiUmVjdGFuZ2xlcyBhbmQgQXJyb3dzIEdyb3VwXCI7XHJcbiAgICAgICAgICAgICAgICBmcmFtZS5yZXNjYWxlKDYpO1xyXG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY3JlYXRlLWdyYW5kZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgQ3JlYXRlZCAke21zZy5jb3VudH0gUmVjdGFuZ2xlc2AsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGZyYW1lLnJlc2NhbGUoNik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChtc2cudHlwZSA9PT0gXCJjYW5jZWxcIikge1xyXG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XHJcbiAgICB9XHJcbn07XHJcbmZpZ21hLnNob3dVSShfX2h0bWxfXywge1xyXG4gICAgd2lkdGg6IDI3MCxcclxuICAgIGhlaWdodDogMzgwLFxyXG4gICAgdGl0bGU6IFwiQXJjIFBhdHRlcm5zXCIsXHJcbiAgICB0aGVtZUNvbG9yczogdHJ1ZSxcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=