/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/plugin/controller.ts":
/*!**********************************!*\
  !*** ./src/plugin/controller.ts ***!
  \**********************************/
/***/ (function() {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__, { width: 320, height: 250, themeColors: true });
let stylesInformation = [];
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    if (msg.type === 'dds') {
        const data22 = msg.data22;
        try {
            const possibleValues = [
                'Al Mudhaibi, Ash Sharqiyah North',
                'Al Thanyah 2, Hadaeq Mohammed Bin Rashid, Dubai',
                'Mohammed Bin Rashid Boulevard, Old Town Residences, Burj Khalifa/Downtown Dubai, Dubai',
                'Al Muntazah, Abu Dhabi, Abu Dhabi Municipality, Abu Dhabi Emirate',
                'Al Mamourah street 9, Ghaf Al Ghirban street E25, Al Nahyan, Abu Dhabi, Abu Dhabi Municipality, Abu Dhabi Emirate',
            ];
            function findTextNodes(node) {
                return __awaiter(this, void 0, void 0, function* () {
                    const textNodes = [];
                    switch (node.type) {
                        case "FRAME":
                        case "GROUP":
                        case "COMPONENT":
                        case "COMPONENT_SET":
                            const childPromises = node.children.map((childNode) => findTextNodes(childNode));
                            const foundTextNodes = yield Promise.all(childPromises);
                            textNodes.push(...foundTextNodes.flat());
                            break;
                        case "TEXT":
                            textNodes.push(node);
                            break;
                        default:
                            break;
                    }
                    return textNodes;
                });
            }
            function updateTextNode(node) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (typeof node.fontName === "object") {
                        yield figma.loadFontAsync(node.fontName);
                    }
                    node.characters = node.name;
                    return new Promise((resolve, _) => resolve());
                });
            }
            (function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const selectedNodes = figma.currentPage.selection;
                    const textNodes = yield Promise.all(selectedNodes.flatMap(findTextNodes));
                    yield Promise.all(textNodes.flat().map(updateTextNode));
                });
            })();
            var fontsToLoad = [];
            const randomValue = possibleValues[Math.floor(Math.random() * possibleValues.length)];
            figma.currentPage.selection.forEach((selectedNode) => __awaiter(this, void 0, void 0, function* () {
                if (selectedNode.type === 'TEXT') {
                    const words = data22 && data22.trim() !== '' ? data22.split(/\s+/) : [randomValue];
                    const shuffleArray = (array) => {
                        for (let i = array.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [array[i], array[j]] = [array[j], array[i]];
                        }
                        return array;
                    };
                    console.clear();
                    const fontPromises = fontsToLoad.map(f => figma.loadFontAsync(f));
                    Promise.all(fontPromises).then(() => {
                        this.layersToNumber.map(l => this.setTextOfNode(l.layer, this.optionalPrefix, l.number.toString()));
                    });
                    const promises = figma.currentPage.selection.map((selectedNode) => __awaiter(this, void 0, void 0, function* () {
                        if (selectedNode.type === 'TEXT') {
                            yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
                            const shuffledWords = shuffleArray([...words]);
                            const shuffledData22 = shuffledWords.join(' ');
                            selectedNode.characters = shuffledData22;
                            return Promise.resolve();
                        }
                    }));
                    yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
                    yield Promise.all(promises);
                    console.log('All promises fulfilled');
                }
            }));
            if (figma.currentPage.selection.length === 0 || !figma.currentPage.selection.some((node) => node.type === 'TEXT')) {
                console.error('Please select at least one text node in Figma.');
            }
        }
        catch (error) {
            console.error('Error:', error);
            figma.ui.postMessage({ type: 'error', message: 'An error occurred while processing the selection.' });
        }
    }
    if (msg.type === 'create-rectangles') {
        const selectedTextNodes = figma.currentPage.selection.filter(node => node.type === 'TEXT');
        for (const node of selectedTextNodes) {
            function getTextFromSelectedElement(selectedNode) {
                if (selectedNode.type === 'TEXT') {
                    return selectedNode.characters;
                }
                return null;
            }
            const textContent = getTextFromSelectedElement(node);
            console.log('Text content:', textContent);
            if (textContent !== null) {
                const newText = figma.createText();
                newText.characters = textContent;
                newText.x = node.x + 50;
                newText.y = node.y + 50;
                const additionalTextNodes = yield Promise.all(figma.currentPage.selection.flatMap(findTextNodes));
                yield Promise.all(additionalTextNodes.flat().map(updateTextNode));
                figma.currentPage.appendChild(newText);
            }
        }
        figma.ui.postMessage({
            type: 'create-rectangles',
            message: `Created ${selectedTextNodes.length} Rectangles`,
        });
    }
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/plugin/controller.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0EseUJBQXlCLDRDQUE0QztBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELE9BQU87QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSx3REFBd0QsbUNBQW1DO0FBQzNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsZ0RBQWdELG1DQUFtQztBQUNuRjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLDZFQUE2RTtBQUNoSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQywwQkFBMEI7QUFDMUQsU0FBUztBQUNUO0FBQ0EsQ0FBQzs7Ozs7Ozs7VUU3SEQ7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1NoYXBlQXJvdW5kLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIiwid2VicGFjazovL1NoYXBlQXJvdW5kL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vU2hhcGVBcm91bmQvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL1NoYXBlQXJvdW5kL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMzIwLCBoZWlnaHQ6IDI1MCwgdGhlbWVDb2xvcnM6IHRydWUgfSk7XG5sZXQgc3R5bGVzSW5mb3JtYXRpb24gPSBbXTtcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IChtc2cpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICBpZiAobXNnLnR5cGUgPT09ICdkZHMnKSB7XG4gICAgICAgIGNvbnN0IGRhdGEyMiA9IG1zZy5kYXRhMjI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwb3NzaWJsZVZhbHVlcyA9IFtcbiAgICAgICAgICAgICAgICAnQWwgTXVkaGFpYmksIEFzaCBTaGFycWl5YWggTm9ydGgnLFxuICAgICAgICAgICAgICAgICdBbCBUaGFueWFoIDIsIEhhZGFlcSBNb2hhbW1lZCBCaW4gUmFzaGlkLCBEdWJhaScsXG4gICAgICAgICAgICAgICAgJ01vaGFtbWVkIEJpbiBSYXNoaWQgQm91bGV2YXJkLCBPbGQgVG93biBSZXNpZGVuY2VzLCBCdXJqIEtoYWxpZmEvRG93bnRvd24gRHViYWksIER1YmFpJyxcbiAgICAgICAgICAgICAgICAnQWwgTXVudGF6YWgsIEFidSBEaGFiaSwgQWJ1IERoYWJpIE11bmljaXBhbGl0eSwgQWJ1IERoYWJpIEVtaXJhdGUnLFxuICAgICAgICAgICAgICAgICdBbCBNYW1vdXJhaCBzdHJlZXQgOSwgR2hhZiBBbCBHaGlyYmFuIHN0cmVldCBFMjUsIEFsIE5haHlhbiwgQWJ1IERoYWJpLCBBYnUgRGhhYmkgTXVuaWNpcGFsaXR5LCBBYnUgRGhhYmkgRW1pcmF0ZScsXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgZnVuY3Rpb24gZmluZFRleHROb2Rlcyhub2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dE5vZGVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAobm9kZS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiRlJBTUVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJHUk9VUFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkNPTVBPTkVOVFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkNPTVBPTkVOVF9TRVRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZFByb21pc2VzID0gbm9kZS5jaGlsZHJlbi5tYXAoKGNoaWxkTm9kZSkgPT4gZmluZFRleHROb2RlcyhjaGlsZE5vZGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZFRleHROb2RlcyA9IHlpZWxkIFByb21pc2UuYWxsKGNoaWxkUHJvbWlzZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHROb2Rlcy5wdXNoKC4uLmZvdW5kVGV4dE5vZGVzLmZsYXQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiVEVYVFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHROb2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGV4dE5vZGVzO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlVGV4dE5vZGUobm9kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZS5mb250TmFtZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyhub2RlLmZvbnROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBub2RlLmNoYXJhY3RlcnMgPSBub2RlLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgXykgPT4gcmVzb2x2ZSgpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dE5vZGVzID0geWllbGQgUHJvbWlzZS5hbGwoc2VsZWN0ZWROb2Rlcy5mbGF0TWFwKGZpbmRUZXh0Tm9kZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgUHJvbWlzZS5hbGwodGV4dE5vZGVzLmZsYXQoKS5tYXAodXBkYXRlVGV4dE5vZGUpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICB2YXIgZm9udHNUb0xvYWQgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbVZhbHVlID0gcG9zc2libGVWYWx1ZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVWYWx1ZXMubGVuZ3RoKV07XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24uZm9yRWFjaCgoc2VsZWN0ZWROb2RlKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZS50eXBlID09PSAnVEVYVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29yZHMgPSBkYXRhMjIgJiYgZGF0YTIyLnRyaW0oKSAhPT0gJycgPyBkYXRhMjIuc3BsaXQoL1xccysvKSA6IFtyYW5kb21WYWx1ZV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNodWZmbGVBcnJheSA9IChhcnJheSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2FycmF5W2ldLCBhcnJheVtqXV0gPSBbYXJyYXlbal0sIGFycmF5W2ldXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5jbGVhcigpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb250UHJvbWlzZXMgPSBmb250c1RvTG9hZC5tYXAoZiA9PiBmaWdtYS5sb2FkRm9udEFzeW5jKGYpKTtcbiAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoZm9udFByb21pc2VzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGF5ZXJzVG9OdW1iZXIubWFwKGwgPT4gdGhpcy5zZXRUZXh0T2ZOb2RlKGwubGF5ZXIsIHRoaXMub3B0aW9uYWxQcmVmaXgsIGwubnVtYmVyLnRvU3RyaW5nKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb21pc2VzID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLm1hcCgoc2VsZWN0ZWROb2RlKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2RlLnR5cGUgPT09ICdURVhUJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoeyBmYW1pbHk6ICdJbnRlcicsIHN0eWxlOiAnUmVndWxhcicgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2h1ZmZsZWRXb3JkcyA9IHNodWZmbGVBcnJheShbLi4ud29yZHNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzaHVmZmxlZERhdGEyMiA9IHNodWZmbGVkV29yZHMuam9pbignICcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkTm9kZS5jaGFyYWN0ZXJzID0gc2h1ZmZsZWREYXRhMjI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoeyBmYW1pbHk6ICdJbnRlcicsIHN0eWxlOiAnUmVndWxhcicgfSk7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0FsbCBwcm9taXNlcyBmdWxmaWxsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCB8fCAhZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLnNvbWUoKG5vZGUpID0+IG5vZGUudHlwZSA9PT0gJ1RFWFQnKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1BsZWFzZSBzZWxlY3QgYXQgbGVhc3Qgb25lIHRleHQgbm9kZSBpbiBGaWdtYS4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIHByb2Nlc3NpbmcgdGhlIHNlbGVjdGlvbi4nIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyZWF0ZS1yZWN0YW5nbGVzJykge1xuICAgICAgICBjb25zdCBzZWxlY3RlZFRleHROb2RlcyA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5maWx0ZXIobm9kZSA9PiBub2RlLnR5cGUgPT09ICdURVhUJyk7XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBzZWxlY3RlZFRleHROb2Rlcykge1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0VGV4dEZyb21TZWxlY3RlZEVsZW1lbnQoc2VsZWN0ZWROb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZS50eXBlID09PSAnVEVYVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGVkTm9kZS5jaGFyYWN0ZXJzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRleHRDb250ZW50ID0gZ2V0VGV4dEZyb21TZWxlY3RlZEVsZW1lbnQobm9kZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnVGV4dCBjb250ZW50OicsIHRleHRDb250ZW50KTtcbiAgICAgICAgICAgIGlmICh0ZXh0Q29udGVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1RleHQgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XG4gICAgICAgICAgICAgICAgbmV3VGV4dC5jaGFyYWN0ZXJzID0gdGV4dENvbnRlbnQ7XG4gICAgICAgICAgICAgICAgbmV3VGV4dC54ID0gbm9kZS54ICsgNTA7XG4gICAgICAgICAgICAgICAgbmV3VGV4dC55ID0gbm9kZS55ICsgNTA7XG4gICAgICAgICAgICAgICAgY29uc3QgYWRkaXRpb25hbFRleHROb2RlcyA9IHlpZWxkIFByb21pc2UuYWxsKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5mbGF0TWFwKGZpbmRUZXh0Tm9kZXMpKTtcbiAgICAgICAgICAgICAgICB5aWVsZCBQcm9taXNlLmFsbChhZGRpdGlvbmFsVGV4dE5vZGVzLmZsYXQoKS5tYXAodXBkYXRlVGV4dE5vZGUpKTtcbiAgICAgICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5hcHBlbmRDaGlsZChuZXdUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiAnY3JlYXRlLXJlY3RhbmdsZXMnLFxuICAgICAgICAgICAgbWVzc2FnZTogYENyZWF0ZWQgJHtzZWxlY3RlZFRleHROb2Rlcy5sZW5ndGh9IFJlY3RhbmdsZXNgLFxuICAgICAgICB9KTtcbiAgICB9XG59KTtcbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG5fX3dlYnBhY2tfbW9kdWxlc19fW1wiLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHNcIl0oKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==