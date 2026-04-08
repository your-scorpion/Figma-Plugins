import {
  getOrCreateColorCollectionWithMode,
  createOrUpdateColorVariableWithCollection,
} from "./color-utils";

export async function createAllColorVariablesFromSelection(): Promise<void> {
  const selection = figma.currentPage.selection as ReadonlyArray<SceneNode>;
  if (!selection || selection.length === 0) {
    figma.notify("Select at least one node to parse all colors.");
    return;
  }

  const toHex = (c: number) => {
    const n = Math.max(0, Math.min(255, Math.round(c * 255)));
    return n.toString(16).padStart(2, "0");
  };
  const rgbaKey = (rgba: RGBA) =>
    `${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}${toHex(
      rgba.a ?? 1
    )}`.toUpperCase();

  const colorSet = new Map<string, RGBA>();

  const addRGBA = (rgba: RGBA) => {
    const key = rgbaKey(rgba);
    if (!colorSet.has(key)) colorSet.set(key, rgba);
  };

  const processPaint = (paint: Paint) => {
    if (!paint) return;
    if (paint.type === "SOLID") {
      const a = typeof paint.opacity === "number" ? paint.opacity : 1;
      addRGBA({ r: paint.color.r, g: paint.color.g, b: paint.color.b, a });
    } else if (
      paint.type === "GRADIENT_LINEAR" ||
      paint.type === "GRADIENT_RADIAL" ||
      paint.type === "GRADIENT_ANGULAR" ||
      paint.type === "GRADIENT_DIAMOND"
    ) {
      const stops = paint.gradientStops || [];
      for (const stop of stops) addRGBA(stop.color);
    }
  };

  const walk = (node: SceneNode) => {
    if ("fills" in node && Array.isArray((node as any).fills)) {
      const fills = ((node as any).fills as ReadonlyArray<Paint>) || [];
      for (const p of fills) processPaint(p);
    }
    if ("strokes" in node && Array.isArray((node as any).strokes)) {
      const strokes = ((node as any).strokes as ReadonlyArray<Paint>) || [];
      for (const p of strokes) processPaint(p);
    }
    if ("children" in node && Array.isArray((node as any).children)) {
      for (const child of (node as any).children as ReadonlyArray<SceneNode>)
        walk(child);
    }
  };

  for (const root of selection) walk(root);

  const ensured = await getOrCreateColorCollectionWithMode();
  const collection = ensured.collection;
  const modeId = ensured.modeId;
  if (!collection || !modeId) {
    figma.notify("Failed to prepare target color collection.");
    return;
  }

  let created = 0;
  const newVarMap = new Map<string, Variable>();
  for (const [key, rgba] of colorSet.entries()) {
    const name = `color-${key}`;
    const v = await createOrUpdateColorVariableWithCollection(
      collection,
      modeId,
      name,
      rgba
    );
    if (v) {
      created++;
      newVarMap.set(key, v);
    }
  }

  let nodesUpdated = 0;
  const bindNode = (node: SceneNode) => {
    if ("fills" in node && Array.isArray((node as any).fills)) {
      const fills = ((node as any).fills as ReadonlyArray<Paint>) || [];
      const newFills: Paint[] = [];
      for (let i = 0; i < fills.length; i++) {
        const paint = fills[i];
        if (!paint) {
          newFills.push(paint as any);
          continue;
        }
        if (paint.type === "SOLID") {
          const alreadyBound = Boolean(
            paint.boundVariables && (paint.boundVariables as any).color
          );
          if (!alreadyBound) {
            const a = typeof paint.opacity === "number" ? paint.opacity : 1;
            const rgba: RGBA = {
              r: paint.color.r,
              g: paint.color.g,
              b: paint.color.b,
              a,
            };
            const key = rgbaKey(rgba);
            const variable = newVarMap.get(key);
            if (variable) {
              try {
                const bound = figma.variables.setBoundVariableForPaint(
                  paint,
                  "color",
                  variable
                );
                newFills.push(bound);
                nodesUpdated++;
                continue;
              } catch {}
            }
          }
          newFills.push(paint);
        } else if (
          paint.type === "GRADIENT_LINEAR" ||
          paint.type === "GRADIENT_RADIAL" ||
          paint.type === "GRADIENT_ANGULAR" ||
          paint.type === "GRADIENT_DIAMOND"
        ) {
          const gp = paint as GradientPaint;
          const stops = gp.gradientStops || [];
          const rebuilt: ColorStop[] = [];
          let changed = false;
          for (const stop of stops) {
            const bound = Boolean(
              stop.boundVariables && (stop.boundVariables as any).color
            );
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
            nodesUpdated++;
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

    if ("strokes" in node && Array.isArray((node as any).strokes)) {
      const strokes = ((node as any).strokes as ReadonlyArray<Paint>) || [];
      const newStrokes: Paint[] = [];
      for (let i = 0; i < strokes.length; i++) {
        const paint = strokes[i];
        if (!paint) {
          newStrokes.push(paint as any);
          continue;
        }
        if (paint.type === "SOLID") {
          const alreadyBound = Boolean(
            paint.boundVariables && (paint.boundVariables as any).color
          );
          if (!alreadyBound) {
            const a = typeof paint.opacity === "number" ? paint.opacity : 1;
            const rgba: RGBA = {
              r: paint.color.r,
              g: paint.color.g,
              b: paint.color.b,
              a,
            };
            const key = rgbaKey(rgba);
            const variable = newVarMap.get(key);
            if (variable) {
              try {
                const bound = figma.variables.setBoundVariableForPaint(
                  paint,
                  "color",
                  variable
                );
                newStrokes.push(bound);
                nodesUpdated++;
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

    if ("children" in node && Array.isArray((node as any).children)) {
      for (const child of (node as any).children as ReadonlyArray<SceneNode>)
        bindNode(child);
    }
  };

  for (const root of selection) bindNode(root);

  figma.notify(
    `Created ${created} color variables and updated ${nodesUpdated} nodes.`
  );
}
