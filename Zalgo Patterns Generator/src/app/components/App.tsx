import * as React from 'react';
import '../styles/ui.css';
import { useEffect, useState, useRef } from "react";
import { App2 } from './new/newCom';
//import { Error } from './new/newCom2';
import StateTextFields from './new/secondValue';
// @ts-ignore
import Box from '@mui/material/Box';
// @ts-ignore
import Button from '@mui/material/Button';
// @ts-ignore
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
// @ts-ignore
import TextField from '@mui/material/TextField';
// @ts-ignore
import TextareaAutosize from '@mui/base/TextareaAutosize';
// @ts-ignore
import DoDisturbAltTwoToneIcon from '@mui/icons-material/DoDisturbAltTwoTone';
// @ts-ignore
import { InputAdornment } from '@mui/material';
// @ts-ignore
import AccountCircle from '@mui/icons-material/AccountCircle';
// @ts-ignore
import Filter1TwoToneIcon from '@mui/icons-material/Filter1TwoTone';
import ParentComponent from "./new/parentComponent";
// @ts-ignore
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
// @ts-ignore
import TextRotateUpIcon from '@mui/icons-material/TextRotateUp';
// @ts-ignore
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
// @ts-ignore
import Stack from '@mui/material/Stack';
// @ts-ignore
import Tooltip from '@mui/material/Tooltip';
// @ts-ignore
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
// @ts-ignore
import TextRotateUpIcon from '@mui/icons-material/TextRotateUp';
// @ts-ignore
import TextRotationDownIcon from '@mui/icons-material/TextRotationDown';
// @ts-ignore
import Backdrop from '@mui/material/Backdrop';
// @ts-ignore
import CircularProgress from '@mui/material/CircularProgress';
// @ts-ignore
import Zoom from '@mui/material/Zoom';


declare function require(path: string): any;

type Props = {
  children?: React.ReactNode
};

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; --i) {
    const j = Math.floor(Math.random() * i);
    const temp = newArray[i];
    newArray[i] = newArray[j];
    newArray[j] = temp;
  }

  return newArray;
}

const App = ({ }) => {
  const [message, setMessage] = useState('');
  const handleChange = event => {
    setMessage(event.target.value);
  };
  const textbox = React.useRef<HTMLInputElement>(undefined);
  const countRef = React.useCallback((element: HTMLInputElement) => {
    if (element) element.value = '2';
    textbox.current = element;
  }, []);

  const [code, setCode] = useState('');

  function withEvent(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
      console.clear();
    };
  }
  let amount22 = Number(code);

  const [code2, setCode2] = useState('');
  const [open, setOpen] = React.useState(false);


  function withEvent2(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);

    };
  }
  let numbersForPlayfulness = Number(code2);
  const [code3, setCode3] = useState('');

  function withEvent3(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);

    };
  }
  let newWayNumberForVariations = Number(code3);

  const [code4, setCode4] = useState('');

  function withEvent4(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);

    };
  }
  let numberForExperiments = Number(code4);
  const URL = "https://api.emojisworld.fr/v1/random?&&limit=1"

  //console.log(URL);
  const EMOJIREGEX = /[^a-zA-Z]+\p{Emoji}+(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
  const emoji2018 = /\p{Emoji}/ug;
  const tyo = /[^a-zA-Z]+/g;
  const tyo2 = /[^\P{L}a-z][^a-z]*/gui;
  const regexp4 = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g


  const re = /%CC%/g

  //получение данных по апи
  const getGists = async () => {
    const response = await fetch(URL, {
      method: "GET"
    });
    for (let i = 0; i < 12; i++) {

      let data = await response.json() //возвращает promise
      let cantin = JSON.stringify(data, null, 1).replace(tyo2, "");
      let cantin2 = Array.from(cantin);
      let cantin3 = shuffleArray(cantin2);

      let hasZalgo = txt => re.test(encodeURIComponent(txt));
      let cantin4 = cantin3.filter(a => !a.match(regexp4))
      return cantin4;
    }
  }


  function GistPage() { //get data through API
    const [gists, setGists] = useState([]);
    const [error, setError] = useState(null); //empty error
    const [pending, setPending] = useState(false); //status of getting data

    useEffect(() => {

      async function fetchData(URL) {
        try {
          for (let i = 0; i < 3; i++) {
            setPending(true)
            const response = await getGists();
            //console.log(response);
            // @ts-ignore
            await setGists(response);
            setPending(false);
            return response; //right answer
            await fetchData(URL);
          }
        } catch (e) {
          setError(e);
          setPending(false);
        }
      }
      //fetchData();
      let dataAlright = fetchData(URL);
      String(dataAlright);
      fetchData(URL).then(data => data);
    }, []);

    return gists;
  }

  //I apologize for the unconventional variable naming in the code.  let dtaa = GistPage();
  let dtaa = GistPage();
  let dtaa2 = GistPage();
  let dtaa3 = GistPage();
  let dtaa4 = amount22;
  let dtaa5 = numbersForPlayfulness;
  let dtaa6 = newWayNumberForVariations;
  let dtaa7 = numberForExperiments;


  const onCreate = () => {
    const count = parseInt(textbox.current.value, 10);
    //send data to controller.ts
    setOpen(true);
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', count, dtaa, dtaa2, dtaa3, dtaa4, dtaa5, dtaa6, dtaa7 } }, '*');
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  const onValue = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  }


  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = async (event) => {
      let dataApi = event.data.pluginMessage
      const { type, message } = event.data.pluginMessage;

      let message2 = event.data.pluginMessage
      let blob = new Blob([message], { type: "image/png" })
      let blob2 = new Blob([message2], { type: "image/png" })
      //console.log(blob2,"test.png");
      parent.postMessage({ pluginMessage: 'completed' }, '*')

      if (type === 'create-rectangles') {
        // console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  console.clear();
  return (
    <div>
      <div>
        <span>
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={-3.12}
          >
            <TextField
              margin="normal"
              fullWidth // this may override your custom width
              inputRef={countRef} //getting numbers
              color="secondary"
              inputProps={{ min: "1", max: "10", type: 'number' }}
              label="Amount of text blocks"


              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Filter1TwoToneIcon color="secondary" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <App2 />
          </Stack>

          <span className='passPas'>  </span>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& > :not(style)': { m: 1 },
            }}
          >
            <Tooltip
              title="What degree all the text blocks will be rotated to."
              enterDelay={1524} leaveDelay={123}
              followCursor={true}
              arrow
            >

              <TextField type='number'
                margin="dense"
                size="small"
                fullWidth
                color="secondary"
                InputLabelProps={{ shrink: true }}
                label="Rotation Degree"
                placeholder='Rotation Degree'
                defaultValue='90'
                //onChange={event => handleChange3(event)}

                onChange={withEvent(setCode)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Rotate90DegreesCcwIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              /></Tooltip>

            <Tooltip
              title="Offset on the Y axis."
              enterDelay={1524} leaveDelay={123}
              followCursor={true}
              arrow
            >
              <TextField type='number'
                margin="dense"
                fullWidth
                color="secondary"
                size="small"
                InputLabelProps={{ shrink: true }}
                label="Y axis shifting"
                placeholder='Y axis shifting'
                defaultValue='90'
                inputProps={{ min: "-999", max: "999", type: 'number' }}
                //onChange={event => handleChange3(event)}
                onChange={withEvent3(setCode3)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlignHorizontalLeftIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Tooltip>

          </Box>
          <span className='passPas'>   </span>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& > :not(style)': { m: 1 },
            }}
          >

            <TextField type='number'
              margin="dense"
              fullWidth
              size="small"
              color="secondary"
              InputLabelProps={{ shrink: true }}
              label="Min Font Size"
              placeholder='Min Fint Size'
              inputProps={{ min: "1", max: "10", type: 'number' }}
              defaultValue='2'
              //onChange={event => handleChange3(event)}
              onChange={withEvent2(setCode2)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TextRotationDownIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />


            <TextField type='number'
              margin="dense"
              fullWidth
              size="small"
              color="secondary"
              InputLabelProps={{ shrink: true }}
              label="Max Font Size"
              placeholder='Max Font Size'
              inputProps={{ min: "20", max: "700", type: 'number' }}
              defaultValue='22'
              //onChange={event => handleChange3(event)}
              onChange={withEvent4(setCode4)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TextRotateUpIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <span className='passPas'>  </span>

          <Box className="footer_text">
            <Tooltip
              title="If there is nothing in the text area, try to run the plugin the next day. 
                  You have exhausted the number of requests to the server to generate the text."
              enterDelay={324} leaveDelay={123}
              followCursor={true}
              arrow
            >

              <div className="header">Text template</div>
            </Tooltip>
            <TextareaAutosize className="textarea"
              maxRows={12}
              aria-label="Text example"
              onChange={handleChange} //take data to textfield
              value={dtaa}
              style={{
                width: 320
              }}
            /></Box>

          <Box className="footer gradient-shadow">
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">

              <Button className="experiment_with2"
                variant="contained"
                startIcon={<AddCircleTwoToneIcon />}
                id="create"
                color='primary'
                size='large'
                onClick={onCreate}
                href="#text-buttons">
                Create</Button>

              <Button className="experiment_with"
                color='info'
                size='large'
                startIcon={<DoDisturbAltTwoToneIcon />}
                id="create"
                onClick={onCancel}

                href="#text-buttons">
                Cancel</Button>
            </Stack>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
              onClick={onCreate}
            >
              <Zoom in={onCreate} style={{ transitionDelay: onCreate ? '500ms' : '0ms' }}>
                <CircularProgress color="inherit" />
              </Zoom>
            </Backdrop>

          </Box>
        </span>
      </div>
    </div>
  );
};

console.clear();


export default App;