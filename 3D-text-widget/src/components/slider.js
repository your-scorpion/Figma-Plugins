export function createSlider(container, options = {}) {
  const {
    start    = 50,
    min      = 0,
    max      = 100,
    step     = 1,
    onChange = () => {},
    label    = '',
    unit     = '',
    color    = '#3b82f6',
    glow     = `${color}60`,   // semi-transparent version of color for glow
    ticks    = 4,
  } = options;

  let display       = cs(start);
  let target        = display;
  let dragging      = false;
  let activePointerId = null;
  let isInternalSet = false;
  let raf           = null;

  function cs(v) {
    return Math.min(max, Math.max(min, Math.round(v / step) * step));
  }
  function pct(v) {
    return ((v - min) / (max - min) * 100).toFixed(3) + '%';
  }
  function fromClientX(cx) {
    const r = track.getBoundingClientRect();
    return cs(min + Math.min(1, Math.max(0, (cx - r.left) / r.width)) * (max - min));
  }
  function el(tag, css = '') {
    const e = document.createElement(tag);
    if (css) e.style.cssText = css;
    return e;
  }

  // ── DOM ────────────────────────────────────────────────────────────────
  container.style.cssText = 'display:flex;flex-direction:column;gap:9px;';

  // Label — brightens on row hover via CSS
  const labelEl = el('span', `
    font-size:10px; font-weight:700; letter-spacing:0.11em;
    text-transform:uppercase; color:var(--ns-sub,#3a5080);
    font-family:-apple-system,sans-serif;
    transition:color 0.3s ease;
  `);
  labelEl.textContent = label;
  // Hover brightening via JS (no parent selector needed)
  container.addEventListener('mouseenter', () => { labelEl.style.color = '#7eb8ff'; });
  container.addEventListener('mouseleave', () => { labelEl.style.color = ''; });

  // Track wrapper
  const trackWrap = el('div', 'display:flex;align-items:center;');

  const capStyle = `
    width:3px; height:10px; border-radius:3px; flex-shrink:0;
    background:var(--ns,#364e8b);
    box-shadow:2px 2px 5px var(--ns-dk,#04050f),-1px -1px 3px var(--ns-lt,#0f1228);
    transition:box-shadow 0.3s ease;
  `;
  const capL = el('div', capStyle);
  const capR = el('div', capStyle);

  // Glow caps on hover
  const capGlow = `2px 2px 5px var(--ns-dk,#04050f),-1px -1px 3px var(--ns-lt,#0f1228),0 0 8px 1px ${glow}`;
  container.addEventListener('mouseenter', () => {
    capL.style.boxShadow = capGlow;
    capR.style.boxShadow = capGlow;
  });
  container.addEventListener('mouseleave', () => {
    capL.style.boxShadow = '';
    capR.style.boxShadow = '';
  });

  const track = el('div', `
    position:relative; flex:1; height:10px; border-radius:999px;
    background:var(--ns,#364e8b);
    box-shadow:inset 3px 3px 7px var(--ns-dk,#04050f),inset -2px -2px 5px var(--ns-lt,#0f1228);
    cursor:pointer; margin:0 6px;
    --glow:${glow};
  `);
  track.setAttribute('tabindex', '0');
  track.setAttribute('role', 'slider');
  track.setAttribute('aria-label', label || 'Slider');
  track.setAttribute('aria-valuemin', min);
  track.setAttribute('aria-valuemax', max);

  // Fill bar
  const fill = el('div', `
    position:absolute; left:0; top:0; bottom:0;
    border-radius:999px; pointer-events:none;
    background:${color}50;
    transition:filter 0.3s ease;
  `);

  // Luminescent halo behind the fill
  const halo = el('div', `
    position:absolute; top:50%; left:0;
    height:22px; border-radius:999px;
    transform:translateY(-50%);
    pointer-events:none; opacity:0;
    background:${color}18;
    transition:opacity 0.3s ease;
  `);

  // Hover/active fill brightening
  track.addEventListener('mouseenter', () => {
    fill.style.filter  = 'brightness(1.5) saturate(1.3)';
    halo.style.opacity = '1';
    thumb.style.boxShadow = [
      '3px 3px 8px var(--ns-dk,#04050f)',
      '-2px -2px 7px var(--ns-lt,#0f1228)',
      `0 0 14px 3px ${glow}`,
    ].join(',');
    pip.style.filter = 'brightness(1.4) saturate(1.2)';
  });
  track.addEventListener('mouseleave', () => {
    if (dragging) return;
    fill.style.filter  = '';
    halo.style.opacity = '0';
    pip.style.filter   = '';
    thumb.style.boxShadow = '3px 3px 8px var(--ns-dk,#04050f),-2px -2px 7px var(--ns-lt,#0f1228)';
  });

  // Ticks
  const tickLayer = el('div', 'position:absolute;inset:0;pointer-events:none;');
  for (let i = 0; i <= ticks; i++) {
    const tick = el('div', `
      position:absolute; width:1px; height:4px;
      background:var(--ns-lt,#0f1228); opacity:0.5; border-radius:1px;
      top:50%; transform:translate(-50%,-50%);
      left:${(i / ticks * 100).toFixed(1)}%;
      transition:opacity 0.3s ease;
    `);
    tickLayer.appendChild(tick);
  }
  track.addEventListener('mouseenter', () => {
    tickLayer.querySelectorAll('div').forEach(t => { t.style.opacity = '0.9'; });
  });
  track.addEventListener('mouseleave', () => {
    if (dragging) return;
    tickLayer.querySelectorAll('div').forEach(t => { t.style.opacity = ''; });
  });

  // Thumb
  const thumb = el('div', `
    position:absolute; top:50%; width:20px; height:20px; border-radius:50%;
    background:var(--ns,#364e8b);
    box-shadow:3px 3px 8px var(--ns-dk,#04050f),-2px -2px 7px var(--ns-lt,#0f1228);
    transform:translate(-50%,-50%) scale(1);
    transition:transform 0.15s cubic-bezier(0.34,1.56,0.64,1),
               box-shadow 0.2s ease, filter 0.2s ease;
    cursor:grab; z-index:3;
    --glow:${glow};
  `);
  const pip = el('div', `
    position:absolute; inset:6px; border-radius:50%;
    background:${color};
    transition:filter 0.2s ease;
  `);
  thumb.appendChild(pip);

  // Tooltip
  const tooltip = el('div', `
    position:absolute; bottom:calc(100% + 10px);
    transform:translateX(-50%) translateY(4px);
    background:#060c1e; color:#b8d4ff;
    font-size:11px; font-weight:600;
    font-family:'SF Mono','Menlo',monospace;
    padding:4px 8px; border-radius:7px;
    white-space:nowrap; pointer-events:none;
    opacity:0; transition:opacity 0.14s ease,transform 0.14s ease,box-shadow 0.14s ease;
    border:1px solid #1a2a50; z-index:10;
    --glow:${glow};
  `);
  const arrow = el('div', `
    position:absolute; top:100%; left:50%; transform:translateX(-50%);
    border:4px solid transparent; border-top-color:#1a2a50;
  `);
  tooltip.appendChild(arrow);

  const native = document.createElement('input');
  native.type = 'range';
  native.min = min; native.max = max; native.step = step;
  native.value = Math.round(display);
  native.setAttribute('aria-label', label || 'Slider');
  native.style.cssText = `
    position:absolute; inset:-8px; width:calc(100% + 16px);
    opacity:0; cursor:pointer; margin:0;
  `;

  track.append(fill, halo, tickLayer, thumb, tooltip, native);
  trackWrap.append(capL, track, capR);
  container.append(labelEl, trackWrap);

  // ── Render ─────────────────────────────────────────────────────────────
  function render() {
    const p = pct(display);
    fill.style.width   = p;
    halo.style.width   = p;
    thumb.style.left   = p;
    tooltip.style.left = p;
    tooltip.textContent = Math.round(display) + unit;
    tooltip.appendChild(arrow);
    native.value = Math.round(display);
    track.setAttribute('aria-valuenow', Math.round(display));
    track.setAttribute('aria-valuetext', Math.round(display) + unit);
  }

  function springTo(tgt) {
    cancelAnimationFrame(raf);
    target = tgt;
    (function tick() {
      const d = target - display;
      if (Math.abs(d) < 0.04) { display = target; render(); return; }
      display += d * 0.3;
      render();
      raf = requestAnimationFrame(tick);
    })();
  }

  function showTip() {
    tooltip.style.opacity   = '1';
    tooltip.style.transform = 'translateX(-50%) translateY(0)';
    tooltip.style.boxShadow = `0 0 12px 2px ${glow}`;
  }
  function hideTip() {
    if (dragging) return;
    tooltip.style.opacity   = '0';
    tooltip.style.transform = 'translateX(-50%) translateY(4px)';
    tooltip.style.boxShadow = '';
  }

  function setActive(on) {
    dragging = on;
    if (on) {
      thumb.style.transform  = 'translate(-50%,-50%) scale(1.2)';
      thumb.style.boxShadow  = `5px 5px 12px var(--ns-dk,#04050f),-3px -3px 9px var(--ns-lt,#0f1228),0 0 22px 6px ${glow}`;
      pip.style.filter       = 'brightness(1.7) saturate(1.4)';
      fill.style.filter      = 'brightness(1.7) saturate(1.4)';
      halo.style.opacity     = '1';
      thumb.style.cursor     = 'grabbing';
    } else {
      thumb.style.transform  = 'translate(-50%,-50%) scale(1)';
      thumb.style.boxShadow  = '3px 3px 8px var(--ns-dk,#04050f),-2px -2px 7px var(--ns-lt,#0f1228)';
      pip.style.filter       = '';
      fill.style.filter      = '';
      halo.style.opacity     = '0';
      thumb.style.cursor     = 'grab';
    }
  }

  function emit(v) {
    if (!isInternalSet) onChange(Math.round(v));
  }

  function endDrag() {
    if (!dragging) {
      return;
    }

    setActive(false);
    hideTip();
    activePointerId = null;
  }

  // ── Events ─────────────────────────────────────────────────────────────
  track.addEventListener('pointerdown', e => {
    if (e.target === native) return;
    e.preventDefault();
    activePointerId = e.pointerId;
    setActive(true); showTip();
    const v = fromClientX(e.clientX); springTo(v); emit(v);
  });
  track.addEventListener('pointermove', e => {
    if (!dragging || (activePointerId !== null && e.pointerId !== activePointerId)) return;
    const v = fromClientX(e.clientX); springTo(v); emit(v);
  });
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('pointerleave', endDrag);
  thumb.addEventListener('mouseenter', showTip);
  thumb.addEventListener('mouseleave', hideTip);
  native.addEventListener('input', () => {
    const v = cs(Number(native.value));
    springTo(v); if (!isInternalSet) emit(v);
  });
  track.addEventListener('keydown', e => {
    const delta = e.shiftKey ? step * 10 : step;
    const map = {
      ArrowRight: () => cs(target + delta),
      ArrowUp:    () => cs(target + delta),
      ArrowLeft:  () => cs(target - delta),
      ArrowDown:  () => cs(target - delta),
      Home:       () => min,
      End:        () => max,
    };
    if (map[e.key]) {
      e.preventDefault();
      const v = map[e.key](); springTo(v); emit(v);
    }
  });

  window.addEventListener('blur', endDrag);
  document.addEventListener('pointerup', endDrag, true);
  document.addEventListener('pointercancel', endDrag, true);

  render();

  return {
    set(value) {
      isInternalSet = true;
      springTo(cs(Number(value)));
      isInternalSet = false;
    },
    get() { return Math.round(display); },
    setColor(c, g = `${c}60`) {
      pip.style.background   = c;
      fill.style.background  = `${c}50`;
      halo.style.background  = `${c}18`;
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('blur', endDrag);
      document.removeEventListener('pointerup', endDrag, true);
      document.removeEventListener('pointercancel', endDrag, true);
      container.innerHTML = '';
    },
  };
}