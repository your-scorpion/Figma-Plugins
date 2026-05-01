import { useEffect } from 'react';
import { PaddingNode, NumberVariable } from '../types';

type UsePluginMessagesParams = {
  setPaddingData: (data: PaddingNode[]) => void;
  setNumberVariables: (data: NumberVariable[]) => void;
  setHasFramesSelected: (has: boolean) => void;
  setHasDuplicateSelection: (has: boolean) => void;
  setSelectionChangeToken?: (value: number | ((current: number) => number)) => void;
  setTextRecomputeRunning?: (running: boolean) => void;
  setTextRecomputeTotal?: (n: number) => void;
  setTextRecomputeDone?: (n: number) => void;
  setOrphanScanRunning?: (running: boolean) => void;
  setOrphanScanTotal?: (n: number) => void;
  setOrphanScanChecked?: (n: number) => void;
  setOrphanScanFound?: (n: number) => void;
};

export const usePluginMessages = ({
  setPaddingData,
  setNumberVariables,
  setHasFramesSelected,
  setHasDuplicateSelection,
  setSelectionChangeToken,
  setTextRecomputeRunning,
  setTextRecomputeTotal,
  setTextRecomputeDone,
  setOrphanScanRunning,
  setOrphanScanTotal,
  setOrphanScanChecked,
  setOrphanScanFound,
}: UsePluginMessagesParams) => {
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const { pluginMessage } = event.data || {};
      if (!pluginMessage || typeof pluginMessage !== 'object') return;

      if (pluginMessage.type === 'padding-data') {
        setPaddingData(pluginMessage.data as PaddingNode[]);
      }
      if (pluginMessage.type === 'number-variables') {
        setNumberVariables(pluginMessage.data as NumberVariable[]);
      }
      if (pluginMessage.type === 'selection-frames') {
        const has = Boolean(pluginMessage.hasFrames);
        setHasFramesSelected(has);
        if (!has) setHasDuplicateSelection(false);
      }
      if (pluginMessage.type === 'selection-changed') {
        setSelectionChangeToken && setSelectionChangeToken((current) => current + 1);
      }
      if (pluginMessage.type === 'duplicate-selection') {
        setHasDuplicateSelection(Number(pluginMessage.count) > 0);
      }
      if (pluginMessage.type === 'text-recompute-start') {
        setTextRecomputeRunning && setTextRecomputeRunning(true);
        setTextRecomputeTotal && setTextRecomputeTotal(Number(pluginMessage.total || 0));
        setTextRecomputeDone && setTextRecomputeDone(0);
      }
      if (pluginMessage.type === 'text-recompute-progress') {
        setTextRecomputeDone && setTextRecomputeDone(Number(pluginMessage.done || 0));
      }
      if (pluginMessage.type === 'text-recompute-end') {
        setTextRecomputeDone && setTextRecomputeDone(Number(pluginMessage.done || 0));
        setTextRecomputeRunning && setTextRecomputeRunning(false);
      }
      if (pluginMessage.type === 'orphan-scan-start') {
        setOrphanScanRunning && setOrphanScanRunning(true);
        setOrphanScanTotal && setOrphanScanTotal(Number(pluginMessage.total || 0));
        setOrphanScanChecked && setOrphanScanChecked(0);
        setOrphanScanFound && setOrphanScanFound(0);
      }
      if (pluginMessage.type === 'orphan-scan-progress') {
        setOrphanScanChecked && setOrphanScanChecked(Number(pluginMessage.checked || 0));
        setOrphanScanFound && setOrphanScanFound(Number(pluginMessage.found || 0));
        setOrphanScanTotal && setOrphanScanTotal(Number(pluginMessage.total || 0));
      }
      if (pluginMessage.type === 'orphan-scan-end') {
        setOrphanScanChecked && setOrphanScanChecked(Number(pluginMessage.checked || 0));
        setOrphanScanFound && setOrphanScanFound(Number(pluginMessage.found || 0));
        setOrphanScanTotal && setOrphanScanTotal(Number(pluginMessage.total || 0));
        setOrphanScanRunning && setOrphanScanRunning(false);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setPaddingData, setNumberVariables, setHasFramesSelected, setHasDuplicateSelection, setSelectionChangeToken, setTextRecomputeRunning, setTextRecomputeTotal, setTextRecomputeDone, setOrphanScanRunning, setOrphanScanTotal, setOrphanScanChecked, setOrphanScanFound]);
};
