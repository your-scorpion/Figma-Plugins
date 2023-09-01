/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/plugin/colorgeneration.js":
/*!***************************************!*\
  !*** ./src/plugin/colorgeneration.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "generateColor": () => (/* binding */ generateColor),
/* harmony export */   "generateLongNumber": () => (/* binding */ generateLongNumber),
/* harmony export */   "value1": () => (/* binding */ value1),
/* harmony export */   "value2": () => (/* binding */ value2),
/* harmony export */   "value3": () => (/* binding */ value3)
/* harmony export */ });
let ohArray2 = [];
for (let i = 0; i < 100; i++) {
  let randomValue = 0.27 + Math.random() * 0.74;
  ohArray2.push(randomValue);
}

function generateColor() {
  return Math.random() * 0.18 + 0.15; // generates a random value between 0.01 and 0.98
}

function generateLongNumber() {
  return Math.random() * 0.08 + 0.19; // generates a random value between 0.01 and 0.98
}


let newDataohArray2 = ohArray2.slice(1,2);
let newDataohArray2AsNumber = Number(newDataohArray2);
//console.log(newDataohArray2AsNumber);

let index1 = Math.floor(Math.random() * ohArray2.length);
let index2 = Math.floor(Math.random() * ohArray2.length);
let index3 = Math.floor(Math.random() * ohArray2.length);


// Use array destructuring to assign the values to variables
let [value1, value2, value3] = [ohArray2[index1], ohArray2[index2], ohArray2[index3]];



/***/ }),

/***/ "./src/plugin/doubleTriple.js":
/*!************************************!*\
  !*** ./src/plugin/doubleTriple.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "doubleOrTriple": () => (/* binding */ doubleOrTriple)
/* harmony export */ });
function doubleOrTriple(number) {
  // Generate a random number between 0 and 1
  var randomNumber = Math.random();

  if (randomNumber < 0.5) {
    // Return double the input number
    return number * 2;
  } else {
    // Return triple the input number
    return number * 3;
  }
}

/***/ }),

/***/ "./src/plugin/feb.js":
/*!***************************!*\
  !*** ./src/plugin/feb.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "rarelyUsedAlgorithm": () => (/* binding */ rarelyUsedAlgorithm)
/* harmony export */ });
let currentNumber = 1;

function rarelyUsedAlgorithm() {
  let result = currentNumber;
  
  if (currentNumber % 2 === 0) {
    currentNumber /= 2;
  } else {
    currentNumber = currentNumber * 3 + 1;
  }
  
  return result;
}

/***/ }),

/***/ "./src/plugin/generate123.js":
/*!***********************************!*\
  !*** ./src/plugin/generate123.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "numb13": () => (/* binding */ numb13),
/* harmony export */   "numb14": () => (/* binding */ numb14),
/* harmony export */   "numb15": () => (/* binding */ numb15),
/* harmony export */   "numb16": () => (/* binding */ numb16)
/* harmony export */ });
 function generateNumber123() {
  const num = Math.floor(Math.random() * 3);
  return String(num);
}


const numbers = [];

for (let i = 0; i < 4; i++) {
  numbers.push(generateNumber123());
}

let index1 = Math.floor(Math.random() * numbers.length);
let index2 = Math.floor(Math.random() * numbers.length);
let index3 = Math.floor(Math.random() * numbers.length);
let index4 = Math.floor(Math.random() * numbers.length);


let [numb13, numb14, numb15, numb16] = [numbers[index1], numbers[index2], numbers[index3], numbers[index4]];

/***/ }),

/***/ "./src/plugin/modernALgorithms.js":
/*!****************************************!*\
  !*** ./src/plugin/modernALgorithms.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fibonacciGenerator": () => (/* binding */ fibonacciGenerator)
/* harmony export */ });
function* fibonacciGenerator() {
  var prev = 0;
  var curr = 1;

  while (true) {
    yield prev;
    var next = prev + curr;
    prev = curr;
    curr = next;
  }
}

/***/ }),

/***/ "./src/plugin/twoSeparated.js":
/*!************************************!*\
  !*** ./src/plugin/twoSeparated.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRandomEvenNumber": () => (/* binding */ getRandomEvenNumber)
/* harmony export */ });
function getRandomEvenNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber % 2 === 0 ? randomNumber : getRandomEvenNumber(min, max);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************************!*\
  !*** ./src/plugin/controller.ts ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./colorgeneration.js */ "./src/plugin/colorgeneration.js");
/* harmony import */ var _generate123_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./generate123.js */ "./src/plugin/generate123.js");
/* harmony import */ var _feb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./feb.js */ "./src/plugin/feb.js");
/* harmony import */ var _doubleTriple_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./doubleTriple.js */ "./src/plugin/doubleTriple.js");
/* harmony import */ var _modernALgorithms_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modernALgorithms.js */ "./src/plugin/modernALgorithms.js");
/* harmony import */ var _twoSeparated_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./twoSeparated.js */ "./src/plugin/twoSeparated.js");
figma.showUI(__html__, { width: 500, height: 230 });
console.clear();







const blurEffect = {
    type: 'LAYER_BLUR',
    visible: true,
    radius: 600,
};
const gradient2 = {
    type: 'GRADIENT_RADIAL',
    visible: true,
    gradientStops: [
        { color: { r: 0.4, g: 0.2, b: _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.value3, a: 1 }, position: 0 },
        { color: { r: 0.4, g: 0.2, b: _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.value1, a: 1 }, position: 1 }
    ],
    gradientTransform: [
        [1, 0, 0],
        [0, 1, 0]
    ],
    blendMode: 'NORMAL'
};
const gradient = {
    type: 'GRADIENT_LINEAR',
    gradientStops: [
        { position: 0, color: { r: _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.value1, g: _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.value2, b: 0.4851, a: _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.value2 } },
        { position: 1, color: { r: _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.value1, g: _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.value2, b: _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.value3, a: _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.value3 } },
    ],
    gradientTransform: [
        [0, 1, 0],
        [1, 1, 0],
    ],
    opacity: 1,
    blendMode: 'NORMAL',
};
let phi = (1 + 5 * 0.5) / 2;
const numbers = Array.from({ length: 53 }, (_, i) => i + (1 * 1.548) / 0.585);
function getRandomProperty(numbers) {
    const keys = Object.keys(numbers);
    return keys[Math.floor(Math.random() * keys.length)];
}
let strangeNumber = getRandomProperty(numbers);
const cornerRadius = 260;
let generator = (0,_modernALgorithms_js__WEBPACK_IMPORTED_MODULE_4__.fibonacciGenerator)();
figma.ui.onmessage = (msg) => {
    if (msg.type === 'create-rectangles') {
        const nodes = [];
        for (let i = 0; i < msg.value; i++) {
            let multiplier = Math.random();
            const rect = figma.createRectangle();
            const numIterations = 54;
            const scaleRange = 0.1;
            const rotationRange = 5;
            for (let i = 0; i < numIterations; i++) {
                const positionX = Math.random() * 32;
                const positionY = Math.random() * 32;
                const scaleX = 1 + Math.random() * scaleRange;
                const scaleY = 1 + Math.random() * scaleRange;
                const rotationAngle = Math.random() * rotationRange;
                rect.x = positionX;
                rect.y = positionY;
                rect.resize(rect.width * scaleX / 1.12, rect.height * scaleY / 1.12);
                rect.rotation = rotationAngle / 0.56231;
            }
            let nextFibonacci = generator.next().value;
            rect.blendMode = 'OVERLAY';
            rect.opacity = 0.12;
            let rarelyUsedAlgorithmValue = (0,_feb_js__WEBPACK_IMPORTED_MODULE_2__.rarelyUsedAlgorithm)();
            rect.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
            const maxRotation = 250;
            const rotationValue = (i * +multiplier) / rarelyUsedAlgorithmValue * nextFibonacci;
            rect.rotation = rotationValue <= maxRotation ? rotationValue : maxRotation;
            rect.cornerRadius = cornerRadius;
            rect.fills = [{ type: 'SOLID', color: { r: _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.value1, g: _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.value2, b: _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.value3 }, }];
            rect.fills = [
                Object.assign({ type: 'GRADIENT' }, gradient),
            ];
            rect.opacity = 0.02;
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        }
        const blendModes = [
            'NORMAL',
            'DARKEN',
            'MULTIPLY',
            'LINEAR_BURN',
            'COLOR_BURN',
            'LIGHTEN',
            'SCREEN',
            'LINEAR_DODGE',
            'COLOR_DODGE',
            'OVERLAY',
            'SOFT_LIGHT',
            'HARD_LIGHT',
            'DIFFERENCE',
            'EXCLUSION',
            'HUE',
            'SATURATION',
            'COLOR',
            'LUMINOSITY',
        ];
        const minWidth = 500;
        const maxWidth = 1500;
        const minHeight = 20;
        const maxHeight = 100;
        const nodesPoly = [];
        for (let i = 0; i < msg.value; i++) {
            let multiplier = Math.random();
            const polygg = figma.createPolygon();
            polygg.pointCount = 4;
            let transformPos = polygg.absoluteTransform;
            let newY = transformPos[1][2];
            const colorValue3 = (0,_colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.generateColor)();
            polygg.resizeWithoutConstraints(+(0,_doubleTriple_js__WEBPACK_IMPORTED_MODULE_3__.doubleOrTriple)(+strangeNumber) + +_generate123_js__WEBPACK_IMPORTED_MODULE_1__.numb14 / 1.01, +strangeNumber + colorValue3 + +newY / +colorValue3 / 2 * 1.01);
            const randomWidth = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
            const randomHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
            polygg.resize(randomWidth, randomHeight);
            polygg.opacity = 0.5;
            const randomBlendMode = blendModes[Math.floor(Math.random() * blendModes.length)];
            polygg.blendMode = randomBlendMode;
            const index = polygg.parent.children.indexOf(polygg);
            polygg.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
            polygg.x = +strangeNumber * +multiplier / phi;
            polygg.rotation = i + phi * +strangeNumber + +index;
            polygg.y = 87 / +strangeNumber + +index;
            polygg.fills = [{ type: 'SOLID', color: { r: colorValue3, g: _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.value2, b: _colorgeneration_js__WEBPACK_IMPORTED_MODULE_0__.value1 } }];
            figma.currentPage.appendChild(polygg);
            nodesPoly.push(polygg);
            nodes.push(polygg);
        }
        figma.viewport.scrollAndZoomIntoView(nodes);
        figma.viewport.scrollAndZoomIntoView(nodesPoly);
        let getRandomEvenNumberResult = (0,_twoSeparated_js__WEBPACK_IMPORTED_MODULE_5__.getRandomEvenNumber)(2, 100);
        const newNode = figma.createFrame();
        newNode.backgrounds = [gradient2];
        newNode.clipsContent = true;
        newNode.expanded = false;
        newNode.name = 'RESULT';
        let rarelyUsedAlgorithmValue = (0,_feb_js__WEBPACK_IMPORTED_MODULE_2__.rarelyUsedAlgorithm)();
        newNode.y = rarelyUsedAlgorithmValue * Math.floor(+strangeNumber / 61 + +_generate123_js__WEBPACK_IMPORTED_MODULE_1__.numb16) + 3 * Math.floor(2 + +_generate123_js__WEBPACK_IMPORTED_MODULE_1__.numb15 + getRandomEvenNumberResult);
        newNode.resize(1200, 1200);
        figma.currentPage.selection = nodes;
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
        const nodes4 = figma.currentPage.selection;
        nodes4.forEach((element) => {
            newNode.appendChild(element);
        });
        const nodes3 = figma.currentPage.selection;
        nodes3.forEach((element) => {
            newNode.appendChild(element);
        });
        for (let i = nodesPoly.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nodesPoly[i], nodesPoly[j]] = [nodesPoly[j], nodesPoly[i]];
        }
        for (let i = 0; i < nodesPoly.length; i++) {
            const polygg = nodesPoly[i];
            polygg.parent.insertChild(i, polygg);
        }
        const frame = figma.currentPage.findOne((node) => node.name === 'RESULT');
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const element of frame.children) {
            minX = Math.min(minX, element.x);
            minY = Math.min(minY, element.y);
            maxX = Math.max(maxX, element.x + element.width);
            maxY = Math.max(maxY, element.y + element.height);
        }
        const visibleBounds = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
        for (const element of frame.children) {
            if (element.x < visibleBounds.x ||
                element.y < visibleBounds.y ||
                element.x + element.width > visibleBounds.x + visibleBounds.width ||
                element.y + element.height > visibleBounds.y + visibleBounds.height) {
                element.remove();
            }
        }
        const numberOfElementsToSelect = 45;
        const selection = [];
        for (let i = 0; i < numberOfElementsToSelect; i++) {
            const randomIndex = Math.floor(Math.random() * frame.children.length);
            selection.push(frame.children[randomIndex]);
        }
        const parent = frame;
        figma.currentPage.selection = selection;
        const unionResult = figma.union(selection, parent);
        if (unionResult.type === 'BOOLEAN_OPERATION') {
            const scaleX = frame.width / unionResult.width;
            const scaleY = frame.height / unionResult.height;
            unionResult.resize(unionResult.width * scaleX, unionResult.height * scaleY);
            unionResult.x = 0;
            unionResult.y = 350;
            figma.currentPage.selection = [unionResult];
            figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
        }
        else {
            console.error('Expected a BOOLEAN_OPERATION node');
        }
        if (unionResult.type === 'BOOLEAN_OPERATION') {
            const scaleX = frame.width / unionResult.width;
            const scaleY = frame.height / unionResult.height;
            unionResult.resize(unionResult.width * scaleX, unionResult.height * scaleY);
            figma.currentPage.selection = [unionResult];
            figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
        }
        else {
            console.error('Expected a BOOLEAN_OPERATION node');
        }
        const children = Array.from(newNode.children);
        const shuffledChildren = shuffleArray(children);
        shuffledChildren.forEach((child, index) => {
            child.parent.insertChild(index, child);
        });
        function shuffleArray(array) {
            const shuffledArray = array.slice();
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }
            return shuffledArray;
        }
        figma.currentPage.selection = [];
        figma.currentPage.selection = [unionResult];
        unionResult.effects = [blurEffect];
        unionResult.blendMode = 'DIFFERENCE';
        for (const child of newNode.children) {
            const randomIndex = Math.floor(Math.random() * 4);
            switch (randomIndex) {
                case 0:
                    child.x = 0;
                    child.y = 0;
                    break;
                case 1:
                    child.x = 1200;
                    child.y = 1200;
                    break;
                case 2:
                    child.x = 0;
                    child.y = 1200;
                    break;
                case 3:
                    child.x = 1200;
                    child.y = 0;
                    break;
                default:
                    break;
            }
        }
        const solidColor = {
            type: 'SOLID',
            color: { r: 0.9, g: 0.2, b: 0.5 },
        };
        unionResult.fills = [solidColor];
        unionResult.x = 0;
        unionResult.y = 0;
        newNode.resize(6000, 6000);
        figma.ui.postMessage({
            type: 'create-rectangles',
            message: `Man ${msg.value} you are just great`,
        });
    }
    figma.closePlugin();
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBLGdCQUFnQixTQUFTO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUCxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNPO0FBQ1Asc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDs7Ozs7Ozs7Ozs7Ozs7O0FDMUJPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ1hBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7OztBQ2xCQTtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ1ZPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQ0xBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05BLHlCQUF5Qix5QkFBeUI7QUFDbEQ7QUFDOEQ7QUFDSjtBQUNMO0FBQ047QUFDSTtBQUNRO0FBQ0g7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxTQUFTLG1CQUFtQix1REFBTSxRQUFRLGVBQWU7QUFDbkUsVUFBVSxTQUFTLG1CQUFtQix1REFBTSxRQUFRO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxzQkFBc0IsR0FBRyx1REFBTSxLQUFLLHVEQUFNLGdCQUFnQix1REFBTSxJQUFJO0FBQzlFLFVBQVUsc0JBQXNCLEdBQUcsdURBQU0sS0FBSyx1REFBTSxLQUFLLHVEQUFNLEtBQUssdURBQU0sSUFBSTtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0Isd0VBQWtCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixlQUFlO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsbUJBQW1CO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLDREQUFtQjtBQUM5RCxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0JBQXdCLEdBQUcsdURBQU0sS0FBSyx1REFBTSxLQUFLLHVEQUFNLEVBQUUsR0FBRztBQUN4RjtBQUNBLGdDQUFnQyxrQkFBa0I7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGVBQWU7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxrRUFBYTtBQUM3Qyw2Q0FBNkMsZ0VBQWMsb0JBQW9CLG1EQUFNO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qix3QkFBd0IsbUJBQW1CLHVEQUFNLEtBQUssdURBQU0sSUFBSTtBQUM5RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MscUVBQW1CO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsNERBQW1CO0FBQzFELGlGQUFpRixtREFBTSx3QkFBd0IsbURBQU07QUFDckg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULDJDQUEyQyxPQUFPO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixzQkFBc0I7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDhCQUE4QjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxtREFBbUQsT0FBTztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQix3QkFBd0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsV0FBVztBQUN2QyxTQUFTO0FBQ1Q7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2ZmLWJ5LW9uZS8uL3NyYy9wbHVnaW4vY29sb3JnZW5lcmF0aW9uLmpzIiwid2VicGFjazovL29mZi1ieS1vbmUvLi9zcmMvcGx1Z2luL2RvdWJsZVRyaXBsZS5qcyIsIndlYnBhY2s6Ly9vZmYtYnktb25lLy4vc3JjL3BsdWdpbi9mZWIuanMiLCJ3ZWJwYWNrOi8vb2ZmLWJ5LW9uZS8uL3NyYy9wbHVnaW4vZ2VuZXJhdGUxMjMuanMiLCJ3ZWJwYWNrOi8vb2ZmLWJ5LW9uZS8uL3NyYy9wbHVnaW4vbW9kZXJuQUxnb3JpdGhtcy5qcyIsIndlYnBhY2s6Ly9vZmYtYnktb25lLy4vc3JjL3BsdWdpbi90d29TZXBhcmF0ZWQuanMiLCJ3ZWJwYWNrOi8vb2ZmLWJ5LW9uZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vZmYtYnktb25lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vZmYtYnktb25lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vb2ZmLWJ5LW9uZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL29mZi1ieS1vbmUvLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IG9oQXJyYXkyID0gW107XHJcbmZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcclxuICBsZXQgcmFuZG9tVmFsdWUgPSAwLjI3ICsgTWF0aC5yYW5kb20oKSAqIDAuNzQ7XHJcbiAgb2hBcnJheTIucHVzaChyYW5kb21WYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUNvbG9yKCkge1xyXG4gIHJldHVybiBNYXRoLnJhbmRvbSgpICogMC4xOCArIDAuMTU7IC8vIGdlbmVyYXRlcyBhIHJhbmRvbSB2YWx1ZSBiZXR3ZWVuIDAuMDEgYW5kIDAuOThcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlTG9uZ051bWJlcigpIHtcclxuICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIDAuMDggKyAwLjE5OyAvLyBnZW5lcmF0ZXMgYSByYW5kb20gdmFsdWUgYmV0d2VlbiAwLjAxIGFuZCAwLjk4XHJcbn1cclxuXHJcblxyXG5sZXQgbmV3RGF0YW9oQXJyYXkyID0gb2hBcnJheTIuc2xpY2UoMSwyKTtcclxubGV0IG5ld0RhdGFvaEFycmF5MkFzTnVtYmVyID0gTnVtYmVyKG5ld0RhdGFvaEFycmF5Mik7XHJcbi8vY29uc29sZS5sb2cobmV3RGF0YW9oQXJyYXkyQXNOdW1iZXIpO1xyXG5cclxubGV0IGluZGV4MSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG9oQXJyYXkyLmxlbmd0aCk7XHJcbmxldCBpbmRleDIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBvaEFycmF5Mi5sZW5ndGgpO1xyXG5sZXQgaW5kZXgzID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogb2hBcnJheTIubGVuZ3RoKTtcclxuXHJcblxyXG4vLyBVc2UgYXJyYXkgZGVzdHJ1Y3R1cmluZyB0byBhc3NpZ24gdGhlIHZhbHVlcyB0byB2YXJpYWJsZXNcclxuZXhwb3J0IGxldCBbdmFsdWUxLCB2YWx1ZTIsIHZhbHVlM10gPSBbb2hBcnJheTJbaW5kZXgxXSwgb2hBcnJheTJbaW5kZXgyXSwgb2hBcnJheTJbaW5kZXgzXV07XHJcblxyXG4iLCJleHBvcnQgZnVuY3Rpb24gZG91YmxlT3JUcmlwbGUobnVtYmVyKSB7XHJcbiAgLy8gR2VuZXJhdGUgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gMCBhbmQgMVxyXG4gIHZhciByYW5kb21OdW1iZXIgPSBNYXRoLnJhbmRvbSgpO1xyXG5cclxuICBpZiAocmFuZG9tTnVtYmVyIDwgMC41KSB7XHJcbiAgICAvLyBSZXR1cm4gZG91YmxlIHRoZSBpbnB1dCBudW1iZXJcclxuICAgIHJldHVybiBudW1iZXIgKiAyO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBSZXR1cm4gdHJpcGxlIHRoZSBpbnB1dCBudW1iZXJcclxuICAgIHJldHVybiBudW1iZXIgKiAzO1xyXG4gIH1cclxufSIsImxldCBjdXJyZW50TnVtYmVyID0gMTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByYXJlbHlVc2VkQWxnb3JpdGhtKCkge1xyXG4gIGxldCByZXN1bHQgPSBjdXJyZW50TnVtYmVyO1xyXG4gIFxyXG4gIGlmIChjdXJyZW50TnVtYmVyICUgMiA9PT0gMCkge1xyXG4gICAgY3VycmVudE51bWJlciAvPSAyO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjdXJyZW50TnVtYmVyID0gY3VycmVudE51bWJlciAqIDMgKyAxO1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gcmVzdWx0O1xyXG59IiwiIGZ1bmN0aW9uIGdlbmVyYXRlTnVtYmVyMTIzKCkge1xyXG4gIGNvbnN0IG51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMpO1xyXG4gIHJldHVybiBTdHJpbmcobnVtKTtcclxufVxyXG5cclxuXHJcbmNvbnN0IG51bWJlcnMgPSBbXTtcclxuXHJcbmZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgbnVtYmVycy5wdXNoKGdlbmVyYXRlTnVtYmVyMTIzKCkpO1xyXG59XHJcblxyXG5sZXQgaW5kZXgxID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtYmVycy5sZW5ndGgpO1xyXG5sZXQgaW5kZXgyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtYmVycy5sZW5ndGgpO1xyXG5sZXQgaW5kZXgzID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtYmVycy5sZW5ndGgpO1xyXG5sZXQgaW5kZXg0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtYmVycy5sZW5ndGgpO1xyXG5cclxuXHJcbmV4cG9ydCBsZXQgW251bWIxMywgbnVtYjE0LCBudW1iMTUsIG51bWIxNl0gPSBbbnVtYmVyc1tpbmRleDFdLCBudW1iZXJzW2luZGV4Ml0sIG51bWJlcnNbaW5kZXgzXSwgbnVtYmVyc1tpbmRleDRdXTsiLCJleHBvcnQgZnVuY3Rpb24qIGZpYm9uYWNjaUdlbmVyYXRvcigpIHtcclxuICB2YXIgcHJldiA9IDA7XHJcbiAgdmFyIGN1cnIgPSAxO1xyXG5cclxuICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgeWllbGQgcHJldjtcclxuICAgIHZhciBuZXh0ID0gcHJldiArIGN1cnI7XHJcbiAgICBwcmV2ID0gY3VycjtcclxuICAgIGN1cnIgPSBuZXh0O1xyXG4gIH1cclxufSIsImV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kb21FdmVuTnVtYmVyKG1pbiwgbWF4KSB7XHJcbiAgbWluID0gTWF0aC5jZWlsKG1pbik7XHJcbiAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xyXG4gIGxldCByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gIHJldHVybiByYW5kb21OdW1iZXIgJSAyID09PSAwID8gcmFuZG9tTnVtYmVyIDogZ2V0UmFuZG9tRXZlbk51bWJlcihtaW4sIG1heCk7XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJmaWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDUwMCwgaGVpZ2h0OiAyMzAgfSk7XG5jb25zb2xlLmNsZWFyKCk7XG5pbXBvcnQgeyB2YWx1ZTEsIHZhbHVlMiwgdmFsdWUzIH0gZnJvbSAnLi9jb2xvcmdlbmVyYXRpb24uanMnO1xuaW1wb3J0IHsgbnVtYjE0LCBudW1iMTUsIG51bWIxNiB9IGZyb20gJy4vZ2VuZXJhdGUxMjMuanMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVDb2xvciB9IGZyb20gJy4vY29sb3JnZW5lcmF0aW9uLmpzJztcbmltcG9ydCB7IHJhcmVseVVzZWRBbGdvcml0aG0gfSBmcm9tICcuL2ZlYi5qcyc7XG5pbXBvcnQgeyBkb3VibGVPclRyaXBsZSB9IGZyb20gJy4vZG91YmxlVHJpcGxlLmpzJztcbmltcG9ydCB7IGZpYm9uYWNjaUdlbmVyYXRvciB9IGZyb20gJy4vbW9kZXJuQUxnb3JpdGhtcy5qcyc7XG5pbXBvcnQgeyBnZXRSYW5kb21FdmVuTnVtYmVyIH0gZnJvbSAnLi90d29TZXBhcmF0ZWQuanMnO1xuY29uc3QgYmx1ckVmZmVjdCA9IHtcbiAgICB0eXBlOiAnTEFZRVJfQkxVUicsXG4gICAgdmlzaWJsZTogdHJ1ZSxcbiAgICByYWRpdXM6IDYwMCxcbn07XG5jb25zdCBncmFkaWVudDIgPSB7XG4gICAgdHlwZTogJ0dSQURJRU5UX1JBRElBTCcsXG4gICAgdmlzaWJsZTogdHJ1ZSxcbiAgICBncmFkaWVudFN0b3BzOiBbXG4gICAgICAgIHsgY29sb3I6IHsgcjogMC40LCBnOiAwLjIsIGI6IHZhbHVlMywgYTogMSB9LCBwb3NpdGlvbjogMCB9LFxuICAgICAgICB7IGNvbG9yOiB7IHI6IDAuNCwgZzogMC4yLCBiOiB2YWx1ZTEsIGE6IDEgfSwgcG9zaXRpb246IDEgfVxuICAgIF0sXG4gICAgZ3JhZGllbnRUcmFuc2Zvcm06IFtcbiAgICAgICAgWzEsIDAsIDBdLFxuICAgICAgICBbMCwgMSwgMF1cbiAgICBdLFxuICAgIGJsZW5kTW9kZTogJ05PUk1BTCdcbn07XG5jb25zdCBncmFkaWVudCA9IHtcbiAgICB0eXBlOiAnR1JBRElFTlRfTElORUFSJyxcbiAgICBncmFkaWVudFN0b3BzOiBbXG4gICAgICAgIHsgcG9zaXRpb246IDAsIGNvbG9yOiB7IHI6IHZhbHVlMSwgZzogdmFsdWUyLCBiOiAwLjQ4NTEsIGE6IHZhbHVlMiB9IH0sXG4gICAgICAgIHsgcG9zaXRpb246IDEsIGNvbG9yOiB7IHI6IHZhbHVlMSwgZzogdmFsdWUyLCBiOiB2YWx1ZTMsIGE6IHZhbHVlMyB9IH0sXG4gICAgXSxcbiAgICBncmFkaWVudFRyYW5zZm9ybTogW1xuICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgIFsxLCAxLCAwXSxcbiAgICBdLFxuICAgIG9wYWNpdHk6IDEsXG4gICAgYmxlbmRNb2RlOiAnTk9STUFMJyxcbn07XG5sZXQgcGhpID0gKDEgKyA1ICogMC41KSAvIDI7XG5jb25zdCBudW1iZXJzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogNTMgfSwgKF8sIGkpID0+IGkgKyAoMSAqIDEuNTQ4KSAvIDAuNTg1KTtcbmZ1bmN0aW9uIGdldFJhbmRvbVByb3BlcnR5KG51bWJlcnMpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobnVtYmVycyk7XG4gICAgcmV0dXJuIGtleXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICoga2V5cy5sZW5ndGgpXTtcbn1cbmxldCBzdHJhbmdlTnVtYmVyID0gZ2V0UmFuZG9tUHJvcGVydHkobnVtYmVycyk7XG5jb25zdCBjb3JuZXJSYWRpdXMgPSAyNjA7XG5sZXQgZ2VuZXJhdG9yID0gZmlib25hY2NpR2VuZXJhdG9yKCk7XG5maWdtYS51aS5vbm1lc3NhZ2UgPSAobXNnKSA9PiB7XG4gICAgaWYgKG1zZy50eXBlID09PSAnY3JlYXRlLXJlY3RhbmdsZXMnKSB7XG4gICAgICAgIGNvbnN0IG5vZGVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXNnLnZhbHVlOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBtdWx0aXBsaWVyID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTtcbiAgICAgICAgICAgIGNvbnN0IG51bUl0ZXJhdGlvbnMgPSA1NDtcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlUmFuZ2UgPSAwLjE7XG4gICAgICAgICAgICBjb25zdCByb3RhdGlvblJhbmdlID0gNTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtSXRlcmF0aW9uczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb25YID0gTWF0aC5yYW5kb20oKSAqIDMyO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uWSA9IE1hdGgucmFuZG9tKCkgKiAzMjtcbiAgICAgICAgICAgICAgICBjb25zdCBzY2FsZVggPSAxICsgTWF0aC5yYW5kb20oKSAqIHNjYWxlUmFuZ2U7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2NhbGVZID0gMSArIE1hdGgucmFuZG9tKCkgKiBzY2FsZVJhbmdlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvdGF0aW9uQW5nbGUgPSBNYXRoLnJhbmRvbSgpICogcm90YXRpb25SYW5nZTtcbiAgICAgICAgICAgICAgICByZWN0LnggPSBwb3NpdGlvblg7XG4gICAgICAgICAgICAgICAgcmVjdC55ID0gcG9zaXRpb25ZO1xuICAgICAgICAgICAgICAgIHJlY3QucmVzaXplKHJlY3Qud2lkdGggKiBzY2FsZVggLyAxLjEyLCByZWN0LmhlaWdodCAqIHNjYWxlWSAvIDEuMTIpO1xuICAgICAgICAgICAgICAgIHJlY3Qucm90YXRpb24gPSByb3RhdGlvbkFuZ2xlIC8gMC41NjIzMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBuZXh0Rmlib25hY2NpID0gZ2VuZXJhdG9yLm5leHQoKS52YWx1ZTtcbiAgICAgICAgICAgIHJlY3QuYmxlbmRNb2RlID0gJ09WRVJMQVknO1xuICAgICAgICAgICAgcmVjdC5vcGFjaXR5ID0gMC4xMjtcbiAgICAgICAgICAgIGxldCByYXJlbHlVc2VkQWxnb3JpdGhtVmFsdWUgPSByYXJlbHlVc2VkQWxnb3JpdGhtKCk7XG4gICAgICAgICAgICByZWN0LmNvbnN0cmFpbnRzID0geyBob3Jpem9udGFsOiAnU1RSRVRDSCcsIHZlcnRpY2FsOiAnU1RSRVRDSCcgfTtcbiAgICAgICAgICAgIGNvbnN0IG1heFJvdGF0aW9uID0gMjUwO1xuICAgICAgICAgICAgY29uc3Qgcm90YXRpb25WYWx1ZSA9IChpICogK211bHRpcGxpZXIpIC8gcmFyZWx5VXNlZEFsZ29yaXRobVZhbHVlICogbmV4dEZpYm9uYWNjaTtcbiAgICAgICAgICAgIHJlY3Qucm90YXRpb24gPSByb3RhdGlvblZhbHVlIDw9IG1heFJvdGF0aW9uID8gcm90YXRpb25WYWx1ZSA6IG1heFJvdGF0aW9uO1xuICAgICAgICAgICAgcmVjdC5jb3JuZXJSYWRpdXMgPSBjb3JuZXJSYWRpdXM7XG4gICAgICAgICAgICByZWN0LmZpbGxzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogdmFsdWUxLCBnOiB2YWx1ZTIsIGI6IHZhbHVlMyB9LCB9XTtcbiAgICAgICAgICAgIHJlY3QuZmlsbHMgPSBbXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih7IHR5cGU6ICdHUkFESUVOVCcgfSwgZ3JhZGllbnQpLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIHJlY3Qub3BhY2l0eSA9IDAuMDI7XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5hcHBlbmRDaGlsZChyZWN0KTtcbiAgICAgICAgICAgIG5vZGVzLnB1c2gocmVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmxlbmRNb2RlcyA9IFtcbiAgICAgICAgICAgICdOT1JNQUwnLFxuICAgICAgICAgICAgJ0RBUktFTicsXG4gICAgICAgICAgICAnTVVMVElQTFknLFxuICAgICAgICAgICAgJ0xJTkVBUl9CVVJOJyxcbiAgICAgICAgICAgICdDT0xPUl9CVVJOJyxcbiAgICAgICAgICAgICdMSUdIVEVOJyxcbiAgICAgICAgICAgICdTQ1JFRU4nLFxuICAgICAgICAgICAgJ0xJTkVBUl9ET0RHRScsXG4gICAgICAgICAgICAnQ09MT1JfRE9ER0UnLFxuICAgICAgICAgICAgJ09WRVJMQVknLFxuICAgICAgICAgICAgJ1NPRlRfTElHSFQnLFxuICAgICAgICAgICAgJ0hBUkRfTElHSFQnLFxuICAgICAgICAgICAgJ0RJRkZFUkVOQ0UnLFxuICAgICAgICAgICAgJ0VYQ0xVU0lPTicsXG4gICAgICAgICAgICAnSFVFJyxcbiAgICAgICAgICAgICdTQVRVUkFUSU9OJyxcbiAgICAgICAgICAgICdDT0xPUicsXG4gICAgICAgICAgICAnTFVNSU5PU0lUWScsXG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IG1pbldpZHRoID0gNTAwO1xuICAgICAgICBjb25zdCBtYXhXaWR0aCA9IDE1MDA7XG4gICAgICAgIGNvbnN0IG1pbkhlaWdodCA9IDIwO1xuICAgICAgICBjb25zdCBtYXhIZWlnaHQgPSAxMDA7XG4gICAgICAgIGNvbnN0IG5vZGVzUG9seSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1zZy52YWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbXVsdGlwbGllciA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICBjb25zdCBwb2x5Z2cgPSBmaWdtYS5jcmVhdGVQb2x5Z29uKCk7XG4gICAgICAgICAgICBwb2x5Z2cucG9pbnRDb3VudCA9IDQ7XG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtUG9zID0gcG9seWdnLmFic29sdXRlVHJhbnNmb3JtO1xuICAgICAgICAgICAgbGV0IG5ld1kgPSB0cmFuc2Zvcm1Qb3NbMV1bMl07XG4gICAgICAgICAgICBjb25zdCBjb2xvclZhbHVlMyA9IGdlbmVyYXRlQ29sb3IoKTtcbiAgICAgICAgICAgIHBvbHlnZy5yZXNpemVXaXRob3V0Q29uc3RyYWludHMoK2RvdWJsZU9yVHJpcGxlKCtzdHJhbmdlTnVtYmVyKSArICtudW1iMTQgLyAxLjAxLCArc3RyYW5nZU51bWJlciArIGNvbG9yVmFsdWUzICsgK25ld1kgLyArY29sb3JWYWx1ZTMgLyAyICogMS4wMSk7XG4gICAgICAgICAgICBjb25zdCByYW5kb21XaWR0aCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXhXaWR0aCAtIG1pbldpZHRoICsgMSkpICsgbWluV2lkdGg7XG4gICAgICAgICAgICBjb25zdCByYW5kb21IZWlnaHQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4SGVpZ2h0IC0gbWluSGVpZ2h0ICsgMSkpICsgbWluSGVpZ2h0O1xuICAgICAgICAgICAgcG9seWdnLnJlc2l6ZShyYW5kb21XaWR0aCwgcmFuZG9tSGVpZ2h0KTtcbiAgICAgICAgICAgIHBvbHlnZy5vcGFjaXR5ID0gMC41O1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tQmxlbmRNb2RlID0gYmxlbmRNb2Rlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBibGVuZE1vZGVzLmxlbmd0aCldO1xuICAgICAgICAgICAgcG9seWdnLmJsZW5kTW9kZSA9IHJhbmRvbUJsZW5kTW9kZTtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcG9seWdnLnBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHBvbHlnZyk7XG4gICAgICAgICAgICBwb2x5Z2cuY29uc3RyYWludHMgPSB7IGhvcml6b250YWw6ICdTVFJFVENIJywgdmVydGljYWw6ICdTVFJFVENIJyB9O1xuICAgICAgICAgICAgcG9seWdnLnggPSArc3RyYW5nZU51bWJlciAqICttdWx0aXBsaWVyIC8gcGhpO1xuICAgICAgICAgICAgcG9seWdnLnJvdGF0aW9uID0gaSArIHBoaSAqICtzdHJhbmdlTnVtYmVyICsgK2luZGV4O1xuICAgICAgICAgICAgcG9seWdnLnkgPSA4NyAvICtzdHJhbmdlTnVtYmVyICsgK2luZGV4O1xuICAgICAgICAgICAgcG9seWdnLmZpbGxzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogY29sb3JWYWx1ZTMsIGc6IHZhbHVlMiwgYjogdmFsdWUxIH0gfV07XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5hcHBlbmRDaGlsZChwb2x5Z2cpO1xuICAgICAgICAgICAgbm9kZXNQb2x5LnB1c2gocG9seWdnKTtcbiAgICAgICAgICAgIG5vZGVzLnB1c2gocG9seWdnKTtcbiAgICAgICAgfVxuICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcobm9kZXMpO1xuICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcobm9kZXNQb2x5KTtcbiAgICAgICAgbGV0IGdldFJhbmRvbUV2ZW5OdW1iZXJSZXN1bHQgPSBnZXRSYW5kb21FdmVuTnVtYmVyKDIsIDEwMCk7XG4gICAgICAgIGNvbnN0IG5ld05vZGUgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgICAgICBuZXdOb2RlLmJhY2tncm91bmRzID0gW2dyYWRpZW50Ml07XG4gICAgICAgIG5ld05vZGUuY2xpcHNDb250ZW50ID0gdHJ1ZTtcbiAgICAgICAgbmV3Tm9kZS5leHBhbmRlZCA9IGZhbHNlO1xuICAgICAgICBuZXdOb2RlLm5hbWUgPSAnUkVTVUxUJztcbiAgICAgICAgbGV0IHJhcmVseVVzZWRBbGdvcml0aG1WYWx1ZSA9IHJhcmVseVVzZWRBbGdvcml0aG0oKTtcbiAgICAgICAgbmV3Tm9kZS55ID0gcmFyZWx5VXNlZEFsZ29yaXRobVZhbHVlICogTWF0aC5mbG9vcigrc3RyYW5nZU51bWJlciAvIDYxICsgK251bWIxNikgKyAzICogTWF0aC5mbG9vcigyICsgK251bWIxNSArIGdldFJhbmRvbUV2ZW5OdW1iZXJSZXN1bHQpO1xuICAgICAgICBuZXdOb2RlLnJlc2l6ZSgxMjAwLCAxMjAwKTtcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gbm9kZXM7XG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IG5vZGVzO1xuICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcobm9kZXMpO1xuICAgICAgICBjb25zdCBub2RlczQgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgICAgIG5vZGVzNC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBuZXdOb2RlLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgbm9kZXMzID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgICAgICBub2RlczMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgbmV3Tm9kZS5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAobGV0IGkgPSBub2Rlc1BvbHkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICAgICAgW25vZGVzUG9seVtpXSwgbm9kZXNQb2x5W2pdXSA9IFtub2Rlc1BvbHlbal0sIG5vZGVzUG9seVtpXV07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlc1BvbHkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHBvbHlnZyA9IG5vZGVzUG9seVtpXTtcbiAgICAgICAgICAgIHBvbHlnZy5wYXJlbnQuaW5zZXJ0Q2hpbGQoaSwgcG9seWdnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmcmFtZSA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUoKG5vZGUpID0+IG5vZGUubmFtZSA9PT0gJ1JFU1VMVCcpO1xuICAgICAgICBsZXQgbWluWCA9IEluZmluaXR5O1xuICAgICAgICBsZXQgbWluWSA9IEluZmluaXR5O1xuICAgICAgICBsZXQgbWF4WCA9IC1JbmZpbml0eTtcbiAgICAgICAgbGV0IG1heFkgPSAtSW5maW5pdHk7XG4gICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBmcmFtZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgbWluWCA9IE1hdGgubWluKG1pblgsIGVsZW1lbnQueCk7XG4gICAgICAgICAgICBtaW5ZID0gTWF0aC5taW4obWluWSwgZWxlbWVudC55KTtcbiAgICAgICAgICAgIG1heFggPSBNYXRoLm1heChtYXhYLCBlbGVtZW50LnggKyBlbGVtZW50LndpZHRoKTtcbiAgICAgICAgICAgIG1heFkgPSBNYXRoLm1heChtYXhZLCBlbGVtZW50LnkgKyBlbGVtZW50LmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmlzaWJsZUJvdW5kcyA9IHtcbiAgICAgICAgICAgIHg6IG1pblgsXG4gICAgICAgICAgICB5OiBtaW5ZLFxuICAgICAgICAgICAgd2lkdGg6IG1heFggLSBtaW5YLFxuICAgICAgICAgICAgaGVpZ2h0OiBtYXhZIC0gbWluWSxcbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGZyYW1lLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudC54IDwgdmlzaWJsZUJvdW5kcy54IHx8XG4gICAgICAgICAgICAgICAgZWxlbWVudC55IDwgdmlzaWJsZUJvdW5kcy55IHx8XG4gICAgICAgICAgICAgICAgZWxlbWVudC54ICsgZWxlbWVudC53aWR0aCA+IHZpc2libGVCb3VuZHMueCArIHZpc2libGVCb3VuZHMud2lkdGggfHxcbiAgICAgICAgICAgICAgICBlbGVtZW50LnkgKyBlbGVtZW50LmhlaWdodCA+IHZpc2libGVCb3VuZHMueSArIHZpc2libGVCb3VuZHMuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBudW1iZXJPZkVsZW1lbnRzVG9TZWxlY3QgPSA0NTtcbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZFbGVtZW50c1RvU2VsZWN0OyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZnJhbWUuY2hpbGRyZW4ubGVuZ3RoKTtcbiAgICAgICAgICAgIHNlbGVjdGlvbi5wdXNoKGZyYW1lLmNoaWxkcmVuW3JhbmRvbUluZGV4XSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFyZW50ID0gZnJhbWU7XG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IHNlbGVjdGlvbjtcbiAgICAgICAgY29uc3QgdW5pb25SZXN1bHQgPSBmaWdtYS51bmlvbihzZWxlY3Rpb24sIHBhcmVudCk7XG4gICAgICAgIGlmICh1bmlvblJlc3VsdC50eXBlID09PSAnQk9PTEVBTl9PUEVSQVRJT04nKSB7XG4gICAgICAgICAgICBjb25zdCBzY2FsZVggPSBmcmFtZS53aWR0aCAvIHVuaW9uUmVzdWx0LndpZHRoO1xuICAgICAgICAgICAgY29uc3Qgc2NhbGVZID0gZnJhbWUuaGVpZ2h0IC8gdW5pb25SZXN1bHQuaGVpZ2h0O1xuICAgICAgICAgICAgdW5pb25SZXN1bHQucmVzaXplKHVuaW9uUmVzdWx0LndpZHRoICogc2NhbGVYLCB1bmlvblJlc3VsdC5oZWlnaHQgKiBzY2FsZVkpO1xuICAgICAgICAgICAgdW5pb25SZXN1bHQueCA9IDA7XG4gICAgICAgICAgICB1bmlvblJlc3VsdC55ID0gMzUwO1xuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gW3VuaW9uUmVzdWx0XTtcbiAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXhwZWN0ZWQgYSBCT09MRUFOX09QRVJBVElPTiBub2RlJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuaW9uUmVzdWx0LnR5cGUgPT09ICdCT09MRUFOX09QRVJBVElPTicpIHtcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlWCA9IGZyYW1lLndpZHRoIC8gdW5pb25SZXN1bHQud2lkdGg7XG4gICAgICAgICAgICBjb25zdCBzY2FsZVkgPSBmcmFtZS5oZWlnaHQgLyB1bmlvblJlc3VsdC5oZWlnaHQ7XG4gICAgICAgICAgICB1bmlvblJlc3VsdC5yZXNpemUodW5pb25SZXN1bHQud2lkdGggKiBzY2FsZVgsIHVuaW9uUmVzdWx0LmhlaWdodCAqIHNjYWxlWSk7XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbdW5pb25SZXN1bHRdO1xuICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFeHBlY3RlZCBhIEJPT0xFQU5fT1BFUkFUSU9OIG5vZGUnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IEFycmF5LmZyb20obmV3Tm9kZS5jaGlsZHJlbik7XG4gICAgICAgIGNvbnN0IHNodWZmbGVkQ2hpbGRyZW4gPSBzaHVmZmxlQXJyYXkoY2hpbGRyZW4pO1xuICAgICAgICBzaHVmZmxlZENoaWxkcmVuLmZvckVhY2goKGNoaWxkLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY2hpbGQucGFyZW50Lmluc2VydENoaWxkKGluZGV4LCBjaGlsZCk7XG4gICAgICAgIH0pO1xuICAgICAgICBmdW5jdGlvbiBzaHVmZmxlQXJyYXkoYXJyYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IHNodWZmbGVkQXJyYXkgPSBhcnJheS5zbGljZSgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHNodWZmbGVkQXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgICAgICAgICBbc2h1ZmZsZWRBcnJheVtpXSwgc2h1ZmZsZWRBcnJheVtqXV0gPSBbc2h1ZmZsZWRBcnJheVtqXSwgc2h1ZmZsZWRBcnJheVtpXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2h1ZmZsZWRBcnJheTtcbiAgICAgICAgfVxuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbXTtcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gW3VuaW9uUmVzdWx0XTtcbiAgICAgICAgdW5pb25SZXN1bHQuZWZmZWN0cyA9IFtibHVyRWZmZWN0XTtcbiAgICAgICAgdW5pb25SZXN1bHQuYmxlbmRNb2RlID0gJ0RJRkZFUkVOQ0UnO1xuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG5ld05vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCk7XG4gICAgICAgICAgICBzd2l0Y2ggKHJhbmRvbUluZGV4KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBjaGlsZC54ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQueSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQueCA9IDEyMDA7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnkgPSAxMjAwO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnggPSAwO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC55ID0gMTIwMDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICBjaGlsZC54ID0gMTIwMDtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQueSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvbGlkQ29sb3IgPSB7XG4gICAgICAgICAgICB0eXBlOiAnU09MSUQnLFxuICAgICAgICAgICAgY29sb3I6IHsgcjogMC45LCBnOiAwLjIsIGI6IDAuNSB9LFxuICAgICAgICB9O1xuICAgICAgICB1bmlvblJlc3VsdC5maWxscyA9IFtzb2xpZENvbG9yXTtcbiAgICAgICAgdW5pb25SZXN1bHQueCA9IDA7XG4gICAgICAgIHVuaW9uUmVzdWx0LnkgPSAwO1xuICAgICAgICBuZXdOb2RlLnJlc2l6ZSg2MDAwLCA2MDAwKTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2NyZWF0ZS1yZWN0YW5nbGVzJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBNYW4gJHttc2cudmFsdWV9IHlvdSBhcmUganVzdCBncmVhdGAsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==