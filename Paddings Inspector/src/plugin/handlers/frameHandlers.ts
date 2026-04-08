// Arrange frames horizontally
export function handleArrangeFrames(msg: any) {
  const postfix = (msg.postfix || '').trim();
  const randomnessLevel = typeof msg.randomnessLevel === 'number' ? msg.randomnessLevel : null;
  const selection = figma.currentPage.selection.filter((n) => n.type === 'FRAME') as FrameNode[];

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
    if (randomnessLevel === null) return 16;
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
    } catch (e) {
      console.warn('Failed arranging a frame:', e);
    }
  }

  figma.currentPage.selection = frames;
  figma.viewport.scrollAndZoomIntoView(frames);
  figma.notify(`Arranged ${frames.length} frames${postfix ? ` with postfix "${postfix}"` : ''} (gap: ${gap}px).`);
}

// Group selected frames
export function handleGroupSelectedFrames(msg: any) {
  const suffix = msg.suffix as string;
  const selectedFrames = figma.currentPage.selection.filter((n) => n.type === 'FRAME') as FrameNode[];

  if (selectedFrames.length === 0) {
    figma.notify('Please select some frames first!');
    return;
  }

  const groups: Record<string, { base?: FrameNode; suffixFrame?: FrameNode }> = {};
  for (const frame of selectedFrames) {
    const name = frame.name.trim();
    if (name.endsWith(suffix)) {
      const baseName = name.replace(new RegExp(`\\s*${suffix}$`, 'i'), '').trim();
      if (!groups[baseName]) groups[baseName] = {};
      groups[baseName].suffixFrame = frame;
    } else {
      if (!groups[name]) groups[name] = {};
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
    if (!base && !suffixFrame) continue;

    const row = figma.createFrame();
    row.name = `${baseName} Row`;
    row.layoutMode = 'HORIZONTAL';
    row.primaryAxisSizingMode = 'AUTO';
    row.counterAxisSizingMode = 'AUTO';
    row.itemSpacing = 16;

    if (base) row.appendChild(base);
    if (suffixFrame) row.appendChild(suffixFrame);

    container.appendChild(row);
  }

  figma.currentPage.appendChild(container);
  figma.currentPage.selection = [container];
  figma.viewport.scrollAndZoomIntoView([container]);
  figma.notify('Frames grouped successfully!');
}

// Pair selected frames
export function handlePairSelectedFrames(msg: any) {
  const suffix = msg.suffix as string;
  const selectedFrames = figma.currentPage.selection.filter((n) => n.type === 'FRAME') as FrameNode[];

  if (!selectedFrames.length) {
    figma.notify('Please select frames first!');
    return;
  }

  const groups: Record<string, { base?: FrameNode; suffixFrame?: FrameNode }> = {};

  for (const frame of selectedFrames) {
    const name = frame.name.trim();
    if (name.endsWith(suffix)) {
      const baseName = name.replace(new RegExp(`\\s*${suffix}$`, 'i'), '').trim();
      if (!groups[baseName]) groups[baseName] = {};
      groups[baseName].suffixFrame = frame;
    } else {
      if (!groups[name]) groups[name] = {};
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

// Find duplicate top-level frames
export function handleFindDuplicateTopLevelFrames() {
  const topLevelFrames = figma.currentPage.children.filter(
    (node) => node.type === 'FRAME' && (node as FrameNode).layoutMode === 'NONE'
  ) as FrameNode[];

  const frameMap: { [key: string]: FrameNode[] } = {};
  for (const frame of topLevelFrames) {
    if (!frameMap[frame.name]) frameMap[frame.name] = [];
    frameMap[frame.name].push(frame);
  }

  const duplicates: FrameNode[] = [];
  for (const name in frameMap) {
    if (frameMap[name].length > 1) duplicates.push(...frameMap[name]);
  }

  if (duplicates.length > 0) {
    figma.currentPage.selection = duplicates;
    figma.viewport.scrollAndZoomIntoView(duplicates);
    figma.notify(`Found ${duplicates.length} top-level standard frames with duplicate names.`);
    figma.ui.postMessage({ type: 'duplicate-selection', count: duplicates.length });
  } else {
    figma.notify('No duplicate top-level standard frame names found.');
    figma.ui.postMessage({ type: 'duplicate-selection', count: 0 });
  }
}
