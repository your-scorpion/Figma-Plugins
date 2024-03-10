import React from 'react';
import { Button, Popover } from '@mui/material';
import { usePopupState, bindPopover, bindTrigger } from 'material-ui-popup-state/hooks';

function SecondPopover() {
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoPopover' });

  return (
    <div> 
      <Button {...bindTrigger(popupState)}>Open Popover</Button>
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div style={{ padding: 10 }}>
          <p>This is a popover with PopupState.</p>
          <p>Click outside of the popover to close it.</p>
        </div>
      </Popover>
    </div>
  );
}

export default SecondPopover;
