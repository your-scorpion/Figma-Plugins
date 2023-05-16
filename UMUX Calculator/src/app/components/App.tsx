import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridCellParams } from '@mui/x-data-grid';
import { IconButton, Typography, Box, Alert, AlertTitle, Stack, Grow, Slide, Zoom, Dialog } from '@mui/material';
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import FormGroup from '@mui/material/FormGroup';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import YourLogo from './yourlogo.svg';
import YourLogo2 from './yourlogo2.svg';
import '../styles/ui.css';
import { GridValueFormatterParams } from '@mui/x-data-grid';



let average_cal = 1; 
let total_cal = 1; 

const priorityFormater = (cell) => {
    return (
        <span>
            <span className="priority-span">{cell}</span>
        </span>
    );
};


const rows: GridRowsProp = [
    { id: 1, col1: average_cal, col2: total_cal, col4: 1, },
    { id: 2, col1: average_cal, col2: total_cal, col4: 2, },
    { id: 3, col1: average_cal, col2: total_cal, col4: 3, },
    { id: 4, col1: average_cal, col2: total_cal, col4: 4, },
    { id: 5, col1: average_cal, col2: total_cal, col4: 5, },
    { id: 6, col1: average_cal, col2: total_cal, col4: 6, },
    { id: 7, col1: average_cal, col2: total_cal, col4: 7, },
    { id: 8, col1: average_cal, col2: total_cal, col4: 8, },
    { id: 9, col1: average_cal, col2: total_cal, col4: 9, },
    { id: 10, col1: average_cal, col2: total_cal, col4: 10, },
    { id: 11, col1: average_cal, col2: total_cal, col4: 11, },
    { id: 12, col1: average_cal, col2: total_cal, col4: 12, },
];

const columns: GridColDef[] = [
  {
    field: 'col4',
    cellClassName: 'super',
    sortable: false,
    type: 'string',
    align: 'left',
    width: 20,
    maxWidth: 25,
    flex: 0.1,
    filterable: false,
    headerName: '№',
    editable: false,
  },
  {
    field: 'col1',
    cellClassName: 'super-app-theme--cell',
    sortable: false,
    type: 'number',
    align: 'left',
    maxWidth: 99,
    minWidth: 80,
    filterable: false,
    headerName: 'Its features meet my needs',
    editable: true,
    valueFormatter: (params) => {
      if (params.value > 7 || params.value < 1) {
        return '❌';
      }
      return null;
    },
  },
  {
    field: 'col2',
    sortable: false,
    cellClassName: 'super-app-theme--cell',
    type: 'number',
    align: 'left',
    flex: 0.26,
    minWidth: 35,
    filterable: false,
    headerName: 'It is easy to use',
    editable: true,
    valueFormatter: (params) => {
      if (params.value > 7 || params.value < 1) {
        return '❌';
      }
      return null;
    },
  },
  {
    field: 'col3',
    flex: 0.22,
    type: 'number',
    sortable: false,
    filterable: false,
    hideable: false,
    align: 'center',
    minWidth: 50,
    maxWidth: 600,
    headerName: 'UMUX for each respondent',
    editable: false,
    width: 180,
    valueGetter: (params) => Math.round((Math.round(params.row.col1) / 7 + params.row.col2 / 7) / 2 * 100),
    renderCell: (params) => priorityFormater(params.value),
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.value as number;
      if (value >= 100) {
        return `${value}% - Excellent`;
      } else if (value >= 70) {
        return `${value}% - Good`;
      } else if (value >= 50) {
        return `${value}% - Average`;
      } else {
        return `${value}% - Poor`;
      }
    },
  },
];






function App() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);


    const AntSwitch = styled(Switch)(({ theme }) => ({
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
        '&:active': {
            '& .MuiSwitch-thumb': {
                width: 15,
            },
            '& .MuiSwitch-switchBase.Mui-checked': {
                transform: 'translateX(9px)',
            },
        },
        '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
                transform: 'translateX(12px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
                },
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            width: 12,
            height: 12,
            borderRadius: 6,
            transition: theme.transitions.create(['width'], {
                duration: 200,
            }),
        },
        '& .MuiSwitch-track': {
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgb(76,226,136)' : 'rgb(76,226,136)',
            boxSizing: 'border-box',
        },
    }));


    React.useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = (event) => {
            const { type, message } = event.data.pluginMessage;
            if (type === 'create-rectangles') {
                console.log(`Figma Says: ${message}`);
            }
        };
    }, []);



    const [isDiv1, setIsDiv1] = useState(true);

    const handleSwitchChange = (event) => {
      setIsDiv1(event.target.checked);
    };

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };



    return (
        <div>
            <div>
            <Dialog
              fullScreen
              open={open}
              onClose={handleClose}
            >
              <FormGroup>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ zIndex: 3, pl: 2.82 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ zIndex: 2 }}>
                    <Typography>Confidence Level:</Typography>
                    <Typography>95</Typography>
                    <AntSwitch checked={isDiv1} onChange={handleSwitchChange} inputProps={{ 'aria-label': 'ant design' }} />
                    <Typography sx={{ pr: 3.42 }}>90</Typography>
                    <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                      <CloseIcon />
                    </IconButton>
                  </Stack>
                </Stack>

                <div>
                  {isDiv1 ? (
                    <div>
                      <img src={YourLogo} height={550} width={300} />
                    </div>
                  ) : (
                    <div>
                      <img src={YourLogo2} height={550} width={300} />
                    </div>
                  )}
                </div>
              </FormGroup>
            </Dialog>
            </div>
              
       


        <Slide
          in={isMounted}
          style={{ transformOrigin: '0 0 0' }}
          {...(isMounted ? { timeout: 600 } : {})}
        >
          <Stack sx={{ width: '100%' }} direction="row" justifyContent="flex-start" spacing={0}>
            <Alert icon={false} severity="info" sx={{ mt: -1, ml: -1, fontSize: 12, width: '320px', '& .MuiAlert-message': { textAlign: "left", width: "inherit" } }}>
              <AlertTitle sx={{ fontSize: 12, color: '#A1B2C7' }}>UMUX calculator</AlertTitle>
              Two questions, the user answers in a range from <strong>1 to 7</strong> and the result is calculated from <strong>0 to 100%</strong>;

              <PopupState variant="popover" popupId="demo-popup-popover">
                {(popupState) => (
                  <div>
                    <Zoom
                      in={isMounted}
                      style={{ transformOrigin: '0 0 0' }}
                      {...(isMounted ? { timeout: 1211 } : {})}
                    >
                      <span>
                        <IconButton sx={{ mt: -8, ml: 11 }} color="primary" edge='start' size='small' aria-label="Help me with it please" {...bindTrigger(popupState)}>
                          <LightbulbCircleIcon color="primary" />
                        </IconButton>

                        <IconButton sx={{ mt: -8, ml: 13.73, zIndex: 2 }} onClick={handleClickOpen}>
                          <Typography color="primary" fontSize={12}> Sample Size </Typography>
                        </IconButton>
                      </span>
                    </Zoom>

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
                      PaperProps={{
                        style: { width: '320px' },
                      }}
                    >
                      <Typography align="left" variant="body2" sx={{ p: 2 }}>
                        UMUX is a measure of complexity. Responses are coded by the user from 1 to 7, from disagreement to agreement, with 1 being the most negative and 7 the most positive. UMUX scores are converted to a 0-100 point scale using a simple linear transformation. The formula in this plugin for UMUX = ((q1 / 7) + (q2 / 7)) / 2 x 100, which gives a range of 14 to 100.
                      </Typography>
                    </Popover>
                  </div>
                )}
              </PopupState>
            </Alert>
          </Stack>
        </Slide>



        <div style={{ height: 390, width: '100%', paddingTop: '12px' }}>
          <Grow in={isMounted} style={{ transformOrigin: '0 0 0' }} {...(isMounted ? { timeout: 600 } : {})}>
            <Box
              sx={{
                height: 300,
                width: '100%',
                '& .cold': {
                  backgroundColor: '#F4F2F1',
                  color: '#1a3e72',
                },
                '& .hot': {
                  backgroundColor: '#CAE3BB',
                  color: '#1a3e72',
                },
              }}
            >
              <DataGrid
                columnHeaderHeight={60}
                autoHeight={true}
                hideFooter={true}
                rowHeight={25}
                rows={rows}
                columns={columns}
                sx={{
                  '& .MuiDataGrid-columnHeaderTitle': {
                    textOverflow: 'clip',
                    whiteSpace: 'break-spaces',
                    lineHeight: 1,
                  },
                  backgroundColor: '#FDFDFD',
                  fontSize: '0.865rem',
                  boxShadow: 1,
                  borderColor: '#FDFDFD',
                  '& .hideRightSeparator > .MuiDataGrid-columnSeparator': {
                    display: 'none',
                  },
                  '& .super-app-theme--cell': {
                    backgroundColor: 'rgba(255, 255, 255, 0.55)',
                    color: '#171717',
                    fontWeight: '600',
                  },
                  '& .super': {
                    backgroundColor: 'rgba(201, 201, 202, 1)',
                    color: '#929397',
                    fontWeight: '300',
                  },
                }}
                getCellClassName={(params: GridCellParams<any, any, number>) => {
                  if (params.field === 'city' || params.value == null) {
                    return '';
                  }
                  return params.value >= 68 ? 'hot' : 'cold';
                }}
              />
            </Box>
          </Grow>
        </div>
    </div>
    );
}

export default App;