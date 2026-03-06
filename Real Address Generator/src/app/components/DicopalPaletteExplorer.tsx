import React, { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { getPalettes, getColors, getPaletteProviders, getPaletteNames } from 'dicopal';

type DicopalPalette = {
  name: string;
  provider: string;
  type?: string;
  colors?: string[];
  number?: number;
};

const toHex = (color: string): string => {
  if (typeof color === 'string' && color.startsWith('rgb(')) {
    const nums = color
      .slice(4, -1)
      .split(',')
      .map((v) => parseInt(v.trim(), 10));

    if (nums.length >= 3 && nums.every((n) => Number.isFinite(n))) {
      return (
        '#' +
        nums
          .slice(0, 3)
          .map((n) => n.toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase()
      );
    }
  }

  return color;
};

const DicopalPaletteExplorer: React.FC = () => {
  const [providers, setProviders] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [paletteNames, setPaletteNames] = useState<string[]>([]);
  const [selectedPaletteName, setSelectedPaletteName] = useState<string>('');
  const [allPalettes, setAllPalettes] = useState<DicopalPalette[]>([]);

  useEffect(() => {
    try {
      const palettes = getPalettes() || [];
      setAllPalettes(palettes);
    } catch (error) {
      console.error('Failed to load dicopal palettes', error);
    }

    try {
      if (typeof getPaletteProviders === 'function' && typeof getPaletteNames === 'function') {
        const ps = getPaletteProviders();
        setProviders(ps);
        if (ps.length > 0) {
          setSelectedProvider(ps[0]);
          const names = getPaletteNames(ps[0] as any) || [];
          setPaletteNames(names);
          if (names.length > 0) {
            setSelectedPaletteName(names[0]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load dicopal providers/names', error);
    }
  }, []);

  const handleProviderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const provider = event.target.value;
    setSelectedProvider(provider);

    try {
      if (typeof getPaletteNames === 'function') {
        const names = getPaletteNames(provider as any) || [];
        setPaletteNames(names);
        setSelectedPaletteName(names[0] || '');
      }
    } catch (error) {
      console.error('Failed to load palette names for provider', error);
    }
  };

  const handlePaletteChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPaletteName(event.target.value);
  };


  const selectedPalette = useMemo(() => {
    if (!selectedPaletteName) return null;
    return (
      (allPalettes || []).find(
        (p) =>
          p &&
          p.name === selectedPaletteName &&
          (!selectedProvider || p.provider === selectedProvider),
      ) || null
    );
  }, [allPalettes, selectedPaletteName, selectedProvider]);

  const selectedColors = useMemo(() => {
    if (!selectedPalette || !selectedPalette.name) return [];

    if (Array.isArray(selectedPalette.colors) && selectedPalette.colors.length > 0) {
      return selectedPalette.colors;
    }

    try {
      const n =
        typeof selectedPalette.number === 'number' && selectedPalette.number > 0
          ? selectedPalette.number
          : undefined;
      const fromApi = getColors(selectedPalette.name, n as any) || [];
      return fromApi;
    } catch (error) {
      console.error('Failed to get colors for selected palette', selectedPalette.name, error);
      return [];
    }
  }, [selectedPalette]);

  const handleExportPrismJson = () => {
    if (!selectedPalette || !selectedColors.length) {
      return;
    }

    const tokensForMode: Record<string, { $scopes: string[]; $value: string; $type: 'color' }> =
      {};

    const providerKey = (selectedPalette.provider || 'unknown')
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-');
    const nameKey = (selectedPalette.name || 'unnamed')
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-');

    const count = selectedColors.length;

    selectedColors.forEach((c, idx) => {
      const hex = toHex(c);
      const tokenName = `${providerKey}-${nameKey}-${count}-${idx + 1}`;
      tokensForMode[tokenName] = {
        $scopes: ['ALL_SCOPES'],
        $value: hex,
        $type: 'color',
      };
    });

    const rootArray = [
      {
        Colors: {
          modes: {
            'Mode 1': tokensForMode,
          },
        },
      },
    ];

    const json = JSON.stringify(rootArray, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'dicopal-prism-colors.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const handleCreateVariableCollection = () => {
    if (!selectedPalette || !selectedColors.length) {
      // Nothing currently displayed to convert into variables
      return;
    }

    const tokens: { name: string; value: string }[] = [];

    const providerKey = (selectedPalette.provider || 'unknown')
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-');
    const nameKey = (selectedPalette.name || 'unnamed')
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-');

    const count = selectedColors.length;

    selectedColors.forEach((c, idx) => {
      const hex = toHex(c);
      const tokenName = `${providerKey}-${nameKey}-${count}-${idx + 1}`;
      tokens.push({ name: tokenName, value: hex });
    });

    if (!tokens.length) {
      // Nothing to send to the plugin
      return;
    }

    const collectionName = `${selectedPalette.provider} / ${selectedPalette.name}`;

    parent.postMessage(
      {
        pluginMessage: {
          type: 'create-variable-collection',
          collectionName,
          tokens,
        },
      },
      '*',
    );
  };

  return (
    <div className="dicopal-explorer">

      <div className="dicopal-controls">
        <div className="dicopal-field">
          <label className="dicopal-label" htmlFor="dicopal-provider">
            Provider
          </label>
          <select
            id="dicopal-provider"
            value={selectedProvider}
            onChange={handleProviderChange}
            className="dicopal-select"
          >
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="dicopal-field">
          <label className="dicopal-label" htmlFor="dicopal-palette">
            Palette
          </label>
          <select
            id="dicopal-palette"
            value={selectedPaletteName}
            onChange={handlePaletteChange}
            className="dicopal-select"
          >
            {paletteNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="dicopal-meta-row">
        {/* Intentionally left minimal – no selected palette label */}
      </div>

      <div className="dicopal-export-row">
        <button
          type="button"
          className="dicopal-button dicopal-button-secondary"
          onClick={handleExportPrismJson}
        >
          Download Prism JSON
        </button>
        <button
          type="button"
          className="dicopal-button"
          onClick={handleCreateVariableCollection}
        >
          Create Variables
        </button>
      </div>

      <div className="dicopal-swatches">
        {selectedPalette && selectedColors.length > 0 ? (
          <section
            key={`${selectedPalette.provider}-${selectedPalette.name}`}
            className="dicopal-section"
          >
            <div className="dicopal-palette-header">
              <h3 className="dicopal-palette-title">
                {selectedPalette.provider} / {selectedPalette.name}
              </h3>
              <span className="dicopal-palette-badge">
                {(selectedPalette.type || 'unknown') as string} · n={selectedColors.length}
              </span>
            </div>

            <div className="dicopal-swatch-grid">
              {selectedColors.map((c, idx) => {
                const hex = toHex(c);
                return (
                  <div key={`${hex}-${idx}`} className="dicopal-swatch">
                    <div className="dicopal-swatch-color" style={{ background: c }} />
                    <div className="dicopal-swatch-meta">
                      <code className="dicopal-code">{hex}</code>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <span className="dicopal-meta">No colors available for this selection.</span>
        )}
      </div>
    </div>
  );
};

export default DicopalPaletteExplorer;

