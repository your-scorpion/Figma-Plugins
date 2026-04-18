import React from 'react';
import { sendArrangeFrames, sendFindDuplicateFrames } from './utils/pluginMessages';

type EmptyStateProps = {
  randomnessLevel: number;
  hasDuplicateSelection: boolean;
  hasFramesSelected: boolean;
  fixPaddingsLoading: boolean;
  selectAutoLayoutLoading: boolean;
  onSelectAutoLayout: () => void;
  onArrangeNamingOpen: () => void;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  randomnessLevel,
  hasDuplicateSelection,
  hasFramesSelected,
  fixPaddingsLoading,
  selectAutoLayoutLoading,
  onSelectAutoLayout,
  onArrangeNamingOpen,
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const tooltipTimerRef = React.useRef<number | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = '0 0 16px rgba(48,255,120,0.35), 0 0 24px rgba(175,82,222,0.25), inset 0 1px rgba(255,255,255,0.3)';
    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(48,255,120,0.28), rgba(175,82,222,0.26))';

    // Show tooltip after delay
    tooltipTimerRef.current = window.setTimeout(() => {
      setShowTooltip(true);
    }, 800);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = 'inset 0 1px rgba(255,255,255,0.3)';
    e.currentTarget.style.background = 'linear-gradient(45deg, rgba(140,120,255,0.3), rgba(140,120,255,0.1), rgba(255,255,255,0.05))';

    // Clear timer and hide tooltip
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
    setShowTooltip(false);
  };

  return (
    <div className="quantum-hover-delay" style={{ position: 'relative', minHeight: '100%', overflow: 'hidden' }}>
      {/* Hyperdimensional Background */}
      <div
        className="morphing-grid"
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            60deg,
            rgba(8, 10, 18, 0.9) 0%,
            rgba(14, 16, 28, 0.85) 25%,
            rgba(18, 16, 32, 0.75) 40%,
            rgba(12, 14, 22, 0.8) 55%,
            rgba(20, 18, 30, 0.7) 70%,
            rgba(10, 12, 20, 0.95) 100%
          )`,
          backgroundSize: '400% 400%',
          filter: 'saturate(1.2) brightness(1.05) contrast(1.15)',
        }}
      />

      {/* Quantum Particle Field */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="chaotic-particle"
            style={{
              position: 'absolute',
              top: `${20 + i * 10}%`,
              left: `${10 + i * 5}%`,
              width: `${4 + i}px`,
              height: `${4 + i}px`,
              background: `radial-gradient(circle, rgba(${140 + i * 20},${120 + i * 10},255,0.${8 - i}), transparent)`,
              borderRadius: '50%',
              filter: 'blur(1px)',
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Quantum Shimmer Effects */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="quantum-shimmer"
            style={{
              position: 'absolute',
              top: `${10 + i * 20}%`,
              left: `${-30 - i * 10}%`,
              width: `${80 - i * 10}%`,
              height: `${1 + i}px`,
              background: `linear-gradient(90deg, transparent, rgba(${255 - i * 50},${255 - i * 50},255,0.${10 - i}), transparent)`,
              transform: `rotate(calc(${15 + i * 10}deg + sin(0) * ${20 + i * 5}deg))`,
              filter: 'blur(0.5px)',
              animationDelay: `${i * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 122px)',
          padding: '0px 16px',
        }}
      >
        <div
          className="hyperdimensional-pulse"
          style={{
            width: 'min(580px, 94%)',
            padding: '28px 24px',
            borderRadius: 'calc(20px + sin(0) * 4px)',
            background: `
              linear-gradient(calc(135deg + sin(0) * 45deg), 
                rgba(255,255,255,0.08), 
                rgba(255,255,255,0.02),
                rgba(140,120,255,0.05)
              )
            `,
            boxShadow: `
              0 calc(20px + sin(0) * 10px) calc(40px + cos(0) * 20px) rgba(0,0,0,0.4),
              inset 0 1px rgba(255,255,255,0.3),
              0 0 calc(50px + sin(0) * 30px) rgba(140,120,255,0.1)
            `,
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(calc(16px + sin(0) * 4px))',
            WebkitBackdropFilter: 'blur(calc(16px + sin(0) * 4px))',
            textAlign: 'center',
            color: '#e8e8eb',
            transform: 'perspective(1000px) rotateX(calc(sin(0) * 2deg)) rotateY(calc(cos(0) * 1deg))',
          }}
        >
          {/* Quantum Icon */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div
              className="fractal-rotation"
              role="button"
              tabIndex={0}
              aria-label="Select Auto Layout"
              onClick={selectAutoLayoutLoading ? undefined : onSelectAutoLayout}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !selectAutoLayoutLoading) {
                  e.preventDefault();
                  onSelectAutoLayout();
                }
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                margin: '0 auto 16px',
                width: 'calc(40px + sin(0) * 6px)',
                height: 'calc(40px + cos(0) * 6px)',
                borderRadius: 'calc(12px + sin(0) * 3px)',
                background: `
                  linear-gradient(calc(45deg + sin(0) * 90deg),
                    rgba(140,120,255,0.3),
                    rgba(140,120,255,0.1),
                    rgba(255,255,255,0.05)
                  )
                `,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 1px rgba(255,255,255,0.3)',
                transform: 'perspective(500px) rotateZ(calc(sin(0) * 5deg))',
                cursor: selectAutoLayoutLoading ? 'default' : 'pointer',
                userSelect: 'none',
                outline: 'none',
                transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: selectAutoLayoutLoading ? 0.7 : 1,
              }}
            >
              {selectAutoLayoutLoading ? (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    border: '2px solid rgba(140,120,255,0.3)',
                    borderTop: '2px solid rgba(220,220,255,0.95)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
              ) : (
                <svg
                  className="quantum-float"
                  width="calc(20px + sin(0) * 4px)"
                  height="calc(20px + cos(0) * 4px)"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(200,200,255,0.5))',
                  }}
                >
                  <path
                    d="M4 12h16M12 4v16"
                    stroke="rgba(220,220,255,0.95)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    style={{
                      filter: 'drop-shadow(0 0 2px rgba(140,120,255,0.8))',
                    }}
                  />
                </svg>
              )}
            </div>

            {/* Tooltip */}
            {showTooltip && !selectAutoLayoutLoading && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginTop: 8,
                  padding: '8px 12px',
                  background: 'rgba(20, 20, 30, 0.98)',
                  border: '1px solid rgba(140,120,255,0.4)',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4), 0 0 20px rgba(140,120,255,0.2)',
                  whiteSpace: 'nowrap',
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.9)',
                  zIndex: 1000,
                  pointerEvents: 'none',
                  animation: 'fadeIn 0.2s ease-out',
                }}
              >
                Click to jump to the next Auto Layout frame on your page
              </div>
            )}
          </div>

          {/* Quantum Text */}
          <div
            className="quantum"
            style={{
              fontSize: 'calc(14px + sin(0) * 2px)',
              fontWeight: 700,
              letterSpacing: 'calc(0.3px + cos(0) * 0.1px)',
              color: '#f5f5f7',
              textShadow: '0 0 10px rgba(255,255,255,0.3)',
              animationDelay: '0.5s',
            }}
          >
            No Auto Layout Selected
          </div>

          <div
            className="quantum"
            style={{
              marginTop: 'calc(8px + sin(0) * 2px)',
              fontSize: 'calc(13px + cos(0) * 1px)',
              lineHeight: 'calc(1.6 + sin(0) * 0.1)',
              color: 'rgba(245,245,247,0.8)',
              textShadow: '0 0 5px rgba(255,255,255,0.2)',
              animationDelay: '1s',
            }}
          >
            Select an element that uses Auto Layout to inspect paddings and spacing.
          </div>

          <div
            style={{
              marginTop: 16,
              padding: '14px 16px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 10,
              maxWidth: 520,
              marginInline: 'auto',
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(245,245,247,0.7)',
                marginBottom: 8,
              }}
            >
              Frame Tools
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {hasDuplicateSelection ? (
                <button
                  onClick={() => sendArrangeFrames(undefined, randomnessLevel)}
                  style={{
                    padding: '12px 20px',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                    letterSpacing: '0.02em',
                    background: 'linear-gradient(145deg, rgba(0,200,255,0.15) 0%, rgba(0,200,255,0.05) 100%)',
                    color: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(0,200,255,0.25)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 18px rgba(0,0,0,0.35), inset 0 0.5px 1px rgba(255,255,255,0.25)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    lineHeight: '1.3',
                    wordBreak: 'break-word',
                    backdropFilter: 'blur(30px) saturate(160%)',
                  }}
                  title="Organize selected duplicate frames horizontally"
                >
                  Organize Frames
                </button>
              ) : (
                <button
                  onClick={() => sendFindDuplicateFrames()}
                  disabled={fixPaddingsLoading}
                  style={{
                    padding: '12px 20px',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                    letterSpacing: '0.02em',
                    background: fixPaddingsLoading
                      ? 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)'
                      : 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                    color: fixPaddingsLoading ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.95)',
                    border: fixPaddingsLoading
                      ? '1px solid rgba(255,255,255,0.08)'
                      : '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '12px',
                    boxShadow: fixPaddingsLoading
                      ? 'inset 0 0 2px rgba(255,255,255,0.1), inset 0 -1px 3px rgba(0,0,0,0.25)'
                      : '0 8px 18px rgba(0,0,0,0.35), inset 0 0.5px 1px rgba(255,255,255,0.25)',
                    cursor: fixPaddingsLoading ? 'default' : 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease, box-shadow 0.3s ease',
                    opacity: fixPaddingsLoading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    lineHeight: '1.3',
                    wordBreak: 'break-word',
                    backdropFilter: 'blur(30px) saturate(160%)',
                  }}
                  title="Find top-level frames with duplicate names. Nested frames are ignored."
                >
                  Select First-Level Frames with Same Name
                </button>
              )}

              <button
                onClick={onArrangeNamingOpen}
                disabled={!hasFramesSelected}
                title={hasFramesSelected ? undefined : 'please select frames'}
                style={{
                  padding: '12px 60px',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                  letterSpacing: '0.02em',
                  background: !hasFramesSelected
                    ? 'linear-gradient(180deg, rgba(1, 0, 0, 0.06) 0%, rgba(255,255,255,0.02) 100%)'
                    : 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                  color: !hasFramesSelected ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.95)',
                  border: !hasFramesSelected
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '12px',
                  boxShadow: !hasFramesSelected
                    ? 'inset 0 0 2px rgba(255,255,255,0.1), inset 0 -1px 3px rgba(0,0,0,0.25)'
                    : '0 8px 18px rgba(0,0,0,0.35), inset 0 0.5px 1px rgba(255,255,255,0.25)',
                  cursor: !hasFramesSelected ? 'default' : 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease, box-shadow 0.3s ease',
                  opacity: !hasFramesSelected ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  whiteSpace: 'normal',
                  textAlign: 'center',
                  lineHeight: '1.3',
                  wordBreak: 'break-word',
                  backdropFilter: 'blur(30px) saturate(160%)',
                }}
              >
                Add postfix and arrange selected frames
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
