/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app/components/deselect.ts":
/*!****************************************!*\
  !*** ./src/app/components/deselect.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deselect2": () => (/* binding */ deselect2)
/* harmony export */ });
function deselect2() {
    const currentPage = figma.currentPage;
    currentPage.selection = [];
    figma.notify('All nodes have been deselected.');
}


/***/ }),

/***/ "./src/app/components/invertSelection.ts":
/*!***********************************************!*\
  !*** ./src/app/components/invertSelection.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "invertSelection": () => (/* binding */ invertSelection)
/* harmony export */ });
function invertSelection() {
    const currentPage = figma.currentPage;
    const allNodes = [];
    const selectedNodes = new Set(currentPage.selection);
    function traverse(node) {
        if ('children' in node) {
            for (const child of node.children) {
                traverse(child);
            }
        }
        else {
            allNodes.push(node);
        }
    }
    traverse(currentPage);
    const invertedSelection = allNodes.filter((node) => !selectedNodes.has(node));
    currentPage.selection = invertedSelection;
    figma.notify(`Selection inverted. ${invertedSelection.length} nodes selected.`);
}


/***/ }),

/***/ "./src/app/components/selectBasedonSelected.ts":
/*!*****************************************************!*\
  !*** ./src/app/components/selectBasedonSelected.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "selectTextNodesWithSameFont": () => (/* binding */ selectTextNodesWithSameFont)
/* harmony export */ });
function selectTextNodesWithSameFont() {
    const currentPage = figma.currentPage;
    const selectedNodes = [];
    currentPage.children.forEach(node => {
        if (node.type === 'FRAME') {
            node.children.forEach(child => {
                if (child.type === 'TEXT' && Object.keys(child.boundVariables).length === 0) {
                    selectedNodes.push(child);
                }
            });
        }
    });
    if (selectedNodes.length > 0) {
        currentPage.selection = selectedNodes;
    }
    else {
        figma.notify('No text nodes without applied variables found inside frames.');
    }
}


/***/ }),

/***/ "./src/app/components/selectTextNodesWithoutFontVariables.ts":
/*!*******************************************************************!*\
  !*** ./src/app/components/selectTextNodesWithoutFontVariables.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "selectAllNodesExceptTextNodes": () => (/* binding */ selectAllNodesExceptTextNodes)
/* harmony export */ });
function selectAllNodesExceptTextNodes() {
    const currentPage = figma.currentPage;
    const nonTextNodes = [];
    currentPage.children.forEach(node => {
        if (node.type !== 'TEXT') {
            nonTextNodes.push(node);
        }
    });
    if (nonTextNodes.length > 0) {
        currentPage.selection = nonTextNodes;
    }
    else {
        figma.notify('No non-text nodes found.');
    }
}


/***/ }),

/***/ "./src/app/components/selectTextNodesWithoutVariables.ts":
/*!***************************************************************!*\
  !*** ./src/app/components/selectTextNodesWithoutVariables.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "selectTextNodesWithoutVariables": () => (/* binding */ selectTextNodesWithoutVariables)
/* harmony export */ });
function selectTextNodesWithoutVariables() {
    const currentPage = figma.currentPage;
    const selectedNodes = [];
    currentPage.children.forEach(node => {
        if (node.type === 'TEXT' && Object.keys(node.boundVariables).length === 0) {
            selectedNodes.push(node);
        }
    });
    if (selectedNodes.length > 0) {
        currentPage.selection = selectedNodes;
    }
    else {
        figma.notify('No text nodes without applied variables found.');
    }
}


/***/ }),

/***/ "./src/app/components/loadFonts.js":
/*!*****************************************!*\
  !*** ./src/app/components/loadFonts.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadFonts": () => (/* binding */ loadFonts)
/* harmony export */ });
async function loadFonts() {
  const fontNames = ['Inter', 'Roboto', 'Montserrat', 'Cardo', 'Arial'];

  // Load necessary fonts
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Montserrat', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Cardo', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Arial', style: 'Regular' });

  return fontNames;
}

/***/ }),

/***/ "./src/app/components/selectAllTextNodes.js":
/*!**************************************************!*\
  !*** ./src/app/components/selectAllTextNodes.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "selectAllTextNodes": () => (/* binding */ selectAllTextNodes)
/* harmony export */ });
// selectAllTextNodes.js

function selectAllTextNodes() {
  let textNodes = figma.currentPage.findAll(node => node.type === 'TEXT');
  figma.currentPage.selection = textNodes;
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
/* harmony import */ var _app_components_selectAllTextNodes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app/components/selectAllTextNodes */ "./src/app/components/selectAllTextNodes.js");
/* harmony import */ var _app_components_selectTextNodesWithoutVariables__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app/components/selectTextNodesWithoutVariables */ "./src/app/components/selectTextNodesWithoutVariables.ts");
/* harmony import */ var _app_components_selectTextNodesWithoutFontVariables__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app/components/selectTextNodesWithoutFontVariables */ "./src/app/components/selectTextNodesWithoutFontVariables.ts");
/* harmony import */ var _app_components_loadFonts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../app/components/loadFonts */ "./src/app/components/loadFonts.js");
/* harmony import */ var _app_components_selectBasedonSelected__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../app/components/selectBasedonSelected */ "./src/app/components/selectBasedonSelected.ts");
/* harmony import */ var _app_components_deselect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../app/components/deselect */ "./src/app/components/deselect.ts");
/* harmony import */ var _app_components_invertSelection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../app/components/invertSelection */ "./src/app/components/invertSelection.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







figma.showUI(__html__, { width: 440, height: 510 });
const updateSelectedTextNodesCount = () => {
    const selectedNodes = figma.currentPage.selection;
    const selectedTextNodesCount = selectedNodes.filter((node) => node.type === 'TEXT').length;
    figma.ui.postMessage({
        type: 'selected-text-nodes-count',
        selectedTextNodesCount,
    });
};
updateSelectedTextNodesCount();
figma.on('selectionchange', updateSelectedTextNodesCount);
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.selectAlltexts === true) {
        (0,_app_components_selectAllTextNodes__WEBPACK_IMPORTED_MODULE_0__.selectAllTextNodes)();
        return;
    }
    if (msg.type === 'select-text-nodes-without-variables') {
        (0,_app_components_selectTextNodesWithoutVariables__WEBPACK_IMPORTED_MODULE_1__.selectTextNodesWithoutVariables)();
        return;
        console.clear();
    }
    if (msg.type === 'select-text-nodes-without-variables2') {
        (0,_app_components_selectTextNodesWithoutFontVariables__WEBPACK_IMPORTED_MODULE_2__.selectAllNodesExceptTextNodes)();
        return;
        console.clear();
    }
    if (msg.type === 'select-text-nodes-without-variables3') {
        (0,_app_components_selectBasedonSelected__WEBPACK_IMPORTED_MODULE_4__.selectTextNodesWithSameFont)();
        return;
    }
    if (msg.type === 'select-text-nodes-without-variables4') {
        (0,_app_components_deselect__WEBPACK_IMPORTED_MODULE_5__.deselect2)();
        return;
    }
    if (msg.type === 'select-text-nodes-without-variables5') {
        (0,_app_components_invertSelection__WEBPACK_IMPORTED_MODULE_6__.invertSelection)();
        return;
        console.clear();
    }
    console.clear();
    if (msg.type === 'create-rectangles') {
        const selectedNodes = figma.currentPage.selection;
        figma.ui.postMessage({
            type: 'selected-text-nodes-count',
            selectedTextNodesCount: selectedNodes.filter((node) => node.type === 'TEXT').length,
        });
        if (selectedNodes.length === 0) {
            figma.ui.postMessage({
                type: 'update-text-styles',
                message: 'No text nodes selected',
            });
            figma.closePlugin();
            return;
        }
        const fontNamesSet = new Set();
        selectedNodes.forEach((node) => {
            if (node.type === 'TEXT') {
                const textNode = node;
                const fontName = textNode.fontName;
                if (Array.isArray(fontName)) {
                    console.log('TextNode has mixed fonts:', fontName);
                    fontName.forEach((fn) => fontNamesSet.add(`${fn.family}-${fn.style}`));
                }
                else if (fontName !== figma.mixed) {
                    fontNamesSet.add(`${fontName.family}`);
                }
                else {
                    console.log('TextNode has mixed fonts.');
                }
            }
            else {
                console.log('Selected node is not a TextNode.');
            }
        });
        let allCollectedFonts = Array.from(fontNamesSet);
        if (allCollectedFonts.length === 0) {
            allCollectedFonts = yield (0,_app_components_loadFonts__WEBPACK_IMPORTED_MODULE_3__.loadFonts)();
        }
        console.log(allCollectedFonts);
        const collection = figma.variables.createVariableCollection('Generated Font Collection');
        const modeId = collection.modes[0].modeId;
        const fontFamilyVars = [];
        for (let i = 0; i < allCollectedFonts.length; i++) {
            if (i >= msg.count)
                break;
            const fontName = allCollectedFonts[i];
            const fontFamilyVar = figma.variables.createVariable(fontName, collection, 'STRING');
            fontFamilyVar.setValueForMode(modeId, fontName);
            fontFamilyVars.push(fontFamilyVar);
        }
        while (fontFamilyVars.length > msg.count) {
            const randomIndexToRemove = Math.floor(Math.random() * fontFamilyVars.length);
            const removedVar = fontFamilyVars.splice(randomIndexToRemove, 1)[0];
            removedVar.remove();
        }
        const hasBoundVariables = (node) => {
            return Object.keys(node.boundVariables).length > 0;
        };
        for (let i = 0; i < selectedNodes.length; i++) {
            const node = selectedNodes[i];
            if (node.type !== 'TEXT')
                continue;
            console.clear();
            const textNode = node;
            const shouldSkipAssignment = msg.isChecked === false && hasBoundVariables(textNode);
            if (!shouldSkipAssignment) {
                const randomIndex = Math.floor(Math.random() * fontFamilyVars.length);
                const randomFontFamilyVar = fontFamilyVars[randomIndex];
                textNode.setBoundVariable('fontFamily', randomFontFamilyVar);
            }
        }
        figma.ui.postMessage({
            type: 'update-text-styles',
            message: `Updated styles for ${selectedNodes.length} text nodes`,
        });
        figma.closePlugin();
    }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMEJBQTBCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsc0JBQXNCO0FBQ2pFLFNBQVM7QUFDVDtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0ZvbnQgVmFyaWFibGVzIE1ha2VyLy4vc3JjL2FwcC9jb21wb25lbnRzL2Rlc2VsZWN0LnRzIiwid2VicGFjazovL0ZvbnQgVmFyaWFibGVzIE1ha2VyLy4vc3JjL2FwcC9jb21wb25lbnRzL2ludmVydFNlbGVjdGlvbi50cyIsIndlYnBhY2s6Ly9Gb250IFZhcmlhYmxlcyBNYWtlci8uL3NyYy9hcHAvY29tcG9uZW50cy9zZWxlY3RCYXNlZG9uU2VsZWN0ZWQudHMiLCJ3ZWJwYWNrOi8vRm9udCBWYXJpYWJsZXMgTWFrZXIvLi9zcmMvYXBwL2NvbXBvbmVudHMvc2VsZWN0VGV4dE5vZGVzV2l0aG91dEZvbnRWYXJpYWJsZXMudHMiLCJ3ZWJwYWNrOi8vRm9udCBWYXJpYWJsZXMgTWFrZXIvLi9zcmMvYXBwL2NvbXBvbmVudHMvc2VsZWN0VGV4dE5vZGVzV2l0aG91dFZhcmlhYmxlcy50cyIsIndlYnBhY2s6Ly9Gb250IFZhcmlhYmxlcyBNYWtlci8uL3NyYy9hcHAvY29tcG9uZW50cy9sb2FkRm9udHMuanMiLCJ3ZWJwYWNrOi8vRm9udCBWYXJpYWJsZXMgTWFrZXIvLi9zcmMvYXBwL2NvbXBvbmVudHMvc2VsZWN0QWxsVGV4dE5vZGVzLmpzIiwid2VicGFjazovL0ZvbnQgVmFyaWFibGVzIE1ha2VyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0ZvbnQgVmFyaWFibGVzIE1ha2VyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9Gb250IFZhcmlhYmxlcyBNYWtlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0ZvbnQgVmFyaWFibGVzIE1ha2VyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vRm9udCBWYXJpYWJsZXMgTWFrZXIvLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGRlc2VsZWN0MigpIHtcclxuICAgIGNvbnN0IGN1cnJlbnRQYWdlID0gZmlnbWEuY3VycmVudFBhZ2U7XHJcbiAgICBjdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbXTtcclxuICAgIGZpZ21hLm5vdGlmeSgnQWxsIG5vZGVzIGhhdmUgYmVlbiBkZXNlbGVjdGVkLicpO1xyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBpbnZlcnRTZWxlY3Rpb24oKSB7XHJcbiAgICBjb25zdCBjdXJyZW50UGFnZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xyXG4gICAgY29uc3QgYWxsTm9kZXMgPSBbXTtcclxuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSBuZXcgU2V0KGN1cnJlbnRQYWdlLnNlbGVjdGlvbik7XHJcbiAgICBmdW5jdGlvbiB0cmF2ZXJzZShub2RlKSB7XHJcbiAgICAgICAgaWYgKCdjaGlsZHJlbicgaW4gbm9kZSkge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIHRyYXZlcnNlKGNoaWxkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgYWxsTm9kZXMucHVzaChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB0cmF2ZXJzZShjdXJyZW50UGFnZSk7XHJcbiAgICBjb25zdCBpbnZlcnRlZFNlbGVjdGlvbiA9IGFsbE5vZGVzLmZpbHRlcigobm9kZSkgPT4gIXNlbGVjdGVkTm9kZXMuaGFzKG5vZGUpKTtcclxuICAgIGN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IGludmVydGVkU2VsZWN0aW9uO1xyXG4gICAgZmlnbWEubm90aWZ5KGBTZWxlY3Rpb24gaW52ZXJ0ZWQuICR7aW52ZXJ0ZWRTZWxlY3Rpb24ubGVuZ3RofSBub2RlcyBzZWxlY3RlZC5gKTtcclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gc2VsZWN0VGV4dE5vZGVzV2l0aFNhbWVGb250KCkge1xyXG4gICAgY29uc3QgY3VycmVudFBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcclxuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSBbXTtcclxuICAgIGN1cnJlbnRQYWdlLmNoaWxkcmVuLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJykge1xyXG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdURVhUJyAmJiBPYmplY3Qua2V5cyhjaGlsZC5ib3VuZFZhcmlhYmxlcykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWROb2Rlcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBpZiAoc2VsZWN0ZWROb2Rlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gc2VsZWN0ZWROb2RlcztcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZpZ21hLm5vdGlmeSgnTm8gdGV4dCBub2RlcyB3aXRob3V0IGFwcGxpZWQgdmFyaWFibGVzIGZvdW5kIGluc2lkZSBmcmFtZXMuJyk7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEFsbE5vZGVzRXhjZXB0VGV4dE5vZGVzKCkge1xyXG4gICAgY29uc3QgY3VycmVudFBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcclxuICAgIGNvbnN0IG5vblRleHROb2RlcyA9IFtdO1xyXG4gICAgY3VycmVudFBhZ2UuY2hpbGRyZW4uZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICBpZiAobm9kZS50eXBlICE9PSAnVEVYVCcpIHtcclxuICAgICAgICAgICAgbm9uVGV4dE5vZGVzLnB1c2gobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBpZiAobm9uVGV4dE5vZGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBub25UZXh0Tm9kZXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmaWdtYS5ub3RpZnkoJ05vIG5vbi10ZXh0IG5vZGVzIGZvdW5kLicpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBzZWxlY3RUZXh0Tm9kZXNXaXRob3V0VmFyaWFibGVzKCkge1xyXG4gICAgY29uc3QgY3VycmVudFBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcclxuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSBbXTtcclxuICAgIGN1cnJlbnRQYWdlLmNoaWxkcmVuLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ1RFWFQnICYmIE9iamVjdC5rZXlzKG5vZGUuYm91bmRWYXJpYWJsZXMpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBzZWxlY3RlZE5vZGVzLnB1c2gobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBpZiAoc2VsZWN0ZWROb2Rlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gc2VsZWN0ZWROb2RlcztcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZpZ21hLm5vdGlmeSgnTm8gdGV4dCBub2RlcyB3aXRob3V0IGFwcGxpZWQgdmFyaWFibGVzIGZvdW5kLicpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkRm9udHMoKSB7XHJcbiAgY29uc3QgZm9udE5hbWVzID0gWydJbnRlcicsICdSb2JvdG8nLCAnTW9udHNlcnJhdCcsICdDYXJkbycsICdBcmlhbCddO1xyXG5cclxuICAvLyBMb2FkIG5lY2Vzc2FyeSBmb250c1xyXG4gIGF3YWl0IGZpZ21hLmxvYWRGb250QXN5bmMoeyBmYW1pbHk6ICdJbnRlcicsIHN0eWxlOiAnUmVndWxhcicgfSk7XHJcbiAgYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyh7IGZhbWlseTogJ1JvYm90bycsIHN0eWxlOiAnUmVndWxhcicgfSk7XHJcbiAgYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyh7IGZhbWlseTogJ01vbnRzZXJyYXQnLCBzdHlsZTogJ1JlZ3VsYXInIH0pO1xyXG4gIGF3YWl0IGZpZ21hLmxvYWRGb250QXN5bmMoeyBmYW1pbHk6ICdDYXJkbycsIHN0eWxlOiAnUmVndWxhcicgfSk7XHJcbiAgYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyh7IGZhbWlseTogJ0FyaWFsJywgc3R5bGU6ICdSZWd1bGFyJyB9KTtcclxuXHJcbiAgcmV0dXJuIGZvbnROYW1lcztcclxufSIsIi8vIHNlbGVjdEFsbFRleHROb2Rlcy5qc1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEFsbFRleHROb2RlcygpIHtcclxuICBsZXQgdGV4dE5vZGVzID0gZmlnbWEuY3VycmVudFBhZ2UuZmluZEFsbChub2RlID0+IG5vZGUudHlwZSA9PT0gJ1RFWFQnKTtcclxuICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSB0ZXh0Tm9kZXM7XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbmltcG9ydCB7IHNlbGVjdEFsbFRleHROb2RlcyB9IGZyb20gJy4uL2FwcC9jb21wb25lbnRzL3NlbGVjdEFsbFRleHROb2Rlcyc7XHJcbmltcG9ydCB7IHNlbGVjdFRleHROb2Rlc1dpdGhvdXRWYXJpYWJsZXMgfSBmcm9tICcuLi9hcHAvY29tcG9uZW50cy9zZWxlY3RUZXh0Tm9kZXNXaXRob3V0VmFyaWFibGVzJztcclxuaW1wb3J0IHsgc2VsZWN0QWxsTm9kZXNFeGNlcHRUZXh0Tm9kZXMgfSBmcm9tICcuLi9hcHAvY29tcG9uZW50cy9zZWxlY3RUZXh0Tm9kZXNXaXRob3V0Rm9udFZhcmlhYmxlcyc7XHJcbmltcG9ydCB7IGxvYWRGb250cyB9IGZyb20gJy4uL2FwcC9jb21wb25lbnRzL2xvYWRGb250cyc7XHJcbmltcG9ydCB7IHNlbGVjdFRleHROb2Rlc1dpdGhTYW1lRm9udCB9IGZyb20gJy4uL2FwcC9jb21wb25lbnRzL3NlbGVjdEJhc2Vkb25TZWxlY3RlZCc7XHJcbmltcG9ydCB7IGRlc2VsZWN0MiB9IGZyb20gJy4uL2FwcC9jb21wb25lbnRzL2Rlc2VsZWN0JztcclxuaW1wb3J0IHsgaW52ZXJ0U2VsZWN0aW9uIH0gZnJvbSAnLi4vYXBwL2NvbXBvbmVudHMvaW52ZXJ0U2VsZWN0aW9uJztcclxuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiA0NDAsIGhlaWdodDogNTEwIH0pO1xyXG5jb25zdCB1cGRhdGVTZWxlY3RlZFRleHROb2Rlc0NvdW50ID0gKCkgPT4ge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcclxuICAgIGNvbnN0IHNlbGVjdGVkVGV4dE5vZGVzQ291bnQgPSBzZWxlY3RlZE5vZGVzLmZpbHRlcigobm9kZSkgPT4gbm9kZS50eXBlID09PSAnVEVYVCcpLmxlbmd0aDtcclxuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcclxuICAgICAgICB0eXBlOiAnc2VsZWN0ZWQtdGV4dC1ub2Rlcy1jb3VudCcsXHJcbiAgICAgICAgc2VsZWN0ZWRUZXh0Tm9kZXNDb3VudCxcclxuICAgIH0pO1xyXG59O1xyXG51cGRhdGVTZWxlY3RlZFRleHROb2Rlc0NvdW50KCk7XHJcbmZpZ21hLm9uKCdzZWxlY3Rpb25jaGFuZ2UnLCB1cGRhdGVTZWxlY3RlZFRleHROb2Rlc0NvdW50KTtcclxuZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICBpZiAobXNnLnNlbGVjdEFsbHRleHRzID09PSB0cnVlKSB7XHJcbiAgICAgICAgc2VsZWN0QWxsVGV4dE5vZGVzKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKG1zZy50eXBlID09PSAnc2VsZWN0LXRleHQtbm9kZXMtd2l0aG91dC12YXJpYWJsZXMnKSB7XHJcbiAgICAgICAgc2VsZWN0VGV4dE5vZGVzV2l0aG91dFZhcmlhYmxlcygpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zb2xlLmNsZWFyKCk7XHJcbiAgICB9XHJcbiAgICBpZiAobXNnLnR5cGUgPT09ICdzZWxlY3QtdGV4dC1ub2Rlcy13aXRob3V0LXZhcmlhYmxlczInKSB7XHJcbiAgICAgICAgc2VsZWN0QWxsTm9kZXNFeGNlcHRUZXh0Tm9kZXMoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc29sZS5jbGVhcigpO1xyXG4gICAgfVxyXG4gICAgaWYgKG1zZy50eXBlID09PSAnc2VsZWN0LXRleHQtbm9kZXMtd2l0aG91dC12YXJpYWJsZXMzJykge1xyXG4gICAgICAgIHNlbGVjdFRleHROb2Rlc1dpdGhTYW1lRm9udCgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3NlbGVjdC10ZXh0LW5vZGVzLXdpdGhvdXQtdmFyaWFibGVzNCcpIHtcclxuICAgICAgICBkZXNlbGVjdDIoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAobXNnLnR5cGUgPT09ICdzZWxlY3QtdGV4dC1ub2Rlcy13aXRob3V0LXZhcmlhYmxlczUnKSB7XHJcbiAgICAgICAgaW52ZXJ0U2VsZWN0aW9uKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnNvbGUuY2xlYXIoKTtcclxuICAgIH1cclxuICAgIGNvbnNvbGUuY2xlYXIoKTtcclxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyZWF0ZS1yZWN0YW5nbGVzJykge1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XHJcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICB0eXBlOiAnc2VsZWN0ZWQtdGV4dC1ub2Rlcy1jb3VudCcsXHJcbiAgICAgICAgICAgIHNlbGVjdGVkVGV4dE5vZGVzQ291bnQ6IHNlbGVjdGVkTm9kZXMuZmlsdGVyKChub2RlKSA9PiBub2RlLnR5cGUgPT09ICdURVhUJykubGVuZ3RoLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChzZWxlY3RlZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAndXBkYXRlLXRleHQtc3R5bGVzJyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyB0ZXh0IG5vZGVzIHNlbGVjdGVkJyxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZm9udE5hbWVzU2V0ID0gbmV3IFNldCgpO1xyXG4gICAgICAgIHNlbGVjdGVkTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobm9kZS50eXBlID09PSAnVEVYVCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZvbnROYW1lID0gdGV4dE5vZGUuZm9udE5hbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShmb250TmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVGV4dE5vZGUgaGFzIG1peGVkIGZvbnRzOicsIGZvbnROYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBmb250TmFtZS5mb3JFYWNoKChmbikgPT4gZm9udE5hbWVzU2V0LmFkZChgJHtmbi5mYW1pbHl9LSR7Zm4uc3R5bGV9YCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZm9udE5hbWUgIT09IGZpZ21hLm1peGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udE5hbWVzU2V0LmFkZChgJHtmb250TmFtZS5mYW1pbHl9YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVGV4dE5vZGUgaGFzIG1peGVkIGZvbnRzLicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlbGVjdGVkIG5vZGUgaXMgbm90IGEgVGV4dE5vZGUuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgYWxsQ29sbGVjdGVkRm9udHMgPSBBcnJheS5mcm9tKGZvbnROYW1lc1NldCk7XHJcbiAgICAgICAgaWYgKGFsbENvbGxlY3RlZEZvbnRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBhbGxDb2xsZWN0ZWRGb250cyA9IHlpZWxkIGxvYWRGb250cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhhbGxDb2xsZWN0ZWRGb250cyk7XHJcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IGZpZ21hLnZhcmlhYmxlcy5jcmVhdGVWYXJpYWJsZUNvbGxlY3Rpb24oJ0dlbmVyYXRlZCBGb250IENvbGxlY3Rpb24nKTtcclxuICAgICAgICBjb25zdCBtb2RlSWQgPSBjb2xsZWN0aW9uLm1vZGVzWzBdLm1vZGVJZDtcclxuICAgICAgICBjb25zdCBmb250RmFtaWx5VmFycyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsQ29sbGVjdGVkRm9udHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgPj0gbXNnLmNvdW50KVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvbnROYW1lID0gYWxsQ29sbGVjdGVkRm9udHNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGZvbnRGYW1pbHlWYXIgPSBmaWdtYS52YXJpYWJsZXMuY3JlYXRlVmFyaWFibGUoZm9udE5hbWUsIGNvbGxlY3Rpb24sICdTVFJJTkcnKTtcclxuICAgICAgICAgICAgZm9udEZhbWlseVZhci5zZXRWYWx1ZUZvck1vZGUobW9kZUlkLCBmb250TmFtZSk7XHJcbiAgICAgICAgICAgIGZvbnRGYW1pbHlWYXJzLnB1c2goZm9udEZhbWlseVZhcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlIChmb250RmFtaWx5VmFycy5sZW5ndGggPiBtc2cuY291bnQpIHtcclxuICAgICAgICAgICAgY29uc3QgcmFuZG9tSW5kZXhUb1JlbW92ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGZvbnRGYW1pbHlWYXJzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZWRWYXIgPSBmb250RmFtaWx5VmFycy5zcGxpY2UocmFuZG9tSW5kZXhUb1JlbW92ZSwgMSlbMF07XHJcbiAgICAgICAgICAgIHJlbW92ZWRWYXIucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGhhc0JvdW5kVmFyaWFibGVzID0gKG5vZGUpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG5vZGUuYm91bmRWYXJpYWJsZXMpLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHNlbGVjdGVkTm9kZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChub2RlLnR5cGUgIT09ICdURVhUJylcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRleHROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgY29uc3Qgc2hvdWxkU2tpcEFzc2lnbm1lbnQgPSBtc2cuaXNDaGVja2VkID09PSBmYWxzZSAmJiBoYXNCb3VuZFZhcmlhYmxlcyh0ZXh0Tm9kZSk7XHJcbiAgICAgICAgICAgIGlmICghc2hvdWxkU2tpcEFzc2lnbm1lbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZm9udEZhbWlseVZhcnMubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbUZvbnRGYW1pbHlWYXIgPSBmb250RmFtaWx5VmFyc1tyYW5kb21JbmRleF07XHJcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5zZXRCb3VuZFZhcmlhYmxlKCdmb250RmFtaWx5JywgcmFuZG9tRm9udEZhbWlseVZhcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICB0eXBlOiAndXBkYXRlLXRleHQtc3R5bGVzJyxcclxuICAgICAgICAgICAgbWVzc2FnZTogYFVwZGF0ZWQgc3R5bGVzIGZvciAke3NlbGVjdGVkTm9kZXMubGVuZ3RofSB0ZXh0IG5vZGVzYCxcclxuICAgICAgICB9KTtcclxuICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xyXG4gICAgfVxyXG59KTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9