export async function getOrCreateColorCollectionWithMode(name: string = "Colors"): Promise<{ collection: VariableCollection | null; modeId: string | null }> {
  try {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const lastId = await figma.clientStorage.getAsync('lastColorCollectionId');
    let collection: VariableCollection | null = null;
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
    if (!collection) return { collection: null, modeId: null };
    if (!collection.modes || collection.modes.length === 0) {
      collection.addMode('Base');
    }
    const modeId = collection.modes[0].modeId;
    return { collection, modeId };
  } catch (error) {
    console.error('Error ensuring Color collection/mode:', error);
    return { collection: null, modeId: null };
  }
}

export async function createOrUpdateColorVariableWithCollection(
  collection: VariableCollection,
  modeId: string,
  name: string,
  value: RGBA
): Promise<Variable | null> {
  try {
    // Try to find existing by value or name
    let existing: Variable | null = null;
    if (collection.variableIds && Array.isArray(collection.variableIds)) {
      for (const varId of collection.variableIds) {
        try {
          const v = await figma.variables.getVariableByIdAsync(varId);
          if (v && v.name === name && v.resolvedType === 'COLOR') {
            existing = v;
            break;
          }
          if (!existing && v && v.resolvedType === 'COLOR') {
            const current = (v as any).valuesByMode && (v as any).valuesByMode[modeId];
            if (current && typeof current === 'object' && 'r' in current && 'g' in current && 'b' in current) {
              const toHex = (c: number) => {
                const n = Math.max(0, Math.min(255, Math.round(c * 255)));
                return n.toString(16).padStart(2, '0');
              };
              const keyA = `${toHex((current as RGBA).r)}${toHex((current as RGBA).g)}${toHex((current as RGBA).b)}${toHex((current as RGBA).a ?? 1)}`.toUpperCase();
              const keyB = `${toHex(value.r)}${toHex(value.g)}${toHex(value.b)}${toHex(value.a ?? 1)}`.toUpperCase();
              if (keyA === keyB) {
                existing = v;
                break;
              }
            }
          }
        } catch {}
      }
    }

    if (existing) {
      try {
        existing.setValueForMode(modeId, value);
        return existing;
      } catch (e) {
        console.error('Failed updating color variable value:', e);
        return null;
      }
    }

    // Create fresh
    try {
      const variable = figma.variables.createVariable(name, collection, 'COLOR');
      variable.setValueForMode(modeId, value);
      return variable;
    } catch (e) {
      console.error('Failed creating color variable:', e);
      return null;
    }
  } catch (error) {
    console.error('Error in createOrUpdateColorVariableWithCollection:', error);
    return null;
  }
}
