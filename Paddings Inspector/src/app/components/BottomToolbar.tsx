import React, { RefObject, useEffect, useRef } from 'react';
import { TabType } from './types';
import { sendApplyEvenPaddings, sendSnapAutoLayoutToGrid } from './utils/pluginMessages';
import { MAX_PADDING_INCREMENT } from './constants';

type BottomToolbarProps = {
  toolbarRef: RefObject<HTMLDivElement>;
  isVisible: boolean;
  activeTab: TabType;
  paddingDataLength: number;
  paddingIncrement: number;
  selectionChangeToken: number;
  fixPaddingsLoading: boolean;
  onPaddingIncrementChange: (value: number) => void;
};

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
  toolbarRef,
  isVisible,
  activeTab,
  paddingDataLength,
  paddingIncrement,
  selectionChangeToken,
  fixPaddingsLoading,
  onPaddingIncrementChange,
}) => {
  const sliderValueRef = useRef(paddingIncrement);

  useEffect(() => {
    sliderValueRef.current = paddingIncrement;
  }, [paddingIncrement]);

  useEffect(() => {
    sliderValueRef.current = 0;
    onPaddingIncrementChange(0);
  }, [selectionChangeToken, onPaddingIncrementChange]);

  const sliderFill = (paddingIncrement / MAX_PADDING_INCREMENT) * 100;

  const handleSliderChange = (nextValue: number) => {
    if (Number.isNaN(nextValue) || nextValue === sliderValueRef.current) return;

    sliderValueRef.current = nextValue;
    onPaddingIncrementChange(nextValue);
    sendApplyEvenPaddings(nextValue);
  };

  return (
    <div
      ref={toolbarRef}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        padding: '8px 10px',
        background: '#1e1e1e',
        borderTop: '1px solid #333',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        zIndex: 9998,
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {activeTab === 'paddings' && (
        <>
          <div className="toolbar-tooltip-anchor">
            <button
              onClick={() => sendSnapAutoLayoutToGrid()}
              disabled={fixPaddingsLoading || paddingDataLength === 0}
              aria-describedby="fix-paddings-tooltip"
              style={{
                padding: '12px 20px',
                fontSize: '13.5px',
                fontWeight: 500,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                letterSpacing: '0.02em',
                background: (fixPaddingsLoading || paddingDataLength === 0)
                  ? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)'
                  : 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                color: (fixPaddingsLoading || paddingDataLength === 0) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.95)',
                border: (fixPaddingsLoading || paddingDataLength === 0)
                  ? '1px solid rgba(255,255,255,0.05)'
                  : '1px solid rgba(255,255,255,0.18)',
                borderRadius: '12px',
                boxShadow: (fixPaddingsLoading || paddingDataLength === 0)
                  ? 'inset 0 0 2px rgba(255,255,255,0.05), inset 0 -1px 3px rgba(0,0,0,0.15)'
                  : '0 8px 18px rgba(0,0,0,0.35), inset 0 0.5px 1px rgba(255,255,255,0.25)',
                cursor: (fixPaddingsLoading || paddingDataLength === 0) ? 'not-allowed' : 'pointer',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease, box-shadow 0.3s ease',
                opacity: (fixPaddingsLoading || paddingDataLength === 0) ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(30px) saturate(160%)',
              }}
            >
              {fixPaddingsLoading && (
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(0, 255, 255, 0.4)',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite, pulse 2s ease-in-out infinite',
                    boxShadow: '0 0 8px rgba(0,255,255,0.5)',
                  }}
                />
              )}
              {fixPaddingsLoading ? 'Processing…' : 'Fix Paddings'}
            </button>
            <div className="toolbar-tooltip toolbar-tooltip--align-left" id="fix-paddings-tooltip" role="tooltip">
              <div className="toolbar-tooltip__title">Snap to the 2px grid</div>
              <div className="toolbar-tooltip__body">
                Rounds every selected Auto Layout layer, including nested containers, up to the next clean Material-friendly step.
              </div>
            </div>
          </div>

          {/* Padding Increase Slider */}
          <div className="toolbar-tooltip-anchor">
            <div
              aria-describedby="padding-slider-tooltip"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 6px',
                background: 'rgba(255, 255, 255, 0.10)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                minWidth: '160px',
                height: '28px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                position: 'relative',
                opacity: paddingDataLength === 0 ? 0.6 : 1,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: '600',
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  minWidth: '24px',
                  textAlign: 'center',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                {paddingIncrement}
              </span>
              <div
                style={{
                  position: 'relative',
                  width: '100px',
                  height: '8px',
                  background: 'linear-gradient(90deg, #2a2a2a 0%, #4a4a4a 50%, #6a6a6a 100%)',
                  borderRadius: '3px',
                  boxShadow: 'inset 0 2px 3px rgba(0, 0, 0, 0.35)',
                }}
              >
                <input
                  type="range"
                  min="0"
                  max={String(MAX_PADDING_INCREMENT)}
                  step="4"
                  value={paddingIncrement}
                  onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
                  onInput={(e) => handleSliderChange(parseInt((e.target as HTMLInputElement).value, 10))}
                  disabled={paddingDataLength === 0}
                  aria-describedby="padding-slider-tooltip"
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '0',
                    width: '100%',
                    height: '18px',
                    background: 'transparent',
                    outline: 'none',
                    cursor: paddingDataLength === 0 ? 'not-allowed' : 'pointer',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    zIndex: 2,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${sliderFill}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '18px',
                    height: '18px',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%)',
                    borderRadius: '50%',
                    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.32), 0 1px 2px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    zIndex: 1,
                    transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: paddingDataLength === 0 ? 0.6 : 1,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: `${sliderFill}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #007AFF 0%, #5AC8FA 50%, #AF52DE 100%)',
                    borderRadius: '3px',
                    boxShadow: '0 1px 2px rgba(0, 122, 255, 0.35)',
                    transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: paddingDataLength === 0 ? 0.6 : 1,
                  }}
                />
              </div>
            </div>
            <div className="toolbar-tooltip toolbar-tooltip--wide" id="padding-slider-tooltip" role="tooltip">
              <div className="toolbar-tooltip__title">Live padding offset</div>
              <div className="toolbar-tooltip__body">
                Drag to add the same padding increase across every selected Auto Layout layer in real time. Slide back to 0 to restore the current selection baseline.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
