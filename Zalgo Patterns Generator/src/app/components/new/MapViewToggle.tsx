/**
 * MapViewToggle — SDK-agnostic compass bearing/pitch control.
 *
 * The ring controls bearing (drag to rotate).
 * The center disc controls pitch only — drag up = more 3D, drag down = top-down 2D.
 * The disc is a flat plane that tilts: edge-on at pitch 0, nearly circular at pitch 60.
 *
 * Zero external dependencies beyond React itself.
 *
 * Uncontrolled (self-managed):
 *   <MapViewToggle onStateChange={({ bearing, pitch }) =>
 *     map.easeTo({ bearing, pitch })} />
 *
 * Controlled (parent drives from map events):
 *   <MapViewToggle bearing={mapBearing} pitch={mapPitch} onStateChange={...} />
 */

import * as React from 'react';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface MapViewState {
  /** 0–360°. 0 = north up. */
  bearing: number;
  /** 0–60°. 0 = top-down 2D. 60 = full 3D tilt. */
  pitch: number;
}

export interface MapViewToggleProps {
  /** Controlled bearing (0–360). Omit for internal state. */
  bearing?: number;
  /** Controlled pitch (0–60). Omit for internal state. */
  pitch?: number;
  /** Fired on every bearing / pitch change. */
  onStateChange?: (state: MapViewState) => void;
  /** Ring + disc diameter in px. Default 64. */
  size?: number;
  /** Initial pitch when uncontrolled. Default 0 (2D). */
  initialPitch?: number;
  /** Long-press duration in ms -> resets bearing + pitch. Default 600. */
  longPressMs?: number;
  /** px of vertical drag that equals the full 0-60 degree pitch range. Default 80. */
  pitchDragScale?: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RAD = Math.PI / 180;
function normBearing(d: number) { return ((d % 360) + 360) % 360; }

// ─── Component ───────────────────────────────────────────────────────────────

export function MapViewToggle({
  bearing: controlledBearing,
  pitch: controlledPitch,
  onStateChange,
  size = 64,
  initialPitch = 0,
  longPressMs = 600,
  pitchDragScale = 80,
}: MapViewToggleProps) {
  const isControlled = controlledBearing !== undefined || controlledPitch !== undefined;

  const [intBearing, setIntBearing] = React.useState(0);
  const [intPitch, setIntPitch]     = React.useState(initialPitch);
  const [isDragging, setIsDragging]         = React.useState(false);
  const [isDiscDragging, setIsDiscDragging] = React.useState(false);

  const bearing = controlledBearing ?? intBearing;
  const pitch   = controlledPitch   ?? intPitch;

  const apply = React.useCallback((next: Partial<MapViewState>) => {
    const s: MapViewState = {
      bearing: normBearing(next.bearing ?? bearing),
      pitch:   Math.max(0, Math.min(60, next.pitch ?? pitch)),
    };
    if (!isControlled) { setIntBearing(s.bearing); setIntPitch(s.pitch); }
    onStateChange?.(s);
  }, [bearing, pitch, isControlled, onStateChange]);

  // Long-press resets both bearing and pitch
  const lpt = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const startLp = React.useCallback(() => {
    lpt.current = setTimeout(() => apply({ bearing: 0, pitch: initialPitch }), longPressMs);
  }, [apply, longPressMs, initialPitch]);
  const cancelLp = React.useCallback(() => {
    if (lpt.current) { clearTimeout(lpt.current); lpt.current = null; }
  }, []);

  // North reset on N-arrow click
  const handleNorth = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    apply({ bearing: 0 });
  }, [apply]);

  // Ring drag — changes bearing
  const ringRef      = React.useRef<HTMLDivElement>(null);
  const dragAngle0   = React.useRef<number | null>(null);
  const dragBearing0 = React.useRef(0);

  function angleFromRingCenter(clientX: number, clientY: number) {
    if (!ringRef.current) return 0;
    const rc = ringRef.current.getBoundingClientRect();
    const dx = clientX - (rc.left + rc.width / 2);
    const dy = clientY - (rc.top + rc.height / 2);
    // bearing: 0° = north (up), 90° = east (right), 180° = south, 270° = west (left)
    return Math.atan2(dx, -dy) * (180 / Math.PI);
  }

  const beginDrag = React.useCallback((cx: number, cy: number) => {
    dragAngle0.current   = angleFromRingCenter(cx, cy);
    dragBearing0.current = bearing;
    setIsDragging(true);
  }, [bearing]);

  const moveDrag = React.useCallback((cx: number, cy: number) => {
    if (dragAngle0.current === null) return;
    apply({ bearing: dragBearing0.current - (angleFromRingCenter(cx, cy) - dragAngle0.current) });
  }, [apply]);

  const endDrag = React.useCallback(() => {
    dragAngle0.current = null;
    setIsDragging(false);
  }, []);

  const onRingMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    beginDrag(e.clientX, e.clientY);
    const mm = (ev: MouseEvent) => moveDrag(ev.clientX, ev.clientY);
    const mu = () => { endDrag(); window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
  }, [beginDrag, moveDrag, endDrag]);

  const onRingTouchStart = React.useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    beginDrag(t.clientX, t.clientY);
    const tm = (ev: TouchEvent) => { const t2 = ev.touches[0]; moveDrag(t2.clientX, t2.clientY); };
    const te = () => { endDrag(); window.removeEventListener('touchmove', tm); window.removeEventListener('touchend', te); };
    window.addEventListener('touchmove', tm);
    window.addEventListener('touchend', te);
  }, [beginDrag, moveDrag, endDrag]);

  // Disc drag — changes pitch only (vertical axis)
  const discDragStart  = React.useRef<{ cy: number; pitch: number } | null>(null);
  const discDraggingRef = React.useRef(false);

  const onDiscMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    discDragStart.current  = { cy: e.clientY, pitch };
    discDraggingRef.current = false;
    startLp();
    const mm = (ev: MouseEvent) => {
      if (!discDragStart.current) return;
      const dy = ev.clientY - discDragStart.current.cy;
      if (!discDraggingRef.current && dy * dy > 9) {
        discDraggingRef.current = true;
        setIsDiscDragging(true);
        cancelLp();
      }
      if (discDraggingRef.current) {
        // drag down (positive dy) -> higher pitch (more 3D)
        apply({ pitch: discDragStart.current.pitch + (dy / pitchDragScale) * 60 });
      }
    };
    const mu = () => {
      discDragStart.current   = null;
      discDraggingRef.current = false;
      setIsDiscDragging(false);
      cancelLp();
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', mu);
    };
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
  }, [pitch, pitchDragScale, startLp, cancelLp, apply]);

  const onDiscTouchStart = React.useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    const t0 = e.touches[0];
    discDragStart.current   = { cy: t0.clientY, pitch };
    discDraggingRef.current = false;
    startLp();
    const tm = (ev: TouchEvent) => {
      if (!discDragStart.current) return;
      const dy = ev.touches[0].clientY - discDragStart.current.cy;
      if (!discDraggingRef.current && dy * dy > 9) {
        discDraggingRef.current = true;
        setIsDiscDragging(true);
        cancelLp();
      }
      if (discDraggingRef.current) {
        apply({ pitch: discDragStart.current.pitch + (dy / pitchDragScale) * 60 });
      }
    };
    const te = () => {
      discDragStart.current   = null;
      discDraggingRef.current = false;
      setIsDiscDragging(false);
      cancelLp();
      window.removeEventListener('touchmove', tm);
      window.removeEventListener('touchend', te);
    };
    window.addEventListener('touchmove', tm);
    window.addEventListener('touchend', te);
  }, [pitch, pitchDragScale, startLp, cancelLp, apply]);

  // Disc geometry — rx fixed, ry = rx * cos(pitch) — full circle at 0, compressed as pitch increases
  const svgD   = Math.round(size * 0.60);
  const svgR   = svgD / 2;
  const discRx = Math.round(svgR * 0.80);
  const discRy = Math.max(1, discRx * Math.cos(pitch * RAD));
  const blend3D = Math.min(1, pitch / 15);

  return (
    <div
      style={{ position: 'relative', width: size, height: size,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, userSelect: 'none', WebkitUserSelect: 'none' }}
      aria-label={`Compass. Bearing ${Math.round(bearing)} degrees. Pitch ${Math.round(pitch)} degrees.`}
    >
      {/* Compass ring — bearing */}
      <div
        ref={ringRef}
        style={{
          position: 'absolute', width: size, height: size, borderRadius: '50%',
          background: `radial-gradient(circle, transparent 0%, transparent 75%, rgba(255,255,255,0.95) 75%, rgba(255,255,255,0.95) 100%)`,
          border: '1.5px solid rgba(200,200,200,0.4)',
          boxShadow: isDragging 
            ? '0 0 0 1px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.8)' 
            : '0 0 0 1px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(0,0,0,0.08)',
          transform: `rotate(${-bearing}deg)`, transformOrigin: 'center',
          willChange: 'transform', transition: isDragging ? 'none' : 'box-shadow 0.15s',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={onRingMouseDown}
        onTouchStart={onRingTouchStart}
        aria-hidden="true"
      >
        {/* Dashed tick marks on ring with degree indicators */}
        <svg
          style={{ position: 'absolute', width: size, height: size, top: 0, left: 0 }}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
          pointerEvents="none"
        >
          {/* Degree ticks every 10 degrees */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = i * 10;
            const rad = angle * Math.PI / 180;
            const isMajor = angle % 30 === 0;
            const r1 = size * 0.48;
            const r2 = isMajor ? size * 0.38 : size * 0.44;
            const x1 = size / 2 + r1 * Math.cos(rad - Math.PI / 2);
            const y1 = size / 2 + r1 * Math.sin(rad - Math.PI / 2);
            const x2 = size / 2 + r2 * Math.cos(rad - Math.PI / 2);
            const y2 = size / 2 + r2 * Math.sin(rad - Math.PI / 2);
            return (
              <line
                key={`tick-${angle}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isMajor ? 'rgba(100,100,100,0.45)' : 'rgba(150,150,150,0.28)'}
                strokeWidth={isMajor ? '1.6' : '0.9'}
                strokeDasharray={isMajor ? '3,1.5' : '2,1'}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        {(['top', 'left', 'right', 'bottom'] as const).map(pos => {
          const posStyles = pos === 'top' ? { top: 2, left: '50%', transform: 'translateX(-50%)', width: 5, height: 5 }
            : pos === 'bottom' ? { bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 5, height: 5 }
            : pos === 'left' ? { left: 3, top: '50%', transform: 'translateY(-50%)', width: 5, height: 5 }
            : { right: 3, top: '50%', transform: 'translateY(-50%)', width: 5, height: 5 };
          return (
            <div key={pos} style={{ position: 'absolute', ...posStyles,
              borderRadius: '50%', background: '#888' }} aria-hidden="true" />
          );
        })}
      </div>

      {/* Center disc — pitch */}
      <div
        style={{
          position: 'absolute', zIndex: 3,
          cursor: isDiscDragging ? 'ns-resize' : 'row-resize',
          filter: 'drop-shadow(0px -3px 4px rgba(255,255,255,0.5)) drop-shadow(0px 5px 10px rgba(0,0,0,0.25))',
          transition: 'all 0.3s ease-out',
        }}
        onMouseDown={onDiscMouseDown}
        onTouchStart={onDiscTouchStart}
        title={`Pitch ${Math.round(pitch)} deg — drag down for 3D, drag up for 2D — long-press to reset`}
        aria-label={`Pitch control ${Math.round(pitch)} degrees. Drag down for 3D view.`}
      >
        <svg
          width={svgD}
          height={svgD}
          viewBox={`${-svgR} ${-svgR} ${svgD} ${svgD}`}
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="mvt-disc-fill" x1="0" y1={-discRy} x2="0" y2={discRy} gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#7EC8F4" />
              <stop offset="55%"  stopColor="#3E9FD8" />
              <stop offset="100%" stopColor="#2567A4" />
            </linearGradient>
            <radialGradient id="mvt-neo-light" cx="35%" cy="35%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <radialGradient id="mvt-neo-dark" cx="65%" cy="65%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="40%" stopColor="rgba(0,0,0,0.08)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
            </radialGradient>
            <clipPath id="mvt-disc-clip">
              <ellipse cx="0" cy="0" rx={discRx} ry={discRy} />
            </clipPath>
            <filter id="mvt-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.4" />
            </filter>
            <filter id="mvt-neo-inset" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
              <feOffset in="blur" dx="0" dy="2" result="offsetblur" />
              <feFlood floodColor="rgba(0,0,0,0.15)" floodOpacity="1" result="color" />
              <feComposite in="color" in2="offsetblur" operator="in" result="shadow" />
              <feComposite in="shadow" in2="SourceGraphic" operator="in" result="shadow" />
            </filter>
          </defs>

          {/* Single ellipse: Y-axis scaled from 2D (thin) to 3D (round) */}
          {/* Base white circle with neomorphic shadow */}
          <ellipse cx="0" cy="0" rx={discRx} ry={discRy}
            fill="white" stroke="rgba(0,0,0,0.06)" strokeWidth="0.8"
            style={{ filter: `drop-shadow(0 ${2 + blend3D}px ${5 + blend3D * 4}px rgba(0,0,0,${0.18 + blend3D * 0.12})) drop-shadow(0 ${0.5 + blend3D * 0.5}px ${2 + blend3D * 1.5}px rgba(0,0,0,${0.1 + blend3D * 0.08}))` }} />

          {/* Neomorphic light highlight (top-left) */}
          <ellipse cx="0" cy="0" rx={discRx} ry={discRy}
            fill="url(#mvt-neo-light)" stroke="none"
            style={{ pointerEvents: 'none', opacity: 0.6 + blend3D * 0.2, transition: 'opacity 0.2s linear' }} />

          {/* Neomorphic dark shadow (bottom-right) */}
          <ellipse cx="0" cy="0" rx={discRx} ry={discRy}
            fill="url(#mvt-neo-dark)" stroke="none"
            style={{ pointerEvents: 'none', opacity: 0.5 + blend3D * 0.2, transition: 'opacity 0.2s linear' }} />

          {/* Gradient overlay that fades in as pitch increases */}
          <ellipse cx="0" cy="0" rx={discRx} ry={discRy}
            fill="url(#mvt-disc-fill)" stroke="#1a5fa0" strokeWidth={1 + blend3D * 0.2}
            style={{ opacity: blend3D, transition: 'opacity 0.2s linear' }} />

          {/* Interior rings (only visible when 3D enough) */}
          {blend3D > 0.3 && (
            <g clipPath="url(#mvt-disc-clip)" style={{ opacity: blend3D }}>
              <ellipse cx="0" cy={-discRy * 0.3}
                rx={discRx - 2} ry={Math.max(0.5, discRy * 0.45)}
                fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
              <ellipse cx="0" cy={discRy * 0.22}
                rx={discRx - 2} ry={Math.max(0.5, discRy * 0.75)}
                fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
              <ellipse cx="0" cy={-discRy * 0.38}
                rx={discRx * 0.42} ry={discRy * 0.22}
                fill="rgba(255,255,255,0.18)" />
            </g>
          )}

          {/* Circle with hole in center (replaces "2D" text) */}
          {blend3D < 0.7 && (
            <g style={{ pointerEvents: 'none', opacity: 1 - blend3D, transition: 'opacity 0.2s linear' }}>
              <circle cx="0" cy="0" r={Math.round(discRx * 0.35)}
                fill="rgba(30,100,200,0.4)" stroke="rgba(30,100,200,0.6)" strokeWidth="0.8" />
              <circle cx="0" cy="0" r={Math.round(discRx * 0.18)}
                fill="white" stroke="none" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
