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
figma.showUI(__html__, { width: 400, height: 600 });
function isAutoLayoutNode(node) {
    return ((node.type === 'FRAME' ||
        node.type === 'COMPONENT' ||
        node.type === 'INSTANCE') &&
        (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL'));
}
function extractAutoLayoutInfo(node) {
    const isAuto = isAutoLayoutNode(node);
    const children = node.children
        .filter((child) => (child.type === 'FRAME' ||
        child.type === 'COMPONENT' ||
        child.type === 'INSTANCE' ||
        child.type === 'SECTION') &&
        (child.type === 'SECTION' || isAutoLayoutNode(child)))
        .map((node) => {
        try {
            return extractAutoLayoutInfo(node);
        }
        catch (e) {
            console.warn('Failed to extract node:', node.id, e);
            return null;
        }
    })
        .filter(Boolean);
    if (!isAuto && children.length === 0)
        return null;
    return Object.assign(Object.assign({ id: node.id, name: node.name, isAutoLayout: isAuto, layoutMode: isAuto ? node.layoutMode : undefined }, (isAuto && {
        padding: {
            top: node.paddingTop,
            bottom: node.paddingBottom,
            left: node.paddingLeft,
            right: node.paddingRight,
        },
        itemSpacing: node.itemSpacing,
    })), { children });
}
function getAllPaddingData() {
    const selection = figma.currentPage.selection;
    return selection
        .filter((node) => (node.type === 'FRAME' ||
        node.type === 'COMPONENT' ||
        node.type === 'INSTANCE' ||
        node.type === 'SECTION') &&
        isAutoLayoutNode(node))
        .map(extractAutoLayoutInfo)
        .filter(Boolean);
}
function sendNumberVariablesToUI() {
    const collections = figma.variables.getLocalVariableCollections();
    const allVariables = [];
    for (const collection of collections) {
        const fullCollection = figma.variables.getVariableCollectionById(collection.id);
        if (fullCollection) {
            for (const varId of fullCollection.variableIds) {
                const variable = figma.variables.getVariableById(varId);
                if (variable) {
                    allVariables.push(variable);
                }
            }
        }
    }
    const numberVars = allVariables.filter((v) => v.resolvedType === 'FLOAT');
    const sanitizedVariables = Array.isArray(numberVars)
        ? numberVars.map((v) => ({
            id: v.id,
            name: v.name,
            key: v.key,
        }))
        : [];
    figma.ui.postMessage({
        type: 'number-variables',
        data: sanitizedVariables,
    });
}
(() => __awaiter(this, void 0, void 0, function* () {
    yield sendNumberVariablesToUI();
    figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
}))();
figma.on('selectionchange', () => {
    figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
});
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    if (msg.type === 'select-all-autolayout') {
        const autoLayoutNodes = figma.root.findAll((node) => node.type === 'FRAME' &&
            node.layoutMode !== 'NONE');
        if (autoLayoutNodes.length > 0) {
            figma.currentPage.selection = autoLayoutNodes;
            figma.viewport.scrollAndZoomIntoView(autoLayoutNodes);
        }
        else {
            figma.notify('No Auto Layout frames found on this page.');
        }
    }
    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
    if (msg.type === 'zoom-to-node') {
        const node = yield figma.getNodeByIdAsync(msg.nodeId);
        if (node && 'parent' in node) {
            figma.viewport.scrollAndZoomIntoView([node]);
            figma.currentPage.selection = [node];
        }
    }
    if (msg.type === 'update-padding') {
        const { id, side, value, variableId } = msg;
        figma.getNodeByIdAsync(id).then((node) => {
            if (!node ||
                !(node.type === 'FRAME' ||
                    node.type === 'COMPONENT' ||
                    node.type === 'INSTANCE') ||
                !isAutoLayoutNode(node)) {
                console.warn('Invalid node for padding update:', node);
                return;
            }
            const sideKey = `padding${side.charAt(0).toUpperCase()}${side.slice(1)}`;
            try {
                if (typeof variableId === 'string') {
                    node.setBoundVariable(sideKey, variableId);
                }
                else if (typeof value === 'number' && !isNaN(value)) {
                    node[sideKey] = value;
                }
                else {
                    console.warn('Invalid padding value:', value);
                }
            }
            catch (e) {
                console.error(`Failed to update padding for ${id}`, e);
            }
        });
    }
    if (msg.type === 'update-item-spacing') {
        const { id, value, variableId } = msg;
        const node = figma.getNodeById(id);
        if (!node ||
            !(node.type === 'FRAME' ||
                node.type === 'COMPONENT' ||
                node.type === 'INSTANCE' ||
                node.type === 'SECTION') ||
            !isAutoLayoutNode(node))
            return;
        try {
            if (variableId) {
                node.setBoundVariable('itemSpacing', variableId);
            }
            else if (typeof value === 'number') {
                node.itemSpacing = value;
            }
        }
        catch (e) {
            console.error(`Failed to update itemSpacing for ${id}`, e);
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0EseUJBQXlCLHlCQUF5QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsc0dBQXNHO0FBQy9JO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLLE1BQU0sVUFBVTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixpREFBaUQ7QUFDNUUsQ0FBQztBQUNEO0FBQ0EsMkJBQTJCLGlEQUFpRDtBQUM1RSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQiw4QkFBOEI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLDZCQUE2QixFQUFFLGNBQWM7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOERBQThELEdBQUc7QUFDakU7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLGdCQUFnQix3QkFBd0I7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RCxHQUFHO0FBQ2pFO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztVRW5LRDtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmlnbWEtcGx1Z2luLXJlYWN0LXRlbXBsYXRlLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIiwid2VicGFjazovL2ZpZ21hLXBsdWdpbi1yZWFjdC10ZW1wbGF0ZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2ZpZ21hLXBsdWdpbi1yZWFjdC10ZW1wbGF0ZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmlnbWEtcGx1Z2luLXJlYWN0LXRlbXBsYXRlL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogNDAwLCBoZWlnaHQ6IDYwMCB9KTtcbmZ1bmN0aW9uIGlzQXV0b0xheW91dE5vZGUobm9kZSkge1xuICAgIHJldHVybiAoKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyB8fFxuICAgICAgICBub2RlLnR5cGUgPT09ICdDT01QT05FTlQnIHx8XG4gICAgICAgIG5vZGUudHlwZSA9PT0gJ0lOU1RBTkNFJykgJiZcbiAgICAgICAgKG5vZGUubGF5b3V0TW9kZSA9PT0gJ0hPUklaT05UQUwnIHx8IG5vZGUubGF5b3V0TW9kZSA9PT0gJ1ZFUlRJQ0FMJykpO1xufVxuZnVuY3Rpb24gZXh0cmFjdEF1dG9MYXlvdXRJbmZvKG5vZGUpIHtcbiAgICBjb25zdCBpc0F1dG8gPSBpc0F1dG9MYXlvdXROb2RlKG5vZGUpO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlblxuICAgICAgICAuZmlsdGVyKChjaGlsZCkgPT4gKGNoaWxkLnR5cGUgPT09ICdGUkFNRScgfHxcbiAgICAgICAgY2hpbGQudHlwZSA9PT0gJ0NPTVBPTkVOVCcgfHxcbiAgICAgICAgY2hpbGQudHlwZSA9PT0gJ0lOU1RBTkNFJyB8fFxuICAgICAgICBjaGlsZC50eXBlID09PSAnU0VDVElPTicpICYmXG4gICAgICAgIChjaGlsZC50eXBlID09PSAnU0VDVElPTicgfHwgaXNBdXRvTGF5b3V0Tm9kZShjaGlsZCkpKVxuICAgICAgICAubWFwKChub2RlKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gZXh0cmFjdEF1dG9MYXlvdXRJbmZvKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byBleHRyYWN0IG5vZGU6Jywgbm9kZS5pZCwgZSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG4gICAgaWYgKCFpc0F1dG8gJiYgY2hpbGRyZW4ubGVuZ3RoID09PSAwKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHsgaWQ6IG5vZGUuaWQsIG5hbWU6IG5vZGUubmFtZSwgaXNBdXRvTGF5b3V0OiBpc0F1dG8sIGxheW91dE1vZGU6IGlzQXV0byA/IG5vZGUubGF5b3V0TW9kZSA6IHVuZGVmaW5lZCB9LCAoaXNBdXRvICYmIHtcbiAgICAgICAgcGFkZGluZzoge1xuICAgICAgICAgICAgdG9wOiBub2RlLnBhZGRpbmdUb3AsXG4gICAgICAgICAgICBib3R0b206IG5vZGUucGFkZGluZ0JvdHRvbSxcbiAgICAgICAgICAgIGxlZnQ6IG5vZGUucGFkZGluZ0xlZnQsXG4gICAgICAgICAgICByaWdodDogbm9kZS5wYWRkaW5nUmlnaHQsXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW1TcGFjaW5nOiBub2RlLml0ZW1TcGFjaW5nLFxuICAgIH0pKSwgeyBjaGlsZHJlbiB9KTtcbn1cbmZ1bmN0aW9uIGdldEFsbFBhZGRpbmdEYXRhKCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICByZXR1cm4gc2VsZWN0aW9uXG4gICAgICAgIC5maWx0ZXIoKG5vZGUpID0+IChub2RlLnR5cGUgPT09ICdGUkFNRScgfHxcbiAgICAgICAgbm9kZS50eXBlID09PSAnQ09NUE9ORU5UJyB8fFxuICAgICAgICBub2RlLnR5cGUgPT09ICdJTlNUQU5DRScgfHxcbiAgICAgICAgbm9kZS50eXBlID09PSAnU0VDVElPTicpICYmXG4gICAgICAgIGlzQXV0b0xheW91dE5vZGUobm9kZSkpXG4gICAgICAgIC5tYXAoZXh0cmFjdEF1dG9MYXlvdXRJbmZvKVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pO1xufVxuZnVuY3Rpb24gc2VuZE51bWJlclZhcmlhYmxlc1RvVUkoKSB7XG4gICAgY29uc3QgY29sbGVjdGlvbnMgPSBmaWdtYS52YXJpYWJsZXMuZ2V0TG9jYWxWYXJpYWJsZUNvbGxlY3Rpb25zKCk7XG4gICAgY29uc3QgYWxsVmFyaWFibGVzID0gW107XG4gICAgZm9yIChjb25zdCBjb2xsZWN0aW9uIG9mIGNvbGxlY3Rpb25zKSB7XG4gICAgICAgIGNvbnN0IGZ1bGxDb2xsZWN0aW9uID0gZmlnbWEudmFyaWFibGVzLmdldFZhcmlhYmxlQ29sbGVjdGlvbkJ5SWQoY29sbGVjdGlvbi5pZCk7XG4gICAgICAgIGlmIChmdWxsQ29sbGVjdGlvbikge1xuICAgICAgICAgICAgZm9yIChjb25zdCB2YXJJZCBvZiBmdWxsQ29sbGVjdGlvbi52YXJpYWJsZUlkcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlID0gZmlnbWEudmFyaWFibGVzLmdldFZhcmlhYmxlQnlJZCh2YXJJZCk7XG4gICAgICAgICAgICAgICAgaWYgKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbFZhcmlhYmxlcy5wdXNoKHZhcmlhYmxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbnVtYmVyVmFycyA9IGFsbFZhcmlhYmxlcy5maWx0ZXIoKHYpID0+IHYucmVzb2x2ZWRUeXBlID09PSAnRkxPQVQnKTtcbiAgICBjb25zdCBzYW5pdGl6ZWRWYXJpYWJsZXMgPSBBcnJheS5pc0FycmF5KG51bWJlclZhcnMpXG4gICAgICAgID8gbnVtYmVyVmFycy5tYXAoKHYpID0+ICh7XG4gICAgICAgICAgICBpZDogdi5pZCxcbiAgICAgICAgICAgIG5hbWU6IHYubmFtZSxcbiAgICAgICAgICAgIGtleTogdi5rZXksXG4gICAgICAgIH0pKVxuICAgICAgICA6IFtdO1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ251bWJlci12YXJpYWJsZXMnLFxuICAgICAgICBkYXRhOiBzYW5pdGl6ZWRWYXJpYWJsZXMsXG4gICAgfSk7XG59XG4oKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIHlpZWxkIHNlbmROdW1iZXJWYXJpYWJsZXNUb1VJKCk7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAncGFkZGluZy1kYXRhJywgZGF0YTogZ2V0QWxsUGFkZGluZ0RhdGEoKSB9KTtcbn0pKSgpO1xuZmlnbWEub24oJ3NlbGVjdGlvbmNoYW5nZScsICgpID0+IHtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdwYWRkaW5nLWRhdGEnLCBkYXRhOiBnZXRBbGxQYWRkaW5nRGF0YSgpIH0pO1xufSk7XG5maWdtYS51aS5vbm1lc3NhZ2UgPSAobXNnKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgaWYgKG1zZy50eXBlID09PSAnc2VsZWN0LWFsbC1hdXRvbGF5b3V0Jykge1xuICAgICAgICBjb25zdCBhdXRvTGF5b3V0Tm9kZXMgPSBmaWdtYS5yb290LmZpbmRBbGwoKG5vZGUpID0+IG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyAmJlxuICAgICAgICAgICAgbm9kZS5sYXlvdXRNb2RlICE9PSAnTk9ORScpO1xuICAgICAgICBpZiAoYXV0b0xheW91dE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IGF1dG9MYXlvdXROb2RlcztcbiAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhhdXRvTGF5b3V0Tm9kZXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KCdObyBBdXRvIExheW91dCBmcmFtZXMgZm91bmQgb24gdGhpcyBwYWdlLicpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2NhbmNlbCcpIHtcbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAnem9vbS10by1ub2RlJykge1xuICAgICAgICBjb25zdCBub2RlID0geWllbGQgZmlnbWEuZ2V0Tm9kZUJ5SWRBc3luYyhtc2cubm9kZUlkKTtcbiAgICAgICAgaWYgKG5vZGUgJiYgJ3BhcmVudCcgaW4gbm9kZSkge1xuICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtub2RlXSk7XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbbm9kZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAndXBkYXRlLXBhZGRpbmcnKSB7XG4gICAgICAgIGNvbnN0IHsgaWQsIHNpZGUsIHZhbHVlLCB2YXJpYWJsZUlkIH0gPSBtc2c7XG4gICAgICAgIGZpZ21hLmdldE5vZGVCeUlkQXN5bmMoaWQpLnRoZW4oKG5vZGUpID0+IHtcbiAgICAgICAgICAgIGlmICghbm9kZSB8fFxuICAgICAgICAgICAgICAgICEobm9kZS50eXBlID09PSAnRlJBTUUnIHx8XG4gICAgICAgICAgICAgICAgICAgIG5vZGUudHlwZSA9PT0gJ0NPTVBPTkVOVCcgfHxcbiAgICAgICAgICAgICAgICAgICAgbm9kZS50eXBlID09PSAnSU5TVEFOQ0UnKSB8fFxuICAgICAgICAgICAgICAgICFpc0F1dG9MYXlvdXROb2RlKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdJbnZhbGlkIG5vZGUgZm9yIHBhZGRpbmcgdXBkYXRlOicsIG5vZGUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHNpZGVLZXkgPSBgcGFkZGluZyR7c2lkZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKX0ke3NpZGUuc2xpY2UoMSl9YDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YXJpYWJsZUlkID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBub2RlLnNldEJvdW5kVmFyaWFibGUoc2lkZUtleSwgdmFyaWFibGVJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlW3NpZGVLZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgcGFkZGluZyB2YWx1ZTonLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gdXBkYXRlIHBhZGRpbmcgZm9yICR7aWR9YCwgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09ICd1cGRhdGUtaXRlbS1zcGFjaW5nJykge1xuICAgICAgICBjb25zdCB7IGlkLCB2YWx1ZSwgdmFyaWFibGVJZCB9ID0gbXNnO1xuICAgICAgICBjb25zdCBub2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoaWQpO1xuICAgICAgICBpZiAoIW5vZGUgfHxcbiAgICAgICAgICAgICEobm9kZS50eXBlID09PSAnRlJBTUUnIHx8XG4gICAgICAgICAgICAgICAgbm9kZS50eXBlID09PSAnQ09NUE9ORU5UJyB8fFxuICAgICAgICAgICAgICAgIG5vZGUudHlwZSA9PT0gJ0lOU1RBTkNFJyB8fFxuICAgICAgICAgICAgICAgIG5vZGUudHlwZSA9PT0gJ1NFQ1RJT04nKSB8fFxuICAgICAgICAgICAgIWlzQXV0b0xheW91dE5vZGUobm9kZSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodmFyaWFibGVJZCkge1xuICAgICAgICAgICAgICAgIG5vZGUuc2V0Qm91bmRWYXJpYWJsZSgnaXRlbVNwYWNpbmcnLCB2YXJpYWJsZUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBub2RlLml0ZW1TcGFjaW5nID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byB1cGRhdGUgaXRlbVNwYWNpbmcgZm9yICR7aWR9YCwgZSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG5fX3dlYnBhY2tfbW9kdWxlc19fW1wiLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHNcIl0oKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==