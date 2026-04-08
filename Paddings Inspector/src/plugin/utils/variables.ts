// Send number variable list to UI
export async function sendNumberVariablesToUI() {
  try {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const allVariables: Variable[] = [];

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
  } catch (error) {
    console.error('Error sending variables to UI:', error);
    figma.ui.postMessage({
      type: 'number-variables',
      data: [],
    });
  }
}

// Ensure Padding collection exists and return it with a safe modeId
export async function getOrCreatePaddingCollectionWithMode(): Promise<{
  collection: VariableCollection | null;
  modeId: string | null;
}> {
  try {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    let collection = collections.find((c) => c.name === 'Padding');
    if (!collection) {
      collection = figma.variables.createVariableCollection('Padding');
    }
    if (!collection) return { collection: null, modeId: null };

    if (!collection.modes || collection.modes.length === 0) {
      collection.addMode('Base');
    }
    const modeId = collection.modes[0].modeId;
    return { collection, modeId };
  } catch (error) {
    console.error('Error ensuring Padding collection/mode:', error);
    return { collection: null, modeId: null };
  }
}

// Create or update variable within a known collection/mode
export async function createOrUpdateVariableWithCollection(
  collection: VariableCollection,
  modeId: string,
  name: string,
  value: number
): Promise<Variable | null> {
  try {
    let existing: Variable | null = null;
    if (collection.variableIds && Array.isArray(collection.variableIds)) {
      for (const varId of collection.variableIds) {
        try {
          const v = await figma.variables.getVariableByIdAsync(varId);
          if (v && v.name === name && v.resolvedType === 'FLOAT') {
            existing = v;
            break;
          }
        } catch {}
      }
    }

    if (existing) {
      try {
        existing.setValueForMode(modeId, value);
        return existing;
      } catch (e) {
        console.error('Failed updating variable value:', e);
        return null;
      }
    }

    try {
      const variable = figma.variables.createVariable(name, collection, 'FLOAT');
      variable.setValueForMode(modeId, value);
      return variable;
    } catch (e) {
      console.error('Failed creating variable:', e);
      return null;
    }
  } catch (error) {
    console.error('Error in createOrUpdateVariableWithCollection:', error);
    return null;
  }
}

