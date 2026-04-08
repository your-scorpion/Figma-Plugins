import { useState, useMemo } from 'react';
import { PaddingNode, NumberVariable, TabType } from '../types';
import { DEFAULT_PREFIX, DEFAULT_RANDOMNESS_LEVEL, getPaddingRangeMax } from '../constants';

export const useAppState = () => {
  const [paddingData, setPaddingData] = useState<PaddingNode[]>([]);
  const [numberVariables, setNumberVariables] = useState<NumberVariable[]>([]);
  const [apiUrl, setApiUrl] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState<string>('');
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [apiUrlPopupOpen, setApiUrlPopupOpen] = useState(false);
  const [selectAutoLayoutLoading, setSelectAutoLayoutLoading] = useState(false);
  const [fixPaddingsLoading, setFixPaddingsLoading] = useState(false);
  const [createVariablesLoading, setCreateVariablesLoading] = useState(false);
  const [randomnessLevel, setRandomnessLevel] = useState(DEFAULT_RANDOMNESS_LEVEL);
  const [toolbarsVisible, setToolbarsVisible] = useState(true);
  const [arrangeNamingOpen, setArrangeNamingOpen] = useState(false);
  const [postfixInput, setPostfixInput] = useState('');
  const [hasFramesSelected, setHasFramesSelected] = useState(false);
  const [hasDuplicateSelection, setHasDuplicateSelection] = useState(false);
  const [isNamingPromptOpen, setIsNamingPromptOpen] = useState(false);
  const [prefixInput, setPrefixInput] = useState(DEFAULT_PREFIX);
  const [activeTab, setActiveTab] = useState<TabType>('paddings');
  const [colorsToVarsLoading, setColorsToVarsLoading] = useState(false);
  const [allColorsToVarsLoading, setAllColorsToVarsLoading] = useState(false);
  const [textRecomputeRunning, setTextRecomputeRunning] = useState(false);
  const [textRecomputeTotal, setTextRecomputeTotal] = useState(0);
  const [textRecomputeDone, setTextRecomputeDone] = useState(0);
  const [orphanScanRunning, setOrphanScanRunning] = useState(false);
  const [orphanScanTotal, setOrphanScanTotal] = useState(0);
  const [orphanScanChecked, setOrphanScanChecked] = useState(0);
  const [orphanScanFound, setOrphanScanFound] = useState(0);

  const paddingRangeMax = useMemo(() => getPaddingRangeMax(randomnessLevel), [randomnessLevel]);

  return {
    // Data
    paddingData,
    setPaddingData,
    numberVariables,
    setNumberVariables,
    // UI State
    apiUrl,
    setApiUrl,
    popupOpen,
    setPopupOpen,
    popupContent,
    setPopupContent,
    editingNodeId,
    setEditingNodeId,
    editingName,
    setEditingName,
    apiUrlPopupOpen,
    setApiUrlPopupOpen,
    // Loading States
    selectAutoLayoutLoading,
    setSelectAutoLayoutLoading,
    fixPaddingsLoading,
    setFixPaddingsLoading,
    createVariablesLoading,
    setCreateVariablesLoading,
    colorsToVarsLoading,
    setColorsToVarsLoading,
    allColorsToVarsLoading,
    setAllColorsToVarsLoading,
    // Text recompute
    textRecomputeRunning,
    setTextRecomputeRunning,
    textRecomputeTotal,
    setTextRecomputeTotal,
    textRecomputeDone,
    setTextRecomputeDone,
    orphanScanRunning,
    setOrphanScanRunning,
    orphanScanTotal,
    setOrphanScanTotal,
    orphanScanChecked,
    setOrphanScanChecked,
    orphanScanFound,
    setOrphanScanFound,
    // Settings
    randomnessLevel,
    setRandomnessLevel,
    toolbarsVisible,
    setToolbarsVisible,
    // Modals
    arrangeNamingOpen,
    setArrangeNamingOpen,
    postfixInput,
    setPostfixInput,
    isNamingPromptOpen,
    setIsNamingPromptOpen,
    prefixInput,
    setPrefixInput,
    // Selection
    hasFramesSelected,
    setHasFramesSelected,
    hasDuplicateSelection,
    setHasDuplicateSelection,
    // Tabs
    activeTab,
    setActiveTab,
    // Computed
    paddingRangeMax,
  };
};
