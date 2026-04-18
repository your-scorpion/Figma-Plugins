import React from 'react';
import { TabType } from './types';

type TabNavigationProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
};

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="segmented-control" role="radiogroup" aria-label="Tabs">
      <div className="segmented-group">
        <SegmentRadio
          label="Paddings"
          value="paddings"
          checked={activeTab === 'paddings'}
          onChange={() => onTabChange('paddings')}
        />
        <SegmentRadio
          label="Colors"
          value="colors"
          checked={activeTab === 'colors'}
          onChange={() => onTabChange('colors')}
        />
        <SegmentRadio
          label="More"
          value="buttons"
          checked={activeTab === 'buttons'}
          onChange={() => onTabChange('buttons')}
        />
      </div>
    </div>
  );
};

type SegmentProps = {
  label: string;
  value: TabType;
  checked: boolean;
  onChange: () => void;
};

const SegmentRadio: React.FC<SegmentProps> = ({ label, value, checked, onChange }) => {
  return (
    <>
      <input
        className="segment-input"
        type="radio"
        role="radio"
        aria-checked={checked}
        name="main-tabs"
        id={`tab-${value}`}
        checked={checked}
        onChange={onChange}
        value={value}
      />
      <label
        className={`segment-button${checked ? ' is-active' : ''}`}
        htmlFor={`tab-${value}`}
        data-value={value}
        title={label}
      >
        {label}
      </label>
    </>
  );
};
