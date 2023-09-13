import React from 'react';
import { useState } from "react";
import '../styles/ui.css';
import { keyframes } from "@emotion/react";
import Zoom from '@mui/material/Zoom';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles'; 
import RectangleTwoToneIcon from '@mui/icons-material/RectangleTwoTone';
import TuneIcon from '@mui/icons-material/Tune';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
// @ts-ignore
import { ThemeContext } from './theme-context';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
//import BasicTabs from "./Tabs"
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import TabPanel from '@mui/lab/TabPanel';
import Backdrop from '@mui/material/Backdrop';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import FiberManualRecordTwoToneIcon from '@mui/icons-material/FiberManualRecordTwoTone';
import PentagonTwoToneIcon from '@mui/icons-material/PentagonTwoTone';
import SyncAltTwoToneIcon from '@mui/icons-material/SyncAltTwoTone';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Grow from '@mui/material/Grow';
import { LinearIndeterminate } from './experiment.js'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import LinearProgress from "@mui/material/LinearProgress";


const myKeyframe = keyframes`
  0% {
    -webkit-transform: rotate(44deg) scale(1);
    animation-timing-function: ease-in;
  },
  47% {
    -webkit-transform: rotate(75deg) scale(-0.75);
  }
  100% {
    -webkit-transform: rotate(44deg) scale(1);
  }
`;

const myKeyframe2 = keyframes`
  0% {
    -webkit-transform: rotate(0deg) scale(1);
    animation-timing-function: ease-in;
  },
  51% {
    -webkit-transform: rotate(-745deg) scale(0);
  }
  100% {
    -webkit-transform: rotate(0deg) scale(1);
  }
`;

const myKeyframe3 = keyframes`
  0% {
    -webkit-transform: rotate(264deg) scale(1);
    animation-timing-function: ease-in;
  },
  47% {
    -webkit-transform: rotate(-275deg) scale(-0.75);
  }
  100% {
    -webkit-transform: rotate(264deg) scale(1);
  }
`;

const style = {
  margin: 12,
  outline: 'none',
  minWidth: 120,
};

const styleCheckBox = {
  margin: 1,
  outline: 'none',
};

// Styles for text fields
const InputCSS = {
  width: '100%',
  textIndent: '17px',
  outline: 'none',
  borderRadius: '2%',
  fontSize: '16px',
  '&.MuiInputBase-root': {
    borderColor: '#000',
    boxShadow: '0px 1px 0px rgba(66, 63, 66, 0.2)',
    background: 'linear-gradient(21deg, #FDFDFF07, #F9FCFA02)',
  },
};



function App() {
  //tabs
  const [value, setValue] = React.useState('1');
  // @ts-ignore
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  //for backdrop
  const [open, setOpen] = React.useState(false);

  const SampleForVirtualDom = ({ }) => {
    const theme = useTheme()

    return (
      <div style={{ background: theme.palette.primary.dark }} id='fixedFooter'>
        {/* swicther below */}
        <div id='masquarading'>
          <Grid container
            direction="row"
            justifyContent="center"
            alignItems="center">


            <Tooltip
              title="One-click icon generation"
              TransitionComponent={Zoom}
              placement="bottom"
              followCursor
              disableInteractive
              arrow
              sx={{
                marginTop: "332px !important",
              }}
            >

              <IconButton
                sx={{
                  color: "primary",
                  height: "45px",
                  width: "168px",
                  borderRadius: "24px",
                }}
                onClick={onMagic}
                color="primary"
                aria-label="Generate random set of icons"
                component="label"
              >
                <AutoFixHighIcon />
                <Stack direction="row" spacing={0.35}>
                  <LinearProgress
                    variant="indeterminate"
                    sx={{
                      animation: `${myKeyframe} 2.873s infinite ease`,
                      height: "15px",
                      backgroundColor: "secondary",
                      borderRadius: "17px",
                      width: "15px",
                      "& .MuiLinearProgress-bar": {
                        animationDuration: "2.42s",
                        boxShadow: "rgba(67, 176, 241, 0) 0px 0px 21px 8px",
                        borderRadius: "48px",
                        transform: "skew(30deg, 20deg)",
                      },
                    }}
                  />
                  <LinearProgress
                    variant="indeterminate"
                    sx={{
                      animation: `${myKeyframe2} 2.863s infinite alternate`,
                      height: "15px",
                      backgroundColor: "secondary",
                      borderRadius: "17px",
                      width: "15px",
                      "& .MuiLinearProgress-bar": {
                        animationDuration: "2.42s",
                        boxShadow: "rgba(67, 176, 241, 0) 0px -72px 1px 213px",
                        borderRadius: "48px",
                      },
                    }}
                  />
                  <LinearProgress
                    variant="indeterminate"
                    sx={{
                      animation: `${myKeyframe3} 2.873s infinite ease`,
                      height: "15px",
                      backgroundColor: "secondary",
                      borderRadius: "17px",
                      width: "15px",
                      "& .MuiLinearProgress-bar": {
                        animationDuration: "2.42s",
                        borderRadius: "48px",
                        boxShadow: "rgba(67, 176, 241, 0) 0px 0px 21px 8px",
                        transform: "perspective(-341px)",
                      },
                    }}
                  />
                </Stack>
              </IconButton>
            </Tooltip>
            <Button
              size="large"
              sx={{
                borderRadius: 28,
                border: '0px solid',
              }}
              variant="outlined"
              color="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <span></span>
            <Button
              size="large"
              sx={{
                borderRadius: 28,
                ':hover': {
                  bgcolor: '#3D3C42',
                  color: 'white',
                  scale: '1.02',
                },
              }}
              variant="contained"
              color="primary"
              onClick={onCreate}
            >
              Generate
            </Button>
          </Grid>
        </div>
      </div>
    )
  }

  //for frame size
  const [code4, setCode4] = useState('24');

  function withEventSizeFrame(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }


  //to rotate element
  const [code5, setCode5] = useState('0');

  function withEventRotateIconElements(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }


  const [IconStartPosition, setIconStartPosition] = useState('0');

  function withEventPositionFrame(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }

  const [borderRadiusForRect, setborderRadiusForRect] = useState('0');

  function borderRadiusRectFunt(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }


  //for Lines
  const [linePosition, setlinePosition] = useState('8');

  function linePositionFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }

  const [lineRotation, setlineRotation] = useState('0');

  function lineRotationFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }
  //позволяет первым аргументом передать новое состояние, и второй аргумент это функция для обновления состояния.

  const [isTrueFatLines, setIsTrueFatLines] = React.useState(false);
  const [fatLines, setFatLines] = useState('0');

  function lineFatFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
      setIsTrueFatLines(!isTrueFatLines);
    };
  }

  const [isTrueRandomRotation, setIsTrueRandomRotation] = React.useState(false);
  const [RandomLinesRotation, setRandomLinesRotation] = useState(false);

  function randomizeLinesFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
      setRandomLinesRotation(!RandomLinesRotation);
    };
  }

  const [isTrueSmallRect, setIsTrueSmallRect] = React.useState(false);
  const [SmallRect, setSmallRect] = useState(false);

  function rectanglesSmaalProp(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
      setSmallRect(!SmallRect);
    };
  }


  const [isTrue, setIsTrue] = React.useState(false);
  const [EnableRect, setEnableRect] = useState(false);


  function enableRectangles(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
      setEnableRect(!EnableRect);
    };
  }




  const [isTrueLines, setIsTrueLines] = React.useState(false); //тут можно менять чтоб чекбокс проставился
  const [EnableLine, setEnableLine] = useState(false);
  //console.log(EnableLine, setEnableLine, isTrueLines, setIsTrueLines)

  function enableLines(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
      setEnableLine(!EnableLine);
    };
  }




  //icon's name
  const [IconName, setIconName] = useState('generated_');

  function iconNameFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }


  //number of icons to create
  const [numberofIcons, setnumberofIcons] = useState('12');

  function iconNumberFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }




  const [positionFrameState, setPositionFrameFunction] = useState('2.2');

  function tryPositionFrameFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }


  const [isTrueCircles, setIsTrueCircles] = React.useState(false);
  const [EnableCircles, setEnableCircles] = useState(false);

  function enableCircles(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
      setEnableCircles(!EnableCircles);
    };
  }



  const [ellipseSize, setEllipseSize] = useState('24');

  function tryEllipseSizeFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }



  const [ellipsePositionRandomness, setEllipsePositionRandomness] = useState('6');

  function tryEllipsePositionRandomnessFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }



  const [ellipseCornerRadius, setEllipseCornerRadius] = useState('0');

  function tryEllipseCornerRadiusFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }




  const [isTruePoly, setIsTruePoly] = React.useState(false);
  const [EnablePoly, setEnablePoly] = useState(false);

  function enablePoly(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
      setEnablePoly(!EnablePoly);
    };
  }


  const [polyPointsAmount, setPolyPointsAmount] = useState('3');

  function tryPolyPointsAmountFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }


  const [polyCornerRadius, setPolyCornerRadius] = useState('0');

  function tryPolyCornerRadiusFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }


  const [polyPosition, setPolyPosition] = useState('25.5');

  function tryPolyPositionFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }


  const [firstValue, setFirstValue] = useState('12');

  function tryFirstValueFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
    };
  }


  const [age, setAge] = React.useState('20');

  function tryAgeFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: SelectChangeEvent) => {
      const { target } = event;
      func(target.value);
    };
  }


  const [isPolyRandomRotation, setIsPolyRandomRotation] = React.useState(false);
  const [RandomPolyRotation, setRandomPolyRotation] = useState(false);

  function randomizePolyFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
      setRandomPolyRotation(!RandomPolyRotation);
    };
  }



  const [arrowWidth, setArrowWidth] = React.useState('1');

  function tryArrowWidthFunction(func: Function): React.ChangeEventHandler<any> {
    return (event: SelectChangeEvent) => {
      const { target } = event;
      func(target.value);
    };
  }




  const [isTrueEnableDeformCircle, setIsTrueEnableDeformCircle] = React.useState(false);
  const [EnableDeformCircle, setEnableDeformCircle] = useState(false);

  function enableDeformCircles(func: Function): React.ChangeEventHandler<any> {
    return (event: React.ChangeEvent<any>) => {
      const { target } = event;
      func(target.value);
      setEnableDeformCircle(!EnableDeformCircle);

    };
  }









  let sizeFrame = Number(code4);
  let RotateElements = Number(code5);
  let positionFrame = Number(IconStartPosition);
  let frameName = (IconName);
  let amountOficons = Number(numberofIcons);
  //let trySendMainSend = Number(trySendMain);
  let borderRadiusForRectTrans = Number(borderRadiusForRect);
  //for lines
  let linesxyposition = Number(linePosition);
  let lineRotationToPass = Number(lineRotation);
  let fatLinesToPass = fatLines;
  let SmallRectPass = SmallRect;
  let EnableRectPass = EnableRect;
  let EnableLinePass = EnableLine;
  let RandomLinesRotationPass = RandomLinesRotation;
  let circleSizes = Number(positionFrameState);
  let EnableCirclePass = EnableCircles;
  let ellipseSizePass = Number(ellipseSize);
  let ellipsePositionRandomnessPass = Number(ellipsePositionRandomness);
  let ellipseCornerRadiusPass = Number(ellipseCornerRadius);
  let EnablePolyPass = EnablePoly;
  let polyPointsAmountPass = Number(polyPointsAmount);
  let PolyCornerRadiusPass = Number(polyCornerRadius);
  let polyPositionPass = Number(polyPosition);
  let firstValuePass = Number(firstValue);
  let RandomPolyRotationPass = RandomPolyRotation;
  let arrowWidthPass = Number(arrowWidth);
  let agePass = Number(age);
  let EnableDeformCirclePass = EnableDeformCircle;




  const darkTheme = createTheme({
    transitions: {
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
    palette: {
      mode: 'dark',
      primary: {
        light: '#6ec6ff',
        main: '#2196f3',
        dark: '#2A2E33',
        contrastText: '#fff',
      },
      secondary: {
        main: '#73E3BB',
      },
      background: {
        default: "#347631",
      },
    },
    typography: {
      fontFamily: ['Work Sans', 'Montserrat', 'Nunito', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
      body2: {
        fontWeight: 700,
        fontSize: '0.75rem',
      },
      body1: {
        color: '#fff'
      }
    },
  });


  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#060606',
        dark: '#F2F6F9',
      },
      background: {
        default: '#fff',
      },
      secondary: {
        main: '#6202FF',
      }
    }
  });



  const preventMinus = (e) => {
    if (e.code === 'Minus') {
      e.preventDefault();
    }
  };

  const onCreate = () => {
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', sizeFrame, positionFrame, frameName, RotateElements, numberofIcons, borderRadiusForRectTrans, linesxyposition, lineRotationToPass, fatLinesToPass, SmallRectPass, EnableRectPass, EnableLinePass, RandomLinesRotationPass, circleSizes, EnableCirclePass, ellipseSizePass, ellipsePositionRandomnessPass, ellipseCornerRadiusPass, EnablePolyPass, polyPointsAmountPass, PolyCornerRadiusPass, polyPositionPass, firstValuePass, RandomPolyRotationPass, arrowWidthPass, agePass, EnableDeformCirclePass } }, '*');
    setOpen(!open);
  };

  const giveitawayforMagic = true;

  const onMagic = () => {
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', giveitawayforMagic } }, '*');
    setOpen(!open);
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  React.useEffect(() => {
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);





  const [isDark, setIsDark] = useState(false);

  return (



    //ниже тернарный оператор
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>

      <Card sx={{ bgcolor: 'background.paper', width: 480, height: 500, padding: '0' }}>  <div>



        <CardContent sx={{ bgcolor: 'background.paper', padding: '0', marginTop: '0' }}>

          <TabContext value={value} >
            <Box style={styleCheckBox} sx={{
              borderBottom: 0, width: "100%", height: '12%', backgroundColor: "#9096C920",
              boxShadow: '0px 33px 25px 0 #979CC820',
            }}>
              <Stack direction="row" spacing={2} sx={{ boxShadow: 'inset 0px 33px 25px 0 #979CC820', }}>
                <TabList style={styleCheckBox} sx={{
                  mb: 2, sm: 'none', marginTop: '-4', borderRadius: '2px', outline: 'none',
                  "& .MuiTabs-indicator": { marginTop: '4', height: '6', width: '12px', boxShadow: 4 },
                  "& button:hover": { backgroundColor: "#C1C9D610", outline: 'none', scale: '1.02' },
                  "& button:focus": { backgroundColor: "#C1C9D630", outline: 'none' },
                  "& .MuiTab-root.Mui-selected": { fontWeight: "700", fontSize: "14px", outline: 'none' },

                  "& .MuiTab-root.Mui-selected:hover": { fontWeight: "500", boxShadow: 'iinset 0px -20px 20px 60px #ffffff20;', outline: 'none' },

                  "& .MuiTab-root": {
                    fontSize: "13px", marginBottom: '-8px', mb: 0, outline: 'none', minWidth: '52px',
                    transition: 'width 2s', width: '1',
                  },
                }}
                  variant="fullWidth" onChange={handleChange} aria-label="TABS_section_with_settings">
                  <Tab icon={<TuneIcon fontSize='small' />} label="Settings" value="1" />
                  <Tab icon={<RectangleTwoToneIcon fontSize='small' />} label="Squares" value="2" />
                  <Tab icon={<SyncAltTwoToneIcon fontSize='small' />} label="Arrows" value="3" />
                  <Tab icon={<FiberManualRecordTwoToneIcon fontSize='small' />} label="Ellipses" value="4" />
                  <Tab icon={<PentagonTwoToneIcon fontSize='small' />} label="Polygons" value="5" />
                </TabList>

                <FormControlLabel style={styleCheckBox} value="6" labelPlacement="bottom" control={<Switch icon={<WbSunnyTwoToneIcon fontSize='small' color="primary" />} color="secondary" onClick={() => { setIsDark(pervstate => !pervstate) }} />} label="Dark" />
              </Stack>
            </Box>

            <TabPanel value='1' >
              <Container sx={{ paddingTop: 1 }}>


                <Stack direction="row" spacing={1.5}>
                  <Paper sx={{ p: 2, maxWidth: 180 }}>
                    <Grid>

                      <FormControl style={style} color='secondary' variant="standard">
                        <InputLabel htmlFor="component-simple">Icon Name:</InputLabel>
                        <Input sx={{ ...InputCSS, bgcolor: 'background.paper', }} autoFocus value={frameName} onChange={iconNameFunction(setIconName)} />
                      </FormControl>

                      <FormControl style={style} variant="standard" color='secondary' >
                        <InputLabel htmlFor="component-simple">Count of icons:</InputLabel>
                        <Input sx={{ ...InputCSS }} type="number" inputProps={{ min: 0, max: 9999 }} value={amountOficons} onChange={iconNumberFunction(setnumberofIcons)} />
                      </FormControl>

                      <FormControl style={style} color='secondary' variant="standard">
                        <InputLabel htmlFor="component-simple">Icon Size:</InputLabel>
                        <Input type="number" inputProps={{ min: 16, max: 96, step: "4" }} value={sizeFrame} onChange={withEventSizeFrame(setCode4)} />
                      </FormControl>

                    </Grid>
                  </Paper>
                  <Card sx={{ maxWidth: 190, p: 2 }}>
                    <Grid>

                      <Stack direction="column"
                        justifyContent="flex-start"
                        alignItems="left"
                        spacing={0}>

                        <FormControl style={style} color='secondary' variant="standard">
                          <InputLabel htmlFor="component-simple">Icon complexity:</InputLabel>
                          <Input sx={{ ...InputCSS }} inputProps={{ min: 1, max: 100 }} type="number" value={firstValue} onChange={tryFirstValueFunction(setFirstValue)} />
                        </FormControl>

                        <FormControl style={style} variant="standard" color='secondary' >
                          <InputLabel htmlFor="component-simple">Icon start Position:</InputLabel>
                          <Input sx={{ ...InputCSS }} type="number" value={positionFrame} onChange={withEventPositionFrame(setIconStartPosition)} />
                        </FormControl>
                      </Stack>
                    </Grid>
                  </Card>
                </Stack>
              </Container>
            </TabPanel>

            <TabPanel value='2'>
              <Card elevation={0} sx={{ paddingLeft: '10px' }}>
                <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1.5}><div>
                  <FormControlLabel style={styleCheckBox} control={
                    <Checkbox
                      checkedIcon={<CheckCircleSharpIcon />}
                      onClick={enableRectangles(setEnableRect)}
                      checked={isTrue}
                      color='secondary'
                      onChange={e => {
                        setIsTrue(e.target.checked)
                      }
                      }
                    />}
                    label="Squares" />
                </div>

                  {isTrue ?
                    <Typography variant="body1" sx={{ opacity: '1', marginLeft: '20px' }}>
                      will be generated
                    </Typography>
                    :
                    <Typography variant="body1" sx={{ opacity: '0.4' }}>
                      Check to generate a shape
                    </Typography>
                  }
                </Stack>
              </Card>

              <Grow in={isTrue}>
                <Container sx={{ paddingTop: 1 }}>
                  <Stack direction="row" spacing={1.5}>

                    <Grid item xs={1}>
                      <Paper sx={{ p: 2 }}>

                        <FormControl style={style} variant="standard" color='secondary' >
                          <InputLabel htmlFor="component-simple">Angle Variation: </InputLabel>
                          <Input sx={{ ...InputCSS }} type="number" inputProps={{ min: -9999999999, max: 9999999999 }} value={RotateElements} onChange={withEventRotateIconElements(setCode5)} />
                        </FormControl>

                        <FormControl style={style} variant="standard" color='secondary' >
                          <InputLabel htmlFor="component-simple">Sq. Border Radius:</InputLabel>
                          <Input sx={{ ...InputCSS }} inputProps={{ min: 0, max: 9999999999 }} type="number" onKeyPress={preventMinus} value={borderRadiusForRect} onChange={borderRadiusRectFunt(setborderRadiusForRect)} />
                        </FormControl>

                        <FormGroup>
                          <FormControlLabel style={styleCheckBox} control={
                            <Checkbox
                              onClick={rectanglesSmaalProp(setSmallRect)}
                              size='small'
                              color='secondary'
                              checked={isTrueSmallRect}
                              onChange={e => {
                                //console.log("target checked? - ", e.target.checked);
                                setIsTrueSmallRect(e.target.checked)
                              }
                              }
                            />}
                            label="Small rectangles" />
                        </FormGroup>
                      </Paper>
                    </Grid>

                    <Card sx={{ maxWidth: 180 }}>
                      <Grid>
                        <Paper sx={{ p: 0 }}>
                          <Alert icon={false} variant="outlined" severity="success">Angle variation: 0 = no rotation, any other value = varying degrees of random incline angles. </Alert>
                        </Paper>
                        <Paper sx={{ p: 0 }}>
                          <Alert icon={false} variant="outlined" severity="success">Small rectangles: there will be only small squares. </Alert>

                        </Paper>
                      </Grid>
                    </Card>
                  </Stack>
                </Container>
              </Grow>
            </TabPanel>

            <TabPanel value='3'>
              <Card sx={{ paddingLeft: '10px' }} elevation={0}  ><Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1.5}>
                <div>
                  <FormControlLabel style={styleCheckBox} control={
                    <Checkbox
                      checkedIcon={<CheckCircleSharpIcon />}
                      onClick={enableLines(setEnableLine)}
                      color='secondary'
                      checked={isTrueLines}
                      onChange={e => {
                        //console.log("target checked? - ", e.target.checked);
                        setIsTrueLines(e.target.checked)
                      }
                      }
                    />}
                    label="Arrows" />


                </div>
                {isTrueLines ?
                  <Typography variant="body1" sx={{ opacity: '1', marginLeft: '20px' }}>
                    will be generated
                  </Typography>
                  :
                  <Typography variant="body1" sx={{ opacity: '0.4' }}>
                    Check to generate a shape
                  </Typography>
                }

              </Stack>
              </Card>









              <Grow in={isTrueLines}>
                <Container sx={{ paddingTop: 1 }}>
                  <Stack direction="row" spacing={1.5}>


                    <Paper sx={{ p: 2 }}>

                      <FormControl style={style} variant="standard" color='secondary' >
                        <InputLabel htmlFor="component-simple">Line position:</InputLabel>
                        <Input type="number" value={linePosition} onChange={linePositionFunction(setlinePosition)} />
                      </FormControl>

                      <FormGroup>
                        <FormControlLabel style={styleCheckBox} control={
                          <Checkbox
                            size='small'
                            onClick={lineFatFunction(setRandomLinesRotation)}
                            color='secondary'
                            checked={isTrueFatLines}
                            onChange={e => {
                              setIsTrueFatLines(e.target.checked)
                            }
                            }
                          />}

                          label="Fat lines" />
                      </FormGroup>
                    </Paper>


                    <Grid item xs={12}>
                      <Paper sx={{ p: 2, maxWidth: 240 }}>
                        <Stack direction="row" spacing={0}>

                          <FormControl style={style} variant="standard" color='secondary' >
                            <InputLabel htmlFor="component-simple">Rotation:</InputLabel>
                            <Input type="number" value={lineRotation} onChange={lineRotationFunction(setlineRotation)} />
                          </FormControl>



                          <Tooltip title="Rotation: 0 for horizontal lines.">
                            <IconButton sx={{ height: '42px', marginTop: '20px', marginLeft: '-20px' }}>
                              <InfoOutlinedIcon />
                            </IconButton>
                          </Tooltip></Stack>

                        <FormControl style={style} variant="standard" color='secondary' >
                          <InputLabel htmlFor="component-simple">Width:</InputLabel>
                          <Input inputProps={{ min: 0, max: 12 }} type="number" value={arrowWidth} onChange={tryArrowWidthFunction(setArrowWidth)} />
                        </FormControl>


                        <FormGroup>
                          <FormControlLabel style={styleCheckBox} control={
                            <Checkbox
                              size='small'
                              onClick={randomizeLinesFunction(setFatLines)}
                              color='secondary'
                              checked={isTrueRandomRotation}
                              onChange={e => {
                                //console.log("target checked? - ", e.target.checked);
                                setIsTrueRandomRotation(e.target.checked)
                              }
                              }
                            />
                          }
                            label="Randomize rotation" />
                        </FormGroup>
                      </Paper>
                    </Grid>

                  </Stack>
                </Container></Grow>
            </TabPanel>



            <TabPanel value='4'>
              <Card sx={{ paddingLeft: '10px' }} elevation={0}>
                <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1.5}>
                  <div>
                    {/* Checkbox for enabling ellipses */}
                    <FormControlLabel
                      style={styleCheckBox}
                      control={
                        <Checkbox
                          onClick={enableCircles(setEnableCircles)}
                          checkedIcon={<CheckCircleSharpIcon />}
                          color='secondary'
                          checked={isTrueCircles}
                          onChange={e => {
                            setIsTrueCircles(e.target.checked);
                          }}
                        />}
                      label="Ellipses"
                    />
                  </div>

                  {/* Text indicating whether ellipses will be generated */}
                  {isTrueCircles ?
                    <Typography variant="body1" sx={{ opacity: '1', marginLeft: '20px' }}>
                      will be generated
                    </Typography>
                    :
                    <Typography variant="body1" sx={{ opacity: '0.4' }}>
                      Check to generate a shape
                    </Typography>
                  }
                </Stack>
              </Card>

              <Grow in={isTrueCircles}>
                <Container sx={{ paddingTop: 1 }}>
                  <Stack direction="column" spacing={1.5}>
                    <Card>
                      <Grid alignItems="stretch" item xs={1}>
                        <Paper sx={{ p: 2 }}>
                          <Stack direction="row" spacing={0}>
                            {/* Input for ellipse size */}
                            <FormControl style={style} variant="standard" color='secondary'>
                              <InputLabel htmlFor="component-simple">Size:</InputLabel>
                              <Input type="number" inputProps={{ min: 2, max: 99999 }} value={ellipseSize} onChange={tryEllipseSizeFunction(setEllipseSize)} />
                            </FormControl>
                            <Tooltip title="Actual approximate size of generated items">
                              <IconButton sx={{ height: '42px', marginTop: '20px', marginLeft: '-20px' }}>
                                <InfoOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                            {/* Tooltip for angle information */}
                            <Stack direction="row" spacing={0}>

                            </Stack>

                            {/* Input for position randomness */}
                            <Stack direction="row" spacing={0}>
                              <FormControl style={style} variant="standard" color='secondary'>
                                <InputLabel htmlFor="component-simple">Position Random:</InputLabel>
                                <Input type="number" inputProps={{ min: -16, max: 16, step: "0.25" }} value={ellipsePositionRandomness} onChange={tryEllipsePositionRandomnessFunction(setEllipsePositionRandomness)} />
                              </FormControl>
                            </Stack>

                            {/* Tooltip for range information */}
                            <Stack direction="row" spacing={0}>
                              <Tooltip title="The range is between -16 and 16. Larger values will result in the generation of elements outside the frame. 12 is fine for the icon size of 24px.">
                                <IconButton sx={{ height: '42px', marginTop: '20px', marginLeft: '-20px' }}>
                                  <InfoOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Stack>

                          {/* Checkbox for enabling deform */}
                          <FormGroup>
                            <FormControlLabel
                              style={styleCheckBox}
                              control={
                                <Checkbox
                                  onClick={enableDeformCircles(setEnableDeformCircle)}
                                  size='small'
                                  color='secondary'
                                  checked={isTrueEnableDeformCircle}
                                  onChange={e => {
                                    setIsTrueEnableDeformCircle(e.target.checked);
                                  }}
                                />
                              }
                              label="Deform"
                            />

                            {/* Input for angle */}
                            <Stack direction="row" spacing={0}>
                              <Stack direction="row" spacing={0}>
                                <FormControl style={style} variant="standard" color='secondary'>
                                  <InputLabel htmlFor="component-simple">Angle:</InputLabel>
                                  <Input sx={{ minWidth: '110px' }} type="number" inputProps={{ min: 0.1, max: 3, step: "0.05" }} value={circleSizes} onChange={tryPositionFrameFunction(setPositionFrameFunction)} />
                                </FormControl>
                                <Tooltip title="Angles: 3 for full ellipse, 0.1 for 4.18% of ellipse">
                                  <IconButton sx={{ height: '42px', marginTop: '20px', marginLeft: '-20px' }}>
                                    <InfoOutlinedIcon />
                                  </IconButton>
                                </Tooltip>
                              </Stack>

                              {/* Input for corner radius */}
                              <FormControl style={style} variant="standard" color='secondary'>
                                <InputLabel htmlFor="component-simple">Corner Radius:</InputLabel>
                                <Input sx={{ minWidth: '140px' }} type="number" inputProps={{ min: 0, max: 32 }} value={ellipseCornerRadius} onChange={tryEllipseCornerRadiusFunction(setEllipseCornerRadius)} />
                              </FormControl>
                            </Stack>
                          </FormGroup>
                        </Paper>
                      </Grid>
                    </Card>
                  </Stack>
                </Container>
              </Grow>
            </TabPanel>




            <TabPanel value='5'>

              <Card sx={{ paddingLeft: '10px' }} elevation={0}>
                <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1.5}>
                  <div>
                    <FormControlLabel
                      style={styleCheckBox}
                      control={
                        <Checkbox
                          checkedIcon={<CheckCircleSharpIcon />}
                          onClick={enablePoly(setEnablePoly)}
                          color='secondary'
                          checked={isTruePoly}
                          onChange={e => {
                            setIsTruePoly(e.target.checked);
                          }}
                        />
                      }
                      label="Polygons"
                    />
                  </div>

                  {isTruePoly ?
                    <Typography variant="body1" sx={{ opacity: '1', marginLeft: '20px' }}>
                      will be generated
                    </Typography>
                    :
                    <Typography variant="body1" sx={{ opacity: '0.4' }}>
                      Check to generate a shape
                    </Typography>
                  }
                </Stack>
              </Card>


              <Grow in={isTruePoly}>
                <Container sx={{ paddingTop: 1 }}>
                  <Stack direction="row" spacing={1.5}>
                    <Card sx={{ width: 220 }}>
                      <Grid item xs={1}>
                        <Paper sx={{ p: 2 }}>
                          <FormControl style={style} variant="standard" color='secondary'>
                            <InputLabel htmlFor="component-simple">Angles:</InputLabel>
                            <Input type="number" fullWidth inputProps={{ min: 3, max: 180 }} value={polyPointsAmount} onChange={tryPolyPointsAmountFunction(setPolyPointsAmount)} />
                          </FormControl>

                          <FormControl style={style} variant="standard" color='secondary'>
                            <InputLabel htmlFor="component-simple">Corner Radius:</InputLabel>
                            <Input type="number" fullWidth inputProps={{ min: 0, max: 180 }} value={polyCornerRadius} onChange={tryPolyCornerRadiusFunction(setPolyCornerRadius)} />
                          </FormControl>

                          <FormControl style={style} variant="standard" color='secondary'>
                            <InputLabel htmlFor="component-simple">Position Randomness:</InputLabel>
                            <Input type="number" fullWidth inputProps={{ min: -10, max: 40, step: "0.25" }} value={polyPosition} onChange={tryPolyPositionFunction(setPolyPosition)} />
                          </FormControl>
                        </Paper>
                      </Grid>
                    </Card>

                    <Card sx={{ width: 220 }}>
                      <Grid item xs={1}>
                        <FormControl fullWidth variant="filled">
                          <InputLabel color='secondary' id="demo-simple-select-label">Density</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue=""
                            value={age}
                            label="Density"
                            color='secondary'
                            onChange={tryAgeFunction(setAge)}
                          >
                            <MenuItem value={2}>Tiny</MenuItem>
                            <MenuItem value={20}>Medium</MenuItem>
                            <MenuItem value={40}>Huge</MenuItem>
                          </Select>
                        </FormControl>

                        <FormGroup>
                          <FormControlLabel
                            style={styleCheckBox}
                            control={
                              <Checkbox
                                size='small'
                                onClick={randomizePolyFunction(setRandomPolyRotation)}
                                color='secondary'
                                checked={isPolyRandomRotation}
                                onChange={e => {
                                  //console.log("target checked? - ", e.target.checked);
                                  setIsPolyRandomRotation(e.target.checked)
                                }}
                              />
                            }
                            label="Angle Randomizer"
                          />
                        </FormGroup>
                      </Grid>
                    </Card>
                  </Stack>
                </Container>
              </Grow>

            </TabPanel>
          </TabContext>
          <SampleForVirtualDom />
        </CardContent>


        <Backdrop
          sx={{ backgroundColor: '#CED6F199', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <Grid
            container
            spacing={0}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <LinearIndeterminate />

            <Button
              size="large"
              sx={{ borderRadius: 28, opacity: '0.83' }}
              variant="contained"
              color="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
        </Backdrop>

      </div>
      </Card>

    </ThemeProvider>

  );
}

export default App;