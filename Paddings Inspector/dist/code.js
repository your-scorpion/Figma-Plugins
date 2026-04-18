/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/plugin/color-utils.ts"
/*!***********************************!*\
  !*** ./src/plugin/color-utils.ts ***!
  \***********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createOrUpdateColorVariableWithCollection = exports.getOrCreateColorCollectionWithMode = void 0;
async function getOrCreateColorCollectionWithMode(name = "Colors") {
    try {
        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        const lastId = await figma.clientStorage.getAsync('lastColorCollectionId');
        let collection = null;
        if (lastId) {
            collection = collections.find((c) => c.id === lastId) || null;
        }
        if (!collection) {
            collection = collections.find((c) => c.name === name) || null;
        }
        if (!collection) {
            collection = figma.variables.createVariableCollection(name);
            await figma.clientStorage.setAsync('lastColorCollectionId', collection.id);
        }
        if (!collection)
            return { collection: null, modeId: null };
        if (!collection.modes || collection.modes.length === 0) {
            collection.addMode('Base');
        }
        const modeId = collection.modes[0].modeId;
        return { collection, modeId };
    }
    catch (error) {
        console.error('Error ensuring Color collection/mode:', error);
        return { collection: null, modeId: null };
    }
}
exports.getOrCreateColorCollectionWithMode = getOrCreateColorCollectionWithMode;
async function createOrUpdateColorVariableWithCollection(collection, modeId, name, value) {
    var _a, _b;
    try {
        let existing = null;
        if (collection.variableIds && Array.isArray(collection.variableIds)) {
            for (const varId of collection.variableIds) {
                try {
                    const v = await figma.variables.getVariableByIdAsync(varId);
                    if (v && v.name === name && v.resolvedType === 'COLOR') {
                        existing = v;
                        break;
                    }
                    if (!existing && v && v.resolvedType === 'COLOR') {
                        const current = v.valuesByMode && v.valuesByMode[modeId];
                        if (current && typeof current === 'object' && 'r' in current && 'g' in current && 'b' in current) {
                            const toHex = (c) => {
                                const n = Math.max(0, Math.min(255, Math.round(c * 255)));
                                return n.toString(16).padStart(2, '0');
                            };
                            const keyA = `${toHex(current.r)}${toHex(current.g)}${toHex(current.b)}${toHex((_a = current.a) !== null && _a !== void 0 ? _a : 1)}`.toUpperCase();
                            const keyB = `${toHex(value.r)}${toHex(value.g)}${toHex(value.b)}${toHex((_b = value.a) !== null && _b !== void 0 ? _b : 1)}`.toUpperCase();
                            if (keyA === keyB) {
                                existing = v;
                                break;
                            }
                        }
                    }
                }
                catch (_c) { }
            }
        }
        if (existing) {
            try {
                existing.setValueForMode(modeId, value);
                return existing;
            }
            catch (e) {
                console.error('Failed updating color variable value:', e);
                return null;
            }
        }
        try {
            const variable = figma.variables.createVariable(name, collection, 'COLOR');
            variable.setValueForMode(modeId, value);
            return variable;
        }
        catch (e) {
            console.error('Failed creating color variable:', e);
            return null;
        }
    }
    catch (error) {
        console.error('Error in createOrUpdateColorVariableWithCollection:', error);
        return null;
    }
}
exports.createOrUpdateColorVariableWithCollection = createOrUpdateColorVariableWithCollection;


/***/ },

/***/ "./src/plugin/color-variable-generator.ts"
/*!************************************************!*\
  !*** ./src/plugin/color-variable-generator.ts ***!
  \************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createAllColorVariablesFromSelection = void 0;
const color_utils_1 = __webpack_require__(/*! ./color-utils */ "./src/plugin/color-utils.ts");
async function createAllColorVariablesFromSelection() {
    const selection = figma.currentPage.selection;
    if (!selection || selection.length === 0) {
        figma.notify("Select at least one node to parse all colors.");
        return;
    }
    const toHex = (c) => {
        const n = Math.max(0, Math.min(255, Math.round(c * 255)));
        return n.toString(16).padStart(2, "0");
    };
    const rgbaKey = (rgba) => {
        var _a;
        return `${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}${toHex((_a = rgba.a) !== null && _a !== void 0 ? _a : 1)}`.toUpperCase();
    };
    const colorSet = new Map();
    const addRGBA = (rgba) => {
        const key = rgbaKey(rgba);
        if (!colorSet.has(key))
            colorSet.set(key, rgba);
    };
    const processPaint = (paint) => {
        if (!paint)
            return;
        if (paint.type === "SOLID") {
            const a = typeof paint.opacity === "number" ? paint.opacity : 1;
            addRGBA({ r: paint.color.r, g: paint.color.g, b: paint.color.b, a });
        }
        else if (paint.type === "GRADIENT_LINEAR" ||
            paint.type === "GRADIENT_RADIAL" ||
            paint.type === "GRADIENT_ANGULAR" ||
            paint.type === "GRADIENT_DIAMOND") {
            const stops = paint.gradientStops || [];
            for (const stop of stops)
                addRGBA(stop.color);
        }
    };
    const walk = (node) => {
        if ("fills" in node && Array.isArray(node.fills)) {
            const fills = node.fills || [];
            for (const p of fills)
                processPaint(p);
        }
        if ("strokes" in node && Array.isArray(node.strokes)) {
            const strokes = node.strokes || [];
            for (const p of strokes)
                processPaint(p);
        }
        if ("children" in node && Array.isArray(node.children)) {
            for (const child of node.children)
                walk(child);
        }
    };
    for (const root of selection)
        walk(root);
    const ensured = await (0, color_utils_1.getOrCreateColorCollectionWithMode)();
    const collection = ensured.collection;
    const modeId = ensured.modeId;
    if (!collection || !modeId) {
        figma.notify("Failed to prepare target color collection.");
        return;
    }
    let created = 0;
    const newVarMap = new Map();
    for (const [key, rgba] of colorSet.entries()) {
        const name = `color-${key}`;
        const v = await (0, color_utils_1.createOrUpdateColorVariableWithCollection)(collection, modeId, name, rgba);
        if (v) {
            created++;
            newVarMap.set(key, v);
        }
    }
    let nodesUpdated = 0;
    const bindNode = (node) => {
        if ("fills" in node && Array.isArray(node.fills)) {
            const fills = node.fills || [];
            const newFills = [];
            for (let i = 0; i < fills.length; i++) {
                const paint = fills[i];
                if (!paint) {
                    newFills.push(paint);
                    continue;
                }
                if (paint.type === "SOLID") {
                    const alreadyBound = Boolean(paint.boundVariables && paint.boundVariables.color);
                    if (!alreadyBound) {
                        const a = typeof paint.opacity === "number" ? paint.opacity : 1;
                        const rgba = {
                            r: paint.color.r,
                            g: paint.color.g,
                            b: paint.color.b,
                            a,
                        };
                        const key = rgbaKey(rgba);
                        const variable = newVarMap.get(key);
                        if (variable) {
                            try {
                                const bound = figma.variables.setBoundVariableForPaint(paint, "color", variable);
                                newFills.push(bound);
                                nodesUpdated++;
                                continue;
                            }
                            catch (_a) { }
                        }
                    }
                    newFills.push(paint);
                }
                else if (paint.type === "GRADIENT_LINEAR" ||
                    paint.type === "GRADIENT_RADIAL" ||
                    paint.type === "GRADIENT_ANGULAR" ||
                    paint.type === "GRADIENT_DIAMOND") {
                    const gp = paint;
                    const stops = gp.gradientStops || [];
                    const rebuilt = [];
                    let changed = false;
                    for (const stop of stops) {
                        const bound = Boolean(stop.boundVariables && stop.boundVariables.color);
                        if (!bound) {
                            const rgba = stop.color;
                            const key = rgbaKey(rgba);
                            const variable = newVarMap.get(key);
                            if (variable) {
                                rebuilt.push({
                                    position: stop.position,
                                    color: stop.color,
                                    boundVariables: {
                                        color: { type: "VARIABLE_ALIAS", id: variable.id },
                                    },
                                });
                                changed = true;
                            }
                            else {
                                rebuilt.push(stop);
                            }
                        }
                        else {
                            rebuilt.push(stop);
                        }
                    }
                    if (changed) {
                        const newPaint = {
                            type: gp.type,
                            gradientTransform: gp.gradientTransform,
                            gradientStops: rebuilt,
                            opacity: gp.opacity,
                            visible: gp.visible,
                            blendMode: gp.blendMode,
                        };
                        newFills.push(newPaint);
                        nodesUpdated++;
                    }
                    else {
                        newFills.push(paint);
                    }
                }
                else {
                    newFills.push(paint);
                }
            }
            try {
                node.fills = newFills;
            }
            catch (_b) { }
        }
        if ("strokes" in node && Array.isArray(node.strokes)) {
            const strokes = node.strokes || [];
            const newStrokes = [];
            for (let i = 0; i < strokes.length; i++) {
                const paint = strokes[i];
                if (!paint) {
                    newStrokes.push(paint);
                    continue;
                }
                if (paint.type === "SOLID") {
                    const alreadyBound = Boolean(paint.boundVariables && paint.boundVariables.color);
                    if (!alreadyBound) {
                        const a = typeof paint.opacity === "number" ? paint.opacity : 1;
                        const rgba = {
                            r: paint.color.r,
                            g: paint.color.g,
                            b: paint.color.b,
                            a,
                        };
                        const key = rgbaKey(rgba);
                        const variable = newVarMap.get(key);
                        if (variable) {
                            try {
                                const bound = figma.variables.setBoundVariableForPaint(paint, "color", variable);
                                newStrokes.push(bound);
                                nodesUpdated++;
                                continue;
                            }
                            catch (_c) { }
                        }
                    }
                    newStrokes.push(paint);
                }
                else {
                    newStrokes.push(paint);
                }
            }
            try {
                node.strokes = newStrokes;
            }
            catch (_d) { }
        }
        if ("children" in node && Array.isArray(node.children)) {
            for (const child of node.children)
                bindNode(child);
        }
    };
    for (const root of selection)
        bindNode(root);
    figma.notify(`Created ${created} color variables and updated ${nodesUpdated} nodes.`);
}
exports.createAllColorVariablesFromSelection = createAllColorVariablesFromSelection;


/***/ },

/***/ "./src/plugin/handlers/colorHandlers.ts"
/*!**********************************************!*\
  !*** ./src/plugin/handlers/colorHandlers.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleAliasLocalToImportedByName = exports.handleCreateAllColorVariables = exports.handleCreateColorCollectionFromSelection = exports.handleConvertColorsToVariables = void 0;
const color_utils_1 = __webpack_require__(/*! ../color-utils */ "./src/plugin/color-utils.ts");
const color_variable_generator_1 = __webpack_require__(/*! ../color-variable-generator */ "./src/plugin/color-variable-generator.ts");
async function handleConvertColorsToVariables() {
    const selection = figma.currentPage.selection;
    if (!selection || selection.length === 0) {
        figma.notify('Select at least one frame or node to process colors.');
        return;
    }
    const ensured = await (0, color_utils_1.getOrCreateColorCollectionWithMode)();
    const collection = ensured.collection;
    const modeId = ensured.modeId;
    if (!collection || !modeId) {
        figma.notify('Failed to prepare Colors variable collection');
        return;
    }
    const colorCollection = collection;
    const colorModeId = modeId;
    let nodesUpdated = 0;
    const toHex = (c) => {
        const n = Math.max(0, Math.min(255, Math.round(c * 255)));
        return n.toString(16).padStart(2, '0');
    };
    const rgbaKey = (rgba) => {
        return `${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}${toHex(rgba.a)}`.toUpperCase();
    };
    async function findExistingColorVarForRGBA(rgba) {
        try {
            const keyTarget = rgbaKey(rgba);
            if (colorCollection.variableIds && Array.isArray(colorCollection.variableIds)) {
                for (const varId of colorCollection.variableIds) {
                    try {
                        const v = await figma.variables.getVariableByIdAsync(varId);
                        if (v && v.resolvedType === 'COLOR') {
                            const current = v.valuesByMode && v.valuesByMode[colorModeId];
                            if (current && typeof current === 'object' && 'r' in current) {
                                const key = rgbaKey(current);
                                if (key === keyTarget)
                                    return v;
                            }
                        }
                    }
                    catch (_a) { }
                }
            }
            return null;
        }
        catch (_b) {
            return null;
        }
    }
    async function processNodePaints(node) {
        let updated = false;
        if ('fills' in node && Array.isArray(node.fills)) {
            const fills = node.fills || [];
            const newFills = [];
            for (const paint of fills) {
                if (!paint) {
                    newFills.push(paint);
                    continue;
                }
                if (paint.type === 'SOLID') {
                    const alreadyBound = Boolean(paint.boundVariables && paint.boundVariables.color);
                    if (!alreadyBound) {
                        newFills.push(paint);
                    }
                    else {
                        newFills.push(paint);
                    }
                }
                else if (paint.type === 'GRADIENT_LINEAR' ||
                    paint.type === 'GRADIENT_RADIAL' ||
                    paint.type === 'GRADIENT_ANGULAR' ||
                    paint.type === 'GRADIENT_DIAMOND') {
                    const stops = paint.gradientStops || [];
                    let changedStops = false;
                    const newStops = stops.map((stop) => {
                        if (!stop.boundVariables || !stop.boundVariables.color) {
                            changedStops = true;
                            return {
                                position: stop.position,
                                color: stop.color,
                                boundVariables: {
                                    color: { type: 'VARIABLE_ALIAS', id: '' },
                                },
                            };
                        }
                        return stop;
                    });
                    if (changedStops) {
                        updated = true;
                        const newPaint = {
                            type: paint.type,
                            gradientTransform: paint.gradientTransform,
                            gradientStops: newStops,
                            opacity: paint.opacity,
                            visible: paint.visible,
                            blendMode: paint.blendMode,
                        };
                        newFills.push(newPaint);
                    }
                    else {
                        newFills.push(paint);
                    }
                }
                else {
                    newFills.push(paint);
                }
            }
            for (let i = 0; i < newFills.length; i++) {
                const paint = newFills[i];
                if (paint && paint.type === 'SOLID') {
                    const original = fills[i];
                    const a = typeof original.opacity === 'number' ? original.opacity : 1;
                    const rgba = { r: original.color.r, g: original.color.g, b: original.color.b, a };
                    const alreadyBound = Boolean(original.boundVariables && original.boundVariables.color);
                    if (!alreadyBound) {
                        try {
                            const variable = await findExistingColorVarForRGBA(rgba);
                            if (variable) {
                                const bound = figma.variables.setBoundVariableForPaint(original, 'color', variable);
                                newFills[i] = bound;
                                updated = true;
                            }
                            else {
                                newFills[i] = paint;
                            }
                        }
                        catch (e) {
                            newFills[i] = paint;
                        }
                    }
                }
                if (paint &&
                    (paint.type === 'GRADIENT_LINEAR' ||
                        paint.type === 'GRADIENT_RADIAL' ||
                        paint.type === 'GRADIENT_ANGULAR' ||
                        paint.type === 'GRADIENT_DIAMOND')) {
                    const gp = paint;
                    const stops = gp.gradientStops || [];
                    const rebuiltStops = [];
                    for (const stop of stops) {
                        const rgba = stop.color;
                        if (!stop.boundVariables || !stop.boundVariables.color) {
                            try {
                                const variable = await findExistingColorVarForRGBA(rgba);
                                if (variable) {
                                    rebuiltStops.push({
                                        position: stop.position,
                                        color: stop.color,
                                        boundVariables: { color: { type: 'VARIABLE_ALIAS', id: variable.id } },
                                    });
                                }
                                else {
                                    rebuiltStops.push(stop);
                                }
                            }
                            catch (e) {
                                rebuiltStops.push(stop);
                            }
                        }
                        else {
                            rebuiltStops.push(stop);
                        }
                    }
                    if (rebuiltStops.length === stops.length && rebuiltStops.some((s, idx) => s !== stops[idx])) {
                        updated = true;
                        const rebuilt = {
                            type: gp.type,
                            gradientTransform: gp.gradientTransform,
                            gradientStops: rebuiltStops,
                            opacity: gp.opacity,
                            visible: gp.visible,
                            blendMode: gp.blendMode,
                        };
                        newFills[i] = rebuilt;
                    }
                }
            }
            try {
                node.fills = newFills;
            }
            catch (_a) { }
            if (updated)
                nodesUpdated++;
        }
        if ('strokes' in node && Array.isArray(node.strokes)) {
            const strokes = node.strokes || [];
            const newStrokes = [];
            let updatedStrokes = false;
            for (let i = 0; i < strokes.length; i++) {
                const paint = strokes[i];
                if (!paint) {
                    newStrokes.push(paint);
                    continue;
                }
                if (paint.type === 'SOLID') {
                    const a = typeof paint.opacity === 'number' ? paint.opacity : 1;
                    const rgba = { r: paint.color.r, g: paint.color.g, b: paint.color.b, a };
                    const alreadyBound = Boolean(paint.boundVariables && paint.boundVariables.color);
                    if (!alreadyBound) {
                        try {
                            const variable = await findExistingColorVarForRGBA(rgba);
                            if (variable) {
                                const bound = figma.variables.setBoundVariableForPaint(paint, 'color', variable);
                                newStrokes[i] = bound;
                                updatedStrokes = true;
                            }
                            else {
                                newStrokes[i] = paint;
                            }
                        }
                        catch (e) {
                            newStrokes[i] = paint;
                        }
                    }
                    else {
                        newStrokes[i] = paint;
                    }
                }
                else {
                    newStrokes[i] = paint;
                }
            }
            try {
                node.strokes = newStrokes;
            }
            catch (_b) { }
            if (updatedStrokes)
                nodesUpdated++;
        }
    }
    const walk = async (node) => {
        await processNodePaints(node);
        if ('children' in node && Array.isArray(node.children)) {
            for (const child of node.children) {
                await walk(child);
            }
        }
    };
    for (const root of selection)
        await walk(root);
    figma.notify(`Updated ${nodesUpdated} nodes by binding existing color variables where available`);
}
exports.handleConvertColorsToVariables = handleConvertColorsToVariables;
async function handleCreateColorCollectionFromSelection() {
    const selection = figma.currentPage.selection;
    if (!selection || selection.length === 0) {
        figma.notify('Select at least one node to create a color collection.');
        return;
    }
    const colorMap = new Map();
    const addRGBA = (rgba) => {
        const key = `${Math.max(0, Math.min(255, Math.round(rgba.r * 255)))
            .toString(16)
            .padStart(2, '0')}${Math.max(0, Math.min(255, Math.round(rgba.g * 255)))
            .toString(16)
            .padStart(2, '0')}${Math.max(0, Math.min(255, Math.round(rgba.b * 255)))
            .toString(16)
            .padStart(2, '0')}${Math.max(0, Math.min(255, Math.round((typeof rgba.a === 'number' ? rgba.a : 1) * 255)))
            .toString(16)
            .padStart(2, '0')}`.toUpperCase();
        if (!colorMap.has(key))
            colorMap.set(key, { r: rgba.r, g: rgba.g, b: rgba.b, a: typeof rgba.a === 'number' ? rgba.a : 1 });
    };
    const processPaint = (paint) => {
        if (!paint)
            return;
        if (paint.type === 'SOLID') {
            const a = typeof paint.opacity === 'number' ? paint.opacity : 1;
            addRGBA({ r: paint.color.r, g: paint.color.g, b: paint.color.b, a });
        }
        else if (paint.type === 'GRADIENT_LINEAR' ||
            paint.type === 'GRADIENT_RADIAL' ||
            paint.type === 'GRADIENT_ANGULAR' ||
            paint.type === 'GRADIENT_DIAMOND') {
            const stops = paint.gradientStops || [];
            for (const stop of stops) {
                addRGBA(stop.color);
            }
        }
    };
    const processNode = (node) => {
        const hasFillStyle = 'fillStyleId' in node && Boolean(node.fillStyleId);
        const hasStrokeStyle = 'strokeStyleId' in node && Boolean(node.strokeStyleId);
        if ('fills' in node && Array.isArray(node.fills)) {
            const fills = node.fills || [];
            for (const paint of fills) {
                const bound = Boolean(paint && paint.boundVariables && paint.boundVariables.color);
                if (bound || hasFillStyle)
                    processPaint(paint);
            }
        }
        if ('strokes' in node && Array.isArray(node.strokes)) {
            const strokes = node.strokes || [];
            for (const paint of strokes) {
                const bound = Boolean(paint && paint.boundVariables && paint.boundVariables.color);
                if (bound || hasStrokeStyle)
                    processPaint(paint);
            }
        }
        if (hasFillStyle) {
            try {
                const style = figma.getStyleById(node.fillStyleId);
                if (style && Array.isArray(style.paints)) {
                    for (const p of style.paints)
                        processPaint(p);
                }
            }
            catch (_a) { }
        }
        if (hasStrokeStyle) {
            try {
                const style = figma.getStyleById(node.strokeStyleId);
                if (style && Array.isArray(style.paints)) {
                    for (const p of style.paints)
                        processPaint(p);
                }
            }
            catch (_b) { }
        }
        if ('children' in node && Array.isArray(node.children)) {
            for (const child of node.children) {
                processNode(child);
            }
        }
    };
    for (const root of selection)
        processNode(root);
    if (colorMap.size === 0) {
        figma.notify('No styled or variable-bound colors found in selection.');
        return;
    }
    let collection = null;
    try {
        const lastId = await figma.clientStorage.getAsync('lastColorCollectionId');
        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        if (lastId) {
            collection = collections.find((c) => c.id === lastId) || null;
        }
        if (!collection) {
            const label = `Selection Colors ${new Date().toLocaleString()}`;
            collection = figma.variables.createVariableCollection(label);
            await figma.clientStorage.setAsync('lastColorCollectionId', collection.id);
        }
    }
    catch (e) {
        figma.notify('Failed to prepare variable collection.');
        return;
    }
    if (!collection) {
        figma.notify('Failed to prepare variable collection.');
        return;
    }
    if (!collection.modes || collection.modes.length === 0) {
        collection.addMode('Base');
    }
    const modeId = collection.modes[0].modeId;
    let created = 0;
    const newVarMap = new Map();
    const toHex = (c) => {
        const n = Math.max(0, Math.min(255, Math.round(c * 255)));
        return n.toString(16).padStart(2, '0');
    };
    const rgbaKey = (rgba) => `${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}${toHex(rgba.a)}`.toUpperCase();
    for (const [key, rgba] of colorMap.entries()) {
        const name = `color-${key}`;
        const v = await (0, color_utils_1.createOrUpdateColorVariableWithCollection)(collection, modeId, name, rgba);
        if (v) {
            created++;
            newVarMap.set(key, v);
        }
    }
    let reassigned = 0;
    const reassignNode = (node) => {
        if ('fills' in node && Array.isArray(node.fills)) {
            const fills = node.fills || [];
            const newFills = [];
            for (const paint of fills) {
                if (!paint) {
                    newFills.push(paint);
                    continue;
                }
                if (paint.type === 'SOLID') {
                    const bound = Boolean(paint.boundVariables && paint.boundVariables.color);
                    if (bound) {
                        const a = typeof paint.opacity === 'number' ? paint.opacity : 1;
                        const rgba = { r: paint.color.r, g: paint.color.g, b: paint.color.b, a };
                        const key = rgbaKey(rgba);
                        const target = newVarMap.get(key);
                        if (target) {
                            try {
                                const updated = figma.variables.setBoundVariableForPaint(paint, 'color', target);
                                newFills.push(updated);
                                reassigned++;
                                continue;
                            }
                            catch (_a) { }
                        }
                    }
                    newFills.push(paint);
                }
                else if (paint.type === 'GRADIENT_LINEAR' ||
                    paint.type === 'GRADIENT_RADIAL' ||
                    paint.type === 'GRADIENT_ANGULAR' ||
                    paint.type === 'GRADIENT_DIAMOND') {
                    const gp = paint;
                    const stops = gp.gradientStops || [];
                    const rebuilt = [];
                    let changed = false;
                    for (const stop of stops) {
                        const bound = Boolean(stop.boundVariables && stop.boundVariables.color);
                        if (bound) {
                            const rgba = stop.color;
                            const key = rgbaKey(rgba);
                            const target = newVarMap.get(key);
                            if (target) {
                                rebuilt.push({
                                    position: stop.position,
                                    color: stop.color,
                                    boundVariables: { color: { type: 'VARIABLE_ALIAS', id: target.id } },
                                });
                                changed = true;
                                reassigned++;
                            }
                            else {
                                rebuilt.push(stop);
                            }
                        }
                        else {
                            rebuilt.push(stop);
                        }
                    }
                    if (changed) {
                        const newPaint = {
                            type: gp.type,
                            gradientTransform: gp.gradientTransform,
                            gradientStops: rebuilt,
                            opacity: gp.opacity,
                            visible: gp.visible,
                            blendMode: gp.blendMode,
                        };
                        newFills.push(newPaint);
                    }
                    else {
                        newFills.push(paint);
                    }
                }
                else {
                    newFills.push(paint);
                }
            }
            try {
                node.fills = newFills;
            }
            catch (_b) { }
        }
        if ('strokes' in node && Array.isArray(node.strokes)) {
            const strokes = node.strokes || [];
            const newStrokes = [];
            for (const paint of strokes) {
                if (!paint) {
                    newStrokes.push(paint);
                    continue;
                }
                if (paint.type === 'SOLID') {
                    const bound = Boolean(paint.boundVariables && paint.boundVariables.color);
                    if (bound) {
                        const a = typeof paint.opacity === 'number' ? paint.opacity : 1;
                        const rgba = { r: paint.color.r, g: paint.color.g, b: paint.color.b, a };
                        const key = rgbaKey(rgba);
                        const target = newVarMap.get(key);
                        if (target) {
                            try {
                                const updated = figma.variables.setBoundVariableForPaint(paint, 'color', target);
                                newStrokes.push(updated);
                                reassigned++;
                                continue;
                            }
                            catch (_c) { }
                        }
                    }
                    newStrokes.push(paint);
                }
                else {
                    newStrokes.push(paint);
                }
            }
            try {
                node.strokes = newStrokes;
            }
            catch (_d) { }
        }
        if ('children' in node && Array.isArray(node.children)) {
            for (const child of node.children) {
                reassignNode(child);
            }
        }
    };
    for (const root of selection)
        reassignNode(root);
    figma.notify(`Created ${created} vars and reassigned ${reassigned} bindings to the new collection.`);
}
exports.handleCreateColorCollectionFromSelection = handleCreateColorCollectionFromSelection;
async function handleCreateAllColorVariables() {
    await (0, color_variable_generator_1.createAllColorVariablesFromSelection)();
}
exports.handleCreateAllColorVariables = handleCreateAllColorVariables;
async function handleAliasLocalToImportedByName() {
    try {
        const localVars = await figma.variables.getLocalVariablesAsync();
        console.log('[Plugin] Local variables:', localVars.length);
        const remoteByName = new Map();
        const addById = async (id) => {
            if (!id)
                return;
            try {
                const v = await figma.variables.getVariableByIdAsync(id);
                if (v && v.remote && !remoteByName.has(v.name))
                    remoteByName.set(v.name, v);
            }
            catch (_a) { }
        };
        figma.currentPage.findAll((node) => {
            var _a;
            const anyNode = node;
            try {
                const b = anyNode.boundVariables;
                if (b && typeof b === 'object') {
                    for (const k of Object.keys(b)) {
                        const entry = b[k];
                        if (!entry)
                            continue;
                        if (Array.isArray(entry)) {
                            for (const a of entry)
                                addById(a === null || a === void 0 ? void 0 : a.id);
                        }
                        else {
                            addById(entry === null || entry === void 0 ? void 0 : entry.id);
                        }
                    }
                }
                const paintFields = ['fills', 'strokes', 'effects'];
                for (const field of paintFields) {
                    const arr = anyNode[field];
                    if (Array.isArray(arr)) {
                        for (const paint of arr) {
                            const bv = paint === null || paint === void 0 ? void 0 : paint.boundVariables;
                            const colorAliasId = (_a = bv === null || bv === void 0 ? void 0 : bv.color) === null || _a === void 0 ? void 0 : _a.id;
                            if (colorAliasId)
                                addById(colorAliasId);
                        }
                    }
                }
            }
            catch (_b) { }
            return false;
        });
        console.log('[Plugin] Imported variables discovered by name:', remoteByName.size);
        const toHex = (c) => Math.max(0, Math.min(255, Math.round(c * 255))).toString(16).padStart(2, '0');
        const valueKey = (val) => {
            if (typeof val === 'number')
                return `N:${val}`;
            if (typeof val === 'string')
                return `S:${val}`;
            if (val && typeof val === 'object' && 'r' in val && 'g' in val && 'b' in val && 'a' in val) {
                return `C:${toHex(val.r)}${toHex(val.g)}${toHex(val.b)}${toHex(val.a)}`;
            }
            return null;
        };
        const firstValueKey = (variable) => {
            try {
                const vals = variable.valuesByMode;
                if (!vals)
                    return null;
                for (const k of Object.keys(vals)) {
                    const key = valueKey(vals[k]);
                    if (key)
                        return key;
                }
                return null;
            }
            catch (_a) {
                return null;
            }
        };
        let updated = 0;
        const matched = [];
        const skippedMismatch = [];
        for (const v of localVars) {
            const remote = remoteByName.get(v.name);
            if (!remote || remote.resolvedType !== v.resolvedType)
                continue;
            const localKey = firstValueKey(v);
            const remoteKey = firstValueKey(remote);
            if (!localKey || !remoteKey || localKey !== remoteKey) {
                skippedMismatch.push(v.name);
                continue;
            }
            const collection = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
            if (!collection)
                continue;
            for (const mode of collection.modes) {
                try {
                    v.setValueForMode(mode.modeId, { type: 'VARIABLE_ALIAS', id: remote.id });
                    updated++;
                }
                catch (_a) { }
            }
            matched.push(v.name);
        }
        console.log('[Plugin] Aliased variables (name+value match):', matched);
        if (skippedMismatch.length)
            console.log('[Plugin] Skipped due to value mismatch:', skippedMismatch);
        figma.notify(updated > 0
            ? `Aliased ${updated} local variable values to imported variables by name and value`
            : 'No matching imported variables (name+value) found');
    }
    catch (e) {
        console.error('Alias locals to imported error:', e);
        figma.notify('Error aliasing variables');
    }
}
exports.handleAliasLocalToImportedByName = handleAliasLocalToImportedByName;


/***/ },

/***/ "./src/plugin/handlers/frameHandlers.ts"
/*!**********************************************!*\
  !*** ./src/plugin/handlers/frameHandlers.ts ***!
  \**********************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleFindDuplicateTopLevelFrames = exports.handlePairSelectedFrames = exports.handleGroupSelectedFrames = exports.handleArrangeFrames = void 0;
function handleArrangeFrames(msg) {
    const postfix = (msg.postfix || '').trim();
    const randomnessLevel = typeof msg.randomnessLevel === 'number' ? msg.randomnessLevel : null;
    const selection = figma.currentPage.selection.filter((n) => n.type === 'FRAME');
    if (!selection.length) {
        figma.notify('Please select frames first.');
        return;
    }
    const commonParent = selection[0].parent;
    const frames = selection.filter((f) => f.parent === commonParent);
    if (!frames.length) {
        figma.notify('No frames with a common parent found.');
        return;
    }
    frames.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    const gap = (() => {
        if (randomnessLevel === null)
            return 16;
        const clamped = Math.max(0, Math.min(100, Math.round(randomnessLevel)));
        return Math.round((clamped / 100) * 200);
    })();
    const startX = Math.min(...frames.map((f) => f.x));
    const baselineY = Math.min(...frames.map((f) => f.y));
    let x = startX;
    for (const f of frames) {
        try {
            f.x = x;
            f.y = baselineY;
            if (postfix) {
                const needsSpace = !postfix.startsWith(' ') && !postfix.startsWith('-') && !postfix.startsWith('_');
                f.name = `${f.name}${needsSpace ? ' ' : ''}${postfix}`;
            }
            x += f.width + gap;
        }
        catch (e) {
            console.warn('Failed arranging a frame:', e);
        }
    }
    figma.currentPage.selection = frames;
    figma.viewport.scrollAndZoomIntoView(frames);
    figma.notify(`Arranged ${frames.length} frames${postfix ? ` with postfix "${postfix}"` : ''} (gap: ${gap}px).`);
}
exports.handleArrangeFrames = handleArrangeFrames;
function handleGroupSelectedFrames(msg) {
    const suffix = msg.suffix;
    const selectedFrames = figma.currentPage.selection.filter((n) => n.type === 'FRAME');
    if (selectedFrames.length === 0) {
        figma.notify('Please select some frames first!');
        return;
    }
    const groups = {};
    for (const frame of selectedFrames) {
        const name = frame.name.trim();
        if (name.endsWith(suffix)) {
            const baseName = name.replace(new RegExp(`\\s*${suffix}$`, 'i'), '').trim();
            if (!groups[baseName])
                groups[baseName] = {};
            groups[baseName].suffixFrame = frame;
        }
        else {
            if (!groups[name])
                groups[name] = {};
            groups[name].base = frame;
        }
    }
    const container = figma.createFrame();
    container.name = `Grouped Frames (${suffix})`;
    container.layoutMode = 'VERTICAL';
    container.primaryAxisSizingMode = 'AUTO';
    container.counterAxisSizingMode = 'AUTO';
    container.itemSpacing = 24;
    container.paddingTop = container.paddingBottom = 24;
    container.paddingLeft = container.paddingRight = 24;
    for (const baseName in groups) {
        const { base, suffixFrame } = groups[baseName];
        if (!base && !suffixFrame)
            continue;
        const row = figma.createFrame();
        row.name = `${baseName} Row`;
        row.layoutMode = 'HORIZONTAL';
        row.primaryAxisSizingMode = 'AUTO';
        row.counterAxisSizingMode = 'AUTO';
        row.itemSpacing = 16;
        if (base)
            row.appendChild(base);
        if (suffixFrame)
            row.appendChild(suffixFrame);
        container.appendChild(row);
    }
    figma.currentPage.appendChild(container);
    figma.currentPage.selection = [container];
    figma.viewport.scrollAndZoomIntoView([container]);
    figma.notify('Frames grouped successfully!');
}
exports.handleGroupSelectedFrames = handleGroupSelectedFrames;
function handlePairSelectedFrames(msg) {
    const suffix = msg.suffix;
    const selectedFrames = figma.currentPage.selection.filter((n) => n.type === 'FRAME');
    if (!selectedFrames.length) {
        figma.notify('Please select frames first!');
        return;
    }
    const groups = {};
    for (const frame of selectedFrames) {
        const name = frame.name.trim();
        if (name.endsWith(suffix)) {
            const baseName = name.replace(new RegExp(`\\s*${suffix}$`, 'i'), '').trim();
            if (!groups[baseName])
                groups[baseName] = {};
            groups[baseName].suffixFrame = frame;
        }
        else {
            if (!groups[name])
                groups[name] = {};
            groups[name].base = frame;
        }
    }
    let xOffset = 0;
    for (const baseName in groups) {
        const { base, suffixFrame } = groups[baseName];
        if (base) {
            base.x = xOffset;
            base.y = 0;
            xOffset += base.width + 24;
        }
        if (suffixFrame) {
            suffixFrame.x = xOffset;
            suffixFrame.y = 0;
            xOffset += suffixFrame.width + 24;
        }
    }
    figma.notify('Selected frames arranged by naming!');
}
exports.handlePairSelectedFrames = handlePairSelectedFrames;
function handleFindDuplicateTopLevelFrames() {
    const topLevelFrames = figma.currentPage.children.filter((node) => node.type === 'FRAME' && node.layoutMode === 'NONE');
    const frameMap = {};
    for (const frame of topLevelFrames) {
        if (!frameMap[frame.name])
            frameMap[frame.name] = [];
        frameMap[frame.name].push(frame);
    }
    const duplicates = [];
    for (const name in frameMap) {
        if (frameMap[name].length > 1)
            duplicates.push(...frameMap[name]);
    }
    if (duplicates.length > 0) {
        figma.currentPage.selection = duplicates;
        figma.viewport.scrollAndZoomIntoView(duplicates);
        figma.notify(`Found ${duplicates.length} top-level standard frames with duplicate names.`);
        figma.ui.postMessage({ type: 'duplicate-selection', count: duplicates.length });
    }
    else {
        figma.notify('No duplicate top-level standard frame names found.');
        figma.ui.postMessage({ type: 'duplicate-selection', count: 0 });
    }
}
exports.handleFindDuplicateTopLevelFrames = handleFindDuplicateTopLevelFrames;


/***/ },

/***/ "./src/plugin/handlers/mcpHandlers.ts"
/*!********************************************!*\
  !*** ./src/plugin/handlers/mcpHandlers.ts ***!
  \********************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleMcpGetCurrentSelection = exports.handleMcpGetSelection = exports.handleMcpComponentSearch = exports.handleMcpNodeOperation = void 0;
class ValidationError extends Error {
    constructor(field, message) {
        super(`${field}: ${message}`);
        this.field = field;
        this.name = 'ValidationError';
    }
}
function normalizePayload(payload, aliases) {
    const normalized = {};
    for (const [key, value] of Object.entries(payload)) {
        const canonicalKey = aliases[key] || key;
        normalized[canonicalKey] = value;
    }
    return normalized;
}
function validateNodeId(id) {
    const normalized = id.replace('-', ':');
    if (!normalized.includes(':')) {
        throw new ValidationError('nodeId', 'Must be in format "123:456"');
    }
    return normalized;
}
function validateOperation(op) {
    const valid = ['read', 'update', 'delete', 'select'];
    if (!valid.includes(op)) {
        throw new ValidationError('operation', `Must be one of: ${valid.join(', ')}`);
    }
    return op;
}
function validateComponentName(name) {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
        throw new ValidationError('name', 'Component name cannot be empty');
    }
    return trimmed;
}
function validateSelection(selection, constraints) {
    const { minItems = 0, maxItems = Infinity, allowedTypes } = constraints;
    if (selection.length < minItems) {
        throw new ValidationError('selection', `Select at least ${minItems} item(s)`);
    }
    if (selection.length > maxItems) {
        throw new ValidationError('selection', `Select at most ${maxItems} item(s)`);
    }
    if (allowedTypes) {
        const invalid = selection.filter((node) => !allowedTypes.includes(node.type));
        if (invalid.length > 0) {
            throw new ValidationError('selection', `Invalid node types. Allowed: ${allowedTypes.join(', ')}`);
        }
    }
    return selection;
}
const NODE_ALIASES = {
    id: 'nodeId',
    node: 'nodeId',
    node_id: 'nodeId',
    action: 'operation',
    op: 'operation',
    props: 'properties',
    data: 'properties',
};
const COMPONENT_ALIASES = {
    componentName: 'name',
    component: 'name',
    comp: 'name',
    variantName: 'variant',
    pageName: 'page',
};
const SELECTION_ALIASES = {
    min: 'minItems',
    max: 'maxItems',
    types: 'allowedTypes',
    nodeTypes: 'allowedTypes',
};
async function handleMcpNodeOperation(msg) {
    try {
        const normalized = normalizePayload(msg.arguments, NODE_ALIASES);
        const nodeId = validateNodeId(normalized.nodeId);
        const operation = validateOperation(normalized.operation || 'read');
        const node = await figma.getNodeByIdAsync(nodeId);
        if (!node) {
            throw new Error(`Node ${nodeId} not found`);
        }
        let resultData;
        switch (operation) {
            case 'read':
                resultData = {
                    id: node.id,
                    name: node.name,
                    type: node.type,
                    visible: node.visible,
                    locked: node.locked,
                };
                break;
            case 'update':
                if (normalized.properties) {
                    if ('name' in normalized.properties)
                        node.name = normalized.properties.name;
                    if ('visible' in normalized.properties)
                        node.visible = normalized.properties.visible;
                    if ('locked' in normalized.properties)
                        node.locked = normalized.properties.locked;
                }
                resultData = { updated: true };
                break;
            case 'delete':
                node.remove();
                resultData = { deleted: true };
                break;
            case 'select':
                figma.currentPage.selection = [node];
                figma.viewport.scrollAndZoomIntoView([node]);
                resultData = { selected: true };
                break;
        }
        figma.ui.postMessage({
            type: 'mcp_result',
            data: { success: true, data: resultData },
        });
    }
    catch (error) {
        figma.ui.postMessage({
            type: 'mcp_result',
            data: { success: false, error: error.message },
        });
    }
}
exports.handleMcpNodeOperation = handleMcpNodeOperation;
async function handleMcpComponentSearch(msg) {
    try {
        const normalized = normalizePayload(msg.arguments, COMPONENT_ALIASES);
        const name = validateComponentName(normalized.name);
        await figma.loadAllPagesAsync();
        const components = figma.root.findAll((node) => {
            if (node.type !== 'COMPONENT' && node.type !== 'COMPONENT_SET') {
                return false;
            }
            const nameMatch = node.name.toLowerCase().includes(name.toLowerCase());
            if (normalized.page) {
                const pageMatch = node.parent ? node.parent.name === normalized.page : false;
                return nameMatch && pageMatch;
            }
            return nameMatch;
        });
        if (components.length > 0) {
            const sceneNodes = components.filter((c) => 'parent' in c && c.parent !== null);
            if (sceneNodes.length > 0) {
                figma.currentPage.selection = sceneNodes;
                try {
                    figma.viewport.scrollAndZoomIntoView(sceneNodes);
                }
                catch (_a) { }
            }
        }
        figma.ui.postMessage({
            type: 'mcp_result',
            data: {
                success: true,
                data: {
                    count: components.length,
                    components: components.slice(0, 10).map((c) => ({
                        id: c.id,
                        name: c.name,
                        type: c.type,
                        page: c.parent ? c.parent.name : null,
                    })),
                },
            },
        });
    }
    catch (error) {
        figma.ui.postMessage({
            type: 'mcp_result',
            data: { success: false, error: error.message },
        });
    }
}
exports.handleMcpComponentSearch = handleMcpComponentSearch;
function handleMcpGetSelection(msg) {
    try {
        const normalized = normalizePayload(msg.arguments, SELECTION_ALIASES);
        const selection = validateSelection(figma.currentPage.selection, {
            minItems: normalized.minItems,
            maxItems: normalized.maxItems,
            allowedTypes: normalized.allowedTypes,
        });
        figma.ui.postMessage({
            type: 'mcp_result',
            data: {
                success: true,
                data: {
                    count: selection.length,
                    nodes: selection.map((node) => ({
                        id: node.id,
                        name: node.name,
                        type: node.type,
                    })),
                },
            },
        });
    }
    catch (error) {
        figma.ui.postMessage({
            type: 'mcp_result',
            data: { success: false, error: error.message },
        });
    }
}
exports.handleMcpGetSelection = handleMcpGetSelection;
function handleMcpGetCurrentSelection() {
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
        figma.ui.postMessage({
            type: 'mcp_current_selection',
            data: { nodeId: selection[0].id },
        });
    }
    else {
        figma.ui.postMessage({
            type: 'mcp_current_selection',
            data: null,
        });
    }
}
exports.handleMcpGetCurrentSelection = handleMcpGetCurrentSelection;


/***/ },

/***/ "./src/plugin/handlers/paddingHandlers.ts"
/*!************************************************!*\
  !*** ./src/plugin/handlers/paddingHandlers.ts ***!
  \************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleBulkApplyDepthSpacing = exports.handleApplyRandomPaddings = exports.handleUpdateItemSpacing = exports.handleUpdatePadding = exports.createPaddingVariables = void 0;
const autolayout_1 = __webpack_require__(/*! ../utils/autolayout */ "./src/plugin/utils/autolayout.ts");
const variables_1 = __webpack_require__(/*! ../utils/variables */ "./src/plugin/utils/variables.ts");
async function createPaddingVariables(namePrefix) {
    const selectedNodes = figma.currentPage.selection;
    if (selectedNodes.length === 0) {
        figma.notify('No Auto Layout frames selected. Please select Auto Layout frames first.');
        return;
    }
    const autoLayoutFrames = selectedNodes.filter((node) => node.type === 'FRAME' &&
        node.layoutMode !== 'NONE' &&
        node.visible &&
        !node.locked &&
        !node.removed);
    if (autoLayoutFrames.length === 0) {
        figma.notify('No valid Auto Layout frames selected. Please select Auto Layout frames.');
        return;
    }
    const paddingData = autoLayoutFrames.map((frame) => (0, autolayout_1.extractAutoLayoutInfo)(frame)).filter(Boolean);
    if (paddingData.length === 0) {
        figma.notify('No Auto Layout nodes with padding found in selection');
        return;
    }
    try {
        const ensured = await (0, variables_1.getOrCreatePaddingCollectionWithMode)();
        if (!ensured.collection || !ensured.modeId) {
            figma.notify('Failed to prepare Padding variable collection');
            return;
        }
        const collection = ensured.collection;
        const modeId = ensured.modeId;
        const createdVariables = [];
        const valueMap = new Map();
        const prefix = (() => {
            try {
                const raw = (namePrefix || 'padding').trim();
                const cleaned = raw.replace(/[\x00-\x1F\x7F]/g, '').replace(/\s+/g, '-');
                return cleaned || 'padding';
            }
            catch (_a) {
                return 'padding';
            }
        })();
        async function processNode(node, originalFigmaNode) {
            try {
                if (!node)
                    return;
                let figmaNode = originalFigmaNode || null;
                if (node.isAutoLayout) {
                    const padding = node.padding || {};
                    const top = padding.top || 0;
                    const bottom = padding.bottom || 0;
                    const left = padding.left || 0;
                    const right = padding.right || 0;
                    const itemSpacing = node.itemSpacing || 0;
                    if (!figmaNode && node.id) {
                        try {
                            figmaNode = figma.getNodeById(node.id);
                        }
                        catch (e) {
                            console.warn('Could not find Figma node with ID:', node.id);
                        }
                    }
                    const bindVariable = async (value, property) => {
                        if (value >= 0) {
                            const variable = await getOrCreateVariableForValue(collection, modeId, value, valueMap);
                            if (variable && !createdVariables.includes(variable)) {
                                createdVariables.push(variable);
                            }
                            if (figmaNode && property in figmaNode && variable) {
                                try {
                                    figmaNode.setBoundVariable(property, variable.id);
                                }
                                catch (e) {
                                    console.warn(`Could not bind ${property} variable:`, e);
                                }
                            }
                        }
                    };
                    await bindVariable(top, 'paddingTop');
                    await bindVariable(bottom, 'paddingBottom');
                    await bindVariable(left, 'paddingLeft');
                    await bindVariable(right, 'paddingRight');
                    await bindVariable(itemSpacing, 'itemSpacing');
                }
                if (node.children && Array.isArray(node.children) && node.children.length > 0) {
                    for (const child of node.children) {
                        await processNode(child, figmaNode);
                    }
                }
            }
            catch (error) {
                console.error('Error processing node:', error);
            }
        }
        async function getOrCreateVariableForValue(collection, modeId, value, valueMap) {
            try {
                if (valueMap.has(value)) {
                    const existingVariable = valueMap.get(value);
                    return existingVariable || null;
                }
                const varName = `${prefix}-${value}`;
                const variable = await (0, variables_1.createOrUpdateVariableWithCollection)(collection, modeId, varName, value);
                if (variable) {
                    valueMap.set(value, variable);
                }
                return variable;
            }
            catch (error) {
                console.error(`Error creating variable for value ${value}:`, error);
                return null;
            }
        }
        for (const node of paddingData) {
            let figmaNode = null;
            if (node.id) {
                try {
                    figmaNode = figma.getNodeById(node.id);
                }
                catch (e) {
                    console.warn('Could not find Figma node with ID:', node.id);
                }
            }
            await processNode(node, figmaNode);
        }
        if (createdVariables.length > 0) {
            figma.notify(`Created ${createdVariables.length} padding variables and assigned to ${autoLayoutFrames.length} selected Auto Layout frames`);
            await (0, variables_1.sendNumberVariablesToUI)();
            figma.ui.postMessage({ type: 'padding-data', data: (0, autolayout_1.getAllPaddingData)() });
        }
        else {
            figma.notify('No padding variables created');
        }
    }
    catch (error) {
        console.error('Error creating padding variables:', error);
        figma.notify('Error creating variables: ' + error.message);
    }
}
exports.createPaddingVariables = createPaddingVariables;
function handleUpdatePadding(msg) {
    const { id, side, value, variableId } = msg;
    figma.getNodeByIdAsync(id).then((node) => {
        if (!node ||
            !(node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') ||
            !(0, autolayout_1.isAutoLayoutNode)(node)) {
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
            figma.ui.postMessage({ type: 'padding-data', data: (0, autolayout_1.getAllPaddingData)() });
        }
        catch (e) {
            console.error(`Failed to update padding for ${id}`, e);
        }
    });
}
exports.handleUpdatePadding = handleUpdatePadding;
function handleUpdateItemSpacing(msg) {
    const { id, value, variableId } = msg;
    const node = figma.getNodeById(id);
    if (!node ||
        !(node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE' || node.type === 'SECTION') ||
        !(0, autolayout_1.isAutoLayoutNode)(node))
        return;
    try {
        if (variableId) {
            try {
                node.setBoundVariable('primaryAxisSpacing', variableId);
            }
            catch (_a) { }
            try {
                node.setBoundVariable('counterAxisSpacing', variableId);
            }
            catch (_b) { }
            try {
                node.setBoundVariable('itemSpacing', variableId);
            }
            catch (_c) { }
        }
        else if (typeof value === 'number') {
            try {
                node.primaryAxisSpacing = value;
            }
            catch (_d) { }
            try {
                node.counterAxisSpacing = value;
            }
            catch (_e) { }
            try {
                node.itemSpacing = value;
            }
            catch (_f) { }
        }
        figma.ui.postMessage({ type: 'padding-data', data: (0, autolayout_1.getAllPaddingData)() });
    }
    catch (e) {
        console.error(`Failed to update itemSpacing for ${id}`, e);
    }
}
exports.handleUpdateItemSpacing = handleUpdateItemSpacing;
function handleApplyRandomPaddings(msg) {
    try {
        const selected = figma.currentPage.selection.filter((node) => (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') &&
            (0, autolayout_1.isAutoLayoutNode)(node) &&
            node.visible &&
            !node.locked);
        if (selected.length === 0) {
            figma.notify('Select at least one Auto Layout node.');
            return;
        }
        const randomnessLevel = msg.randomnessLevel || 50;
        const getPaddingScale = (level) => {
            if (level <= 20)
                return [0, 4, 8];
            if (level <= 40)
                return [0, 4, 8, 12, 16];
            if (level <= 60)
                return [0, 4, 8, 12, 16, 20, 24];
            if (level <= 80)
                return [0, 4, 8, 12, 16, 20, 24, 28, 32];
            return [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48];
        };
        const getSpacingScale = (level) => {
            if (level <= 20)
                return [0, 4, 8];
            if (level <= 40)
                return [0, 4, 8, 12];
            if (level <= 60)
                return [0, 4, 8, 12, 16, 20];
            if (level <= 80)
                return [0, 4, 8, 12, 16, 20, 24];
            return [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40];
        };
        const paddingScale = getPaddingScale(randomnessLevel);
        const spacingScale = getSpacingScale(randomnessLevel);
        const randFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const applyRandomToNode = (node) => {
            if (!(0, autolayout_1.isAutoLayoutNode)(node))
                return;
            const padV = randFrom(paddingScale);
            const padH = randFrom(paddingScale);
            const maxPad = paddingScale[paddingScale.length - 1];
            const vPad = Math.min(padV, maxPad);
            const hPad = Math.min(padH, maxPad);
            const gap = randFrom(spacingScale);
            try {
                node.paddingTop = vPad;
            }
            catch (_a) { }
            try {
                node.paddingBottom = vPad;
            }
            catch (_b) { }
            try {
                node.paddingLeft = hPad;
            }
            catch (_c) { }
            try {
                node.paddingRight = hPad;
            }
            catch (_d) { }
            try {
                node.primaryAxisSpacing = gap;
            }
            catch (_e) { }
            try {
                node.counterAxisSpacing = gap;
            }
            catch (_f) { }
            try {
                node.itemSpacing = gap;
            }
            catch (_g) { }
        };
        const walk = (node) => {
            if ((node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') &&
                (0, autolayout_1.isAutoLayoutNode)(node)) {
                applyRandomToNode(node);
            }
            if ('children' in node && Array.isArray(node.children)) {
                for (const child of node.children) {
                    walk(child);
                }
            }
        };
        for (const n of selected)
            walk(n);
        figma.ui.postMessage({ type: 'padding-data', data: (0, autolayout_1.getAllPaddingData)() });
        figma.notify(`Assigned random paddings (${randomnessLevel}% randomness) to ${selected.length} selection roots (and their descendants).`);
    }
    catch (e) {
        console.error('Error applying random paddings:', e);
        figma.notify('Error applying random paddings.');
    }
}
exports.handleApplyRandomPaddings = handleApplyRandomPaddings;
function handleBulkApplyDepthSpacing() {
    try {
        const selectedNodes = figma.currentPage.selection;
        if (selectedNodes.length === 0) {
            figma.notify('No frames selected. Please select Auto Layout frames first.');
            return;
        }
        const autoLayoutFrames = selectedNodes.filter((node) => node.type === 'FRAME' &&
            node.layoutMode !== 'NONE' &&
            node.visible &&
            !node.locked &&
            !node.removed);
        if (autoLayoutFrames.length === 0) {
            figma.notify('No valid Auto Layout frames selected.');
            return;
        }
        const getPaddingForDepth = (depth) => {
            return Math.max(8, 24 - depth * 8);
        };
        const getSpacingForDepth = (depth) => {
            return Math.max(4, 12 - depth * 4);
        };
        const applyCascadingPaddings = (node, depth = 0) => {
            try {
                if ((0, autolayout_1.isAutoLayoutNode)(node)) {
                    const paddingValue = getPaddingForDepth(depth);
                    const spacingValue = getSpacingForDepth(depth);
                    try {
                        node.paddingTop = paddingValue;
                        node.paddingRight = paddingValue;
                        node.paddingBottom = paddingValue;
                        node.paddingLeft = paddingValue;
                    }
                    catch (e) {
                        console.warn('Could not set padding for node:', node.id, e);
                    }
                    try {
                        node.primaryAxisSpacing = spacingValue;
                        node.counterAxisSpacing = spacingValue;
                        node.itemSpacing = spacingValue;
                    }
                    catch (e) {
                        console.warn('Could not set spacing for node:', node.id, e);
                    }
                }
                if ('children' in node && node.children) {
                    for (const child of node.children) {
                        if (child.type === 'FRAME' ||
                            child.type === 'COMPONENT' ||
                            child.type === 'INSTANCE' ||
                            child.type === 'SECTION') {
                            applyCascadingPaddings(child, depth + 1);
                        }
                    }
                }
            }
            catch (error) {
                console.error('Error processing node:', node.id, error);
            }
        };
        for (const frame of autoLayoutFrames) {
            applyCascadingPaddings(frame, 0);
        }
        figma.ui.postMessage({ type: 'padding-data', data: (0, autolayout_1.getAllPaddingData)() });
        figma.notify(`Applied cascading paddings to ${autoLayoutFrames.length} Auto Layout frames`);
    }
    catch (error) {
        console.error('Error applying cascading paddings:', error);
        figma.notify('Error applying cascading paddings: ' + error.message);
    }
}
exports.handleBulkApplyDepthSpacing = handleBulkApplyDepthSpacing;


/***/ },

/***/ "./src/plugin/handlers/selectionHandlers.ts"
/*!**************************************************!*\
  !*** ./src/plugin/handlers/selectionHandlers.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleRenameNode = exports.handleZoomToNode = exports.handleSelectNextAutoLayout = exports.handleSelectAllAutoLayout = void 0;
const autolayout_1 = __webpack_require__(/*! ../utils/autolayout */ "./src/plugin/utils/autolayout.ts");
function handleSelectAllAutoLayout() {
    const autoLayoutNodes = figma.root.findAll((node) => node.type === 'FRAME' && node.layoutMode !== 'NONE');
    if (autoLayoutNodes.length > 0) {
        figma.currentPage.selection = autoLayoutNodes;
        figma.viewport.scrollAndZoomIntoView(autoLayoutNodes);
    }
    else {
        figma.notify('No Auto Layout frames found on this page.');
    }
}
exports.handleSelectAllAutoLayout = handleSelectAllAutoLayout;
function handleSelectNextAutoLayout(_msg) {
    try {
        const currentSelection = figma.currentPage.selection;
        const autoLayoutNodes = figma.currentPage.findAll((node) => (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') &&
            (0, autolayout_1.isAutoLayoutNode)(node));
        if (autoLayoutNodes.length === 0) {
            figma.notify('No Auto Layout frames found on this page.');
            return;
        }
        if (currentSelection.length > 0) {
            const currentAutoLayout = currentSelection.find((node) => autoLayoutNodes.some((alNode) => alNode.id === node.id));
            if (currentAutoLayout) {
                const currentIndex = autoLayoutNodes.findIndex((node) => node.id === currentAutoLayout.id);
                const nextIndex = (currentIndex + 1) % autoLayoutNodes.length;
                const nextNode = autoLayoutNodes[nextIndex];
                figma.currentPage.selection = [nextNode];
                figma.viewport.scrollAndZoomIntoView([nextNode]);
                figma.ui.postMessage({ type: 'padding-data', data: (0, autolayout_1.getAllPaddingData)() });
                return;
            }
        }
        const validNodes = autoLayoutNodes.filter((node) => node &&
            !node.removed &&
            node.visible &&
            !node.locked &&
            node.layoutMode &&
            node.layoutMode !== 'NONE');
        if (validNodes.length === 0) {
            figma.notify('No valid Auto Layout frames found.');
            return;
        }
        const randomIndex = Math.floor(Math.random() * validNodes.length);
        const selectedNode = validNodes[randomIndex];
        if (!selectedNode || selectedNode.removed || !selectedNode.visible) {
            figma.notify('Selected node is no longer valid. Please try again.');
            return;
        }
        figma.currentPage.selection = [selectedNode];
        try {
            figma.viewport.scrollAndZoomIntoView([selectedNode]);
        }
        catch (zoomError) {
            console.warn('Could not zoom to selected node:', zoomError);
        }
        figma.notify(`Selected: ${selectedNode.name}`);
    }
    catch (error) {
        console.error('Error selecting random Auto Layout:', error);
        figma.notify('Error selecting Auto Layout frame. Please try again.');
    }
}
exports.handleSelectNextAutoLayout = handleSelectNextAutoLayout;
async function handleZoomToNode(msg) {
    const node = await figma.getNodeByIdAsync(msg.nodeId);
    if (node && 'parent' in node) {
        figma.viewport.scrollAndZoomIntoView([node]);
        figma.currentPage.selection = [node];
    }
}
exports.handleZoomToNode = handleZoomToNode;
function handleRenameNode(msg) {
    const { nodeId, newName } = msg;
    figma.getNodeByIdAsync(nodeId).then((node) => {
        if (node && 'name' in node) {
            let name = String(newName !== null && newName !== void 0 ? newName : '').trim();
            name = name.replace(/[\x00-\x1F\x7F]/g, '');
            if (name.length > 128)
                name = name.slice(0, 128);
            if (!name || name === node.name)
                return;
            node.name = name;
            figma.ui.postMessage({ type: 'padding-data', data: (0, autolayout_1.getAllPaddingData)() });
        }
    });
}
exports.handleRenameNode = handleRenameNode;


/***/ },

/***/ "./src/plugin/utils/autolayout.ts"
/*!****************************************!*\
  !*** ./src/plugin/utils/autolayout.ts ***!
  \****************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAllPaddingData = exports.extractAutoLayoutInfo = exports.isAutoLayoutNode = void 0;
function isAutoLayoutNode(node) {
    return ((node.type === 'FRAME' ||
        node.type === 'COMPONENT' ||
        node.type === 'INSTANCE') &&
        (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL'));
}
exports.isAutoLayoutNode = isAutoLayoutNode;
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
exports.extractAutoLayoutInfo = extractAutoLayoutInfo;
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
exports.getAllPaddingData = getAllPaddingData;


/***/ },

/***/ "./src/plugin/utils/variables.ts"
/*!***************************************!*\
  !*** ./src/plugin/utils/variables.ts ***!
  \***************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createOrUpdateVariableWithCollection = exports.getOrCreatePaddingCollectionWithMode = exports.sendNumberVariablesToUI = void 0;
async function sendNumberVariablesToUI() {
    try {
        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        const allVariables = [];
        for (const collection of collections) {
            const fullCollection = await figma.variables.getVariableCollectionByIdAsync(collection.id);
            if (fullCollection) {
                for (const varId of fullCollection.variableIds) {
                    const variable = await figma.variables.getVariableByIdAsync(varId);
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
    catch (error) {
        console.error('Error sending variables to UI:', error);
        figma.ui.postMessage({
            type: 'number-variables',
            data: [],
        });
    }
}
exports.sendNumberVariablesToUI = sendNumberVariablesToUI;
async function getOrCreatePaddingCollectionWithMode() {
    try {
        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        let collection = collections.find((c) => c.name === 'Padding');
        if (!collection) {
            collection = figma.variables.createVariableCollection('Padding');
        }
        if (!collection)
            return { collection: null, modeId: null };
        if (!collection.modes || collection.modes.length === 0) {
            collection.addMode('Base');
        }
        const modeId = collection.modes[0].modeId;
        return { collection, modeId };
    }
    catch (error) {
        console.error('Error ensuring Padding collection/mode:', error);
        return { collection: null, modeId: null };
    }
}
exports.getOrCreatePaddingCollectionWithMode = getOrCreatePaddingCollectionWithMode;
async function createOrUpdateVariableWithCollection(collection, modeId, name, value) {
    try {
        let existing = null;
        if (collection.variableIds && Array.isArray(collection.variableIds)) {
            for (const varId of collection.variableIds) {
                try {
                    const v = await figma.variables.getVariableByIdAsync(varId);
                    if (v && v.name === name && v.resolvedType === 'FLOAT') {
                        existing = v;
                        break;
                    }
                }
                catch (_a) { }
            }
        }
        if (existing) {
            try {
                existing.setValueForMode(modeId, value);
                return existing;
            }
            catch (e) {
                console.error('Failed updating variable value:', e);
                return null;
            }
        }
        try {
            const variable = figma.variables.createVariable(name, collection, 'FLOAT');
            variable.setValueForMode(modeId, value);
            return variable;
        }
        catch (e) {
            console.error('Failed creating variable:', e);
            return null;
        }
    }
    catch (error) {
        console.error('Error in createOrUpdateVariableWithCollection:', error);
        return null;
    }
}
exports.createOrUpdateVariableWithCollection = createOrUpdateVariableWithCollection;


/***/ }

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
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
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
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************************!*\
  !*** ./src/plugin/controller.ts ***!
  \**********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const autolayout_1 = __webpack_require__(/*! ./utils/autolayout */ "./src/plugin/utils/autolayout.ts");
const variables_1 = __webpack_require__(/*! ./utils/variables */ "./src/plugin/utils/variables.ts");
const paddingHandlers_1 = __webpack_require__(/*! ./handlers/paddingHandlers */ "./src/plugin/handlers/paddingHandlers.ts");
const frameHandlers_1 = __webpack_require__(/*! ./handlers/frameHandlers */ "./src/plugin/handlers/frameHandlers.ts");
const selectionHandlers_1 = __webpack_require__(/*! ./handlers/selectionHandlers */ "./src/plugin/handlers/selectionHandlers.ts");
const colorHandlers_1 = __webpack_require__(/*! ./handlers/colorHandlers */ "./src/plugin/handlers/colorHandlers.ts");
const mcpHandlers_1 = __webpack_require__(/*! ./handlers/mcpHandlers */ "./src/plugin/handlers/mcpHandlers.ts");
figma.showUI(__html__, { width: 400, height: 660 });
async function loadAllFontsForText(text) {
    try {
        const mixed = figma.mixed;
        const chars = text.characters || '';
        if (text.fontName !== mixed) {
            await figma.loadFontAsync(text.fontName);
            return;
        }
        const seen = new Set();
        for (let i = 0; i < chars.length; i++) {
            try {
                const fn = text.getRangeFontName(i, i + 1);
                if (fn && fn !== mixed) {
                    const key = `${fn.family}__${fn.style}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        await figma.loadFontAsync({ family: fn.family, style: fn.style });
                    }
                }
            }
            catch (_a) { }
        }
    }
    catch (e) {
        console.warn('Failed to load fonts for text node', text.id, e);
    }
}
async function recomputeTextLayoutOnPage() {
    const texts = figma.currentPage.findAll((n) => n.type === 'TEXT');
    figma.ui.postMessage({ type: 'text-recompute-start', total: texts.length });
    let updated = 0;
    for (let i = 0; i < texts.length; i++) {
        const t = texts[i];
        try {
            await loadAllFontsForText(t);
            const current = t.characters;
            t.characters = current;
            try {
                t.textAutoResize = t.textAutoResize;
            }
            catch (_a) { }
            updated++;
            figma.ui.postMessage({ type: 'text-recompute-progress', done: updated, total: texts.length });
        }
        catch (e) {
            console.warn('Failed to recompute text layout for', t.id, e);
        }
    }
    figma.ui.postMessage({ type: 'text-recompute-end', done: updated, total: texts.length });
    return updated;
}
async function findOrphanedInstancesOnPage() {
    const instances = figma.currentPage.findAll((n) => n.type === 'INSTANCE');
    const total = instances.length;
    const orphans = [];
    let checked = 0;
    figma.ui.postMessage({ type: 'orphan-scan-start', total });
    for (const instance of instances) {
        try {
            if (!instance.mainComponent) {
                orphans.push(instance);
            }
        }
        catch (_a) {
            orphans.push(instance);
        }
        checked += 1;
        if (checked === total || checked % 25 === 0) {
            figma.ui.postMessage({
                type: 'orphan-scan-progress',
                checked,
                total,
                found: orphans.length,
            });
            await new Promise((resolve) => setTimeout(resolve, 0));
        }
    }
    figma.ui.postMessage({
        type: 'orphan-scan-end',
        checked,
        total,
        found: orphans.length,
    });
    if (orphans.length > 0) {
        figma.currentPage.selection = orphans;
        try {
            figma.viewport.scrollAndZoomIntoView(orphans);
        }
        catch (_b) { }
    }
    return { checked, total, found: orphans.length };
}
(async () => {
    await (0, variables_1.sendNumberVariablesToUI)();
    figma.ui.postMessage({ type: 'padding-data', data: (0, autolayout_1.getAllPaddingData)() });
    const frames = figma.currentPage.selection.filter((n) => n.type === 'FRAME');
    figma.ui.postMessage({ type: 'selection-frames', count: frames.length, hasFrames: frames.length > 0 });
})();
figma.on('selectionchange', () => {
    figma.ui.postMessage({ type: 'padding-data', data: (0, autolayout_1.getAllPaddingData)() });
    const frames = figma.currentPage.selection.filter((n) => n.type === 'FRAME');
    figma.ui.postMessage({ type: 'selection-frames', count: frames.length, hasFrames: frames.length > 0 });
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
        figma.ui.postMessage({
            type: 'mcp_selection_changed',
            data: { nodeId: selection[0].id }
        });
    }
    else {
        figma.ui.postMessage({
            type: 'mcp_selection_changed',
            data: null
        });
    }
});
figma.ui.onmessage = async (msg) => {
    if (msg.type === 'arrange-frames') {
        (0, frameHandlers_1.handleArrangeFrames)(msg);
        return;
    }
    if (msg.type === 'group-selected-frames') {
        (0, frameHandlers_1.handleGroupSelectedFrames)(msg);
        return;
    }
    if (msg.type === 'pair-selected-frames') {
        (0, frameHandlers_1.handlePairSelectedFrames)(msg);
        return;
    }
    if (msg.type === 'create-padding-variables') {
        await (0, paddingHandlers_1.createPaddingVariables)(msg.namePrefix);
        return;
    }
    if (msg.type === 'select-all-autolayout') {
        (0, selectionHandlers_1.handleSelectAllAutoLayout)();
        return;
    }
    if (msg.type === 'find-duplicate-top-level-frames') {
        (0, frameHandlers_1.handleFindDuplicateTopLevelFrames)();
        return;
    }
    if (msg.type === 'select-next-autolayout') {
        (0, selectionHandlers_1.handleSelectNextAutoLayout)(msg);
        return;
    }
    if (msg.type === 'cancel') {
        figma.closePlugin();
        return;
    }
    if (msg.type === 'zoom-to-node') {
        await (0, selectionHandlers_1.handleZoomToNode)(msg);
        return;
    }
    if (msg.type === 'update-padding') {
        (0, paddingHandlers_1.handleUpdatePadding)(msg);
        return;
    }
    if (msg.type === 'update-item-spacing') {
        (0, paddingHandlers_1.handleUpdateItemSpacing)(msg);
        return;
    }
    if (msg.type === 'rename-node') {
        (0, selectionHandlers_1.handleRenameNode)(msg);
        return;
    }
    if (msg.type === 'bulk-apply-depth-spacing') {
        (0, paddingHandlers_1.handleBulkApplyDepthSpacing)();
        return;
    }
    if (msg.type === 'apply-random-paddings') {
        (0, paddingHandlers_1.handleApplyRandomPaddings)(msg);
        return;
    }
    if (msg.type === 'convert-colors-to-variables') {
        try {
            await (0, colorHandlers_1.handleConvertColorsToVariables)();
        }
        catch (e) {
            console.error('Error converting colors to variables:', e);
            figma.notify('Error converting colors to variables');
        }
        return;
    }
    if (msg.type === 'create-color-collection-from-selection') {
        try {
            await (0, colorHandlers_1.handleCreateColorCollectionFromSelection)();
        }
        catch (e) {
            console.error('Error creating color collection from selection:', e);
            figma.notify('Error creating color collection from selection');
        }
        return;
    }
    if (msg.type === 'create-all-color-variables-in-collection') {
        try {
            await (0, colorHandlers_1.handleCreateAllColorVariables)();
        }
        catch (e) {
            console.error('Error creating variables for all colors in selection:', e);
            figma.notify('Error creating variables for all colors in selection');
        }
        return;
    }
    if (msg.type === 'alias-local-to-imported-by-name') {
        try {
            await (0, colorHandlers_1.handleAliasLocalToImportedByName)();
        }
        catch (e) {
            console.error('Error aliasing variables:', e);
            figma.notify('Error aliasing variables');
        }
        return;
    }
    if (msg.type === 'find-orphaned-instances') {
        try {
            const result = await findOrphanedInstancesOnPage();
            if (result.found > 0) {
                figma.notify(`Checked ${result.checked} instances and found ${result.found} orphaned instances on this page`);
            }
            else {
                figma.notify(`Checked ${result.checked} instances. No orphaned instances found on this page`);
            }
        }
        catch (e) {
            console.error('Error finding orphaned instances:', e);
            figma.ui.postMessage({ type: 'orphan-scan-end', checked: 0, total: 0, found: 0 });
            figma.notify('Error finding orphaned instances');
        }
        return;
    }
    if (msg.type === 'recompute-text-layout') {
        try {
            const count = await recomputeTextLayoutOnPage();
            figma.notify(`Recomputed text layout for ${count} text layers`);
        }
        catch (e) {
            console.error('Error recomputing text layout:', e);
            figma.notify('Error recomputing text layout');
        }
        return;
    }
    if (msg.type === 'mcp_node_operation') {
        await (0, mcpHandlers_1.handleMcpNodeOperation)(msg);
        return;
    }
    if (msg.type === 'mcp_component_search') {
        await (0, mcpHandlers_1.handleMcpComponentSearch)(msg);
        return;
    }
    if (msg.type === 'mcp_get_selection') {
        (0, mcpHandlers_1.handleMcpGetSelection)(msg);
        return;
    }
    if (msg.type === 'mcp_get_current_selection') {
        (0, mcpHandlers_1.handleMcpGetCurrentSelection)();
        return;
    }
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsU0FBUyx5Q0FBeUM7QUFDeEcsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsU0FBUyxzQkFBc0IsWUFBWTtBQUN2RTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsSUFBSTtBQUNoQztBQUNBLDRC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QUFDQTtBQUNBO0FBQ0EsdURBQXVELE9BQU87QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmlnbWEtcGx1Z2luLXJlYWN0LXRlbXBsYXRlLy4vc3JjL3BsdWdpbi9jb2xvci11dGlscy50cyIsIndlYnBhY2s6Ly9maWdtYS1wbHVnaW4tcmVhY3QtdGVtcGxhdGUvLi9zcmMvcGx1Z2luL2NvbG9yLXZhcmlhYmxlLWdlbmVyYXRvci50cyIsIndlYnBhY2s6Ly9maWdtYS1wbHVnaW4tcmVhY3QtdGVtcGxhdGUvLi9zcmMvcGx1Z2luL2hhbmRsZXJzL2NvbG9ySGFuZGxlcnMudHMiLCJ3ZWJwYWNrOi8vZmlnbWEtcGx1Z2luLXJlYWN0LXRlbXBsYXRlLy4vc3JjL3BsdWdpbi9oYW5kbGVycy9mcmFtZUhhbmRsZXJzLnRzIiwid2VicGFjazovL2ZpZ21hLXBsdWdpbi1yZWFjdC10ZW1wbGF0ZS8uL3NyYy9wbHVnaW4vaGFuZGxlcnMvbWNwSGFuZGxlcnMudHMiLCJ3ZWJwYWNrOi8vZmlnbWEtcGx1Z2luLXJlYWN0LXRlbXBsYXRlLy4vc3JjL3BsdWdpbi9oYW5kbGVycy9wYWRkaW5nSGFuZGxlcnMudHMiLCJ3ZWJwYWNrOi8vZmlnbWEtcGx1Z2luLXJlYWN0LXRlbXBsYXRlLy4vc3JjL3BsdWdpbi9oYW5kbGVycy9zZWxlY3Rpb25IYW5kbGVycy50cyIsIndlYnBhY2s6Ly9maWdtYS1wbHVnaW4tcmVhY3QtdGVtcGxhdGUvLi9zcmMvcGx1Z2luL3V0aWxzL2F1dG9sYXlvdXQudHMiLCJ3ZWJwYWNrOi8vZmlnbWEtcGx1Z2luLXJlYWN0LXRlbXBsYXRlLy4vc3JjL3BsdWdpbi91dGlscy92YXJpYWJsZXMudHMiLCJ3ZWJwYWNrOi8vZmlnbWEtcGx1Z2luLXJlYWN0LXRlbXBsYXRlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ZpZ21hLXBsdWdpbi1yZWFjdC10ZW1wbGF0ZS8uL3NyYy9wbHVnaW4vY29udHJvbGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY3JlYXRlT3JVcGRhdGVDb2xvclZhcmlhYmxlV2l0aENvbGxlY3Rpb24gPSBleHBvcnRzLmdldE9yQ3JlYXRlQ29sb3JDb2xsZWN0aW9uV2l0aE1vZGUgPSB2b2lkIDA7XG5hc3luYyBmdW5jdGlvbiBnZXRPckNyZWF0ZUNvbG9yQ29sbGVjdGlvbldpdGhNb2RlKG5hbWUgPSBcIkNvbG9yc1wiKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbnMgPSBhd2FpdCBmaWdtYS52YXJpYWJsZXMuZ2V0TG9jYWxWYXJpYWJsZUNvbGxlY3Rpb25zQXN5bmMoKTtcbiAgICAgICAgY29uc3QgbGFzdElkID0gYXdhaXQgZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYygnbGFzdENvbG9yQ29sbGVjdGlvbklkJyk7XG4gICAgICAgIGxldCBjb2xsZWN0aW9uID0gbnVsbDtcbiAgICAgICAgaWYgKGxhc3RJZCkge1xuICAgICAgICAgICAgY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25zLmZpbmQoKGMpID0+IGMuaWQgPT09IGxhc3RJZCkgfHwgbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9ucy5maW5kKChjKSA9PiBjLm5hbWUgPT09IG5hbWUpIHx8IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uID0gZmlnbWEudmFyaWFibGVzLmNyZWF0ZVZhcmlhYmxlQ29sbGVjdGlvbihuYW1lKTtcbiAgICAgICAgICAgIGF3YWl0IGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoJ2xhc3RDb2xvckNvbGxlY3Rpb25JZCcsIGNvbGxlY3Rpb24uaWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY29sbGVjdGlvbilcbiAgICAgICAgICAgIHJldHVybiB7IGNvbGxlY3Rpb246IG51bGwsIG1vZGVJZDogbnVsbCB9O1xuICAgICAgICBpZiAoIWNvbGxlY3Rpb24ubW9kZXMgfHwgY29sbGVjdGlvbi5tb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb24uYWRkTW9kZSgnQmFzZScpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1vZGVJZCA9IGNvbGxlY3Rpb24ubW9kZXNbMF0ubW9kZUlkO1xuICAgICAgICByZXR1cm4geyBjb2xsZWN0aW9uLCBtb2RlSWQgfTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGVuc3VyaW5nIENvbG9yIGNvbGxlY3Rpb24vbW9kZTonLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB7IGNvbGxlY3Rpb246IG51bGwsIG1vZGVJZDogbnVsbCB9O1xuICAgIH1cbn1cbmV4cG9ydHMuZ2V0T3JDcmVhdGVDb2xvckNvbGxlY3Rpb25XaXRoTW9kZSA9IGdldE9yQ3JlYXRlQ29sb3JDb2xsZWN0aW9uV2l0aE1vZGU7XG5hc3luYyBmdW5jdGlvbiBjcmVhdGVPclVwZGF0ZUNvbG9yVmFyaWFibGVXaXRoQ29sbGVjdGlvbihjb2xsZWN0aW9uLCBtb2RlSWQsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICB0cnkge1xuICAgICAgICBsZXQgZXhpc3RpbmcgPSBudWxsO1xuICAgICAgICBpZiAoY29sbGVjdGlvbi52YXJpYWJsZUlkcyAmJiBBcnJheS5pc0FycmF5KGNvbGxlY3Rpb24udmFyaWFibGVJZHMpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHZhcklkIG9mIGNvbGxlY3Rpb24udmFyaWFibGVJZHMpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gYXdhaXQgZmlnbWEudmFyaWFibGVzLmdldFZhcmlhYmxlQnlJZEFzeW5jKHZhcklkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHYgJiYgdi5uYW1lID09PSBuYW1lICYmIHYucmVzb2x2ZWRUeXBlID09PSAnQ09MT1InKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGlzdGluZyA9IHY7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWV4aXN0aW5nICYmIHYgJiYgdi5yZXNvbHZlZFR5cGUgPT09ICdDT0xPUicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnQgPSB2LnZhbHVlc0J5TW9kZSAmJiB2LnZhbHVlc0J5TW9kZVttb2RlSWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQgJiYgdHlwZW9mIGN1cnJlbnQgPT09ICdvYmplY3QnICYmICdyJyBpbiBjdXJyZW50ICYmICdnJyBpbiBjdXJyZW50ICYmICdiJyBpbiBjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9IZXggPSAoYykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBNYXRoLnJvdW5kKGMgKiAyNTUpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5QSA9IGAke3RvSGV4KGN1cnJlbnQucil9JHt0b0hleChjdXJyZW50LmcpfSR7dG9IZXgoY3VycmVudC5iKX0ke3RvSGV4KChfYSA9IGN1cnJlbnQuYSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMSl9YC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleUIgPSBgJHt0b0hleCh2YWx1ZS5yKX0ke3RvSGV4KHZhbHVlLmcpfSR7dG9IZXgodmFsdWUuYil9JHt0b0hleCgoX2IgPSB2YWx1ZS5hKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAxKX1gLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleUEgPT09IGtleUIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmcgPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKF9jKSB7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZXhpc3Rpbmcuc2V0VmFsdWVGb3JNb2RlKG1vZGVJZCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBleGlzdGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHVwZGF0aW5nIGNvbG9yIHZhcmlhYmxlIHZhbHVlOicsIGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB2YXJpYWJsZSA9IGZpZ21hLnZhcmlhYmxlcy5jcmVhdGVWYXJpYWJsZShuYW1lLCBjb2xsZWN0aW9uLCAnQ09MT1InKTtcbiAgICAgICAgICAgIHZhcmlhYmxlLnNldFZhbHVlRm9yTW9kZShtb2RlSWQsIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB2YXJpYWJsZTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIGNyZWF0aW5nIGNvbG9yIHZhcmlhYmxlOicsIGUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluIGNyZWF0ZU9yVXBkYXRlQ29sb3JWYXJpYWJsZVdpdGhDb2xsZWN0aW9uOicsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuZXhwb3J0cy5jcmVhdGVPclVwZGF0ZUNvbG9yVmFyaWFibGVXaXRoQ29sbGVjdGlvbiA9IGNyZWF0ZU9yVXBkYXRlQ29sb3JWYXJpYWJsZVdpdGhDb2xsZWN0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZUFsbENvbG9yVmFyaWFibGVzRnJvbVNlbGVjdGlvbiA9IHZvaWQgMDtcbmNvbnN0IGNvbG9yX3V0aWxzXzEgPSByZXF1aXJlKFwiLi9jb2xvci11dGlsc1wiKTtcbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUFsbENvbG9yVmFyaWFibGVzRnJvbVNlbGVjdGlvbigpIHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgaWYgKCFzZWxlY3Rpb24gfHwgc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBmaWdtYS5ub3RpZnkoXCJTZWxlY3QgYXQgbGVhc3Qgb25lIG5vZGUgdG8gcGFyc2UgYWxsIGNvbG9ycy5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdG9IZXggPSAoYykgPT4ge1xuICAgICAgICBjb25zdCBuID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBNYXRoLnJvdW5kKGMgKiAyNTUpKSk7XG4gICAgICAgIHJldHVybiBuLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCBcIjBcIik7XG4gICAgfTtcbiAgICBjb25zdCByZ2JhS2V5ID0gKHJnYmEpID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gYCR7dG9IZXgocmdiYS5yKX0ke3RvSGV4KHJnYmEuZyl9JHt0b0hleChyZ2JhLmIpfSR7dG9IZXgoKF9hID0gcmdiYS5hKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAxKX1gLnRvVXBwZXJDYXNlKCk7XG4gICAgfTtcbiAgICBjb25zdCBjb2xvclNldCA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBhZGRSR0JBID0gKHJnYmEpID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0gcmdiYUtleShyZ2JhKTtcbiAgICAgICAgaWYgKCFjb2xvclNldC5oYXMoa2V5KSlcbiAgICAgICAgICAgIGNvbG9yU2V0LnNldChrZXksIHJnYmEpO1xuICAgIH07XG4gICAgY29uc3QgcHJvY2Vzc1BhaW50ID0gKHBhaW50KSA9PiB7XG4gICAgICAgIGlmICghcGFpbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmIChwYWludC50eXBlID09PSBcIlNPTElEXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGEgPSB0eXBlb2YgcGFpbnQub3BhY2l0eSA9PT0gXCJudW1iZXJcIiA/IHBhaW50Lm9wYWNpdHkgOiAxO1xuICAgICAgICAgICAgYWRkUkdCQSh7IHI6IHBhaW50LmNvbG9yLnIsIGc6IHBhaW50LmNvbG9yLmcsIGI6IHBhaW50LmNvbG9yLmIsIGEgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGFpbnQudHlwZSA9PT0gXCJHUkFESUVOVF9MSU5FQVJcIiB8fFxuICAgICAgICAgICAgcGFpbnQudHlwZSA9PT0gXCJHUkFESUVOVF9SQURJQUxcIiB8fFxuICAgICAgICAgICAgcGFpbnQudHlwZSA9PT0gXCJHUkFESUVOVF9BTkdVTEFSXCIgfHxcbiAgICAgICAgICAgIHBhaW50LnR5cGUgPT09IFwiR1JBRElFTlRfRElBTU9ORFwiKSB7XG4gICAgICAgICAgICBjb25zdCBzdG9wcyA9IHBhaW50LmdyYWRpZW50U3RvcHMgfHwgW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHN0b3Agb2Ygc3RvcHMpXG4gICAgICAgICAgICAgICAgYWRkUkdCQShzdG9wLmNvbG9yKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3Qgd2FsayA9IChub2RlKSA9PiB7XG4gICAgICAgIGlmIChcImZpbGxzXCIgaW4gbm9kZSAmJiBBcnJheS5pc0FycmF5KG5vZGUuZmlsbHMpKSB7XG4gICAgICAgICAgICBjb25zdCBmaWxscyA9IG5vZGUuZmlsbHMgfHwgW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHAgb2YgZmlsbHMpXG4gICAgICAgICAgICAgICAgcHJvY2Vzc1BhaW50KHApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcInN0cm9rZXNcIiBpbiBub2RlICYmIEFycmF5LmlzQXJyYXkobm9kZS5zdHJva2VzKSkge1xuICAgICAgICAgICAgY29uc3Qgc3Ryb2tlcyA9IG5vZGUuc3Ryb2tlcyB8fCBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcCBvZiBzdHJva2VzKVxuICAgICAgICAgICAgICAgIHByb2Nlc3NQYWludChwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXCJjaGlsZHJlblwiIGluIG5vZGUgJiYgQXJyYXkuaXNBcnJheShub2RlLmNoaWxkcmVuKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlLmNoaWxkcmVuKVxuICAgICAgICAgICAgICAgIHdhbGsoY2hpbGQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IHJvb3Qgb2Ygc2VsZWN0aW9uKVxuICAgICAgICB3YWxrKHJvb3QpO1xuICAgIGNvbnN0IGVuc3VyZWQgPSBhd2FpdCAoMCwgY29sb3JfdXRpbHNfMS5nZXRPckNyZWF0ZUNvbG9yQ29sbGVjdGlvbldpdGhNb2RlKSgpO1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBlbnN1cmVkLmNvbGxlY3Rpb247XG4gICAgY29uc3QgbW9kZUlkID0gZW5zdXJlZC5tb2RlSWQ7XG4gICAgaWYgKCFjb2xsZWN0aW9uIHx8ICFtb2RlSWQpIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KFwiRmFpbGVkIHRvIHByZXBhcmUgdGFyZ2V0IGNvbG9yIGNvbGxlY3Rpb24uXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBjcmVhdGVkID0gMDtcbiAgICBjb25zdCBuZXdWYXJNYXAgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChjb25zdCBba2V5LCByZ2JhXSBvZiBjb2xvclNldC5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGBjb2xvci0ke2tleX1gO1xuICAgICAgICBjb25zdCB2ID0gYXdhaXQgKDAsIGNvbG9yX3V0aWxzXzEuY3JlYXRlT3JVcGRhdGVDb2xvclZhcmlhYmxlV2l0aENvbGxlY3Rpb24pKGNvbGxlY3Rpb24sIG1vZGVJZCwgbmFtZSwgcmdiYSk7XG4gICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICBjcmVhdGVkKys7XG4gICAgICAgICAgICBuZXdWYXJNYXAuc2V0KGtleSwgdik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IG5vZGVzVXBkYXRlZCA9IDA7XG4gICAgY29uc3QgYmluZE5vZGUgPSAobm9kZSkgPT4ge1xuICAgICAgICBpZiAoXCJmaWxsc1wiIGluIG5vZGUgJiYgQXJyYXkuaXNBcnJheShub2RlLmZpbGxzKSkge1xuICAgICAgICAgICAgY29uc3QgZmlsbHMgPSBub2RlLmZpbGxzIHx8IFtdO1xuICAgICAgICAgICAgY29uc3QgbmV3RmlsbHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYWludCA9IGZpbGxzW2ldO1xuICAgICAgICAgICAgICAgIGlmICghcGFpbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3RmlsbHMucHVzaChwYWludCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGFpbnQudHlwZSA9PT0gXCJTT0xJRFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFscmVhZHlCb3VuZCA9IEJvb2xlYW4ocGFpbnQuYm91bmRWYXJpYWJsZXMgJiYgcGFpbnQuYm91bmRWYXJpYWJsZXMuY29sb3IpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWFscmVhZHlCb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYSA9IHR5cGVvZiBwYWludC5vcGFjaXR5ID09PSBcIm51bWJlclwiID8gcGFpbnQub3BhY2l0eSA6IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZ2JhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHI6IHBhaW50LmNvbG9yLnIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZzogcGFpbnQuY29sb3IuZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiOiBwYWludC5jb2xvci5iLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gcmdiYUtleShyZ2JhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlID0gbmV3VmFyTWFwLmdldChrZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYm91bmQgPSBmaWdtYS52YXJpYWJsZXMuc2V0Qm91bmRWYXJpYWJsZUZvclBhaW50KHBhaW50LCBcImNvbG9yXCIsIHZhcmlhYmxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RmlsbHMucHVzaChib3VuZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVzVXBkYXRlZCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKF9hKSB7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXdGaWxscy5wdXNoKHBhaW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocGFpbnQudHlwZSA9PT0gXCJHUkFESUVOVF9MSU5FQVJcIiB8fFxuICAgICAgICAgICAgICAgICAgICBwYWludC50eXBlID09PSBcIkdSQURJRU5UX1JBRElBTFwiIHx8XG4gICAgICAgICAgICAgICAgICAgIHBhaW50LnR5cGUgPT09IFwiR1JBRElFTlRfQU5HVUxBUlwiIHx8XG4gICAgICAgICAgICAgICAgICAgIHBhaW50LnR5cGUgPT09IFwiR1JBRElFTlRfRElBTU9ORFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdwID0gcGFpbnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0b3BzID0gZ3AuZ3JhZGllbnRTdG9wcyB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVidWlsdCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHN0b3Agb2Ygc3RvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kID0gQm9vbGVhbihzdG9wLmJvdW5kVmFyaWFibGVzICYmIHN0b3AuYm91bmRWYXJpYWJsZXMuY29sb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFib3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJnYmEgPSBzdG9wLmNvbG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHJnYmFLZXkocmdiYSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSBuZXdWYXJNYXAuZ2V0KGtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYnVpbHQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogc3RvcC5wb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBzdG9wLmNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRWYXJpYWJsZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogeyB0eXBlOiBcIlZBUklBQkxFX0FMSUFTXCIsIGlkOiB2YXJpYWJsZS5pZCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVidWlsdC5wdXNoKHN0b3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYnVpbHQucHVzaChzdG9wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3UGFpbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZ3AudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmFkaWVudFRyYW5zZm9ybTogZ3AuZ3JhZGllbnRUcmFuc2Zvcm0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnRTdG9wczogcmVidWlsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBncC5vcGFjaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGU6IGdwLnZpc2libGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxlbmRNb2RlOiBncC5ibGVuZE1vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RmlsbHMucHVzaChuZXdQYWludCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2Rlc1VwZGF0ZWQrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbGxzLnB1c2gocGFpbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdGaWxscy5wdXNoKHBhaW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG5vZGUuZmlsbHMgPSBuZXdGaWxscztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChfYikgeyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFwic3Ryb2tlc1wiIGluIG5vZGUgJiYgQXJyYXkuaXNBcnJheShub2RlLnN0cm9rZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBzdHJva2VzID0gbm9kZS5zdHJva2VzIHx8IFtdO1xuICAgICAgICAgICAgY29uc3QgbmV3U3Ryb2tlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJva2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFpbnQgPSBzdHJva2VzW2ldO1xuICAgICAgICAgICAgICAgIGlmICghcGFpbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3Ryb2tlcy5wdXNoKHBhaW50KTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwYWludC50eXBlID09PSBcIlNPTElEXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxyZWFkeUJvdW5kID0gQm9vbGVhbihwYWludC5ib3VuZFZhcmlhYmxlcyAmJiBwYWludC5ib3VuZFZhcmlhYmxlcy5jb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYWxyZWFkeUJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhID0gdHlwZW9mIHBhaW50Lm9wYWNpdHkgPT09IFwibnVtYmVyXCIgPyBwYWludC5vcGFjaXR5IDogMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJnYmEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcjogcGFpbnQuY29sb3IucixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnOiBwYWludC5jb2xvci5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGI6IHBhaW50LmNvbG9yLmIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSByZ2JhS2V5KHJnYmEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSBuZXdWYXJNYXAuZ2V0KGtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBib3VuZCA9IGZpZ21hLnZhcmlhYmxlcy5zZXRCb3VuZFZhcmlhYmxlRm9yUGFpbnQocGFpbnQsIFwiY29sb3JcIiwgdmFyaWFibGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdHJva2VzLnB1c2goYm91bmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2Rlc1VwZGF0ZWQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChfYykgeyB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3U3Ryb2tlcy5wdXNoKHBhaW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cm9rZXMucHVzaChwYWludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBub2RlLnN0cm9rZXMgPSBuZXdTdHJva2VzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9kKSB7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoXCJjaGlsZHJlblwiIGluIG5vZGUgJiYgQXJyYXkuaXNBcnJheShub2RlLmNoaWxkcmVuKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlLmNoaWxkcmVuKVxuICAgICAgICAgICAgICAgIGJpbmROb2RlKGNoaWxkKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgZm9yIChjb25zdCByb290IG9mIHNlbGVjdGlvbilcbiAgICAgICAgYmluZE5vZGUocm9vdCk7XG4gICAgZmlnbWEubm90aWZ5KGBDcmVhdGVkICR7Y3JlYXRlZH0gY29sb3IgdmFyaWFibGVzIGFuZCB1cGRhdGVkICR7bm9kZXNVcGRhdGVkfSBub2Rlcy5gKTtcbn1cbmV4cG9ydHMuY3JlYXRlQWxsQ29sb3JWYXJpYWJsZXNGcm9tU2VsZWN0aW9uID0gY3JlYXRlQWxsQ29sb3JWYXJpYWJsZXNGcm9tU2VsZWN0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhbmRsZUFsaWFzTG9jYWxUb0ltcG9ydGVkQnlOYW1lID0gZXhwb3J0cy5oYW5kbGVDcmVhdGVBbGxDb2xvclZhcmlhYmxlcyA9IGV4cG9ydHMuaGFuZGxlQ3JlYXRlQ29sb3JDb2xsZWN0aW9uRnJvbVNlbGVjdGlvbiA9IGV4cG9ydHMuaGFuZGxlQ29udmVydENvbG9yc1RvVmFyaWFibGVzID0gdm9pZCAwO1xuY29uc3QgY29sb3JfdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi9jb2xvci11dGlsc1wiKTtcbmNvbnN0IGNvbG9yX3ZhcmlhYmxlX2dlbmVyYXRvcl8xID0gcmVxdWlyZShcIi4uL2NvbG9yLXZhcmlhYmxlLWdlbmVyYXRvclwiKTtcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUNvbnZlcnRDb2xvcnNUb1ZhcmlhYmxlcygpIHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgaWYgKCFzZWxlY3Rpb24gfHwgc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBmaWdtYS5ub3RpZnkoJ1NlbGVjdCBhdCBsZWFzdCBvbmUgZnJhbWUgb3Igbm9kZSB0byBwcm9jZXNzIGNvbG9ycy4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBlbnN1cmVkID0gYXdhaXQgKDAsIGNvbG9yX3V0aWxzXzEuZ2V0T3JDcmVhdGVDb2xvckNvbGxlY3Rpb25XaXRoTW9kZSkoKTtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gZW5zdXJlZC5jb2xsZWN0aW9uO1xuICAgIGNvbnN0IG1vZGVJZCA9IGVuc3VyZWQubW9kZUlkO1xuICAgIGlmICghY29sbGVjdGlvbiB8fCAhbW9kZUlkKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeSgnRmFpbGVkIHRvIHByZXBhcmUgQ29sb3JzIHZhcmlhYmxlIGNvbGxlY3Rpb24nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb2xvckNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuICAgIGNvbnN0IGNvbG9yTW9kZUlkID0gbW9kZUlkO1xuICAgIGxldCBub2Rlc1VwZGF0ZWQgPSAwO1xuICAgIGNvbnN0IHRvSGV4ID0gKGMpID0+IHtcbiAgICAgICAgY29uc3QgbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZChjICogMjU1KSkpO1xuICAgICAgICByZXR1cm4gbi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKTtcbiAgICB9O1xuICAgIGNvbnN0IHJnYmFLZXkgPSAocmdiYSkgPT4ge1xuICAgICAgICByZXR1cm4gYCR7dG9IZXgocmdiYS5yKX0ke3RvSGV4KHJnYmEuZyl9JHt0b0hleChyZ2JhLmIpfSR7dG9IZXgocmdiYS5hKX1gLnRvVXBwZXJDYXNlKCk7XG4gICAgfTtcbiAgICBhc3luYyBmdW5jdGlvbiBmaW5kRXhpc3RpbmdDb2xvclZhckZvclJHQkEocmdiYSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qga2V5VGFyZ2V0ID0gcmdiYUtleShyZ2JhKTtcbiAgICAgICAgICAgIGlmIChjb2xvckNvbGxlY3Rpb24udmFyaWFibGVJZHMgJiYgQXJyYXkuaXNBcnJheShjb2xvckNvbGxlY3Rpb24udmFyaWFibGVJZHMpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB2YXJJZCBvZiBjb2xvckNvbGxlY3Rpb24udmFyaWFibGVJZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBhd2FpdCBmaWdtYS52YXJpYWJsZXMuZ2V0VmFyaWFibGVCeUlkQXN5bmModmFySWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYgJiYgdi5yZXNvbHZlZFR5cGUgPT09ICdDT0xPUicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gdi52YWx1ZXNCeU1vZGUgJiYgdi52YWx1ZXNCeU1vZGVbY29sb3JNb2RlSWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50ICYmIHR5cGVvZiBjdXJyZW50ID09PSAnb2JqZWN0JyAmJiAncicgaW4gY3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSByZ2JhS2V5KGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSBrZXlUYXJnZXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKF9hKSB7IH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoX2IpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NOb2RlUGFpbnRzKG5vZGUpIHtcbiAgICAgICAgbGV0IHVwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKCdmaWxscycgaW4gbm9kZSAmJiBBcnJheS5pc0FycmF5KG5vZGUuZmlsbHMpKSB7XG4gICAgICAgICAgICBjb25zdCBmaWxscyA9IG5vZGUuZmlsbHMgfHwgW107XG4gICAgICAgICAgICBjb25zdCBuZXdGaWxscyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBwYWludCBvZiBmaWxscykge1xuICAgICAgICAgICAgICAgIGlmICghcGFpbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3RmlsbHMucHVzaChwYWludCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGFpbnQudHlwZSA9PT0gJ1NPTElEJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbHJlYWR5Qm91bmQgPSBCb29sZWFuKHBhaW50LmJvdW5kVmFyaWFibGVzICYmIHBhaW50LmJvdW5kVmFyaWFibGVzLmNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhbHJlYWR5Qm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbGxzLnB1c2gocGFpbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RmlsbHMucHVzaChwYWludCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocGFpbnQudHlwZSA9PT0gJ0dSQURJRU5UX0xJTkVBUicgfHxcbiAgICAgICAgICAgICAgICAgICAgcGFpbnQudHlwZSA9PT0gJ0dSQURJRU5UX1JBRElBTCcgfHxcbiAgICAgICAgICAgICAgICAgICAgcGFpbnQudHlwZSA9PT0gJ0dSQURJRU5UX0FOR1VMQVInIHx8XG4gICAgICAgICAgICAgICAgICAgIHBhaW50LnR5cGUgPT09ICdHUkFESUVOVF9ESUFNT05EJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdG9wcyA9IHBhaW50LmdyYWRpZW50U3RvcHMgfHwgW107XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFuZ2VkU3RvcHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3U3RvcHMgPSBzdG9wcy5tYXAoKHN0b3ApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc3RvcC5ib3VuZFZhcmlhYmxlcyB8fCAhc3RvcC5ib3VuZFZhcmlhYmxlcy5jb2xvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRTdG9wcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHN0b3AucG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBzdG9wLmNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3VuZFZhcmlhYmxlczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHsgdHlwZTogJ1ZBUklBQkxFX0FMSUFTJywgaWQ6ICcnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9wO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYW5nZWRTdG9wcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdQYWludCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBwYWludC50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyYWRpZW50VHJhbnNmb3JtOiBwYWludC5ncmFkaWVudFRyYW5zZm9ybSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmFkaWVudFN0b3BzOiBuZXdTdG9wcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBwYWludC5vcGFjaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHBhaW50LnZpc2libGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxlbmRNb2RlOiBwYWludC5ibGVuZE1vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RmlsbHMucHVzaChuZXdQYWludCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdGaWxscy5wdXNoKHBhaW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3RmlsbHMucHVzaChwYWludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdGaWxscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhaW50ID0gbmV3RmlsbHNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHBhaW50ICYmIHBhaW50LnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWwgPSBmaWxsc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYSA9IHR5cGVvZiBvcmlnaW5hbC5vcGFjaXR5ID09PSAnbnVtYmVyJyA/IG9yaWdpbmFsLm9wYWNpdHkgOiAxO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZ2JhID0geyByOiBvcmlnaW5hbC5jb2xvci5yLCBnOiBvcmlnaW5hbC5jb2xvci5nLCBiOiBvcmlnaW5hbC5jb2xvci5iLCBhIH07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFscmVhZHlCb3VuZCA9IEJvb2xlYW4ob3JpZ2luYWwuYm91bmRWYXJpYWJsZXMgJiYgb3JpZ2luYWwuYm91bmRWYXJpYWJsZXMuY29sb3IpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWFscmVhZHlCb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YXJpYWJsZSA9IGF3YWl0IGZpbmRFeGlzdGluZ0NvbG9yVmFyRm9yUkdCQShyZ2JhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYm91bmQgPSBmaWdtYS52YXJpYWJsZXMuc2V0Qm91bmRWYXJpYWJsZUZvclBhaW50KG9yaWdpbmFsLCAnY29sb3InLCB2YXJpYWJsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbGxzW2ldID0gYm91bmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RmlsbHNbaV0gPSBwYWludDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbGxzW2ldID0gcGFpbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhaW50ICYmXG4gICAgICAgICAgICAgICAgICAgIChwYWludC50eXBlID09PSAnR1JBRElFTlRfTElORUFSJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFpbnQudHlwZSA9PT0gJ0dSQURJRU5UX1JBRElBTCcgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhaW50LnR5cGUgPT09ICdHUkFESUVOVF9BTkdVTEFSJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFpbnQudHlwZSA9PT0gJ0dSQURJRU5UX0RJQU1PTkQnKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBncCA9IHBhaW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdG9wcyA9IGdwLmdyYWRpZW50U3RvcHMgfHwgW107XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlYnVpbHRTdG9wcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHN0b3Agb2Ygc3RvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJnYmEgPSBzdG9wLmNvbG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdG9wLmJvdW5kVmFyaWFibGVzIHx8ICFzdG9wLmJvdW5kVmFyaWFibGVzLmNvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSBhd2FpdCBmaW5kRXhpc3RpbmdDb2xvclZhckZvclJHQkEocmdiYSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVidWlsdFN0b3BzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBzdG9wLnBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBzdG9wLmNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kVmFyaWFibGVzOiB7IGNvbG9yOiB7IHR5cGU6ICdWQVJJQUJMRV9BTElBUycsIGlkOiB2YXJpYWJsZS5pZCB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYnVpbHRTdG9wcy5wdXNoKHN0b3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYnVpbHRTdG9wcy5wdXNoKHN0b3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYnVpbHRTdG9wcy5wdXNoKHN0b3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWJ1aWx0U3RvcHMubGVuZ3RoID09PSBzdG9wcy5sZW5ndGggJiYgcmVidWlsdFN0b3BzLnNvbWUoKHMsIGlkeCkgPT4gcyAhPT0gc3RvcHNbaWR4XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVidWlsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBncC50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyYWRpZW50VHJhbnNmb3JtOiBncC5ncmFkaWVudFRyYW5zZm9ybSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmFkaWVudFN0b3BzOiByZWJ1aWx0U3RvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogZ3Aub3BhY2l0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiBncC52aXNpYmxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsZW5kTW9kZTogZ3AuYmxlbmRNb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbGxzW2ldID0gcmVidWlsdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbm9kZS5maWxscyA9IG5ld0ZpbGxzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9hKSB7IH1cbiAgICAgICAgICAgIGlmICh1cGRhdGVkKVxuICAgICAgICAgICAgICAgIG5vZGVzVXBkYXRlZCsrO1xuICAgICAgICB9XG4gICAgICAgIGlmICgnc3Ryb2tlcycgaW4gbm9kZSAmJiBBcnJheS5pc0FycmF5KG5vZGUuc3Ryb2tlcykpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0cm9rZXMgPSBub2RlLnN0cm9rZXMgfHwgW107XG4gICAgICAgICAgICBjb25zdCBuZXdTdHJva2VzID0gW107XG4gICAgICAgICAgICBsZXQgdXBkYXRlZFN0cm9rZXMgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3Ryb2tlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhaW50ID0gc3Ryb2tlc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoIXBhaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cm9rZXMucHVzaChwYWludCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGFpbnQudHlwZSA9PT0gJ1NPTElEJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhID0gdHlwZW9mIHBhaW50Lm9wYWNpdHkgPT09ICdudW1iZXInID8gcGFpbnQub3BhY2l0eSA6IDE7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJnYmEgPSB7IHI6IHBhaW50LmNvbG9yLnIsIGc6IHBhaW50LmNvbG9yLmcsIGI6IHBhaW50LmNvbG9yLmIsIGEgfTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxyZWFkeUJvdW5kID0gQm9vbGVhbihwYWludC5ib3VuZFZhcmlhYmxlcyAmJiBwYWludC5ib3VuZFZhcmlhYmxlcy5jb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYWxyZWFkeUJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlID0gYXdhaXQgZmluZEV4aXN0aW5nQ29sb3JWYXJGb3JSR0JBKHJnYmEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBib3VuZCA9IGZpZ21hLnZhcmlhYmxlcy5zZXRCb3VuZFZhcmlhYmxlRm9yUGFpbnQocGFpbnQsICdjb2xvcicsIHZhcmlhYmxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3Ryb2tlc1tpXSA9IGJvdW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkU3Ryb2tlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdHJva2VzW2ldID0gcGFpbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdHJva2VzW2ldID0gcGFpbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdTdHJva2VzW2ldID0gcGFpbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cm9rZXNbaV0gPSBwYWludDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG5vZGUuc3Ryb2tlcyA9IG5ld1N0cm9rZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoX2IpIHsgfVxuICAgICAgICAgICAgaWYgKHVwZGF0ZWRTdHJva2VzKVxuICAgICAgICAgICAgICAgIG5vZGVzVXBkYXRlZCsrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHdhbGsgPSBhc3luYyAobm9kZSkgPT4ge1xuICAgICAgICBhd2FpdCBwcm9jZXNzTm9kZVBhaW50cyhub2RlKTtcbiAgICAgICAgaWYgKCdjaGlsZHJlbicgaW4gbm9kZSAmJiBBcnJheS5pc0FycmF5KG5vZGUuY2hpbGRyZW4pKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB3YWxrKGNoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgZm9yIChjb25zdCByb290IG9mIHNlbGVjdGlvbilcbiAgICAgICAgYXdhaXQgd2Fsayhyb290KTtcbiAgICBmaWdtYS5ub3RpZnkoYFVwZGF0ZWQgJHtub2Rlc1VwZGF0ZWR9IG5vZGVzIGJ5IGJpbmRpbmcgZXhpc3RpbmcgY29sb3IgdmFyaWFibGVzIHdoZXJlIGF2YWlsYWJsZWApO1xufVxuZXhwb3J0cy5oYW5kbGVDb252ZXJ0Q29sb3JzVG9WYXJpYWJsZXMgPSBoYW5kbGVDb252ZXJ0Q29sb3JzVG9WYXJpYWJsZXM7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVDcmVhdGVDb2xvckNvbGxlY3Rpb25Gcm9tU2VsZWN0aW9uKCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBpZiAoIXNlbGVjdGlvbiB8fCBzZWxlY3Rpb24ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeSgnU2VsZWN0IGF0IGxlYXN0IG9uZSBub2RlIHRvIGNyZWF0ZSBhIGNvbG9yIGNvbGxlY3Rpb24uJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29sb3JNYXAgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgYWRkUkdCQSA9IChyZ2JhKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IGAke01hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZChyZ2JhLnIgKiAyNTUpKSlcbiAgICAgICAgICAgIC50b1N0cmluZygxNilcbiAgICAgICAgICAgIC5wYWRTdGFydCgyLCAnMCcpfSR7TWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBNYXRoLnJvdW5kKHJnYmEuZyAqIDI1NSkpKVxuICAgICAgICAgICAgLnRvU3RyaW5nKDE2KVxuICAgICAgICAgICAgLnBhZFN0YXJ0KDIsICcwJyl9JHtNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQocmdiYS5iICogMjU1KSkpXG4gICAgICAgICAgICAudG9TdHJpbmcoMTYpXG4gICAgICAgICAgICAucGFkU3RhcnQoMiwgJzAnKX0ke01hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZCgodHlwZW9mIHJnYmEuYSA9PT0gJ251bWJlcicgPyByZ2JhLmEgOiAxKSAqIDI1NSkpKVxuICAgICAgICAgICAgLnRvU3RyaW5nKDE2KVxuICAgICAgICAgICAgLnBhZFN0YXJ0KDIsICcwJyl9YC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBpZiAoIWNvbG9yTWFwLmhhcyhrZXkpKVxuICAgICAgICAgICAgY29sb3JNYXAuc2V0KGtleSwgeyByOiByZ2JhLnIsIGc6IHJnYmEuZywgYjogcmdiYS5iLCBhOiB0eXBlb2YgcmdiYS5hID09PSAnbnVtYmVyJyA/IHJnYmEuYSA6IDEgfSk7XG4gICAgfTtcbiAgICBjb25zdCBwcm9jZXNzUGFpbnQgPSAocGFpbnQpID0+IHtcbiAgICAgICAgaWYgKCFwYWludClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHBhaW50LnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgICAgIGNvbnN0IGEgPSB0eXBlb2YgcGFpbnQub3BhY2l0eSA9PT0gJ251bWJlcicgPyBwYWludC5vcGFjaXR5IDogMTtcbiAgICAgICAgICAgIGFkZFJHQkEoeyByOiBwYWludC5jb2xvci5yLCBnOiBwYWludC5jb2xvci5nLCBiOiBwYWludC5jb2xvci5iLCBhIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBhaW50LnR5cGUgPT09ICdHUkFESUVOVF9MSU5FQVInIHx8XG4gICAgICAgICAgICBwYWludC50eXBlID09PSAnR1JBRElFTlRfUkFESUFMJyB8fFxuICAgICAgICAgICAgcGFpbnQudHlwZSA9PT0gJ0dSQURJRU5UX0FOR1VMQVInIHx8XG4gICAgICAgICAgICBwYWludC50eXBlID09PSAnR1JBRElFTlRfRElBTU9ORCcpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3BzID0gcGFpbnQuZ3JhZGllbnRTdG9wcyB8fCBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgc3RvcCBvZiBzdG9wcykge1xuICAgICAgICAgICAgICAgIGFkZFJHQkEoc3RvcC5jb2xvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IHByb2Nlc3NOb2RlID0gKG5vZGUpID0+IHtcbiAgICAgICAgY29uc3QgaGFzRmlsbFN0eWxlID0gJ2ZpbGxTdHlsZUlkJyBpbiBub2RlICYmIEJvb2xlYW4obm9kZS5maWxsU3R5bGVJZCk7XG4gICAgICAgIGNvbnN0IGhhc1N0cm9rZVN0eWxlID0gJ3N0cm9rZVN0eWxlSWQnIGluIG5vZGUgJiYgQm9vbGVhbihub2RlLnN0cm9rZVN0eWxlSWQpO1xuICAgICAgICBpZiAoJ2ZpbGxzJyBpbiBub2RlICYmIEFycmF5LmlzQXJyYXkobm9kZS5maWxscykpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGxzID0gbm9kZS5maWxscyB8fCBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGFpbnQgb2YgZmlsbHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBib3VuZCA9IEJvb2xlYW4ocGFpbnQgJiYgcGFpbnQuYm91bmRWYXJpYWJsZXMgJiYgcGFpbnQuYm91bmRWYXJpYWJsZXMuY29sb3IpO1xuICAgICAgICAgICAgICAgIGlmIChib3VuZCB8fCBoYXNGaWxsU3R5bGUpXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NQYWludChwYWludCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdzdHJva2VzJyBpbiBub2RlICYmIEFycmF5LmlzQXJyYXkobm9kZS5zdHJva2VzKSkge1xuICAgICAgICAgICAgY29uc3Qgc3Ryb2tlcyA9IG5vZGUuc3Ryb2tlcyB8fCBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGFpbnQgb2Ygc3Ryb2tlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kID0gQm9vbGVhbihwYWludCAmJiBwYWludC5ib3VuZFZhcmlhYmxlcyAmJiBwYWludC5ib3VuZFZhcmlhYmxlcy5jb2xvcik7XG4gICAgICAgICAgICAgICAgaWYgKGJvdW5kIHx8IGhhc1N0cm9rZVN0eWxlKVxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzUGFpbnQocGFpbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNGaWxsU3R5bGUpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBmaWdtYS5nZXRTdHlsZUJ5SWQobm9kZS5maWxsU3R5bGVJZCk7XG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlICYmIEFycmF5LmlzQXJyYXkoc3R5bGUucGFpbnRzKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHAgb2Ygc3R5bGUucGFpbnRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc1BhaW50KHApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChfYSkgeyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhc1N0cm9rZVN0eWxlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0eWxlID0gZmlnbWEuZ2V0U3R5bGVCeUlkKG5vZGUuc3Ryb2tlU3R5bGVJZCk7XG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlICYmIEFycmF5LmlzQXJyYXkoc3R5bGUucGFpbnRzKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHAgb2Ygc3R5bGUucGFpbnRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc1BhaW50KHApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChfYikgeyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdjaGlsZHJlbicgaW4gbm9kZSAmJiBBcnJheS5pc0FycmF5KG5vZGUuY2hpbGRyZW4pKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzTm9kZShjaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGZvciAoY29uc3Qgcm9vdCBvZiBzZWxlY3Rpb24pXG4gICAgICAgIHByb2Nlc3NOb2RlKHJvb3QpO1xuICAgIGlmIChjb2xvck1hcC5zaXplID09PSAwKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeSgnTm8gc3R5bGVkIG9yIHZhcmlhYmxlLWJvdW5kIGNvbG9ycyBmb3VuZCBpbiBzZWxlY3Rpb24uJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGNvbGxlY3Rpb24gPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGxhc3RJZCA9IGF3YWl0IGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoJ2xhc3RDb2xvckNvbGxlY3Rpb25JZCcpO1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9ucyA9IGF3YWl0IGZpZ21hLnZhcmlhYmxlcy5nZXRMb2NhbFZhcmlhYmxlQ29sbGVjdGlvbnNBc3luYygpO1xuICAgICAgICBpZiAobGFzdElkKSB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbnMuZmluZCgoYykgPT4gYy5pZCA9PT0gbGFzdElkKSB8fCBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBgU2VsZWN0aW9uIENvbG9ycyAke25ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKX1gO1xuICAgICAgICAgICAgY29sbGVjdGlvbiA9IGZpZ21hLnZhcmlhYmxlcy5jcmVhdGVWYXJpYWJsZUNvbGxlY3Rpb24obGFiZWwpO1xuICAgICAgICAgICAgYXdhaXQgZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYygnbGFzdENvbG9yQ29sbGVjdGlvbklkJywgY29sbGVjdGlvbi5pZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KCdGYWlsZWQgdG8gcHJlcGFyZSB2YXJpYWJsZSBjb2xsZWN0aW9uLicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICBmaWdtYS5ub3RpZnkoJ0ZhaWxlZCB0byBwcmVwYXJlIHZhcmlhYmxlIGNvbGxlY3Rpb24uJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFjb2xsZWN0aW9uLm1vZGVzIHx8IGNvbGxlY3Rpb24ubW9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbGxlY3Rpb24uYWRkTW9kZSgnQmFzZScpO1xuICAgIH1cbiAgICBjb25zdCBtb2RlSWQgPSBjb2xsZWN0aW9uLm1vZGVzWzBdLm1vZGVJZDtcbiAgICBsZXQgY3JlYXRlZCA9IDA7XG4gICAgY29uc3QgbmV3VmFyTWFwID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IHRvSGV4ID0gKGMpID0+IHtcbiAgICAgICAgY29uc3QgbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZChjICogMjU1KSkpO1xuICAgICAgICByZXR1cm4gbi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKTtcbiAgICB9O1xuICAgIGNvbnN0IHJnYmFLZXkgPSAocmdiYSkgPT4gYCR7dG9IZXgocmdiYS5yKX0ke3RvSGV4KHJnYmEuZyl9JHt0b0hleChyZ2JhLmIpfSR7dG9IZXgocmdiYS5hKX1gLnRvVXBwZXJDYXNlKCk7XG4gICAgZm9yIChjb25zdCBba2V5LCByZ2JhXSBvZiBjb2xvck1hcC5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGBjb2xvci0ke2tleX1gO1xuICAgICAgICBjb25zdCB2ID0gYXdhaXQgKDAsIGNvbG9yX3V0aWxzXzEuY3JlYXRlT3JVcGRhdGVDb2xvclZhcmlhYmxlV2l0aENvbGxlY3Rpb24pKGNvbGxlY3Rpb24sIG1vZGVJZCwgbmFtZSwgcmdiYSk7XG4gICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICBjcmVhdGVkKys7XG4gICAgICAgICAgICBuZXdWYXJNYXAuc2V0KGtleSwgdik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHJlYXNzaWduZWQgPSAwO1xuICAgIGNvbnN0IHJlYXNzaWduTm9kZSA9IChub2RlKSA9PiB7XG4gICAgICAgIGlmICgnZmlsbHMnIGluIG5vZGUgJiYgQXJyYXkuaXNBcnJheShub2RlLmZpbGxzKSkge1xuICAgICAgICAgICAgY29uc3QgZmlsbHMgPSBub2RlLmZpbGxzIHx8IFtdO1xuICAgICAgICAgICAgY29uc3QgbmV3RmlsbHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGFpbnQgb2YgZmlsbHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXBhaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0ZpbGxzLnB1c2gocGFpbnQpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhaW50LnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYm91bmQgPSBCb29sZWFuKHBhaW50LmJvdW5kVmFyaWFibGVzICYmIHBhaW50LmJvdW5kVmFyaWFibGVzLmNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhID0gdHlwZW9mIHBhaW50Lm9wYWNpdHkgPT09ICdudW1iZXInID8gcGFpbnQub3BhY2l0eSA6IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZ2JhID0geyByOiBwYWludC5jb2xvci5yLCBnOiBwYWludC5jb2xvci5nLCBiOiBwYWludC5jb2xvci5iLCBhIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSByZ2JhS2V5KHJnYmEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gbmV3VmFyTWFwLmdldChrZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBmaWdtYS52YXJpYWJsZXMuc2V0Qm91bmRWYXJpYWJsZUZvclBhaW50KHBhaW50LCAnY29sb3InLCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdGaWxscy5wdXNoKHVwZGF0ZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFzc2lnbmVkKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoX2EpIHsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld0ZpbGxzLnB1c2gocGFpbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwYWludC50eXBlID09PSAnR1JBRElFTlRfTElORUFSJyB8fFxuICAgICAgICAgICAgICAgICAgICBwYWludC50eXBlID09PSAnR1JBRElFTlRfUkFESUFMJyB8fFxuICAgICAgICAgICAgICAgICAgICBwYWludC50eXBlID09PSAnR1JBRElFTlRfQU5HVUxBUicgfHxcbiAgICAgICAgICAgICAgICAgICAgcGFpbnQudHlwZSA9PT0gJ0dSQURJRU5UX0RJQU1PTkQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdwID0gcGFpbnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0b3BzID0gZ3AuZ3JhZGllbnRTdG9wcyB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVidWlsdCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHN0b3Agb2Ygc3RvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kID0gQm9vbGVhbihzdG9wLmJvdW5kVmFyaWFibGVzICYmIHN0b3AuYm91bmRWYXJpYWJsZXMuY29sb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmdiYSA9IHN0b3AuY29sb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gcmdiYUtleShyZ2JhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBuZXdWYXJNYXAuZ2V0KGtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWJ1aWx0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHN0b3AucG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogc3RvcC5jb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kVmFyaWFibGVzOiB7IGNvbG9yOiB7IHR5cGU6ICdWQVJJQUJMRV9BTElBUycsIGlkOiB0YXJnZXQuaWQgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNzaWduZWQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYnVpbHQucHVzaChzdG9wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWJ1aWx0LnB1c2goc3RvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1BhaW50ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGdwLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnRUcmFuc2Zvcm06IGdwLmdyYWRpZW50VHJhbnNmb3JtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyYWRpZW50U3RvcHM6IHJlYnVpbHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogZ3Aub3BhY2l0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiBncC52aXNpYmxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsZW5kTW9kZTogZ3AuYmxlbmRNb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbGxzLnB1c2gobmV3UGFpbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RmlsbHMucHVzaChwYWludCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0ZpbGxzLnB1c2gocGFpbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbm9kZS5maWxscyA9IG5ld0ZpbGxzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9iKSB7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoJ3N0cm9rZXMnIGluIG5vZGUgJiYgQXJyYXkuaXNBcnJheShub2RlLnN0cm9rZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBzdHJva2VzID0gbm9kZS5zdHJva2VzIHx8IFtdO1xuICAgICAgICAgICAgY29uc3QgbmV3U3Ryb2tlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBwYWludCBvZiBzdHJva2VzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFwYWludCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJva2VzLnB1c2gocGFpbnQpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhaW50LnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYm91bmQgPSBCb29sZWFuKHBhaW50LmJvdW5kVmFyaWFibGVzICYmIHBhaW50LmJvdW5kVmFyaWFibGVzLmNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhID0gdHlwZW9mIHBhaW50Lm9wYWNpdHkgPT09ICdudW1iZXInID8gcGFpbnQub3BhY2l0eSA6IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZ2JhID0geyByOiBwYWludC5jb2xvci5yLCBnOiBwYWludC5jb2xvci5nLCBiOiBwYWludC5jb2xvci5iLCBhIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSByZ2JhS2V5KHJnYmEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gbmV3VmFyTWFwLmdldChrZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBmaWdtYS52YXJpYWJsZXMuc2V0Qm91bmRWYXJpYWJsZUZvclBhaW50KHBhaW50LCAnY29sb3InLCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdHJva2VzLnB1c2godXBkYXRlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNzaWduZWQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChfYykgeyB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3U3Ryb2tlcy5wdXNoKHBhaW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cm9rZXMucHVzaChwYWludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBub2RlLnN0cm9rZXMgPSBuZXdTdHJva2VzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9kKSB7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoJ2NoaWxkcmVuJyBpbiBub2RlICYmIEFycmF5LmlzQXJyYXkobm9kZS5jaGlsZHJlbikpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIHJlYXNzaWduTm9kZShjaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGZvciAoY29uc3Qgcm9vdCBvZiBzZWxlY3Rpb24pXG4gICAgICAgIHJlYXNzaWduTm9kZShyb290KTtcbiAgICBmaWdtYS5ub3RpZnkoYENyZWF0ZWQgJHtjcmVhdGVkfSB2YXJzIGFuZCByZWFzc2lnbmVkICR7cmVhc3NpZ25lZH0gYmluZGluZ3MgdG8gdGhlIG5ldyBjb2xsZWN0aW9uLmApO1xufVxuZXhwb3J0cy5oYW5kbGVDcmVhdGVDb2xvckNvbGxlY3Rpb25Gcm9tU2VsZWN0aW9uID0gaGFuZGxlQ3JlYXRlQ29sb3JDb2xsZWN0aW9uRnJvbVNlbGVjdGlvbjtcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUNyZWF0ZUFsbENvbG9yVmFyaWFibGVzKCkge1xuICAgIGF3YWl0ICgwLCBjb2xvcl92YXJpYWJsZV9nZW5lcmF0b3JfMS5jcmVhdGVBbGxDb2xvclZhcmlhYmxlc0Zyb21TZWxlY3Rpb24pKCk7XG59XG5leHBvcnRzLmhhbmRsZUNyZWF0ZUFsbENvbG9yVmFyaWFibGVzID0gaGFuZGxlQ3JlYXRlQWxsQ29sb3JWYXJpYWJsZXM7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVBbGlhc0xvY2FsVG9JbXBvcnRlZEJ5TmFtZSgpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBsb2NhbFZhcnMgPSBhd2FpdCBmaWdtYS52YXJpYWJsZXMuZ2V0TG9jYWxWYXJpYWJsZXNBc3luYygpO1xuICAgICAgICBjb25zb2xlLmxvZygnW1BsdWdpbl0gTG9jYWwgdmFyaWFibGVzOicsIGxvY2FsVmFycy5sZW5ndGgpO1xuICAgICAgICBjb25zdCByZW1vdGVCeU5hbWUgPSBuZXcgTWFwKCk7XG4gICAgICAgIGNvbnN0IGFkZEJ5SWQgPSBhc3luYyAoaWQpID0+IHtcbiAgICAgICAgICAgIGlmICghaWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gYXdhaXQgZmlnbWEudmFyaWFibGVzLmdldFZhcmlhYmxlQnlJZEFzeW5jKGlkKTtcbiAgICAgICAgICAgICAgICBpZiAodiAmJiB2LnJlbW90ZSAmJiAhcmVtb3RlQnlOYW1lLmhhcyh2Lm5hbWUpKVxuICAgICAgICAgICAgICAgICAgICByZW1vdGVCeU5hbWUuc2V0KHYubmFtZSwgdik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoX2EpIHsgfVxuICAgICAgICB9O1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5maW5kQWxsKChub2RlKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICBjb25zdCBhbnlOb2RlID0gbm9kZTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IGFueU5vZGUuYm91bmRWYXJpYWJsZXM7XG4gICAgICAgICAgICAgICAgaWYgKGIgJiYgdHlwZW9mIGIgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyhiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZW50cnkgPSBiW2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlbnRyeSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGVudHJ5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYSBvZiBlbnRyeSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkQnlJZChhID09PSBudWxsIHx8IGEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGEuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkQnlJZChlbnRyeSA9PT0gbnVsbCB8fCBlbnRyeSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZW50cnkuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHBhaW50RmllbGRzID0gWydmaWxscycsICdzdHJva2VzJywgJ2VmZmVjdHMnXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIHBhaW50RmllbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyciA9IGFueU5vZGVbZmllbGRdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHBhaW50IG9mIGFycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ2ID0gcGFpbnQgPT09IG51bGwgfHwgcGFpbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhaW50LmJvdW5kVmFyaWFibGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yQWxpYXNJZCA9IChfYSA9IGJ2ID09PSBudWxsIHx8IGJ2ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBidi5jb2xvcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2xvckFsaWFzSWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZEJ5SWQoY29sb3JBbGlhc0lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChfYikgeyB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZygnW1BsdWdpbl0gSW1wb3J0ZWQgdmFyaWFibGVzIGRpc2NvdmVyZWQgYnkgbmFtZTonLCByZW1vdGVCeU5hbWUuc2l6ZSk7XG4gICAgICAgIGNvbnN0IHRvSGV4ID0gKGMpID0+IE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZChjICogMjU1KSkpLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgICBjb25zdCB2YWx1ZUtleSA9ICh2YWwpID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJylcbiAgICAgICAgICAgICAgICByZXR1cm4gYE46JHt2YWx9YDtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJylcbiAgICAgICAgICAgICAgICByZXR1cm4gYFM6JHt2YWx9YDtcbiAgICAgICAgICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgJiYgJ3InIGluIHZhbCAmJiAnZycgaW4gdmFsICYmICdiJyBpbiB2YWwgJiYgJ2EnIGluIHZhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBgQzoke3RvSGV4KHZhbC5yKX0ke3RvSGV4KHZhbC5nKX0ke3RvSGV4KHZhbC5iKX0ke3RvSGV4KHZhbC5hKX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGZpcnN0VmFsdWVLZXkgPSAodmFyaWFibGUpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFscyA9IHZhcmlhYmxlLnZhbHVlc0J5TW9kZTtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHMpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyh2YWxzKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB2YWx1ZUtleSh2YWxzW2tdKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9hKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGxldCB1cGRhdGVkID0gMDtcbiAgICAgICAgY29uc3QgbWF0Y2hlZCA9IFtdO1xuICAgICAgICBjb25zdCBza2lwcGVkTWlzbWF0Y2ggPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCB2IG9mIGxvY2FsVmFycykge1xuICAgICAgICAgICAgY29uc3QgcmVtb3RlID0gcmVtb3RlQnlOYW1lLmdldCh2Lm5hbWUpO1xuICAgICAgICAgICAgaWYgKCFyZW1vdGUgfHwgcmVtb3RlLnJlc29sdmVkVHlwZSAhPT0gdi5yZXNvbHZlZFR5cGUpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBjb25zdCBsb2NhbEtleSA9IGZpcnN0VmFsdWVLZXkodik7XG4gICAgICAgICAgICBjb25zdCByZW1vdGVLZXkgPSBmaXJzdFZhbHVlS2V5KHJlbW90ZSk7XG4gICAgICAgICAgICBpZiAoIWxvY2FsS2V5IHx8ICFyZW1vdGVLZXkgfHwgbG9jYWxLZXkgIT09IHJlbW90ZUtleSkge1xuICAgICAgICAgICAgICAgIHNraXBwZWRNaXNtYXRjaC5wdXNoKHYubmFtZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gYXdhaXQgZmlnbWEudmFyaWFibGVzLmdldFZhcmlhYmxlQ29sbGVjdGlvbkJ5SWRBc3luYyh2LnZhcmlhYmxlQ29sbGVjdGlvbklkKTtcbiAgICAgICAgICAgIGlmICghY29sbGVjdGlvbilcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbW9kZSBvZiBjb2xsZWN0aW9uLm1vZGVzKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdi5zZXRWYWx1ZUZvck1vZGUobW9kZS5tb2RlSWQsIHsgdHlwZTogJ1ZBUklBQkxFX0FMSUFTJywgaWQ6IHJlbW90ZS5pZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoX2EpIHsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWF0Y2hlZC5wdXNoKHYubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ1tQbHVnaW5dIEFsaWFzZWQgdmFyaWFibGVzIChuYW1lK3ZhbHVlIG1hdGNoKTonLCBtYXRjaGVkKTtcbiAgICAgICAgaWYgKHNraXBwZWRNaXNtYXRjaC5sZW5ndGgpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW1BsdWdpbl0gU2tpcHBlZCBkdWUgdG8gdmFsdWUgbWlzbWF0Y2g6Jywgc2tpcHBlZE1pc21hdGNoKTtcbiAgICAgICAgZmlnbWEubm90aWZ5KHVwZGF0ZWQgPiAwXG4gICAgICAgICAgICA/IGBBbGlhc2VkICR7dXBkYXRlZH0gbG9jYWwgdmFyaWFibGUgdmFsdWVzIHRvIGltcG9ydGVkIHZhcmlhYmxlcyBieSBuYW1lIGFuZCB2YWx1ZWBcbiAgICAgICAgICAgIDogJ05vIG1hdGNoaW5nIGltcG9ydGVkIHZhcmlhYmxlcyAobmFtZSt2YWx1ZSkgZm91bmQnKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignQWxpYXMgbG9jYWxzIHRvIGltcG9ydGVkIGVycm9yOicsIGUpO1xuICAgICAgICBmaWdtYS5ub3RpZnkoJ0Vycm9yIGFsaWFzaW5nIHZhcmlhYmxlcycpO1xuICAgIH1cbn1cbmV4cG9ydHMuaGFuZGxlQWxpYXNMb2NhbFRvSW1wb3J0ZWRCeU5hbWUgPSBoYW5kbGVBbGlhc0xvY2FsVG9JbXBvcnRlZEJ5TmFtZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5oYW5kbGVGaW5kRHVwbGljYXRlVG9wTGV2ZWxGcmFtZXMgPSBleHBvcnRzLmhhbmRsZVBhaXJTZWxlY3RlZEZyYW1lcyA9IGV4cG9ydHMuaGFuZGxlR3JvdXBTZWxlY3RlZEZyYW1lcyA9IGV4cG9ydHMuaGFuZGxlQXJyYW5nZUZyYW1lcyA9IHZvaWQgMDtcbmZ1bmN0aW9uIGhhbmRsZUFycmFuZ2VGcmFtZXMobXNnKSB7XG4gICAgY29uc3QgcG9zdGZpeCA9IChtc2cucG9zdGZpeCB8fCAnJykudHJpbSgpO1xuICAgIGNvbnN0IHJhbmRvbW5lc3NMZXZlbCA9IHR5cGVvZiBtc2cucmFuZG9tbmVzc0xldmVsID09PSAnbnVtYmVyJyA/IG1zZy5yYW5kb21uZXNzTGV2ZWwgOiBudWxsO1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5maWx0ZXIoKG4pID0+IG4udHlwZSA9PT0gJ0ZSQU1FJyk7XG4gICAgaWYgKCFzZWxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeSgnUGxlYXNlIHNlbGVjdCBmcmFtZXMgZmlyc3QuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29tbW9uUGFyZW50ID0gc2VsZWN0aW9uWzBdLnBhcmVudDtcbiAgICBjb25zdCBmcmFtZXMgPSBzZWxlY3Rpb24uZmlsdGVyKChmKSA9PiBmLnBhcmVudCA9PT0gY29tbW9uUGFyZW50KTtcbiAgICBpZiAoIWZyYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KCdObyBmcmFtZXMgd2l0aCBhIGNvbW1vbiBwYXJlbnQgZm91bmQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZnJhbWVzLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgdW5kZWZpbmVkLCB7IG51bWVyaWM6IHRydWUsIHNlbnNpdGl2aXR5OiAnYmFzZScgfSkpO1xuICAgIGNvbnN0IGdhcCA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChyYW5kb21uZXNzTGV2ZWwgPT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gMTY7XG4gICAgICAgIGNvbnN0IGNsYW1wZWQgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsIE1hdGgucm91bmQocmFuZG9tbmVzc0xldmVsKSkpO1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCgoY2xhbXBlZCAvIDEwMCkgKiAyMDApO1xuICAgIH0pKCk7XG4gICAgY29uc3Qgc3RhcnRYID0gTWF0aC5taW4oLi4uZnJhbWVzLm1hcCgoZikgPT4gZi54KSk7XG4gICAgY29uc3QgYmFzZWxpbmVZID0gTWF0aC5taW4oLi4uZnJhbWVzLm1hcCgoZikgPT4gZi55KSk7XG4gICAgbGV0IHggPSBzdGFydFg7XG4gICAgZm9yIChjb25zdCBmIG9mIGZyYW1lcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZi54ID0geDtcbiAgICAgICAgICAgIGYueSA9IGJhc2VsaW5lWTtcbiAgICAgICAgICAgIGlmIChwb3N0Zml4KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmVlZHNTcGFjZSA9ICFwb3N0Zml4LnN0YXJ0c1dpdGgoJyAnKSAmJiAhcG9zdGZpeC5zdGFydHNXaXRoKCctJykgJiYgIXBvc3RmaXguc3RhcnRzV2l0aCgnXycpO1xuICAgICAgICAgICAgICAgIGYubmFtZSA9IGAke2YubmFtZX0ke25lZWRzU3BhY2UgPyAnICcgOiAnJ30ke3Bvc3RmaXh9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHggKz0gZi53aWR0aCArIGdhcDtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdGYWlsZWQgYXJyYW5naW5nIGEgZnJhbWU6JywgZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gZnJhbWVzO1xuICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhmcmFtZXMpO1xuICAgIGZpZ21hLm5vdGlmeShgQXJyYW5nZWQgJHtmcmFtZXMubGVuZ3RofSBmcmFtZXMke3Bvc3RmaXggPyBgIHdpdGggcG9zdGZpeCBcIiR7cG9zdGZpeH1cImAgOiAnJ30gKGdhcDogJHtnYXB9cHgpLmApO1xufVxuZXhwb3J0cy5oYW5kbGVBcnJhbmdlRnJhbWVzID0gaGFuZGxlQXJyYW5nZUZyYW1lcztcbmZ1bmN0aW9uIGhhbmRsZUdyb3VwU2VsZWN0ZWRGcmFtZXMobXNnKSB7XG4gICAgY29uc3Qgc3VmZml4ID0gbXNnLnN1ZmZpeDtcbiAgICBjb25zdCBzZWxlY3RlZEZyYW1lcyA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5maWx0ZXIoKG4pID0+IG4udHlwZSA9PT0gJ0ZSQU1FJyk7XG4gICAgaWYgKHNlbGVjdGVkRnJhbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBmaWdtYS5ub3RpZnkoJ1BsZWFzZSBzZWxlY3Qgc29tZSBmcmFtZXMgZmlyc3QhJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZ3JvdXBzID0ge307XG4gICAgZm9yIChjb25zdCBmcmFtZSBvZiBzZWxlY3RlZEZyYW1lcykge1xuICAgICAgICBjb25zdCBuYW1lID0gZnJhbWUubmFtZS50cmltKCk7XG4gICAgICAgIGlmIChuYW1lLmVuZHNXaXRoKHN1ZmZpeCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGJhc2VOYW1lID0gbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoYFxcXFxzKiR7c3VmZml4fSRgLCAnaScpLCAnJykudHJpbSgpO1xuICAgICAgICAgICAgaWYgKCFncm91cHNbYmFzZU5hbWVdKVxuICAgICAgICAgICAgICAgIGdyb3Vwc1tiYXNlTmFtZV0gPSB7fTtcbiAgICAgICAgICAgIGdyb3Vwc1tiYXNlTmFtZV0uc3VmZml4RnJhbWUgPSBmcmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICghZ3JvdXBzW25hbWVdKVxuICAgICAgICAgICAgICAgIGdyb3Vwc1tuYW1lXSA9IHt9O1xuICAgICAgICAgICAgZ3JvdXBzW25hbWVdLmJhc2UgPSBmcmFtZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBjb250YWluZXIgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgIGNvbnRhaW5lci5uYW1lID0gYEdyb3VwZWQgRnJhbWVzICgke3N1ZmZpeH0pYDtcbiAgICBjb250YWluZXIubGF5b3V0TW9kZSA9ICdWRVJUSUNBTCc7XG4gICAgY29udGFpbmVyLnByaW1hcnlBeGlzU2l6aW5nTW9kZSA9ICdBVVRPJztcbiAgICBjb250YWluZXIuY291bnRlckF4aXNTaXppbmdNb2RlID0gJ0FVVE8nO1xuICAgIGNvbnRhaW5lci5pdGVtU3BhY2luZyA9IDI0O1xuICAgIGNvbnRhaW5lci5wYWRkaW5nVG9wID0gY29udGFpbmVyLnBhZGRpbmdCb3R0b20gPSAyNDtcbiAgICBjb250YWluZXIucGFkZGluZ0xlZnQgPSBjb250YWluZXIucGFkZGluZ1JpZ2h0ID0gMjQ7XG4gICAgZm9yIChjb25zdCBiYXNlTmFtZSBpbiBncm91cHMpIHtcbiAgICAgICAgY29uc3QgeyBiYXNlLCBzdWZmaXhGcmFtZSB9ID0gZ3JvdXBzW2Jhc2VOYW1lXTtcbiAgICAgICAgaWYgKCFiYXNlICYmICFzdWZmaXhGcmFtZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCByb3cgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgICAgICByb3cubmFtZSA9IGAke2Jhc2VOYW1lfSBSb3dgO1xuICAgICAgICByb3cubGF5b3V0TW9kZSA9ICdIT1JJWk9OVEFMJztcbiAgICAgICAgcm93LnByaW1hcnlBeGlzU2l6aW5nTW9kZSA9ICdBVVRPJztcbiAgICAgICAgcm93LmNvdW50ZXJBeGlzU2l6aW5nTW9kZSA9ICdBVVRPJztcbiAgICAgICAgcm93Lml0ZW1TcGFjaW5nID0gMTY7XG4gICAgICAgIGlmIChiYXNlKVxuICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKGJhc2UpO1xuICAgICAgICBpZiAoc3VmZml4RnJhbWUpXG4gICAgICAgICAgICByb3cuYXBwZW5kQ2hpbGQoc3VmZml4RnJhbWUpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocm93KTtcbiAgICB9XG4gICAgZmlnbWEuY3VycmVudFBhZ2UuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbY29udGFpbmVyXTtcbiAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoW2NvbnRhaW5lcl0pO1xuICAgIGZpZ21hLm5vdGlmeSgnRnJhbWVzIGdyb3VwZWQgc3VjY2Vzc2Z1bGx5IScpO1xufVxuZXhwb3J0cy5oYW5kbGVHcm91cFNlbGVjdGVkRnJhbWVzID0gaGFuZGxlR3JvdXBTZWxlY3RlZEZyYW1lcztcbmZ1bmN0aW9uIGhhbmRsZVBhaXJTZWxlY3RlZEZyYW1lcyhtc2cpIHtcbiAgICBjb25zdCBzdWZmaXggPSBtc2cuc3VmZml4O1xuICAgIGNvbnN0IHNlbGVjdGVkRnJhbWVzID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmZpbHRlcigobikgPT4gbi50eXBlID09PSAnRlJBTUUnKTtcbiAgICBpZiAoIXNlbGVjdGVkRnJhbWVzLmxlbmd0aCkge1xuICAgICAgICBmaWdtYS5ub3RpZnkoJ1BsZWFzZSBzZWxlY3QgZnJhbWVzIGZpcnN0IScpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGdyb3VwcyA9IHt9O1xuICAgIGZvciAoY29uc3QgZnJhbWUgb2Ygc2VsZWN0ZWRGcmFtZXMpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGZyYW1lLm5hbWUudHJpbSgpO1xuICAgICAgICBpZiAobmFtZS5lbmRzV2l0aChzdWZmaXgpKSB7XG4gICAgICAgICAgICBjb25zdCBiYXNlTmFtZSA9IG5hbWUucmVwbGFjZShuZXcgUmVnRXhwKGBcXFxccyoke3N1ZmZpeH0kYCwgJ2knKSwgJycpLnRyaW0oKTtcbiAgICAgICAgICAgIGlmICghZ3JvdXBzW2Jhc2VOYW1lXSlcbiAgICAgICAgICAgICAgICBncm91cHNbYmFzZU5hbWVdID0ge307XG4gICAgICAgICAgICBncm91cHNbYmFzZU5hbWVdLnN1ZmZpeEZyYW1lID0gZnJhbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWdyb3Vwc1tuYW1lXSlcbiAgICAgICAgICAgICAgICBncm91cHNbbmFtZV0gPSB7fTtcbiAgICAgICAgICAgIGdyb3Vwc1tuYW1lXS5iYXNlID0gZnJhbWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHhPZmZzZXQgPSAwO1xuICAgIGZvciAoY29uc3QgYmFzZU5hbWUgaW4gZ3JvdXBzKSB7XG4gICAgICAgIGNvbnN0IHsgYmFzZSwgc3VmZml4RnJhbWUgfSA9IGdyb3Vwc1tiYXNlTmFtZV07XG4gICAgICAgIGlmIChiYXNlKSB7XG4gICAgICAgICAgICBiYXNlLnggPSB4T2Zmc2V0O1xuICAgICAgICAgICAgYmFzZS55ID0gMDtcbiAgICAgICAgICAgIHhPZmZzZXQgKz0gYmFzZS53aWR0aCArIDI0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdWZmaXhGcmFtZSkge1xuICAgICAgICAgICAgc3VmZml4RnJhbWUueCA9IHhPZmZzZXQ7XG4gICAgICAgICAgICBzdWZmaXhGcmFtZS55ID0gMDtcbiAgICAgICAgICAgIHhPZmZzZXQgKz0gc3VmZml4RnJhbWUud2lkdGggKyAyNDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmaWdtYS5ub3RpZnkoJ1NlbGVjdGVkIGZyYW1lcyBhcnJhbmdlZCBieSBuYW1pbmchJyk7XG59XG5leHBvcnRzLmhhbmRsZVBhaXJTZWxlY3RlZEZyYW1lcyA9IGhhbmRsZVBhaXJTZWxlY3RlZEZyYW1lcztcbmZ1bmN0aW9uIGhhbmRsZUZpbmREdXBsaWNhdGVUb3BMZXZlbEZyYW1lcygpIHtcbiAgICBjb25zdCB0b3BMZXZlbEZyYW1lcyA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmZpbHRlcigobm9kZSkgPT4gbm9kZS50eXBlID09PSAnRlJBTUUnICYmIG5vZGUubGF5b3V0TW9kZSA9PT0gJ05PTkUnKTtcbiAgICBjb25zdCBmcmFtZU1hcCA9IHt9O1xuICAgIGZvciAoY29uc3QgZnJhbWUgb2YgdG9wTGV2ZWxGcmFtZXMpIHtcbiAgICAgICAgaWYgKCFmcmFtZU1hcFtmcmFtZS5uYW1lXSlcbiAgICAgICAgICAgIGZyYW1lTWFwW2ZyYW1lLm5hbWVdID0gW107XG4gICAgICAgIGZyYW1lTWFwW2ZyYW1lLm5hbWVdLnB1c2goZnJhbWUpO1xuICAgIH1cbiAgICBjb25zdCBkdXBsaWNhdGVzID0gW107XG4gICAgZm9yIChjb25zdCBuYW1lIGluIGZyYW1lTWFwKSB7XG4gICAgICAgIGlmIChmcmFtZU1hcFtuYW1lXS5sZW5ndGggPiAxKVxuICAgICAgICAgICAgZHVwbGljYXRlcy5wdXNoKC4uLmZyYW1lTWFwW25hbWVdKTtcbiAgICB9XG4gICAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBkdXBsaWNhdGVzO1xuICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoZHVwbGljYXRlcyk7XG4gICAgICAgIGZpZ21hLm5vdGlmeShgRm91bmQgJHtkdXBsaWNhdGVzLmxlbmd0aH0gdG9wLWxldmVsIHN0YW5kYXJkIGZyYW1lcyB3aXRoIGR1cGxpY2F0ZSBuYW1lcy5gKTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZHVwbGljYXRlLXNlbGVjdGlvbicsIGNvdW50OiBkdXBsaWNhdGVzLmxlbmd0aCB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeSgnTm8gZHVwbGljYXRlIHRvcC1sZXZlbCBzdGFuZGFyZCBmcmFtZSBuYW1lcyBmb3VuZC4nKTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZHVwbGljYXRlLXNlbGVjdGlvbicsIGNvdW50OiAwIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuaGFuZGxlRmluZER1cGxpY2F0ZVRvcExldmVsRnJhbWVzID0gaGFuZGxlRmluZER1cGxpY2F0ZVRvcExldmVsRnJhbWVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhbmRsZU1jcEdldEN1cnJlbnRTZWxlY3Rpb24gPSBleHBvcnRzLmhhbmRsZU1jcEdldFNlbGVjdGlvbiA9IGV4cG9ydHMuaGFuZGxlTWNwQ29tcG9uZW50U2VhcmNoID0gZXhwb3J0cy5oYW5kbGVNY3BOb2RlT3BlcmF0aW9uID0gdm9pZCAwO1xuY2xhc3MgVmFsaWRhdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKGZpZWxkLCBtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKGAke2ZpZWxkfTogJHttZXNzYWdlfWApO1xuICAgICAgICB0aGlzLmZpZWxkID0gZmllbGQ7XG4gICAgICAgIHRoaXMubmFtZSA9ICdWYWxpZGF0aW9uRXJyb3InO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVBheWxvYWQocGF5bG9hZCwgYWxpYXNlcykge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwYXlsb2FkKSkge1xuICAgICAgICBjb25zdCBjYW5vbmljYWxLZXkgPSBhbGlhc2VzW2tleV0gfHwga2V5O1xuICAgICAgICBub3JtYWxpemVkW2Nhbm9uaWNhbEtleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZU5vZGVJZChpZCkge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBpZC5yZXBsYWNlKCctJywgJzonKTtcbiAgICBpZiAoIW5vcm1hbGl6ZWQuaW5jbHVkZXMoJzonKSkge1xuICAgICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKCdub2RlSWQnLCAnTXVzdCBiZSBpbiBmb3JtYXQgXCIxMjM6NDU2XCInKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZU9wZXJhdGlvbihvcCkge1xuICAgIGNvbnN0IHZhbGlkID0gWydyZWFkJywgJ3VwZGF0ZScsICdkZWxldGUnLCAnc2VsZWN0J107XG4gICAgaWYgKCF2YWxpZC5pbmNsdWRlcyhvcCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcignb3BlcmF0aW9uJywgYE11c3QgYmUgb25lIG9mOiAke3ZhbGlkLmpvaW4oJywgJyl9YCk7XG4gICAgfVxuICAgIHJldHVybiBvcDtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlQ29tcG9uZW50TmFtZShuYW1lKSB7XG4gICAgY29uc3QgdHJpbW1lZCA9IG5hbWUudHJpbSgpO1xuICAgIGlmICh0cmltbWVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKCduYW1lJywgJ0NvbXBvbmVudCBuYW1lIGNhbm5vdCBiZSBlbXB0eScpO1xuICAgIH1cbiAgICByZXR1cm4gdHJpbW1lZDtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlU2VsZWN0aW9uKHNlbGVjdGlvbiwgY29uc3RyYWludHMpIHtcbiAgICBjb25zdCB7IG1pbkl0ZW1zID0gMCwgbWF4SXRlbXMgPSBJbmZpbml0eSwgYWxsb3dlZFR5cGVzIH0gPSBjb25zdHJhaW50cztcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA8IG1pbkl0ZW1zKSB7XG4gICAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoJ3NlbGVjdGlvbicsIGBTZWxlY3QgYXQgbGVhc3QgJHttaW5JdGVtc30gaXRlbShzKWApO1xuICAgIH1cbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA+IG1heEl0ZW1zKSB7XG4gICAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoJ3NlbGVjdGlvbicsIGBTZWxlY3QgYXQgbW9zdCAke21heEl0ZW1zfSBpdGVtKHMpYCk7XG4gICAgfVxuICAgIGlmIChhbGxvd2VkVHlwZXMpIHtcbiAgICAgICAgY29uc3QgaW52YWxpZCA9IHNlbGVjdGlvbi5maWx0ZXIoKG5vZGUpID0+ICFhbGxvd2VkVHlwZXMuaW5jbHVkZXMobm9kZS50eXBlKSk7XG4gICAgICAgIGlmIChpbnZhbGlkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoJ3NlbGVjdGlvbicsIGBJbnZhbGlkIG5vZGUgdHlwZXMuIEFsbG93ZWQ6ICR7YWxsb3dlZFR5cGVzLmpvaW4oJywgJyl9YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdGlvbjtcbn1cbmNvbnN0IE5PREVfQUxJQVNFUyA9IHtcbiAgICBpZDogJ25vZGVJZCcsXG4gICAgbm9kZTogJ25vZGVJZCcsXG4gICAgbm9kZV9pZDogJ25vZGVJZCcsXG4gICAgYWN0aW9uOiAnb3BlcmF0aW9uJyxcbiAgICBvcDogJ29wZXJhdGlvbicsXG4gICAgcHJvcHM6ICdwcm9wZXJ0aWVzJyxcbiAgICBkYXRhOiAncHJvcGVydGllcycsXG59O1xuY29uc3QgQ09NUE9ORU5UX0FMSUFTRVMgPSB7XG4gICAgY29tcG9uZW50TmFtZTogJ25hbWUnLFxuICAgIGNvbXBvbmVudDogJ25hbWUnLFxuICAgIGNvbXA6ICduYW1lJyxcbiAgICB2YXJpYW50TmFtZTogJ3ZhcmlhbnQnLFxuICAgIHBhZ2VOYW1lOiAncGFnZScsXG59O1xuY29uc3QgU0VMRUNUSU9OX0FMSUFTRVMgPSB7XG4gICAgbWluOiAnbWluSXRlbXMnLFxuICAgIG1heDogJ21heEl0ZW1zJyxcbiAgICB0eXBlczogJ2FsbG93ZWRUeXBlcycsXG4gICAgbm9kZVR5cGVzOiAnYWxsb3dlZFR5cGVzJyxcbn07XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVNY3BOb2RlT3BlcmF0aW9uKG1zZykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVQYXlsb2FkKG1zZy5hcmd1bWVudHMsIE5PREVfQUxJQVNFUyk7XG4gICAgICAgIGNvbnN0IG5vZGVJZCA9IHZhbGlkYXRlTm9kZUlkKG5vcm1hbGl6ZWQubm9kZUlkKTtcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uID0gdmFsaWRhdGVPcGVyYXRpb24obm9ybWFsaXplZC5vcGVyYXRpb24gfHwgJ3JlYWQnKTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGF3YWl0IGZpZ21hLmdldE5vZGVCeUlkQXN5bmMobm9kZUlkKTtcbiAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vZGUgJHtub2RlSWR9IG5vdCBmb3VuZGApO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXN1bHREYXRhO1xuICAgICAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xuICAgICAgICAgICAgY2FzZSAncmVhZCc6XG4gICAgICAgICAgICAgICAgcmVzdWx0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IG5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5vZGUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogbm9kZS50eXBlLFxuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiBub2RlLnZpc2libGUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2tlZDogbm9kZS5sb2NrZWQsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3VwZGF0ZSc6XG4gICAgICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWQucHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJ25hbWUnIGluIG5vcm1hbGl6ZWQucHJvcGVydGllcylcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUubmFtZSA9IG5vcm1hbGl6ZWQucHJvcGVydGllcy5uYW1lO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJ3Zpc2libGUnIGluIG5vcm1hbGl6ZWQucHJvcGVydGllcylcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUudmlzaWJsZSA9IG5vcm1hbGl6ZWQucHJvcGVydGllcy52aXNpYmxlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJ2xvY2tlZCcgaW4gbm9ybWFsaXplZC5wcm9wZXJ0aWVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5sb2NrZWQgPSBub3JtYWxpemVkLnByb3BlcnRpZXMubG9ja2VkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHREYXRhID0geyB1cGRhdGVkOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgcmVzdWx0RGF0YSA9IHsgZGVsZXRlZDogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbbm9kZV07XG4gICAgICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtub2RlXSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0RGF0YSA9IHsgc2VsZWN0ZWQ6IHRydWUgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiAnbWNwX3Jlc3VsdCcsXG4gICAgICAgICAgICBkYXRhOiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHJlc3VsdERhdGEgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiAnbWNwX3Jlc3VsdCcsXG4gICAgICAgICAgICBkYXRhOiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyb3IubWVzc2FnZSB9LFxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLmhhbmRsZU1jcE5vZGVPcGVyYXRpb24gPSBoYW5kbGVNY3BOb2RlT3BlcmF0aW9uO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlTWNwQ29tcG9uZW50U2VhcmNoKG1zZykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVQYXlsb2FkKG1zZy5hcmd1bWVudHMsIENPTVBPTkVOVF9BTElBU0VTKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IHZhbGlkYXRlQ29tcG9uZW50TmFtZShub3JtYWxpemVkLm5hbWUpO1xuICAgICAgICBhd2FpdCBmaWdtYS5sb2FkQWxsUGFnZXNBc3luYygpO1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gZmlnbWEucm9vdC5maW5kQWxsKChub2RlKSA9PiB7XG4gICAgICAgICAgICBpZiAobm9kZS50eXBlICE9PSAnQ09NUE9ORU5UJyAmJiBub2RlLnR5cGUgIT09ICdDT01QT05FTlRfU0VUJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5hbWVNYXRjaCA9IG5vZGUubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKG5hbWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICBpZiAobm9ybWFsaXplZC5wYWdlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFnZU1hdGNoID0gbm9kZS5wYXJlbnQgPyBub2RlLnBhcmVudC5uYW1lID09PSBub3JtYWxpemVkLnBhZ2UgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmFtZU1hdGNoICYmIHBhZ2VNYXRjaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuYW1lTWF0Y2g7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY29tcG9uZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBzY2VuZU5vZGVzID0gY29tcG9uZW50cy5maWx0ZXIoKGMpID0+ICdwYXJlbnQnIGluIGMgJiYgYy5wYXJlbnQgIT09IG51bGwpO1xuICAgICAgICAgICAgaWYgKHNjZW5lTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IHNjZW5lTm9kZXM7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KHNjZW5lTm9kZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoX2EpIHsgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6ICdtY3BfcmVzdWx0JyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IGNvbXBvbmVudHMubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzOiBjb21wb25lbnRzLnNsaWNlKDAsIDEwKS5tYXAoKGMpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogYy5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGMudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IGMucGFyZW50ID8gYy5wYXJlbnQubmFtZSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiAnbWNwX3Jlc3VsdCcsXG4gICAgICAgICAgICBkYXRhOiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyb3IubWVzc2FnZSB9LFxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLmhhbmRsZU1jcENvbXBvbmVudFNlYXJjaCA9IGhhbmRsZU1jcENvbXBvbmVudFNlYXJjaDtcbmZ1bmN0aW9uIGhhbmRsZU1jcEdldFNlbGVjdGlvbihtc2cpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplUGF5bG9hZChtc2cuYXJndW1lbnRzLCBTRUxFQ1RJT05fQUxJQVNFUyk7XG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IHZhbGlkYXRlU2VsZWN0aW9uKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiwge1xuICAgICAgICAgICAgbWluSXRlbXM6IG5vcm1hbGl6ZWQubWluSXRlbXMsXG4gICAgICAgICAgICBtYXhJdGVtczogbm9ybWFsaXplZC5tYXhJdGVtcyxcbiAgICAgICAgICAgIGFsbG93ZWRUeXBlczogbm9ybWFsaXplZC5hbGxvd2VkVHlwZXMsXG4gICAgICAgIH0pO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiAnbWNwX3Jlc3VsdCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiBzZWxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBub2Rlczogc2VsZWN0aW9uLm1hcCgobm9kZSkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBub2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbm9kZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogbm9kZS50eXBlLFxuICAgICAgICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogJ21jcF9yZXN1bHQnLFxuICAgICAgICAgICAgZGF0YTogeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5oYW5kbGVNY3BHZXRTZWxlY3Rpb24gPSBoYW5kbGVNY3BHZXRTZWxlY3Rpb247XG5mdW5jdGlvbiBoYW5kbGVNY3BHZXRDdXJyZW50U2VsZWN0aW9uKCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogJ21jcF9jdXJyZW50X3NlbGVjdGlvbicsXG4gICAgICAgICAgICBkYXRhOiB7IG5vZGVJZDogc2VsZWN0aW9uWzBdLmlkIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogJ21jcF9jdXJyZW50X3NlbGVjdGlvbicsXG4gICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLmhhbmRsZU1jcEdldEN1cnJlbnRTZWxlY3Rpb24gPSBoYW5kbGVNY3BHZXRDdXJyZW50U2VsZWN0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhbmRsZUJ1bGtBcHBseURlcHRoU3BhY2luZyA9IGV4cG9ydHMuaGFuZGxlQXBwbHlSYW5kb21QYWRkaW5ncyA9IGV4cG9ydHMuaGFuZGxlVXBkYXRlSXRlbVNwYWNpbmcgPSBleHBvcnRzLmhhbmRsZVVwZGF0ZVBhZGRpbmcgPSBleHBvcnRzLmNyZWF0ZVBhZGRpbmdWYXJpYWJsZXMgPSB2b2lkIDA7XG5jb25zdCBhdXRvbGF5b3V0XzEgPSByZXF1aXJlKFwiLi4vdXRpbHMvYXV0b2xheW91dFwiKTtcbmNvbnN0IHZhcmlhYmxlc18xID0gcmVxdWlyZShcIi4uL3V0aWxzL3ZhcmlhYmxlc1wiKTtcbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVBhZGRpbmdWYXJpYWJsZXMobmFtZVByZWZpeCkge1xuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgaWYgKHNlbGVjdGVkTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeSgnTm8gQXV0byBMYXlvdXQgZnJhbWVzIHNlbGVjdGVkLiBQbGVhc2Ugc2VsZWN0IEF1dG8gTGF5b3V0IGZyYW1lcyBmaXJzdC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBhdXRvTGF5b3V0RnJhbWVzID0gc2VsZWN0ZWROb2Rlcy5maWx0ZXIoKG5vZGUpID0+IG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyAmJlxuICAgICAgICBub2RlLmxheW91dE1vZGUgIT09ICdOT05FJyAmJlxuICAgICAgICBub2RlLnZpc2libGUgJiZcbiAgICAgICAgIW5vZGUubG9ja2VkICYmXG4gICAgICAgICFub2RlLnJlbW92ZWQpO1xuICAgIGlmIChhdXRvTGF5b3V0RnJhbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBmaWdtYS5ub3RpZnkoJ05vIHZhbGlkIEF1dG8gTGF5b3V0IGZyYW1lcyBzZWxlY3RlZC4gUGxlYXNlIHNlbGVjdCBBdXRvIExheW91dCBmcmFtZXMuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcGFkZGluZ0RhdGEgPSBhdXRvTGF5b3V0RnJhbWVzLm1hcCgoZnJhbWUpID0+ICgwLCBhdXRvbGF5b3V0XzEuZXh0cmFjdEF1dG9MYXlvdXRJbmZvKShmcmFtZSkpLmZpbHRlcihCb29sZWFuKTtcbiAgICBpZiAocGFkZGluZ0RhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeSgnTm8gQXV0byBMYXlvdXQgbm9kZXMgd2l0aCBwYWRkaW5nIGZvdW5kIGluIHNlbGVjdGlvbicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGVuc3VyZWQgPSBhd2FpdCAoMCwgdmFyaWFibGVzXzEuZ2V0T3JDcmVhdGVQYWRkaW5nQ29sbGVjdGlvbldpdGhNb2RlKSgpO1xuICAgICAgICBpZiAoIWVuc3VyZWQuY29sbGVjdGlvbiB8fCAhZW5zdXJlZC5tb2RlSWQpIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeSgnRmFpbGVkIHRvIHByZXBhcmUgUGFkZGluZyB2YXJpYWJsZSBjb2xsZWN0aW9uJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IGVuc3VyZWQuY29sbGVjdGlvbjtcbiAgICAgICAgY29uc3QgbW9kZUlkID0gZW5zdXJlZC5tb2RlSWQ7XG4gICAgICAgIGNvbnN0IGNyZWF0ZWRWYXJpYWJsZXMgPSBbXTtcbiAgICAgICAgY29uc3QgdmFsdWVNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9ICgoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhdyA9IChuYW1lUHJlZml4IHx8ICdwYWRkaW5nJykudHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsZWFuZWQgPSByYXcucmVwbGFjZSgvW1xceDAwLVxceDFGXFx4N0ZdL2csICcnKS5yZXBsYWNlKC9cXHMrL2csICctJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuZWQgfHwgJ3BhZGRpbmcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9hKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdwYWRkaW5nJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkoKTtcbiAgICAgICAgYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc05vZGUobm9kZSwgb3JpZ2luYWxGaWdtYU5vZGUpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKCFub2RlKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgbGV0IGZpZ21hTm9kZSA9IG9yaWdpbmFsRmlnbWFOb2RlIHx8IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaXNBdXRvTGF5b3V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhZGRpbmcgPSBub2RlLnBhZGRpbmcgfHwge307XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcCA9IHBhZGRpbmcudG9wIHx8IDA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJvdHRvbSA9IHBhZGRpbmcuYm90dG9tIHx8IDA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlZnQgPSBwYWRkaW5nLmxlZnQgfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmlnaHQgPSBwYWRkaW5nLnJpZ2h0IHx8IDA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1TcGFjaW5nID0gbm9kZS5pdGVtU3BhY2luZyB8fCAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZpZ21hTm9kZSAmJiBub2RlLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZ21hTm9kZSA9IGZpZ21hLmdldE5vZGVCeUlkKG5vZGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NvdWxkIG5vdCBmaW5kIEZpZ21hIG5vZGUgd2l0aCBJRDonLCBub2RlLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBiaW5kVmFyaWFibGUgPSBhc3luYyAodmFsdWUsIHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlID0gYXdhaXQgZ2V0T3JDcmVhdGVWYXJpYWJsZUZvclZhbHVlKGNvbGxlY3Rpb24sIG1vZGVJZCwgdmFsdWUsIHZhbHVlTWFwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFyaWFibGUgJiYgIWNyZWF0ZWRWYXJpYWJsZXMuaW5jbHVkZXModmFyaWFibGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRWYXJpYWJsZXMucHVzaCh2YXJpYWJsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWdtYU5vZGUgJiYgcHJvcGVydHkgaW4gZmlnbWFOb2RlICYmIHZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWdtYU5vZGUuc2V0Qm91bmRWYXJpYWJsZShwcm9wZXJ0eSwgdmFyaWFibGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYENvdWxkIG5vdCBiaW5kICR7cHJvcGVydHl9IHZhcmlhYmxlOmAsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBiaW5kVmFyaWFibGUodG9wLCAncGFkZGluZ1RvcCcpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBiaW5kVmFyaWFibGUoYm90dG9tLCAncGFkZGluZ0JvdHRvbScpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBiaW5kVmFyaWFibGUobGVmdCwgJ3BhZGRpbmdMZWZ0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGJpbmRWYXJpYWJsZShyaWdodCwgJ3BhZGRpbmdSaWdodCcpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBiaW5kVmFyaWFibGUoaXRlbVNwYWNpbmcsICdpdGVtU3BhY2luZycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5jaGlsZHJlbiAmJiBBcnJheS5pc0FycmF5KG5vZGUuY2hpbGRyZW4pICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHByb2Nlc3NOb2RlKGNoaWxkLCBmaWdtYU5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcHJvY2Vzc2luZyBub2RlOicsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhc3luYyBmdW5jdGlvbiBnZXRPckNyZWF0ZVZhcmlhYmxlRm9yVmFsdWUoY29sbGVjdGlvbiwgbW9kZUlkLCB2YWx1ZSwgdmFsdWVNYXApIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlTWFwLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdWYXJpYWJsZSA9IHZhbHVlTWFwLmdldCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBleGlzdGluZ1ZhcmlhYmxlIHx8IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHZhck5hbWUgPSBgJHtwcmVmaXh9LSR7dmFsdWV9YDtcbiAgICAgICAgICAgICAgICBjb25zdCB2YXJpYWJsZSA9IGF3YWl0ICgwLCB2YXJpYWJsZXNfMS5jcmVhdGVPclVwZGF0ZVZhcmlhYmxlV2l0aENvbGxlY3Rpb24pKGNvbGxlY3Rpb24sIG1vZGVJZCwgdmFyTmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmICh2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZU1hcC5zZXQodmFsdWUsIHZhcmlhYmxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhcmlhYmxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgY3JlYXRpbmcgdmFyaWFibGUgZm9yIHZhbHVlICR7dmFsdWV9OmAsIGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgcGFkZGluZ0RhdGEpIHtcbiAgICAgICAgICAgIGxldCBmaWdtYU5vZGUgPSBudWxsO1xuICAgICAgICAgICAgaWYgKG5vZGUuaWQpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBmaWdtYU5vZGUgPSBmaWdtYS5nZXROb2RlQnlJZChub2RlLmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdDb3VsZCBub3QgZmluZCBGaWdtYSBub2RlIHdpdGggSUQ6Jywgbm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXdhaXQgcHJvY2Vzc05vZGUobm9kZSwgZmlnbWFOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3JlYXRlZFZhcmlhYmxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoYENyZWF0ZWQgJHtjcmVhdGVkVmFyaWFibGVzLmxlbmd0aH0gcGFkZGluZyB2YXJpYWJsZXMgYW5kIGFzc2lnbmVkIHRvICR7YXV0b0xheW91dEZyYW1lcy5sZW5ndGh9IHNlbGVjdGVkIEF1dG8gTGF5b3V0IGZyYW1lc2ApO1xuICAgICAgICAgICAgYXdhaXQgKDAsIHZhcmlhYmxlc18xLnNlbmROdW1iZXJWYXJpYWJsZXNUb1VJKSgpO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAncGFkZGluZy1kYXRhJywgZGF0YTogKDAsIGF1dG9sYXlvdXRfMS5nZXRBbGxQYWRkaW5nRGF0YSkoKSB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeSgnTm8gcGFkZGluZyB2YXJpYWJsZXMgY3JlYXRlZCcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjcmVhdGluZyBwYWRkaW5nIHZhcmlhYmxlczonLCBlcnJvcik7XG4gICAgICAgIGZpZ21hLm5vdGlmeSgnRXJyb3IgY3JlYXRpbmcgdmFyaWFibGVzOiAnICsgZXJyb3IubWVzc2FnZSk7XG4gICAgfVxufVxuZXhwb3J0cy5jcmVhdGVQYWRkaW5nVmFyaWFibGVzID0gY3JlYXRlUGFkZGluZ1ZhcmlhYmxlcztcbmZ1bmN0aW9uIGhhbmRsZVVwZGF0ZVBhZGRpbmcobXNnKSB7XG4gICAgY29uc3QgeyBpZCwgc2lkZSwgdmFsdWUsIHZhcmlhYmxlSWQgfSA9IG1zZztcbiAgICBmaWdtYS5nZXROb2RlQnlJZEFzeW5jKGlkKS50aGVuKChub2RlKSA9PiB7XG4gICAgICAgIGlmICghbm9kZSB8fFxuICAgICAgICAgICAgIShub2RlLnR5cGUgPT09ICdGUkFNRScgfHwgbm9kZS50eXBlID09PSAnQ09NUE9ORU5UJyB8fCBub2RlLnR5cGUgPT09ICdJTlNUQU5DRScpIHx8XG4gICAgICAgICAgICAhKDAsIGF1dG9sYXlvdXRfMS5pc0F1dG9MYXlvdXROb2RlKShub2RlKSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdJbnZhbGlkIG5vZGUgZm9yIHBhZGRpbmcgdXBkYXRlOicsIG5vZGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNpZGVLZXkgPSBgcGFkZGluZyR7c2lkZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKX0ke3NpZGUuc2xpY2UoMSl9YDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFyaWFibGVJZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBub2RlLnNldEJvdW5kVmFyaWFibGUoc2lkZUtleSwgdmFyaWFibGVJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBub2RlW3NpZGVLZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgcGFkZGluZyB2YWx1ZTonLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdwYWRkaW5nLWRhdGEnLCBkYXRhOiAoMCwgYXV0b2xheW91dF8xLmdldEFsbFBhZGRpbmdEYXRhKSgpIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gdXBkYXRlIHBhZGRpbmcgZm9yICR7aWR9YCwgZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMuaGFuZGxlVXBkYXRlUGFkZGluZyA9IGhhbmRsZVVwZGF0ZVBhZGRpbmc7XG5mdW5jdGlvbiBoYW5kbGVVcGRhdGVJdGVtU3BhY2luZyhtc2cpIHtcbiAgICBjb25zdCB7IGlkLCB2YWx1ZSwgdmFyaWFibGVJZCB9ID0gbXNnO1xuICAgIGNvbnN0IG5vZGUgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgaWYgKCFub2RlIHx8XG4gICAgICAgICEobm9kZS50eXBlID09PSAnRlJBTUUnIHx8IG5vZGUudHlwZSA9PT0gJ0NPTVBPTkVOVCcgfHwgbm9kZS50eXBlID09PSAnSU5TVEFOQ0UnIHx8IG5vZGUudHlwZSA9PT0gJ1NFQ1RJT04nKSB8fFxuICAgICAgICAhKDAsIGF1dG9sYXlvdXRfMS5pc0F1dG9MYXlvdXROb2RlKShub2RlKSlcbiAgICAgICAgcmV0dXJuO1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh2YXJpYWJsZUlkKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG5vZGUuc2V0Qm91bmRWYXJpYWJsZSgncHJpbWFyeUF4aXNTcGFjaW5nJywgdmFyaWFibGVJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoX2EpIHsgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBub2RlLnNldEJvdW5kVmFyaWFibGUoJ2NvdW50ZXJBeGlzU3BhY2luZycsIHZhcmlhYmxlSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9iKSB7IH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbm9kZS5zZXRCb3VuZFZhcmlhYmxlKCdpdGVtU3BhY2luZycsIHZhcmlhYmxlSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9jKSB7IH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG5vZGUucHJpbWFyeUF4aXNTcGFjaW5nID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoX2QpIHsgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBub2RlLmNvdW50ZXJBeGlzU3BhY2luZyA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9lKSB7IH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbm9kZS5pdGVtU3BhY2luZyA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9mKSB7IH1cbiAgICAgICAgfVxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdwYWRkaW5nLWRhdGEnLCBkYXRhOiAoMCwgYXV0b2xheW91dF8xLmdldEFsbFBhZGRpbmdEYXRhKSgpIH0pO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gdXBkYXRlIGl0ZW1TcGFjaW5nIGZvciAke2lkfWAsIGUpO1xuICAgIH1cbn1cbmV4cG9ydHMuaGFuZGxlVXBkYXRlSXRlbVNwYWNpbmcgPSBoYW5kbGVVcGRhdGVJdGVtU3BhY2luZztcbmZ1bmN0aW9uIGhhbmRsZUFwcGx5UmFuZG9tUGFkZGluZ3MobXNnKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24uZmlsdGVyKChub2RlKSA9PiAobm9kZS50eXBlID09PSAnRlJBTUUnIHx8IG5vZGUudHlwZSA9PT0gJ0NPTVBPTkVOVCcgfHwgbm9kZS50eXBlID09PSAnSU5TVEFOQ0UnKSAmJlxuICAgICAgICAgICAgKDAsIGF1dG9sYXlvdXRfMS5pc0F1dG9MYXlvdXROb2RlKShub2RlKSAmJlxuICAgICAgICAgICAgbm9kZS52aXNpYmxlICYmXG4gICAgICAgICAgICAhbm9kZS5sb2NrZWQpO1xuICAgICAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoJ1NlbGVjdCBhdCBsZWFzdCBvbmUgQXV0byBMYXlvdXQgbm9kZS4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByYW5kb21uZXNzTGV2ZWwgPSBtc2cucmFuZG9tbmVzc0xldmVsIHx8IDUwO1xuICAgICAgICBjb25zdCBnZXRQYWRkaW5nU2NhbGUgPSAobGV2ZWwpID0+IHtcbiAgICAgICAgICAgIGlmIChsZXZlbCA8PSAyMClcbiAgICAgICAgICAgICAgICByZXR1cm4gWzAsIDQsIDhdO1xuICAgICAgICAgICAgaWYgKGxldmVsIDw9IDQwKVxuICAgICAgICAgICAgICAgIHJldHVybiBbMCwgNCwgOCwgMTIsIDE2XTtcbiAgICAgICAgICAgIGlmIChsZXZlbCA8PSA2MClcbiAgICAgICAgICAgICAgICByZXR1cm4gWzAsIDQsIDgsIDEyLCAxNiwgMjAsIDI0XTtcbiAgICAgICAgICAgIGlmIChsZXZlbCA8PSA4MClcbiAgICAgICAgICAgICAgICByZXR1cm4gWzAsIDQsIDgsIDEyLCAxNiwgMjAsIDI0LCAyOCwgMzJdO1xuICAgICAgICAgICAgcmV0dXJuIFswLCA0LCA4LCAxMiwgMTYsIDIwLCAyNCwgMjgsIDMyLCAzNiwgNDAsIDQ0LCA0OF07XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGdldFNwYWNpbmdTY2FsZSA9IChsZXZlbCkgPT4ge1xuICAgICAgICAgICAgaWYgKGxldmVsIDw9IDIwKVxuICAgICAgICAgICAgICAgIHJldHVybiBbMCwgNCwgOF07XG4gICAgICAgICAgICBpZiAobGV2ZWwgPD0gNDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIFswLCA0LCA4LCAxMl07XG4gICAgICAgICAgICBpZiAobGV2ZWwgPD0gNjApXG4gICAgICAgICAgICAgICAgcmV0dXJuIFswLCA0LCA4LCAxMiwgMTYsIDIwXTtcbiAgICAgICAgICAgIGlmIChsZXZlbCA8PSA4MClcbiAgICAgICAgICAgICAgICByZXR1cm4gWzAsIDQsIDgsIDEyLCAxNiwgMjAsIDI0XTtcbiAgICAgICAgICAgIHJldHVybiBbMCwgNCwgOCwgMTIsIDE2LCAyMCwgMjQsIDI4LCAzMiwgMzYsIDQwXTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcGFkZGluZ1NjYWxlID0gZ2V0UGFkZGluZ1NjYWxlKHJhbmRvbW5lc3NMZXZlbCk7XG4gICAgICAgIGNvbnN0IHNwYWNpbmdTY2FsZSA9IGdldFNwYWNpbmdTY2FsZShyYW5kb21uZXNzTGV2ZWwpO1xuICAgICAgICBjb25zdCByYW5kRnJvbSA9IChhcnIpID0+IGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG4gICAgICAgIGNvbnN0IGFwcGx5UmFuZG9tVG9Ob2RlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICAgIGlmICghKDAsIGF1dG9sYXlvdXRfMS5pc0F1dG9MYXlvdXROb2RlKShub2RlKSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBwYWRWID0gcmFuZEZyb20ocGFkZGluZ1NjYWxlKTtcbiAgICAgICAgICAgIGNvbnN0IHBhZEggPSByYW5kRnJvbShwYWRkaW5nU2NhbGUpO1xuICAgICAgICAgICAgY29uc3QgbWF4UGFkID0gcGFkZGluZ1NjYWxlW3BhZGRpbmdTY2FsZS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGNvbnN0IHZQYWQgPSBNYXRoLm1pbihwYWRWLCBtYXhQYWQpO1xuICAgICAgICAgICAgY29uc3QgaFBhZCA9IE1hdGgubWluKHBhZEgsIG1heFBhZCk7XG4gICAgICAgICAgICBjb25zdCBnYXAgPSByYW5kRnJvbShzcGFjaW5nU2NhbGUpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBub2RlLnBhZGRpbmdUb3AgPSB2UGFkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9hKSB7IH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbm9kZS5wYWRkaW5nQm90dG9tID0gdlBhZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChfYikgeyB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG5vZGUucGFkZGluZ0xlZnQgPSBoUGFkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9jKSB7IH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbm9kZS5wYWRkaW5nUmlnaHQgPSBoUGFkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9kKSB7IH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbm9kZS5wcmltYXJ5QXhpc1NwYWNpbmcgPSBnYXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoX2UpIHsgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBub2RlLmNvdW50ZXJBeGlzU3BhY2luZyA9IGdhcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChfZikgeyB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG5vZGUuaXRlbVNwYWNpbmcgPSBnYXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoX2cpIHsgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCB3YWxrID0gKG5vZGUpID0+IHtcbiAgICAgICAgICAgIGlmICgobm9kZS50eXBlID09PSAnRlJBTUUnIHx8IG5vZGUudHlwZSA9PT0gJ0NPTVBPTkVOVCcgfHwgbm9kZS50eXBlID09PSAnSU5TVEFOQ0UnKSAmJlxuICAgICAgICAgICAgICAgICgwLCBhdXRvbGF5b3V0XzEuaXNBdXRvTGF5b3V0Tm9kZSkobm9kZSkpIHtcbiAgICAgICAgICAgICAgICBhcHBseVJhbmRvbVRvTm9kZShub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgnY2hpbGRyZW4nIGluIG5vZGUgJiYgQXJyYXkuaXNBcnJheShub2RlLmNoaWxkcmVuKSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICB3YWxrKGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGZvciAoY29uc3QgbiBvZiBzZWxlY3RlZClcbiAgICAgICAgICAgIHdhbGsobik7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ3BhZGRpbmctZGF0YScsIGRhdGE6ICgwLCBhdXRvbGF5b3V0XzEuZ2V0QWxsUGFkZGluZ0RhdGEpKCkgfSk7XG4gICAgICAgIGZpZ21hLm5vdGlmeShgQXNzaWduZWQgcmFuZG9tIHBhZGRpbmdzICgke3JhbmRvbW5lc3NMZXZlbH0lIHJhbmRvbW5lc3MpIHRvICR7c2VsZWN0ZWQubGVuZ3RofSBzZWxlY3Rpb24gcm9vdHMgKGFuZCB0aGVpciBkZXNjZW5kYW50cykuYCk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGFwcGx5aW5nIHJhbmRvbSBwYWRkaW5nczonLCBlKTtcbiAgICAgICAgZmlnbWEubm90aWZ5KCdFcnJvciBhcHBseWluZyByYW5kb20gcGFkZGluZ3MuJyk7XG4gICAgfVxufVxuZXhwb3J0cy5oYW5kbGVBcHBseVJhbmRvbVBhZGRpbmdzID0gaGFuZGxlQXBwbHlSYW5kb21QYWRkaW5ncztcbmZ1bmN0aW9uIGhhbmRsZUJ1bGtBcHBseURlcHRoU3BhY2luZygpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeSgnTm8gZnJhbWVzIHNlbGVjdGVkLiBQbGVhc2Ugc2VsZWN0IEF1dG8gTGF5b3V0IGZyYW1lcyBmaXJzdC4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhdXRvTGF5b3V0RnJhbWVzID0gc2VsZWN0ZWROb2Rlcy5maWx0ZXIoKG5vZGUpID0+IG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyAmJlxuICAgICAgICAgICAgbm9kZS5sYXlvdXRNb2RlICE9PSAnTk9ORScgJiZcbiAgICAgICAgICAgIG5vZGUudmlzaWJsZSAmJlxuICAgICAgICAgICAgIW5vZGUubG9ja2VkICYmXG4gICAgICAgICAgICAhbm9kZS5yZW1vdmVkKTtcbiAgICAgICAgaWYgKGF1dG9MYXlvdXRGcmFtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoJ05vIHZhbGlkIEF1dG8gTGF5b3V0IGZyYW1lcyBzZWxlY3RlZC4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBnZXRQYWRkaW5nRm9yRGVwdGggPSAoZGVwdGgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heCg4LCAyNCAtIGRlcHRoICogOCk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGdldFNwYWNpbmdGb3JEZXB0aCA9IChkZXB0aCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgubWF4KDQsIDEyIC0gZGVwdGggKiA0KTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgYXBwbHlDYXNjYWRpbmdQYWRkaW5ncyA9IChub2RlLCBkZXB0aCA9IDApID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKCgwLCBhdXRvbGF5b3V0XzEuaXNBdXRvTGF5b3V0Tm9kZSkobm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFkZGluZ1ZhbHVlID0gZ2V0UGFkZGluZ0ZvckRlcHRoKGRlcHRoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BhY2luZ1ZhbHVlID0gZ2V0U3BhY2luZ0ZvckRlcHRoKGRlcHRoKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucGFkZGluZ1RvcCA9IHBhZGRpbmdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZ1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5wYWRkaW5nQm90dG9tID0gcGFkZGluZ1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5wYWRkaW5nTGVmdCA9IHBhZGRpbmdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdDb3VsZCBub3Qgc2V0IHBhZGRpbmcgZm9yIG5vZGU6Jywgbm9kZS5pZCwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucHJpbWFyeUF4aXNTcGFjaW5nID0gc3BhY2luZ1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jb3VudGVyQXhpc1NwYWNpbmcgPSBzcGFjaW5nVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLml0ZW1TcGFjaW5nID0gc3BhY2luZ1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NvdWxkIG5vdCBzZXQgc3BhY2luZyBmb3Igbm9kZTonLCBub2RlLmlkLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoJ2NoaWxkcmVuJyBpbiBub2RlICYmIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ0ZSQU1FJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLnR5cGUgPT09ICdDT01QT05FTlQnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQudHlwZSA9PT0gJ0lOU1RBTkNFJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLnR5cGUgPT09ICdTRUNUSU9OJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGx5Q2FzY2FkaW5nUGFkZGluZ3MoY2hpbGQsIGRlcHRoICsgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwcm9jZXNzaW5nIG5vZGU6Jywgbm9kZS5pZCwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBmb3IgKGNvbnN0IGZyYW1lIG9mIGF1dG9MYXlvdXRGcmFtZXMpIHtcbiAgICAgICAgICAgIGFwcGx5Q2FzY2FkaW5nUGFkZGluZ3MoZnJhbWUsIDApO1xuICAgICAgICB9XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ3BhZGRpbmctZGF0YScsIGRhdGE6ICgwLCBhdXRvbGF5b3V0XzEuZ2V0QWxsUGFkZGluZ0RhdGEpKCkgfSk7XG4gICAgICAgIGZpZ21hLm5vdGlmeShgQXBwbGllZCBjYXNjYWRpbmcgcGFkZGluZ3MgdG8gJHthdXRvTGF5b3V0RnJhbWVzLmxlbmd0aH0gQXV0byBMYXlvdXQgZnJhbWVzYCk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBhcHBseWluZyBjYXNjYWRpbmcgcGFkZGluZ3M6JywgZXJyb3IpO1xuICAgICAgICBmaWdtYS5ub3RpZnkoJ0Vycm9yIGFwcGx5aW5nIGNhc2NhZGluZyBwYWRkaW5nczogJyArIGVycm9yLm1lc3NhZ2UpO1xuICAgIH1cbn1cbmV4cG9ydHMuaGFuZGxlQnVsa0FwcGx5RGVwdGhTcGFjaW5nID0gaGFuZGxlQnVsa0FwcGx5RGVwdGhTcGFjaW5nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhbmRsZVJlbmFtZU5vZGUgPSBleHBvcnRzLmhhbmRsZVpvb21Ub05vZGUgPSBleHBvcnRzLmhhbmRsZVNlbGVjdE5leHRBdXRvTGF5b3V0ID0gZXhwb3J0cy5oYW5kbGVTZWxlY3RBbGxBdXRvTGF5b3V0ID0gdm9pZCAwO1xuY29uc3QgYXV0b2xheW91dF8xID0gcmVxdWlyZShcIi4uL3V0aWxzL2F1dG9sYXlvdXRcIik7XG5mdW5jdGlvbiBoYW5kbGVTZWxlY3RBbGxBdXRvTGF5b3V0KCkge1xuICAgIGNvbnN0IGF1dG9MYXlvdXROb2RlcyA9IGZpZ21hLnJvb3QuZmluZEFsbCgobm9kZSkgPT4gbm9kZS50eXBlID09PSAnRlJBTUUnICYmIG5vZGUubGF5b3V0TW9kZSAhPT0gJ05PTkUnKTtcbiAgICBpZiAoYXV0b0xheW91dE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gYXV0b0xheW91dE5vZGVzO1xuICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoYXV0b0xheW91dE5vZGVzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeSgnTm8gQXV0byBMYXlvdXQgZnJhbWVzIGZvdW5kIG9uIHRoaXMgcGFnZS4nKTtcbiAgICB9XG59XG5leHBvcnRzLmhhbmRsZVNlbGVjdEFsbEF1dG9MYXlvdXQgPSBoYW5kbGVTZWxlY3RBbGxBdXRvTGF5b3V0O1xuZnVuY3Rpb24gaGFuZGxlU2VsZWN0TmV4dEF1dG9MYXlvdXQoX21zZykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgICAgIGNvbnN0IGF1dG9MYXlvdXROb2RlcyA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRBbGwoKG5vZGUpID0+IChub2RlLnR5cGUgPT09ICdGUkFNRScgfHwgbm9kZS50eXBlID09PSAnQ09NUE9ORU5UJyB8fCBub2RlLnR5cGUgPT09ICdJTlNUQU5DRScpICYmXG4gICAgICAgICAgICAoMCwgYXV0b2xheW91dF8xLmlzQXV0b0xheW91dE5vZGUpKG5vZGUpKTtcbiAgICAgICAgaWYgKGF1dG9MYXlvdXROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeSgnTm8gQXV0byBMYXlvdXQgZnJhbWVzIGZvdW5kIG9uIHRoaXMgcGFnZS4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudFNlbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50QXV0b0xheW91dCA9IGN1cnJlbnRTZWxlY3Rpb24uZmluZCgobm9kZSkgPT4gYXV0b0xheW91dE5vZGVzLnNvbWUoKGFsTm9kZSkgPT4gYWxOb2RlLmlkID09PSBub2RlLmlkKSk7XG4gICAgICAgICAgICBpZiAoY3VycmVudEF1dG9MYXlvdXQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBhdXRvTGF5b3V0Tm9kZXMuZmluZEluZGV4KChub2RlKSA9PiBub2RlLmlkID09PSBjdXJyZW50QXV0b0xheW91dC5pZCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEluZGV4ID0gKGN1cnJlbnRJbmRleCArIDEpICUgYXV0b0xheW91dE5vZGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0Tm9kZSA9IGF1dG9MYXlvdXROb2Rlc1tuZXh0SW5kZXhdO1xuICAgICAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IFtuZXh0Tm9kZV07XG4gICAgICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtuZXh0Tm9kZV0pO1xuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ3BhZGRpbmctZGF0YScsIGRhdGE6ICgwLCBhdXRvbGF5b3V0XzEuZ2V0QWxsUGFkZGluZ0RhdGEpKCkgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZhbGlkTm9kZXMgPSBhdXRvTGF5b3V0Tm9kZXMuZmlsdGVyKChub2RlKSA9PiBub2RlICYmXG4gICAgICAgICAgICAhbm9kZS5yZW1vdmVkICYmXG4gICAgICAgICAgICBub2RlLnZpc2libGUgJiZcbiAgICAgICAgICAgICFub2RlLmxvY2tlZCAmJlxuICAgICAgICAgICAgbm9kZS5sYXlvdXRNb2RlICYmXG4gICAgICAgICAgICBub2RlLmxheW91dE1vZGUgIT09ICdOT05FJyk7XG4gICAgICAgIGlmICh2YWxpZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KCdObyB2YWxpZCBBdXRvIExheW91dCBmcmFtZXMgZm91bmQuJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2YWxpZE5vZGVzLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkTm9kZSA9IHZhbGlkTm9kZXNbcmFuZG9tSW5kZXhdO1xuICAgICAgICBpZiAoIXNlbGVjdGVkTm9kZSB8fCBzZWxlY3RlZE5vZGUucmVtb3ZlZCB8fCAhc2VsZWN0ZWROb2RlLnZpc2libGUpIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeSgnU2VsZWN0ZWQgbm9kZSBpcyBubyBsb25nZXIgdmFsaWQuIFBsZWFzZSB0cnkgYWdhaW4uJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gW3NlbGVjdGVkTm9kZV07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoW3NlbGVjdGVkTm9kZV0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoICh6b29tRXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignQ291bGQgbm90IHpvb20gdG8gc2VsZWN0ZWQgbm9kZTonLCB6b29tRXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGZpZ21hLm5vdGlmeShgU2VsZWN0ZWQ6ICR7c2VsZWN0ZWROb2RlLm5hbWV9YCk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzZWxlY3RpbmcgcmFuZG9tIEF1dG8gTGF5b3V0OicsIGVycm9yKTtcbiAgICAgICAgZmlnbWEubm90aWZ5KCdFcnJvciBzZWxlY3RpbmcgQXV0byBMYXlvdXQgZnJhbWUuIFBsZWFzZSB0cnkgYWdhaW4uJyk7XG4gICAgfVxufVxuZXhwb3J0cy5oYW5kbGVTZWxlY3ROZXh0QXV0b0xheW91dCA9IGhhbmRsZVNlbGVjdE5leHRBdXRvTGF5b3V0O1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlWm9vbVRvTm9kZShtc2cpIHtcbiAgICBjb25zdCBub2RlID0gYXdhaXQgZmlnbWEuZ2V0Tm9kZUJ5SWRBc3luYyhtc2cubm9kZUlkKTtcbiAgICBpZiAobm9kZSAmJiAncGFyZW50JyBpbiBub2RlKSB7XG4gICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhbbm9kZV0pO1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbbm9kZV07XG4gICAgfVxufVxuZXhwb3J0cy5oYW5kbGVab29tVG9Ob2RlID0gaGFuZGxlWm9vbVRvTm9kZTtcbmZ1bmN0aW9uIGhhbmRsZVJlbmFtZU5vZGUobXNnKSB7XG4gICAgY29uc3QgeyBub2RlSWQsIG5ld05hbWUgfSA9IG1zZztcbiAgICBmaWdtYS5nZXROb2RlQnlJZEFzeW5jKG5vZGVJZCkudGhlbigobm9kZSkgPT4ge1xuICAgICAgICBpZiAobm9kZSAmJiAnbmFtZScgaW4gbm9kZSkge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBTdHJpbmcobmV3TmFtZSAhPT0gbnVsbCAmJiBuZXdOYW1lICE9PSB2b2lkIDAgPyBuZXdOYW1lIDogJycpLnRyaW0oKTtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXHgwMC1cXHgxRlxceDdGXS9nLCAnJyk7XG4gICAgICAgICAgICBpZiAobmFtZS5sZW5ndGggPiAxMjgpXG4gICAgICAgICAgICAgICAgbmFtZSA9IG5hbWUuc2xpY2UoMCwgMTI4KTtcbiAgICAgICAgICAgIGlmICghbmFtZSB8fCBuYW1lID09PSBub2RlLm5hbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgbm9kZS5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ3BhZGRpbmctZGF0YScsIGRhdGE6ICgwLCBhdXRvbGF5b3V0XzEuZ2V0QWxsUGFkZGluZ0RhdGEpKCkgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMuaGFuZGxlUmVuYW1lTm9kZSA9IGhhbmRsZVJlbmFtZU5vZGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0QWxsUGFkZGluZ0RhdGEgPSBleHBvcnRzLmV4dHJhY3RBdXRvTGF5b3V0SW5mbyA9IGV4cG9ydHMuaXNBdXRvTGF5b3V0Tm9kZSA9IHZvaWQgMDtcbmZ1bmN0aW9uIGlzQXV0b0xheW91dE5vZGUobm9kZSkge1xuICAgIHJldHVybiAoKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyB8fFxuICAgICAgICBub2RlLnR5cGUgPT09ICdDT01QT05FTlQnIHx8XG4gICAgICAgIG5vZGUudHlwZSA9PT0gJ0lOU1RBTkNFJykgJiZcbiAgICAgICAgKG5vZGUubGF5b3V0TW9kZSA9PT0gJ0hPUklaT05UQUwnIHx8IG5vZGUubGF5b3V0TW9kZSA9PT0gJ1ZFUlRJQ0FMJykpO1xufVxuZXhwb3J0cy5pc0F1dG9MYXlvdXROb2RlID0gaXNBdXRvTGF5b3V0Tm9kZTtcbmZ1bmN0aW9uIGV4dHJhY3RBdXRvTGF5b3V0SW5mbyhub2RlKSB7XG4gICAgY29uc3QgaXNBdXRvID0gaXNBdXRvTGF5b3V0Tm9kZShub2RlKTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW5cbiAgICAgICAgLmZpbHRlcigoY2hpbGQpID0+IChjaGlsZC50eXBlID09PSAnRlJBTUUnIHx8XG4gICAgICAgIGNoaWxkLnR5cGUgPT09ICdDT01QT05FTlQnIHx8XG4gICAgICAgIGNoaWxkLnR5cGUgPT09ICdJTlNUQU5DRScgfHxcbiAgICAgICAgY2hpbGQudHlwZSA9PT0gJ1NFQ1RJT04nKSAmJlxuICAgICAgICAoY2hpbGQudHlwZSA9PT0gJ1NFQ1RJT04nIHx8IGlzQXV0b0xheW91dE5vZGUoY2hpbGQpKSlcbiAgICAgICAgLm1hcCgobm9kZSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGV4dHJhY3RBdXRvTGF5b3V0SW5mbyhub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdGYWlsZWQgdG8gZXh0cmFjdCBub2RlOicsIG5vZGUuaWQsIGUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9KVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmICghaXNBdXRvICYmIGNoaWxkcmVuLmxlbmd0aCA9PT0gMClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7IGlkOiBub2RlLmlkLCBuYW1lOiBub2RlLm5hbWUsIGlzQXV0b0xheW91dDogaXNBdXRvLCBsYXlvdXRNb2RlOiBpc0F1dG8gPyBub2RlLmxheW91dE1vZGUgOiB1bmRlZmluZWQgfSwgKGlzQXV0byAmJiB7XG4gICAgICAgIHBhZGRpbmc6IHtcbiAgICAgICAgICAgIHRvcDogbm9kZS5wYWRkaW5nVG9wLFxuICAgICAgICAgICAgYm90dG9tOiBub2RlLnBhZGRpbmdCb3R0b20sXG4gICAgICAgICAgICBsZWZ0OiBub2RlLnBhZGRpbmdMZWZ0LFxuICAgICAgICAgICAgcmlnaHQ6IG5vZGUucGFkZGluZ1JpZ2h0LFxuICAgICAgICB9LFxuICAgICAgICBpdGVtU3BhY2luZzogbm9kZS5pdGVtU3BhY2luZyxcbiAgICB9KSksIHsgY2hpbGRyZW4gfSk7XG59XG5leHBvcnRzLmV4dHJhY3RBdXRvTGF5b3V0SW5mbyA9IGV4dHJhY3RBdXRvTGF5b3V0SW5mbztcbmZ1bmN0aW9uIGdldEFsbFBhZGRpbmdEYXRhKCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICByZXR1cm4gc2VsZWN0aW9uXG4gICAgICAgIC5maWx0ZXIoKG5vZGUpID0+IChub2RlLnR5cGUgPT09ICdGUkFNRScgfHxcbiAgICAgICAgbm9kZS50eXBlID09PSAnQ09NUE9ORU5UJyB8fFxuICAgICAgICBub2RlLnR5cGUgPT09ICdJTlNUQU5DRScgfHxcbiAgICAgICAgbm9kZS50eXBlID09PSAnU0VDVElPTicpICYmXG4gICAgICAgIGlzQXV0b0xheW91dE5vZGUobm9kZSkpXG4gICAgICAgIC5tYXAoZXh0cmFjdEF1dG9MYXlvdXRJbmZvKVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pO1xufVxuZXhwb3J0cy5nZXRBbGxQYWRkaW5nRGF0YSA9IGdldEFsbFBhZGRpbmdEYXRhO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZU9yVXBkYXRlVmFyaWFibGVXaXRoQ29sbGVjdGlvbiA9IGV4cG9ydHMuZ2V0T3JDcmVhdGVQYWRkaW5nQ29sbGVjdGlvbldpdGhNb2RlID0gZXhwb3J0cy5zZW5kTnVtYmVyVmFyaWFibGVzVG9VSSA9IHZvaWQgMDtcbmFzeW5jIGZ1bmN0aW9uIHNlbmROdW1iZXJWYXJpYWJsZXNUb1VJKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb25zID0gYXdhaXQgZmlnbWEudmFyaWFibGVzLmdldExvY2FsVmFyaWFibGVDb2xsZWN0aW9uc0FzeW5jKCk7XG4gICAgICAgIGNvbnN0IGFsbFZhcmlhYmxlcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGNvbGxlY3Rpb24gb2YgY29sbGVjdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGZ1bGxDb2xsZWN0aW9uID0gYXdhaXQgZmlnbWEudmFyaWFibGVzLmdldFZhcmlhYmxlQ29sbGVjdGlvbkJ5SWRBc3luYyhjb2xsZWN0aW9uLmlkKTtcbiAgICAgICAgICAgIGlmIChmdWxsQ29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdmFySWQgb2YgZnVsbENvbGxlY3Rpb24udmFyaWFibGVJZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSBhd2FpdCBmaWdtYS52YXJpYWJsZXMuZ2V0VmFyaWFibGVCeUlkQXN5bmModmFySWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbFZhcmlhYmxlcy5wdXNoKHZhcmlhYmxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBudW1iZXJWYXJzID0gYWxsVmFyaWFibGVzLmZpbHRlcigodikgPT4gdi5yZXNvbHZlZFR5cGUgPT09ICdGTE9BVCcpO1xuICAgICAgICBjb25zdCBzYW5pdGl6ZWRWYXJpYWJsZXMgPSBBcnJheS5pc0FycmF5KG51bWJlclZhcnMpXG4gICAgICAgICAgICA/IG51bWJlclZhcnMubWFwKCh2KSA9PiAoe1xuICAgICAgICAgICAgICAgIGlkOiB2LmlkLFxuICAgICAgICAgICAgICAgIG5hbWU6IHYubmFtZSxcbiAgICAgICAgICAgICAgICBrZXk6IHYua2V5LFxuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICA6IFtdO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyLXZhcmlhYmxlcycsXG4gICAgICAgICAgICBkYXRhOiBzYW5pdGl6ZWRWYXJpYWJsZXMsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igc2VuZGluZyB2YXJpYWJsZXMgdG8gVUk6JywgZXJyb3IpO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyLXZhcmlhYmxlcycsXG4gICAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5zZW5kTnVtYmVyVmFyaWFibGVzVG9VSSA9IHNlbmROdW1iZXJWYXJpYWJsZXNUb1VJO1xuYXN5bmMgZnVuY3Rpb24gZ2V0T3JDcmVhdGVQYWRkaW5nQ29sbGVjdGlvbldpdGhNb2RlKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb25zID0gYXdhaXQgZmlnbWEudmFyaWFibGVzLmdldExvY2FsVmFyaWFibGVDb2xsZWN0aW9uc0FzeW5jKCk7XG4gICAgICAgIGxldCBjb2xsZWN0aW9uID0gY29sbGVjdGlvbnMuZmluZCgoYykgPT4gYy5uYW1lID09PSAnUGFkZGluZycpO1xuICAgICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBmaWdtYS52YXJpYWJsZXMuY3JlYXRlVmFyaWFibGVDb2xsZWN0aW9uKCdQYWRkaW5nJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjb2xsZWN0aW9uKVxuICAgICAgICAgICAgcmV0dXJuIHsgY29sbGVjdGlvbjogbnVsbCwgbW9kZUlkOiBudWxsIH07XG4gICAgICAgIGlmICghY29sbGVjdGlvbi5tb2RlcyB8fCBjb2xsZWN0aW9uLm1vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29sbGVjdGlvbi5hZGRNb2RlKCdCYXNlJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbW9kZUlkID0gY29sbGVjdGlvbi5tb2Rlc1swXS5tb2RlSWQ7XG4gICAgICAgIHJldHVybiB7IGNvbGxlY3Rpb24sIG1vZGVJZCB9O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZW5zdXJpbmcgUGFkZGluZyBjb2xsZWN0aW9uL21vZGU6JywgZXJyb3IpO1xuICAgICAgICByZXR1cm4geyBjb2xsZWN0aW9uOiBudWxsLCBtb2RlSWQ6IG51bGwgfTtcbiAgICB9XG59XG5leHBvcnRzLmdldE9yQ3JlYXRlUGFkZGluZ0NvbGxlY3Rpb25XaXRoTW9kZSA9IGdldE9yQ3JlYXRlUGFkZGluZ0NvbGxlY3Rpb25XaXRoTW9kZTtcbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU9yVXBkYXRlVmFyaWFibGVXaXRoQ29sbGVjdGlvbihjb2xsZWN0aW9uLCBtb2RlSWQsIG5hbWUsIHZhbHVlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IGV4aXN0aW5nID0gbnVsbDtcbiAgICAgICAgaWYgKGNvbGxlY3Rpb24udmFyaWFibGVJZHMgJiYgQXJyYXkuaXNBcnJheShjb2xsZWN0aW9uLnZhcmlhYmxlSWRzKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCB2YXJJZCBvZiBjb2xsZWN0aW9uLnZhcmlhYmxlSWRzKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IGF3YWl0IGZpZ21hLnZhcmlhYmxlcy5nZXRWYXJpYWJsZUJ5SWRBc3luYyh2YXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2ICYmIHYubmFtZSA9PT0gbmFtZSAmJiB2LnJlc29sdmVkVHlwZSA9PT0gJ0ZMT0FUJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmcgPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKF9hKSB7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZXhpc3Rpbmcuc2V0VmFsdWVGb3JNb2RlKG1vZGVJZCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBleGlzdGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHVwZGF0aW5nIHZhcmlhYmxlIHZhbHVlOicsIGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB2YXJpYWJsZSA9IGZpZ21hLnZhcmlhYmxlcy5jcmVhdGVWYXJpYWJsZShuYW1lLCBjb2xsZWN0aW9uLCAnRkxPQVQnKTtcbiAgICAgICAgICAgIHZhcmlhYmxlLnNldFZhbHVlRm9yTW9kZShtb2RlSWQsIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB2YXJpYWJsZTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIGNyZWF0aW5nIHZhcmlhYmxlOicsIGUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluIGNyZWF0ZU9yVXBkYXRlVmFyaWFibGVXaXRoQ29sbGVjdGlvbjonLCBlcnJvcik7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cbmV4cG9ydHMuY3JlYXRlT3JVcGRhdGVWYXJpYWJsZVdpdGhDb2xsZWN0aW9uID0gY3JlYXRlT3JVcGRhdGVWYXJpYWJsZVdpdGhDb2xsZWN0aW9uO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDaGVjayBpZiBtb2R1bGUgZXhpc3RzIChkZXZlbG9wbWVudCBvbmx5KVxuXHRpZiAoX193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0gPT09IHVuZGVmaW5lZCkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhdXRvbGF5b3V0XzEgPSByZXF1aXJlKFwiLi91dGlscy9hdXRvbGF5b3V0XCIpO1xuY29uc3QgdmFyaWFibGVzXzEgPSByZXF1aXJlKFwiLi91dGlscy92YXJpYWJsZXNcIik7XG5jb25zdCBwYWRkaW5nSGFuZGxlcnNfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZXJzL3BhZGRpbmdIYW5kbGVyc1wiKTtcbmNvbnN0IGZyYW1lSGFuZGxlcnNfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZXJzL2ZyYW1lSGFuZGxlcnNcIik7XG5jb25zdCBzZWxlY3Rpb25IYW5kbGVyc18xID0gcmVxdWlyZShcIi4vaGFuZGxlcnMvc2VsZWN0aW9uSGFuZGxlcnNcIik7XG5jb25zdCBjb2xvckhhbmRsZXJzXzEgPSByZXF1aXJlKFwiLi9oYW5kbGVycy9jb2xvckhhbmRsZXJzXCIpO1xuY29uc3QgbWNwSGFuZGxlcnNfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZXJzL21jcEhhbmRsZXJzXCIpO1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiA0MDAsIGhlaWdodDogNjYwIH0pO1xuYXN5bmMgZnVuY3Rpb24gbG9hZEFsbEZvbnRzRm9yVGV4dCh0ZXh0KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbWl4ZWQgPSBmaWdtYS5taXhlZDtcbiAgICAgICAgY29uc3QgY2hhcnMgPSB0ZXh0LmNoYXJhY3RlcnMgfHwgJyc7XG4gICAgICAgIGlmICh0ZXh0LmZvbnROYW1lICE9PSBtaXhlZCkge1xuICAgICAgICAgICAgYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyh0ZXh0LmZvbnROYW1lKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWVuID0gbmV3IFNldCgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gdGV4dC5nZXRSYW5nZUZvbnROYW1lKGksIGkgKyAxKTtcbiAgICAgICAgICAgICAgICBpZiAoZm4gJiYgZm4gIT09IG1peGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGAke2ZuLmZhbWlseX1fXyR7Zm4uc3R5bGV9YDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWVuLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWVuLmFkZChrZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyh7IGZhbWlseTogZm4uZmFtaWx5LCBzdHlsZTogZm4uc3R5bGUgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoX2EpIHsgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIGxvYWQgZm9udHMgZm9yIHRleHQgbm9kZScsIHRleHQuaWQsIGUpO1xuICAgIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIHJlY29tcHV0ZVRleHRMYXlvdXRPblBhZ2UoKSB7XG4gICAgY29uc3QgdGV4dHMgPSBmaWdtYS5jdXJyZW50UGFnZS5maW5kQWxsKChuKSA9PiBuLnR5cGUgPT09ICdURVhUJyk7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAndGV4dC1yZWNvbXB1dGUtc3RhcnQnLCB0b3RhbDogdGV4dHMubGVuZ3RoIH0pO1xuICAgIGxldCB1cGRhdGVkID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHQgPSB0ZXh0c1tpXTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGxvYWRBbGxGb250c0ZvclRleHQodCk7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gdC5jaGFyYWN0ZXJzO1xuICAgICAgICAgICAgdC5jaGFyYWN0ZXJzID0gY3VycmVudDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdC50ZXh0QXV0b1Jlc2l6ZSA9IHQudGV4dEF1dG9SZXNpemU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoX2EpIHsgfVxuICAgICAgICAgICAgdXBkYXRlZCsrO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAndGV4dC1yZWNvbXB1dGUtcHJvZ3Jlc3MnLCBkb25lOiB1cGRhdGVkLCB0b3RhbDogdGV4dHMubGVuZ3RoIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byByZWNvbXB1dGUgdGV4dCBsYXlvdXQgZm9yJywgdC5pZCwgZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAndGV4dC1yZWNvbXB1dGUtZW5kJywgZG9uZTogdXBkYXRlZCwgdG90YWw6IHRleHRzLmxlbmd0aCB9KTtcbiAgICByZXR1cm4gdXBkYXRlZDtcbn1cbmFzeW5jIGZ1bmN0aW9uIGZpbmRPcnBoYW5lZEluc3RhbmNlc09uUGFnZSgpIHtcbiAgICBjb25zdCBpbnN0YW5jZXMgPSBmaWdtYS5jdXJyZW50UGFnZS5maW5kQWxsKChuKSA9PiBuLnR5cGUgPT09ICdJTlNUQU5DRScpO1xuICAgIGNvbnN0IHRvdGFsID0gaW5zdGFuY2VzLmxlbmd0aDtcbiAgICBjb25zdCBvcnBoYW5zID0gW107XG4gICAgbGV0IGNoZWNrZWQgPSAwO1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ29ycGhhbi1zY2FuLXN0YXJ0JywgdG90YWwgfSk7XG4gICAgZm9yIChjb25zdCBpbnN0YW5jZSBvZiBpbnN0YW5jZXMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghaW5zdGFuY2UubWFpbkNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIG9ycGhhbnMucHVzaChpbnN0YW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKF9hKSB7XG4gICAgICAgICAgICBvcnBoYW5zLnB1c2goaW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgICAgIGNoZWNrZWQgKz0gMTtcbiAgICAgICAgaWYgKGNoZWNrZWQgPT09IHRvdGFsIHx8IGNoZWNrZWQgJSAyNSA9PT0gMCkge1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdvcnBoYW4tc2Nhbi1wcm9ncmVzcycsXG4gICAgICAgICAgICAgICAgY2hlY2tlZCxcbiAgICAgICAgICAgICAgICB0b3RhbCxcbiAgICAgICAgICAgICAgICBmb3VuZDogb3JwaGFucy5sZW5ndGgsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDApKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdvcnBoYW4tc2Nhbi1lbmQnLFxuICAgICAgICBjaGVja2VkLFxuICAgICAgICB0b3RhbCxcbiAgICAgICAgZm91bmQ6IG9ycGhhbnMubGVuZ3RoLFxuICAgIH0pO1xuICAgIGlmIChvcnBoYW5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gb3JwaGFucztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhvcnBoYW5zKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoX2IpIHsgfVxuICAgIH1cbiAgICByZXR1cm4geyBjaGVja2VkLCB0b3RhbCwgZm91bmQ6IG9ycGhhbnMubGVuZ3RoIH07XG59XG4oYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0ICgwLCB2YXJpYWJsZXNfMS5zZW5kTnVtYmVyVmFyaWFibGVzVG9VSSkoKTtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdwYWRkaW5nLWRhdGEnLCBkYXRhOiAoMCwgYXV0b2xheW91dF8xLmdldEFsbFBhZGRpbmdEYXRhKSgpIH0pO1xuICAgIGNvbnN0IGZyYW1lcyA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5maWx0ZXIoKG4pID0+IG4udHlwZSA9PT0gJ0ZSQU1FJyk7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnc2VsZWN0aW9uLWZyYW1lcycsIGNvdW50OiBmcmFtZXMubGVuZ3RoLCBoYXNGcmFtZXM6IGZyYW1lcy5sZW5ndGggPiAwIH0pO1xufSkoKTtcbmZpZ21hLm9uKCdzZWxlY3Rpb25jaGFuZ2UnLCAoKSA9PiB7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAncGFkZGluZy1kYXRhJywgZGF0YTogKDAsIGF1dG9sYXlvdXRfMS5nZXRBbGxQYWRkaW5nRGF0YSkoKSB9KTtcbiAgICBjb25zdCBmcmFtZXMgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24uZmlsdGVyKChuKSA9PiBuLnR5cGUgPT09ICdGUkFNRScpO1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ3NlbGVjdGlvbi1mcmFtZXMnLCBjb3VudDogZnJhbWVzLmxlbmd0aCwgaGFzRnJhbWVzOiBmcmFtZXMubGVuZ3RoID4gMCB9KTtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6ICdtY3Bfc2VsZWN0aW9uX2NoYW5nZWQnLFxuICAgICAgICAgICAgZGF0YTogeyBub2RlSWQ6IHNlbGVjdGlvblswXS5pZCB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogJ21jcF9zZWxlY3Rpb25fY2hhbmdlZCcsXG4gICAgICAgICAgICBkYXRhOiBudWxsXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuZmlnbWEudWkub25tZXNzYWdlID0gYXN5bmMgKG1zZykgPT4ge1xuICAgIGlmIChtc2cudHlwZSA9PT0gJ2FycmFuZ2UtZnJhbWVzJykge1xuICAgICAgICAoMCwgZnJhbWVIYW5kbGVyc18xLmhhbmRsZUFycmFuZ2VGcmFtZXMpKG1zZyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAnZ3JvdXAtc2VsZWN0ZWQtZnJhbWVzJykge1xuICAgICAgICAoMCwgZnJhbWVIYW5kbGVyc18xLmhhbmRsZUdyb3VwU2VsZWN0ZWRGcmFtZXMpKG1zZyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAncGFpci1zZWxlY3RlZC1mcmFtZXMnKSB7XG4gICAgICAgICgwLCBmcmFtZUhhbmRsZXJzXzEuaGFuZGxlUGFpclNlbGVjdGVkRnJhbWVzKShtc2cpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyZWF0ZS1wYWRkaW5nLXZhcmlhYmxlcycpIHtcbiAgICAgICAgYXdhaXQgKDAsIHBhZGRpbmdIYW5kbGVyc18xLmNyZWF0ZVBhZGRpbmdWYXJpYWJsZXMpKG1zZy5uYW1lUHJlZml4KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09ICdzZWxlY3QtYWxsLWF1dG9sYXlvdXQnKSB7XG4gICAgICAgICgwLCBzZWxlY3Rpb25IYW5kbGVyc18xLmhhbmRsZVNlbGVjdEFsbEF1dG9MYXlvdXQpKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAnZmluZC1kdXBsaWNhdGUtdG9wLWxldmVsLWZyYW1lcycpIHtcbiAgICAgICAgKDAsIGZyYW1lSGFuZGxlcnNfMS5oYW5kbGVGaW5kRHVwbGljYXRlVG9wTGV2ZWxGcmFtZXMpKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAnc2VsZWN0LW5leHQtYXV0b2xheW91dCcpIHtcbiAgICAgICAgKDAsIHNlbGVjdGlvbkhhbmRsZXJzXzEuaGFuZGxlU2VsZWN0TmV4dEF1dG9MYXlvdXQpKG1zZyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAnY2FuY2VsJykge1xuICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3pvb20tdG8tbm9kZScpIHtcbiAgICAgICAgYXdhaXQgKDAsIHNlbGVjdGlvbkhhbmRsZXJzXzEuaGFuZGxlWm9vbVRvTm9kZSkobXNnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09ICd1cGRhdGUtcGFkZGluZycpIHtcbiAgICAgICAgKDAsIHBhZGRpbmdIYW5kbGVyc18xLmhhbmRsZVVwZGF0ZVBhZGRpbmcpKG1zZyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAndXBkYXRlLWl0ZW0tc3BhY2luZycpIHtcbiAgICAgICAgKDAsIHBhZGRpbmdIYW5kbGVyc18xLmhhbmRsZVVwZGF0ZUl0ZW1TcGFjaW5nKShtc2cpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3JlbmFtZS1ub2RlJykge1xuICAgICAgICAoMCwgc2VsZWN0aW9uSGFuZGxlcnNfMS5oYW5kbGVSZW5hbWVOb2RlKShtc2cpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2J1bGstYXBwbHktZGVwdGgtc3BhY2luZycpIHtcbiAgICAgICAgKDAsIHBhZGRpbmdIYW5kbGVyc18xLmhhbmRsZUJ1bGtBcHBseURlcHRoU3BhY2luZykoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09ICdhcHBseS1yYW5kb20tcGFkZGluZ3MnKSB7XG4gICAgICAgICgwLCBwYWRkaW5nSGFuZGxlcnNfMS5oYW5kbGVBcHBseVJhbmRvbVBhZGRpbmdzKShtc2cpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2NvbnZlcnQtY29sb3JzLXRvLXZhcmlhYmxlcycpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0ICgwLCBjb2xvckhhbmRsZXJzXzEuaGFuZGxlQ29udmVydENvbG9yc1RvVmFyaWFibGVzKSgpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjb252ZXJ0aW5nIGNvbG9ycyB0byB2YXJpYWJsZXM6JywgZSk7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoJ0Vycm9yIGNvbnZlcnRpbmcgY29sb3JzIHRvIHZhcmlhYmxlcycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAnY3JlYXRlLWNvbG9yLWNvbGxlY3Rpb24tZnJvbS1zZWxlY3Rpb24nKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCAoMCwgY29sb3JIYW5kbGVyc18xLmhhbmRsZUNyZWF0ZUNvbG9yQ29sbGVjdGlvbkZyb21TZWxlY3Rpb24pKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNyZWF0aW5nIGNvbG9yIGNvbGxlY3Rpb24gZnJvbSBzZWxlY3Rpb246JywgZSk7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoJ0Vycm9yIGNyZWF0aW5nIGNvbG9yIGNvbGxlY3Rpb24gZnJvbSBzZWxlY3Rpb24nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyZWF0ZS1hbGwtY29sb3ItdmFyaWFibGVzLWluLWNvbGxlY3Rpb24nKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCAoMCwgY29sb3JIYW5kbGVyc18xLmhhbmRsZUNyZWF0ZUFsbENvbG9yVmFyaWFibGVzKSgpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjcmVhdGluZyB2YXJpYWJsZXMgZm9yIGFsbCBjb2xvcnMgaW4gc2VsZWN0aW9uOicsIGUpO1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KCdFcnJvciBjcmVhdGluZyB2YXJpYWJsZXMgZm9yIGFsbCBjb2xvcnMgaW4gc2VsZWN0aW9uJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09ICdhbGlhcy1sb2NhbC10by1pbXBvcnRlZC1ieS1uYW1lJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgKDAsIGNvbG9ySGFuZGxlcnNfMS5oYW5kbGVBbGlhc0xvY2FsVG9JbXBvcnRlZEJ5TmFtZSkoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgYWxpYXNpbmcgdmFyaWFibGVzOicsIGUpO1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KCdFcnJvciBhbGlhc2luZyB2YXJpYWJsZXMnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2ZpbmQtb3JwaGFuZWQtaW5zdGFuY2VzJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZmluZE9ycGhhbmVkSW5zdGFuY2VzT25QYWdlKCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0LmZvdW5kID4gMCkge1xuICAgICAgICAgICAgICAgIGZpZ21hLm5vdGlmeShgQ2hlY2tlZCAke3Jlc3VsdC5jaGVja2VkfSBpbnN0YW5jZXMgYW5kIGZvdW5kICR7cmVzdWx0LmZvdW5kfSBvcnBoYW5lZCBpbnN0YW5jZXMgb24gdGhpcyBwYWdlYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaWdtYS5ub3RpZnkoYENoZWNrZWQgJHtyZXN1bHQuY2hlY2tlZH0gaW5zdGFuY2VzLiBObyBvcnBoYW5lZCBpbnN0YW5jZXMgZm91bmQgb24gdGhpcyBwYWdlYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZpbmRpbmcgb3JwaGFuZWQgaW5zdGFuY2VzOicsIGUpO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnb3JwaGFuLXNjYW4tZW5kJywgY2hlY2tlZDogMCwgdG90YWw6IDAsIGZvdW5kOiAwIH0pO1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KCdFcnJvciBmaW5kaW5nIG9ycGhhbmVkIGluc3RhbmNlcycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAncmVjb21wdXRlLXRleHQtbGF5b3V0Jykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY291bnQgPSBhd2FpdCByZWNvbXB1dGVUZXh0TGF5b3V0T25QYWdlKCk7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoYFJlY29tcHV0ZWQgdGV4dCBsYXlvdXQgZm9yICR7Y291bnR9IHRleHQgbGF5ZXJzYCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHJlY29tcHV0aW5nIHRleHQgbGF5b3V0OicsIGUpO1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KCdFcnJvciByZWNvbXB1dGluZyB0ZXh0IGxheW91dCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAnbWNwX25vZGVfb3BlcmF0aW9uJykge1xuICAgICAgICBhd2FpdCAoMCwgbWNwSGFuZGxlcnNfMS5oYW5kbGVNY3BOb2RlT3BlcmF0aW9uKShtc2cpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ21jcF9jb21wb25lbnRfc2VhcmNoJykge1xuICAgICAgICBhd2FpdCAoMCwgbWNwSGFuZGxlcnNfMS5oYW5kbGVNY3BDb21wb25lbnRTZWFyY2gpKG1zZyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSAnbWNwX2dldF9zZWxlY3Rpb24nKSB7XG4gICAgICAgICgwLCBtY3BIYW5kbGVyc18xLmhhbmRsZU1jcEdldFNlbGVjdGlvbikobXNnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09ICdtY3BfZ2V0X2N1cnJlbnRfc2VsZWN0aW9uJykge1xuICAgICAgICAoMCwgbWNwSGFuZGxlcnNfMS5oYW5kbGVNY3BHZXRDdXJyZW50U2VsZWN0aW9uKSgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxufTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=