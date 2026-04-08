import { useEffect, useRef, useState } from 'react';
import '../styles/ui.css';
import './styles/animations.css';
import { useAppState } from './hooks/useAppState';
import { usePluginMessages } from './hooks/usePluginMessages';
import { useToolbarVisibility } from './hooks/useToolbarVisibility';
import { useBottomToolbarHeight } from './hooks/useBottomToolbarHeight';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { TabNavigation } from './TabNavigation';
import { TopToolbar } from './TopToolbar';
import { BottomToolbar } from './BottomToolbar';
import { EmptyState } from './EmptyState';
import { PaddingNode } from './PaddingNode';
import { ColorTab } from './ColorTab';
import { ButtonsTab } from './ButtonsTab';
import { NamingPromptModal } from './modals/NamingPromptModal';
import { ArrangeFramesModal } from './modals/ArrangeFramesModal';
import { ApiUrlModal } from './modals/ApiUrlModal';
import { ApiResponseModal } from './modals/ApiResponseModal';
import { sendSelectNextAutoLayout, sendCreatePaddingVariables } from './utils/pluginMessages';
import { TabType } from './types';

const TAB_ORDER: TabType[] = ['paddings', 'colors', 'buttons'];

function getTabDirection(currentTab: TabType, nextTab: TabType): 'forward' | 'backward' {
  return TAB_ORDER.indexOf(nextTab) >= TAB_ORDER.indexOf(currentTab) ? 'forward' : 'backward';
}

function App() {
  const state = useAppState();
  const bottomToolbarRef = useRef<HTMLDivElement>(null);
  const bottomToolbarHeight = useBottomToolbarHeight(bottomToolbarRef);
  const [displayedTab, setDisplayedTab] = useState<TabType>(state.activeTab);
  const [tabTransitionPhase, setTabTransitionPhase] = useState<'idle' | 'exit' | 'enter'>('idle');
  const [tabTransitionDirection, setTabTransitionDirection] = useState<'forward' | 'backward'>('forward');

  // Initialize hooks
  usePluginMessages({
    setPaddingData: state.setPaddingData,
    setNumberVariables: state.setNumberVariables,
    setHasFramesSelected: state.setHasFramesSelected,
    setHasDuplicateSelection: state.setHasDuplicateSelection,
    setTextRecomputeRunning: state.setTextRecomputeRunning,
    setTextRecomputeTotal: state.setTextRecomputeTotal,
    setTextRecomputeDone: state.setTextRecomputeDone,
    setOrphanScanRunning: state.setOrphanScanRunning,
    setOrphanScanTotal: state.setOrphanScanTotal,
    setOrphanScanChecked: state.setOrphanScanChecked,
    setOrphanScanFound: state.setOrphanScanFound,
  });

  useToolbarVisibility(state.setToolbarsVisible);
  useKeyboardShortcuts(
    state.popupOpen,
    state.apiUrlPopupOpen,
    state.setPopupOpen,
    state.setApiUrlPopupOpen
  );

  // Handlers
  const handleSelectAutoLayout = () => {
    state.setSelectAutoLayoutLoading(true);
    sendSelectNextAutoLayout();
    setTimeout(() => state.setSelectAutoLayoutLoading(false), 1000);
  };

  const handleCreateVariables = () => {
    if (state.paddingData.length === 0) return;
    state.setIsNamingPromptOpen(true);
  };

  const handleCreateVariablesConfirm = () => {
    const raw = (state.prefixInput || 'padding').trim();
    let prefix = raw.replace(/[\x00-\x1F\x7F]/g, '').replace(/\s+/g, '-');
    if (!prefix) prefix = 'padding';
    state.setIsNamingPromptOpen(false);
    state.setCreateVariablesLoading(true);
    sendCreatePaddingVariables(prefix);
    setTimeout(() => state.setCreateVariablesLoading(false), 2000);
  };

  useEffect(() => {
    if (state.activeTab === displayedTab && tabTransitionPhase === 'idle') return;
    if (state.activeTab === displayedTab && tabTransitionPhase === 'enter') return;

    setTabTransitionDirection(getTabDirection(displayedTab, state.activeTab));
    setTabTransitionPhase('exit');
  }, [state.activeTab, displayedTab, tabTransitionPhase]);

  const renderContent = (tab: TabType) => {
    if (tab === 'paddings' && state.paddingData.length === 0) {
      return (
        <EmptyState
          randomnessLevel={state.randomnessLevel}
          hasDuplicateSelection={state.hasDuplicateSelection}
          hasFramesSelected={state.hasFramesSelected}
          fixPaddingsLoading={state.fixPaddingsLoading}
          selectAutoLayoutLoading={state.selectAutoLayoutLoading}
          onSelectAutoLayout={handleSelectAutoLayout}
          onArrangeNamingOpen={() => state.setArrangeNamingOpen(true)}
        />
      );
    }

    if (tab === 'paddings') {
      return state.paddingData.map((node) => (
        <PaddingNode
          key={node.id}
          node={node}
          numberVariables={state.numberVariables}
          editingNodeId={state.editingNodeId}
          editingName={state.editingName}
          setEditingNodeId={state.setEditingNodeId}
          setEditingName={state.setEditingName}
        />
      ));
    }

    if (tab === 'colors') {
      return (
        <ColorTab
          hasFramesSelected={state.hasFramesSelected}
          colorsToVarsLoading={state.colorsToVarsLoading}
          allColorsToVarsLoading={state.allColorsToVarsLoading}
          onColorsToVarsLoadingChange={state.setColorsToVarsLoading}
          onAllColorsToVarsLoadingChange={state.setAllColorsToVarsLoading}
        />
      );
    }

    if (tab === 'buttons') {
      return (
        <ButtonsTab
          orphanScanRunning={state.orphanScanRunning}
          orphanScanTotal={state.orphanScanTotal}
          orphanScanChecked={state.orphanScanChecked}
          orphanScanFound={state.orphanScanFound}
          recomputeRunning={state.textRecomputeRunning}
          recomputeTotal={state.textRecomputeTotal}
          recomputeDone={state.textRecomputeDone}
        />
      );
    }

    return null;
  };

  const handleTabPanelAnimationEnd = () => {
    if (tabTransitionPhase === 'exit') {
      setDisplayedTab(state.activeTab);
      setTabTransitionPhase('enter');
      return;
    }

    if (tabTransitionPhase === 'enter') {
      setTabTransitionPhase('idle');
    }
  };

  return (
    <>
      <TopToolbar
        isVisible={state.toolbarsVisible}
        paddingDataLength={state.paddingData.length}
        selectAutoLayoutLoading={state.selectAutoLayoutLoading}
        createVariablesLoading={state.createVariablesLoading}
        onSelectAutoLayout={handleSelectAutoLayout}
        onCreateVariables={handleCreateVariables}
      />

      <div
        data-main-container
        style={{
          margin: '0 auto',
          paddingTop: 56,
          paddingBottom: bottomToolbarHeight,
          overflowY: 'auto',
          transition: 'padding 0.2s ease',
        }}
      >
        <TabNavigation activeTab={state.activeTab} onTabChange={state.setActiveTab} />
        <div
          className={`tab-panel tab-panel--${tabTransitionPhase} tab-panel--${tabTransitionDirection}`}
          onAnimationEnd={handleTabPanelAnimationEnd}
        >
          {renderContent(displayedTab)}
        </div>
      </div>

      <BottomToolbar
        toolbarRef={bottomToolbarRef}
        isVisible={state.toolbarsVisible}
        activeTab={state.activeTab}
        paddingDataLength={state.paddingData.length}
        randomnessLevel={state.randomnessLevel}
        fixPaddingsLoading={state.fixPaddingsLoading}
        onRandomnessChange={state.setRandomnessLevel}
        onApiUrlPopupOpen={() => state.setApiUrlPopupOpen(true)}
      />

      {/* Modals */}
      <NamingPromptModal
        isOpen={state.isNamingPromptOpen}
        prefixInput={state.prefixInput}
        onClose={() => state.setIsNamingPromptOpen(false)}
        onPrefixChange={state.setPrefixInput}
        onCreate={handleCreateVariablesConfirm}
        isLoading={state.createVariablesLoading}
      />

      <ArrangeFramesModal
        isOpen={state.arrangeNamingOpen}
        postfixInput={state.postfixInput}
        randomnessLevel={state.randomnessLevel}
        onClose={() => state.setArrangeNamingOpen(false)}
        onPostfixChange={state.setPostfixInput}
      />

      <ApiUrlModal
        isOpen={state.apiUrlPopupOpen}
        apiUrl={state.apiUrl}
        onClose={() => state.setApiUrlPopupOpen(false)}
        onUrlChange={state.setApiUrl}
        onResponse={state.setPopupContent}
        onOpenResponse={() => state.setPopupOpen(true)}
      />

      <ApiResponseModal
        isOpen={state.popupOpen}
        content={state.popupContent}
        onClose={() => state.setPopupOpen(false)}
      />
    </>
  );
}

export default App;
