import { getOrCreateColorCollectionWithMode, createOrUpdateColorVariableWithCollection } from '../color-utils';
import { createAllColorVariablesFromSelection } from '../color-variable-generator';

// Convert colors to variables (bind existing variables)
export async function handleConvertColorsToVariables() {
  const selection = figma.currentPage.selection as ReadonlyArray<SceneNode>;
  if (!selection || selection.length === 0) {
    figma.notify('Select at least one frame or node to process colors.');
    return;
  }

  const ensured = await getOrCreateColorCollectionWithMode();
  const collection = ensured.collection;
  const modeId = ensured.modeId;
  if (!collection || !modeId) {
    figma.notify('Failed to prepare Colors variable collection');
    return;
  }
  const colorCollection = collection as VariableCollection;
  const colorModeId = modeId as string;

  let nodesUpdated = 0;

  const toHex = (c: number) => {
    const n = Math.max(0, Math.min(255, Math.round(c * 255)));
    return n.toString(16).padStart(2, '0');
  };
  const rgbaKey = (rgba: RGBA) => {
    return `${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}${toHex(rgba.a)}`.toUpperCase();
  };

  async function findExistingColorVarForRGBA(rgba: RGBA): Promise<Variable | null> {
    try {
      const keyTarget = rgbaKey(rgba);
      if (colorCollection.variableIds && Array.isArray(colorCollection.variableIds)) {
        for (const varId of colorCollection.variableIds) {
          try {
            const v = await figma.variables.getVariableByIdAsync(varId);
            if (v && v.resolvedType === 'COLOR') {
              const current = (v as any).valuesByMode && (v as any).valuesByMode[colorModeId];
              if (current && typeof current === 'object' && 'r' in current) {
                const key = rgbaKey(current as RGBA);
                if (key === keyTarget) return v;
              }
            }
          } catch {}
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  async function processNodePaints(node: SceneNode) {
    let updated = false;

    if ('fills' in node && Array.isArray((node as any).fills)) {
      const fills = ((node as any).fills as ReadonlyArray<Paint>) || [];
      const newFills: Paint[] = [];
      for (const paint of fills) {
        if (!paint) {
          newFills.push(paint as any);
          continue;
        }
        if (paint.type === 'SOLID') {
          const alreadyBound = Boolean(paint.boundVariables && (paint.boundVariables as any).color);
          if (!alreadyBound) {
            newFills.push(paint);
          } else {
            newFills.push(paint);
          }
        } else if (
          paint.type === 'GRADIENT_LINEAR' ||
          paint.type === 'GRADIENT_RADIAL' ||
          paint.type === 'GRADIENT_ANGULAR' ||
          paint.type === 'GRADIENT_DIAMOND'
        ) {
          const stops = paint.gradientStops || [];
          let changedStops = false;
          const newStops = stops.map((stop) => {
            if (!stop.boundVariables || !(stop.boundVariables as any).color) {
              changedStops = true;
              return {
                position: stop.position,
                color: stop.color,
                boundVariables: {
                  color: { type: 'VARIABLE_ALIAS', id: '' as any },
                },
              } as ColorStop;
            }
            return stop;
          });
          if (changedStops) {
            updated = true;
            const newPaint: GradientPaint = {
              type: paint.type,
              gradientTransform: paint.gradientTransform,
              gradientStops: newStops,
              opacity: paint.opacity,
              visible: paint.visible,
              blendMode: paint.blendMode,
            } as GradientPaint;
            newFills.push(newPaint);
          } else {
            newFills.push(paint);
          }
        } else {
          newFills.push(paint);
        }
      }

      for (let i = 0; i < newFills.length; i++) {
        const paint = newFills[i];
        if (paint && paint.type === 'SOLID') {
          const original = fills[i] as SolidPaint;
          const a = typeof original.opacity === 'number' ? original.opacity : 1;
          const rgba: RGBA = { r: original.color.r, g: original.color.g, b: original.color.b, a };
          const alreadyBound = Boolean(original.boundVariables && (original.boundVariables as any).color);
          if (!alreadyBound) {
            try {
              const variable = await findExistingColorVarForRGBA(rgba);
              if (variable) {
                const bound = figma.variables.setBoundVariableForPaint(original, 'color', variable);
                newFills[i] = bound;
                updated = true;
              } else {
                newFills[i] = paint;
              }
            } catch (e) {
              newFills[i] = paint;
            }
          }
        }
        if (
          paint &&
          (paint.type === 'GRADIENT_LINEAR' ||
            paint.type === 'GRADIENT_RADIAL' ||
            paint.type === 'GRADIENT_ANGULAR' ||
            paint.type === 'GRADIENT_DIAMOND')
        ) {
          const gp = paint as GradientPaint;
          const stops = gp.gradientStops || [];
          const rebuiltStops: ColorStop[] = [];
          for (const stop of stops) {
            const rgba: RGBA = stop.color;
            if (!stop.boundVariables || !(stop.boundVariables as any).color) {
              try {
                const variable = await findExistingColorVarForRGBA(rgba);
                if (variable) {
                  rebuiltStops.push({
                    position: stop.position,
                    color: stop.color,
                    boundVariables: { color: { type: 'VARIABLE_ALIAS', id: variable.id } },
                  });
                } else {
                  rebuiltStops.push(stop);
                }
              } catch (e) {
                rebuiltStops.push(stop);
              }
            } else {
              rebuiltStops.push(stop);
            }
          }
          if (rebuiltStops.length === stops.length && rebuiltStops.some((s, idx) => s !== stops[idx])) {
            updated = true;
            const rebuilt: GradientPaint = {
              type: gp.type,
              gradientTransform: gp.gradientTransform,
              gradientStops: rebuiltStops,
              opacity: gp.opacity,
              visible: gp.visible,
              blendMode: gp.blendMode,
            } as GradientPaint;
            newFills[i] = rebuilt;
          }
        }
      }
      try {
        (node as any).fills = newFills as ReadonlyArray<Paint>;
      } catch {}
      if (updated) nodesUpdated++;
    }

    if ('strokes' in node && Array.isArray((node as any).strokes)) {
      const strokes = ((node as any).strokes as ReadonlyArray<Paint>) || [];
      const newStrokes: Paint[] = [];
      let updatedStrokes = false;
      for (let i = 0; i < strokes.length; i++) {
        const paint = strokes[i];
        if (!paint) {
          newStrokes.push(paint as any);
          continue;
        }
        if (paint.type === 'SOLID') {
          const a = typeof paint.opacity === 'number' ? paint.opacity : 1;
          const rgba: RGBA = { r: paint.color.r, g: paint.color.g, b: paint.color.b, a };
          const alreadyBound = Boolean(paint.boundVariables && (paint.boundVariables as any).color);
          if (!alreadyBound) {
            try {
              const variable = await findExistingColorVarForRGBA(rgba);
              if (variable) {
                const bound = figma.variables.setBoundVariableForPaint(paint, 'color', variable);
                newStrokes[i] = bound;
                updatedStrokes = true;
              } else {
                newStrokes[i] = paint;
              }
            } catch (e) {
              newStrokes[i] = paint;
            }
          } else {
            newStrokes[i] = paint;
          }
        } else {
          newStrokes[i] = paint;
        }
      }
      try {
        (node as any).strokes = newStrokes as ReadonlyArray<Paint>;
      } catch {}
      if (updatedStrokes) nodesUpdated++;
    }
  }

  const walk = async (node: SceneNode) => {
    await processNodePaints(node);
    if ('children' in node && Array.isArray((node as any).children)) {
      for (const child of (node as any).children as ReadonlyArray<SceneNode>) {
        await walk(child);
      }
    }
  };

  for (const root of selection) await walk(root);

  figma.notify(`Updated ${nodesUpdated} nodes by binding existing color variables where available`);
}

// Create color collection from selection
export async function handleCreateColorCollectionFromSelection() {
  const selection = figma.currentPage.selection as ReadonlyArray<SceneNode>;
  if (!selection || selection.length === 0) {
    figma.notify('Select at least one node to create a color collection.');
    return;
  }

  const colorMap = new Map<string, RGBA>();

  const addRGBA = (rgba: RGBA) => {
    const key = `${Math.max(0, Math.min(255, Math.round(rgba.r * 255)))
      .toString(16)
      .padStart(2, '0')}${Math.max(0, Math.min(255, Math.round(rgba.g * 255)))
      .toString(16)
      .padStart(2, '0')}${Math.max(0, Math.min(255, Math.round(rgba.b * 255)))
      .toString(16)
      .padStart(2, '0')}${Math.max(0, Math.min(255, Math.round((typeof rgba.a === 'number' ? rgba.a : 1) * 255)))
      .toString(16)
      .padStart(2, '0')}`.toUpperCase();
    if (!colorMap.has(key)) colorMap.set(key, { r: rgba.r, g: rgba.g, b: rgba.b, a: typeof rgba.a === 'number' ? rgba.a : 1 });
  };

  const processPaint = (paint: Paint) => {
    if (!paint) return;
    if (paint.type === 'SOLID') {
      const a = typeof paint.opacity === 'number' ? paint.opacity : 1;
      addRGBA({ r: paint.color.r, g: paint.color.g, b: paint.color.b, a });
    } else if (
      paint.type === 'GRADIENT_LINEAR' ||
      paint.type === 'GRADIENT_RADIAL' ||
      paint.type === 'GRADIENT_ANGULAR' ||
      paint.type === 'GRADIENT_DIAMOND'
    ) {
      const stops = paint.gradientStops || [];
      for (const stop of stops) {
        addRGBA(stop.color);
      }
    }
  };

  const processNode = (node: SceneNode) => {
    const hasFillStyle = 'fillStyleId' in node && Boolean((node as any).fillStyleId);
    const hasStrokeStyle = 'strokeStyleId' in node && Boolean((node as any).strokeStyleId);

    if ('fills' in node && Array.isArray((node as any).fills)) {
      const fills = ((node as any).fills as ReadonlyArray<Paint>) || [];
      for (const paint of fills) {
        const bound = Boolean(paint && (paint as any).boundVariables && ((paint as any).boundVariables as any).color);
        if (bound || hasFillStyle) processPaint(paint);
      }
    }

    if ('strokes' in node && Array.isArray((node as any).strokes)) {
      const strokes = ((node as any).strokes as ReadonlyArray<Paint>) || [];
      for (const paint of strokes) {
        const bound = Boolean(paint && (paint as any).boundVariables && ((paint as any).boundVariables as any).color);
        if (bound || hasStrokeStyle) processPaint(paint);
      }
    }

    if (hasFillStyle) {
      try {
        const style = figma.getStyleById((node as any).fillStyleId) as PaintStyle;
        if (style && Array.isArray(style.paints)) {
          for (const p of style.paints) processPaint(p as Paint);
        }
      } catch {}
    }
    if (hasStrokeStyle) {
      try {
        const style = figma.getStyleById((node as any).strokeStyleId) as PaintStyle;
        if (style && Array.isArray(style.paints)) {
          for (const p of style.paints) processPaint(p as Paint);
        }
      } catch {}
    }

    if ('children' in node && Array.isArray((node as any).children)) {
      for (const child of (node as any).children as ReadonlyArray<SceneNode>) {
        processNode(child);
      }
    }
  };

  for (const root of selection) processNode(root);

  if (colorMap.size === 0) {
    figma.notify('No styled or variable-bound colors found in selection.');
    return;
  }

  let collection: VariableCollection | null = null;
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
  } catch (e) {
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
  const newVarMap = new Map<string, Variable>();
  const toHex = (c: number) => {
    const n = Math.max(0, Math.min(255, Math.round(c * 255)));
    return n.toString(16).padStart(2, '0');
  };
  const rgbaKey = (rgba: RGBA) => `${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}${toHex(rgba.a)}`.toUpperCase();

  for (const [key, rgba] of colorMap.entries()) {
    const name = `color-${key}`;
    const v = await createOrUpdateColorVariableWithCollection(collection, modeId, name, rgba);
    if (v) {
      created++;
      newVarMap.set(key, v);
    }
  }

  let reassigned = 0;
  const reassignNode = (node: SceneNode) => {
    if ('fills' in node && Array.isArray((node as any).fills)) {
      const fills = ((node as any).fills as ReadonlyArray<Paint>) || [];
      const newFills: Paint[] = [];
      for (const paint of fills) {
        if (!paint) {
          newFills.push(paint as any);
          continue;
        }
        if (paint.type === 'SOLID') {
          const bound = Boolean(paint.boundVariables && (paint.boundVariables as any).color);
          if (bound) {
            const a = typeof paint.opacity === 'number' ? paint.opacity : 1;
            const rgba: RGBA = { r: paint.color.r, g: paint.color.g, b: paint.color.b, a };
            const key = rgbaKey(rgba);
            const target = newVarMap.get(key);
            if (target) {
              try {
                const updated = figma.variables.setBoundVariableForPaint(paint, 'color', target);
                newFills.push(updated);
                reassigned++;
                continue;
              } catch {}
            }
          }
          newFills.push(paint);
        } else if (
          paint.type === 'GRADIENT_LINEAR' ||
          paint.type === 'GRADIENT_RADIAL' ||
          paint.type === 'GRADIENT_ANGULAR' ||
          paint.type === 'GRADIENT_DIAMOND'
        ) {
          const gp = paint as GradientPaint;
          const stops = gp.gradientStops || [];
          const rebuilt: ColorStop[] = [];
          let changed = false;
          for (const stop of stops) {
            const bound = Boolean(stop.boundVariables && (stop.boundVariables as any).color);
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
              } else {
                rebuilt.push(stop);
              }
            } else {
              rebuilt.push(stop);
            }
          }
          if (changed) {
            const newPaint: GradientPaint = {
              type: gp.type,
              gradientTransform: gp.gradientTransform,
              gradientStops: rebuilt,
              opacity: gp.opacity,
              visible: gp.visible,
              blendMode: gp.blendMode,
            } as GradientPaint;
            newFills.push(newPaint);
          } else {
            newFills.push(paint);
          }
        } else {
          newFills.push(paint);
        }
      }
      try {
        (node as any).fills = newFills as ReadonlyArray<Paint>;
      } catch {}
    }

    if ('strokes' in node && Array.isArray((node as any).strokes)) {
      const strokes = ((node as any).strokes as ReadonlyArray<Paint>) || [];
      const newStrokes: Paint[] = [];
      for (const paint of strokes) {
        if (!paint) {
          newStrokes.push(paint as any);
          continue;
        }
        if (paint.type === 'SOLID') {
          const bound = Boolean(paint.boundVariables && (paint.boundVariables as any).color);
          if (bound) {
            const a = typeof paint.opacity === 'number' ? paint.opacity : 1;
            const rgba: RGBA = { r: paint.color.r, g: paint.color.g, b: paint.color.b, a };
            const key = rgbaKey(rgba);
            const target = newVarMap.get(key);
            if (target) {
              try {
                const updated = figma.variables.setBoundVariableForPaint(paint, 'color', target);
                newStrokes.push(updated);
                reassigned++;
                continue;
              } catch {}
            }
          }
          newStrokes.push(paint);
        } else {
          newStrokes.push(paint);
        }
      }
      try {
        (node as any).strokes = newStrokes as ReadonlyArray<Paint>;
      } catch {}
    }

    if ('children' in node && Array.isArray((node as any).children)) {
      for (const child of (node as any).children as ReadonlyArray<SceneNode>) {
        reassignNode(child);
      }
    }
  };

  for (const root of selection) reassignNode(root);

  figma.notify(`Created ${created} vars and reassigned ${reassigned} bindings to the new collection.`);
}

// Create all color variables from selection
export async function handleCreateAllColorVariables() {
  await createAllColorVariablesFromSelection();
}

// Alias local variables to imported by name
export async function handleAliasLocalToImportedByName() {
  try {
    const localVars = await figma.variables.getLocalVariablesAsync();
    console.log('[Plugin] Local variables:', localVars.length);
    const remoteByName = new Map<string, Variable>();

    const addById = async (id: string | null | undefined) => {
      if (!id) return;
      try {
        const v = await figma.variables.getVariableByIdAsync(id);
        if (v && v.remote && !remoteByName.has(v.name)) remoteByName.set(v.name, v);
      } catch {}
    };

    figma.currentPage.findAll((node) => {
      const anyNode = node as any;
      try {
        const b = anyNode.boundVariables;
        if (b && typeof b === 'object') {
          for (const k of Object.keys(b)) {
            const entry = (b as any)[k];
            if (!entry) continue;
            if (Array.isArray(entry)) {
              for (const a of entry) addById((a as any)?.id);
            } else {
              addById((entry as any)?.id);
            }
          }
        }
        const paintFields = ['fills', 'strokes', 'effects'];
        for (const field of paintFields) {
          const arr = (anyNode as any)[field];
          if (Array.isArray(arr)) {
            for (const paint of arr) {
              const bv = (paint as any)?.boundVariables;
              const colorAliasId = bv?.color?.id;
              if (colorAliasId) addById(colorAliasId);
            }
          }
        }
      } catch {}
      return false;
    });

    console.log('[Plugin] Imported variables discovered by name:', remoteByName.size);

    const toHex = (c: number) => Math.max(0, Math.min(255, Math.round(c * 255))).toString(16).padStart(2, '0');
    const valueKey = (val: any): string | null => {
      if (typeof val === 'number') return `N:${val}`;
      if (typeof val === 'string') return `S:${val}`;
      if (val && typeof val === 'object' && 'r' in val && 'g' in val && 'b' in val && 'a' in val) {
        return `C:${toHex(val.r)}${toHex(val.g)}${toHex(val.b)}${toHex(val.a)}`;
      }
      return null;
    };
    const firstValueKey = (variable: Variable): string | null => {
      try {
        const vals = (variable as any).valuesByMode as { [modeId: string]: any };
        if (!vals) return null;
        for (const k of Object.keys(vals)) {
          const key = valueKey(vals[k]);
          if (key) return key;
        }
        return null;
      } catch {
        return null;
      }
    };

    let updated = 0;
    const matched: string[] = [];
    const skippedMismatch: string[] = [];
    for (const v of localVars) {
      const remote = remoteByName.get(v.name);
      if (!remote || remote.resolvedType !== v.resolvedType) continue;
      const localKey = firstValueKey(v);
      const remoteKey = firstValueKey(remote);
      if (!localKey || !remoteKey || localKey !== remoteKey) {
        skippedMismatch.push(v.name);
        continue;
      }
      const collection = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
      if (!collection) continue;
      for (const mode of collection.modes) {
        try {
          v.setValueForMode(mode.modeId, { type: 'VARIABLE_ALIAS', id: remote.id } as any);
          updated++;
        } catch {}
      }
      matched.push(v.name);
    }

    console.log('[Plugin] Aliased variables (name+value match):', matched);
    if (skippedMismatch.length) console.log('[Plugin] Skipped due to value mismatch:', skippedMismatch);
    figma.notify(
      updated > 0
        ? `Aliased ${updated} local variable values to imported variables by name and value`
        : 'No matching imported variables (name+value) found'
    );
  } catch (e) {
    console.error('Alias locals to imported error:', e);
    figma.notify('Error aliasing variables');
  }
}
