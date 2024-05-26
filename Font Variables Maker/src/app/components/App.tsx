import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/ui.css';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import { GlobalStyles } from '@mui/material';
import Grow from '@mui/material/Grow';
//import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import Button from '@mui/material/Button';
//import { styled } from '@mui/material/styles';
//import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
//import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Draggable from 'react-draggable';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { PaperProps } from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import Zoom from '@mui/material/Zoom';

function App() {
  const textbox = useRef<HTMLInputElement>(null);

  function PaperComponent(props: PaperProps) {
    return (
      <>
        <GlobalStyles
          styles={{
            html: { overflow: 'hidden' },
            body: { overflow: 'hidden' },
          }}
        />
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
          <Paper {...props} />
        </Draggable>
      </>
    );
  }

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [checked, setChecked] = useState(true); // Initialize to true to start the transition

  const countRef = useCallback((element: HTMLInputElement) => {
    if (element) element.value = '1';
    textbox.current = element;
  }, []);

  const [isChecked, setIsChecked] = useState(false); // Declare isChecked state variable and its setter
  const [selectedTextNodesCount, setSelectedTextNodesCount] = useState(0); // State to store the count of selected text nodes
  const [animationTrigger, setAnimationTrigger] = useState(true); // State to trigger the animation

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked; // Get the checked state of the checkbox
    setIsChecked(isChecked); // Update isChecked state based on checkbox state
  };

  // Define state variables for controlling Slide and Zoom separately
  const [slideTrigger, setSlideTrigger] = useState(true);
  const [zoomTrigger, setZoomTrigger] = useState(true);

  // Update useEffect hooks to set the respective triggers
  useEffect(() => {
    setSlideTrigger(animationTrigger);
  }, [animationTrigger]);

  useEffect(() => {
    setZoomTrigger(animationTrigger);
  }, [animationTrigger]);

  const updateSelectedTextNodesCount = (count) => {
    setSelectedTextNodesCount(count); // Update the count of selected text nodes
  };

  const [count, setCount] = useState(1); // Add state to manage the count value
  const handleCountChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setCount(value < 0 ? 0 : value); // Ensure the count is non-negative
  };

  /*useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message, selectedTextNodesCount } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      } else if (type === 'selected-text-nodes-count') {
        updateSelectedTextNodesCount(selectedTextNodesCount); // Call the update function
        setAnimationTrigger((prevState) => !prevState); // Toggle the animation trigger
      }
    };
  }, []);*/

  const copyCountToTextField = () => {
    setCount(selectedTextNodesCount); // Copy the selectedTextNodesCount to the count state
  };

  useEffect(() => {
    window.onmessage = (event) => {
      const { type, selectedTextNodesCount } = event.data.pluginMessage;
      if (type === 'selected-text-nodes-count') {
        updateSelectedTextNodesCount(selectedTextNodesCount);
        setAnimationTrigger(false); // Set animationTrigger to false to trigger the out animation
        setTimeout(() => setAnimationTrigger(true), 91); // Set animationTrigger back to true after 12 milliseconds to trigger the in animation
      }
    };
  }, []);

  const defaultSeverity = selectedTextNodesCount > 0 ? 'success' : 'warning';

  const onCreate = () => {
    const count = parseInt(textbox.current.value, 10);
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', count, isChecked } }, '*');
  };

  const onAction = () => {
    const selectAlltexts = true;
    const count = parseInt(textbox.current.value, 10);
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', selectAlltexts, isChecked, count } }, '*');
  };

  const onDeselect = () => {
    parent.postMessage({ pluginMessage: { type: 'select-text-nodes-without-variables' } }, '*');
  };

  const onDeselect2 = () => {
    parent.postMessage({ pluginMessage: { type: 'select-text-nodes-without-variables2' } }, '*');
  };

  const onDeselect3 = () => {
    parent.postMessage({ pluginMessage: { type: 'select-text-nodes-without-variables3' } }, '*');
  };

  const onDeselect4 = () => {
    parent.postMessage({ pluginMessage: { type: 'select-text-nodes-without-variables4' } }, '*');
  };

  const onDeselect5 = () => {
    parent.postMessage({ pluginMessage: { type: 'select-text-nodes-without-variables5' } }, '*');
  };

  const buttonColor = defaultSeverity === 'success' ? 'success' : 'warning';
  useEffect(() => {
    // Trigger the slide transition when animationTrigger becomes true
    setChecked(animationTrigger);
  }, [animationTrigger]);
  return (
    <div>
      {' '}
      <Dialog
        sx={{ maxHeight: '100%' }}
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        PaperProps={{ sx: { overflow: 'hidden' } }}
      >
        <Grid justifyContent="flex-start" alignItems="baseline" direction="column" container spacing={1}>
          <Paper className="odkd" elevation={0} sx={{ padding: '4px', marginLeft: '2px', borderRadius: '0px' }}>
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              How to Use{' '}
              <DialogActions>
                <Button autoFocus onClick={handleClose} sx={{ marginTop: '-43px', overflow: 'hidden' }}>
                  Got It!
                </Button>
              </DialogActions>
            </DialogTitle>{' '}
            <DialogContent sx={{ marginTop: '-43px' }}>
              <Zoom in={zoomTrigger} mountOnEnter unmountOnExit>
                <DialogContentText>
                  <Slide direction="up" in={slideTrigger} mountOnEnter unmountOnExit>
                    <ul>
                      <Zoom in={checked} mountOnEnter unmountOnExit timeout={{ enter: 500, exit: 300 }}>
                        <li>1️⃣ Select Text Layers</li>
                      </Zoom>
                      <Zoom in={checked} mountOnEnter unmountOnExit timeout={{ enter: 600, exit: 400 }}>
                        <li>2️⃣ Click «Generate new variables set»</li>
                      </Zoom>
                      <Zoom in={checked} mountOnEnter unmountOnExit timeout={{ enter: 700, exit: 500 }}>
                        <li>
                          3️⃣ A new set of variables will be created under the name «Generated Font Collection» in Local
                          variables
                        </li>
                      </Zoom>
                      <Zoom in={checked} mountOnEnter unmountOnExit timeout={{ enter: 800, exit: 600 }}>
                        <li>
                          4️⃣ For selected texts, current font-names will be replaced by created variables. You can limit
                          the number of created variables with the "Max number of variables" parameter.
                        </li>
                      </Zoom>
                    </ul>
                  </Slide>
                </DialogContentText>
              </Zoom>{' '}
            </DialogContent>
          </Paper>
        </Grid>
      </Dialog>{' '}
      <Grid justifyContent="flex-start" alignItems="baseline" direction="column" container spacing={1}>
        <Paper elevation={0} sx={{ padding: '28px', marginLeft: '6px', borderRadius: '22px', maxHeight: '168px' }}>
          <Grid alignItems="flex-start" direction="row" container spacing={1}>
            <>
              <Grid md={1}>
                <TextField
                  sx={{ width: '154px' }}
                  id="filled-number"
                  label="Max number of variables"
                  type="number"
                  size="small"
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="filled"
                  inputRef={countRef}
                  value={count} // Bind the value to the count state
                  onChange={handleCountChange} // Handle changes to the input value
                />
              </Grid>
            </>
            <Grid md={1}>
              <FormGroup aria-label="position" row sx={{ marginTop: '12px' }}>
                <FormControlLabel
                  sx={{
                    width: '175px',
                    textAlign: 'left',
                    '& .MuiFormControlLabel-label': {
                      fontSize: '15px', // Change this value to your desired font size
                    },
                  }}
                  control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                  label="Replace current variables on texts"
                />
              </FormGroup>
            </Grid>
          </Grid>
          <Divider />
          <Grid alignItems="flex-start" direction="row" container spacing={1}>
            <Button
              id="create"
              size="large"
              onClick={onCreate}
              variant="contained"
              disabled={selectedTextNodesCount === 0}
              sx={{
                marginTop: '16px',

                marginLeft: '3px',
                opacity: selectedTextNodesCount === 0 ? 0.2 : 1,
                pointerEvents: selectedTextNodesCount === 0 ? 'none' : 'auto', // This is to ensure the button is not clickable when disabled
              }}
            >
              Generate new variables set
            </Button>
          </Grid>
        </Paper>
      </Grid>
      <span>
        <Paper elevation={0} sx={{ marginTop: '16px', borderRadius: '22px', padding: '26px' }}>
          {' '}
          <span className="exper">
            <Grid rowSpacing={1} direction="row" container spacing={1}>
              <Alert icon={false} severity={defaultSeverity}>
                <div>
                  <>
                    <>
                      Selected text nodes: <Grow  timeout={232} in={animationTrigger}><span>{selectedTextNodesCount} </span></Grow>
                      <span className="spacer"> </span>
                      <Grow in={animationTrigger} timeout={12}>
                        <Button variant="outlined" size="small" color={buttonColor} onClick={copyCountToTextField}>
                          Use this value
                        </Button>
                      </Grow>
                    </>
                  </>
                </div>{' '}
              </Alert>
            </Grid>
          </span>
          <Divider className="djsokkajdasjk" />
          <div className="ddss">Select texts:</div>
          <Grid alignItems="flex-start" direction="row" container spacing={0.84}>
            <Grid alignItems="flex-start" direction="column" container spacing={0}>
              <Grid md={1}>
                <Button
                  size="small"
                  onClick={onAction}
                  sx={{
                    color: 'black',
                    borderColor: 'black',
                    '&:hover': {
                      borderColor: 'black',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)', // Light black background on hover
                    },
                  }}
                >
                  All Text-layers
                </Button>
              </Grid>
              <Grid md={1}>
                <Button
                  size="small"
                  onClick={onDeselect}
                  sx={{
                    color: 'black',
                    borderColor: 'black',
                    '&:hover': {
                      borderColor: 'black',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)', // Light black background on hover
                    },
                  }}
                >
                  With No Variables
                </Button>
              </Grid>
              <Grid md={1}>
                <Button color="error" size="small" onClick={onDeselect5}>
                  Invert selection
                </Button>
              </Grid>
            </Grid>
            <Grid alignItems="flex-start" direction="column" container spacing={0}>
              <Grid md={1}>
                <Button
                  size="small"
                  onClick={onDeselect3}
                  sx={{
                    color: 'black',
                    borderColor: 'black',
                    '&:hover': {
                      borderColor: 'black',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)', // Light black background on hover
                    },
                  }}
                >
                  No variables, frames only
                </Button>
              </Grid>{' '}
              <Grid md={1}>
                <Button color="error" size="small" onClick={onDeselect2}>
                  All layers Except Texts
                </Button>
              </Grid>
              <Grid md={1}>
                <Button color="error" size="small" onClick={onDeselect4}>
                  Deselect All
                </Button>
              </Grid>
            </Grid>
          </Grid>{' '}
        </Paper>
      </span>
      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <Button
        sx={{
          color: 'black',
          borderColor: 'black',
          '&:hover': {
            borderColor: 'black',
            backgroundColor: 'rgba(0, 0, 0, 0.04)', // Light black background on hover
          },
        }}
        variant="outlined"
        className="lkdjkldjoiwhkj"
        onClick={handleClickOpen}
      >
        Instruction
      </Button>
    </div>
  );
}

export default App;
