import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/ui.css';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
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
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

function App() {
  const textbox = useRef<HTMLInputElement>(null);

  const selectButtonSx = {
    textTransform: 'none',
    borderRadius: '10px',
    px: 1,
    py: 0.4,
    fontSize: '12px',
    letterSpacing: '0.05px',
    color: '#1f2937',
    borderColor: '#d1d5db',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#cbd5e1',
      backgroundColor: '#eef2f7',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  } as const;

  const dangerButtonSx = {
    ...selectButtonSx,
    color: '#b91c1c',
    borderColor: '#fecaca',
    backgroundColor: '#fff1f2',
    '&:hover': {
      borderColor: '#fca5a5',
      backgroundColor: '#ffe4e6',
      transform: 'translateY(-1px)',
    },
  } as const;

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
  const [isReplacingUnavailable, setIsReplacingUnavailable] = useState(false);
  const [replaceUnavailableProgress, setReplaceUnavailableProgress] = useState(0);
  const [isReplacing, setIsReplacing] = useState(false);
  const [replaceProgress, setReplaceProgress] = useState(0);
  const [replacementFamily, setReplacementFamily] = useState('Manrope');

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
      const { type, selectedTextNodesCount, total, processed } = event.data.pluginMessage;
      if (type === 'selected-text-nodes-count') {
        updateSelectedTextNodesCount(selectedTextNodesCount);
        setAnimationTrigger(false); // Set animationTrigger to false to trigger the out animation
        setTimeout(() => setAnimationTrigger(true), 91); // Set animationTrigger back to true after 12 milliseconds to trigger the in animation
      } else if (type === 'replace-start') {
        setIsReplacing(true);
        setReplaceProgress(0);
      } else if (type === 'replace-progress') {
        const pct = total && total > 0 ? Math.round((processed / total) * 100) : 0;
        setReplaceProgress(pct);
      } else if (type === 'replace-complete') {
        setReplaceProgress(100);
        setTimeout(() => setIsReplacing(false), 150);
      } else if (type === 'unavailable-start') {
        setIsReplacingUnavailable(true);
        setReplaceUnavailableProgress(0);
      } else if (type === 'unavailable-progress') {
        const pct2 = total && total > 0 ? Math.round((processed / total) * 100) : 0;
        setReplaceUnavailableProgress(pct2);
      } else if (type === 'unavailable-complete') {
        setReplaceUnavailableProgress(100);
        setTimeout(() => setIsReplacingUnavailable(false), 150);
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

  const onReplaceBySize = () => {
    parent.postMessage({ pluginMessage: { type: 'replace-texts-by-size', targetFamily: replacementFamily } }, '*');
    setIsReplacing(true);
    setReplaceProgress(0);
  };

  const onReplaceUnavailableFonts = () => {
    parent.postMessage({ pluginMessage: { type: 'replace-unavailable-fonts', fallbackFamily: replacementFamily } }, '*');
    setIsReplacingUnavailable(true);
    setReplaceUnavailableProgress(0);
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
        <Paper elevation={0} sx={{ padding: '16px', marginLeft: '4px', borderRadius: '16px', maxHeight: '160px' }}>
          <Grid alignItems="flex-start" direction="row" container spacing={0.5} columns={12}>
            <>
              <Grid md={8}>
                <TextField
                  sx={{ width: '100%' }}
                  id="filled-number"
                  label="Max number of variables to be created"
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
            <Grid md={4}>
              {selectedTextNodesCount > 0 ? (
                <span>
                  <Button
                      id="create"
                      size="medium"
                    onClick={onCreate}
                    variant="contained"
                    sx={{
                      marginTop: '6px',
                      marginLeft: '8px',
                      opacity: 1,
                      pointerEvents: 'auto',
                    }}
                  >
                    Generate 
                  </Button>
                </span>
              ) : (
                <Tooltip
                  title="Select one or more text layers."
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: '#fff',
                        color: '#444',
                        boxShadow: '0px 0px 10px rgba(0,0,0,0.12)',
                        border: '1px solid #999',
                        padding: '8px',
                        '& .MuiTooltip-arrow': {
                          color: '#fff',
                          border: '1px solid #999',
                        },
                      },
                    },
                  }}
                >
                  <span>
                    <Button
                      id="create"
                      size="medium"
                      onClick={onCreate}
                      variant="contained"
                      disabled={true}
                      sx={{
                        marginTop: '6px',
                        marginLeft: '8px',
                        opacity: 0.2,
                        pointerEvents: 'none',
                      }}
                    >
                      Generate
                    </Button>
                  </span>
                </Tooltip>
              )}
            </Grid>
           
            <Grid md={12}>
              <FormGroup aria-label="position" row sx={{ marginTop: '2px' }}>
                <FormControlLabel
                  sx={{
                    width: '100%',
                    textAlign: 'left',
                    '& .MuiFormControlLabel-label': {
                      fontSize: '11px',
                    },
                  }}
                control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} sx={{ transform: 'scale(0.85)', padding: '0 4px' }} />}
                label="Replace current variables on texts"
              />
              </FormGroup>
            </Grid>
          </Grid>

          
        </Paper>
      </Grid>
      <span>
        <Paper elevation={0} sx={{ marginTop: '10px', borderRadius: '16px', padding: '16px' }}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'left', fontWeight: 600 }}>Select the text layers on the page:</Typography>


          <Grid alignItems="flex-start" direction="row" container spacing={0.5} columns={12}>
            <Grid md={3}>
              <Button size="small" onClick={onAction} sx={selectButtonSx} variant="outlined">
                All Text-layers
              </Button>
            </Grid>
            <Grid md={3}>
              <Button size="small" onClick={onDeselect} sx={selectButtonSx} variant="outlined">
                With No Variables
              </Button>
            </Grid>
            <Grid md={3}>
              <Button size="small" onClick={onDeselect5} sx={dangerButtonSx} variant="outlined">
                Invert selection
              </Button>
            </Grid>
            <Grid md={3}>
              <Button size="small" onClick={onDeselect4} sx={dangerButtonSx} variant="outlined">
                Deselect All
              </Button>
            </Grid>
            <Grid md={3}>
              <Button size="small" onClick={onDeselect3} sx={selectButtonSx} variant="outlined">
                No variables, in frames only
              </Button>
            </Grid>
            <Grid md={3}>
              <Button size="small" onClick={onDeselect2} sx={dangerButtonSx} variant="outlined">
                All layers Except Texts
              </Button>
            </Grid>
             <Grid md={12} sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: '2px' }}>
              <Typography variant="body2" component="span">Selected texts:</Typography>
              <Grow timeout={232} in={animationTrigger}>
                <Chip size="small" label={String(selectedTextNodesCount)} sx={{ height: 20, '& .MuiChip-label': { px: '6px', fontSize: '11px' } }} />
              </Grow>
              <Grow in={animationTrigger} timeout={12}>
                <Button variant="outlined" size="small" color={buttonColor} onClick={copyCountToTextField} sx={{ minWidth: 'auto', height: 20, px: '6px', py: '2px', fontSize: '11px', letterSpacing: '0.2px' }}>
                  Use this value
                </Button>
              </Grow>
            </Grid>
            <Grid md={3}></Grid>
            <Grid md={3}></Grid>
          </Grid>
        </Paper>
      </span>
      <span>
        <Paper elevation={0} sx={{ marginTop: '10px', borderRadius: '16px', padding: '16px' }}>
          <Typography variant="subtitle1" sx={{ textAlign: 'left', fontWeight: 600 }}>Replace fonts</Typography>
          <Grid alignItems="flex-start" direction="row" container spacing={0.5} columns={12}>
            <Grid md={1}>
              <TextField
                sx={{ width: '100%' }}
                id="replacement-family"
                label="Fallback --- Replacement font family"
                type="text"
                size="small"
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
                fullWidth
                value={replacementFamily}
                onChange={(e) => setReplacementFamily(e.target.value)}
              />
            </Grid>
              <Grid md={3}>
                <Button
                  size="small"
                  onClick={onReplaceBySize}
                  disabled={isReplacing || selectedTextNodesCount === 0}
                  sx={selectButtonSx}
                  variant="outlined"
                >
                  {isReplacing ? 'Replacing…' : 'Replace by variables (size)'}
                </Button>
              {isReplacing && (
                <span style={{ marginLeft: '8px', verticalAlign: 'middle' }}>
                  <CircularProgress size={18} />
                  <span style={{ marginLeft: '6px', fontSize: '12px' }}>{replaceProgress}%</span>
                </span>
              )}
            </Grid>
              <Grid md={1}>
                <Button
                  size="small"
                  onClick={onReplaceUnavailableFonts}
                  disabled={isReplacingUnavailable || selectedTextNodesCount === 0}
                  sx={selectButtonSx}
                  variant="outlined"
                >
                  {isReplacingUnavailable ? 'Replacing…' : `Replace unavailable → ${replacementFamily}`}
                </Button>
              {isReplacingUnavailable && (
                <span style={{ marginLeft: '8px', verticalAlign: 'middle' }}>
                  <CircularProgress size={18} />
                  <span style={{ marginLeft: '6px', fontSize: '12px' }}>{replaceUnavailableProgress}%</span>
                </span>
              )}
            </Grid>
          </Grid>
        </Paper>
      </span>
<Divider />
      <Button
        sx={{
          color: 'black',
          letterSpacing: '1.2px',
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
