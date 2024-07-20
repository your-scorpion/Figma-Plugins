import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Unstable_Grid2";
import DonutLargeOutlinedIcon from "@mui/icons-material/DonutLargeOutlined";
import HeightIcon from "@mui/icons-material/Height";
import Rotate90DegreesCcwOutlinedIcon from "@mui/icons-material/Rotate90DegreesCcwOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import { deepPurple } from "@mui/material/colors";
import { Chip } from "@mui/material";
import { Avatar } from "@mui/material";
import { TextField } from "@mui/material";
import { useRef } from "react";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
const [message, setMessage] = useState(""); //текущее значение и функция для обновления значения

const [message, setMessage] = useState(""); //текущее значение и функция для обновления значения
const [messages, setMessages] = useState([]);
const handleFocus = (event) => event.target.select();
const ref2 = useRef(null);
useEffect(() => {
  // Check if ref2 is not null before calling focus
  if (ref2.current) {
    ref2.current.focus();
  }
}, []);

const handlePressInput = (event) => {
  //отправка по энтеру
  if (event.code === "Enter") {
    sendMessage();
  }
};

const sendMessage = () => {
  if (message) {
    setMessages([...messages, { author: "user", message }]); //спред-оператор
    setMessage("");
  } else {
    console.log("AAAd A!");
  }
};

const ref3 = useRef(null);
const ref4 = useRef(null);
const ref5 = useRef(null);

const onCreate = () => {
  //туть
  //const count = parseInt(textbox.current.value, 10);
  //let pluginForm = document.querySelector('#formTotal');
  //@ts-ignore
  let pluginFormData = new FormData(formTotal);
  let formDataObj = {};
  for (let [key, value] of pluginFormData.entries()) {
    formDataObj[key] = +value;
    //console.log(formDataObj);
  }
  //console.log("заебок");
  parent.postMessage(
    { pluginMessage: { type: "create-rectangles", formDataObj } },
    "*"
  );
};

<div>
  <div className={styles.field2}>
    <Fade in={isLoading} timeout={900}>
      <Chip
        key="chip"
        label="All values must be greater than 0"
        variant="outlined"
        color="secondary"
        size="small"
        avatar={<Avatar sx={{ bgcolor: deepPurple[100] }}>!</Avatar>}
      />
    </Fade>{" "}
    <Box sx={{ width: "100%" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {" "}
        <Box sx={{ width: "100%" }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          ></Grid>
        </Box>
      </Grid>
    </Box>
  </div>
  <div className={styles.field2}>
    <TextField
      key="textfield"
      sx={{ m: -1, ml: -2, width: 200 }}
      className={styles.input}
      fullWidth
      name="fname2"
      size="small"
      placeholder="From 0 up to ∞"
      defaultValue="180"
      type="number"
      //helperText="Rotate canvas"
      inputRef={ref2}
      onFocus={handleFocus}
      InputProps={{
        style: {
          fontSize: 16,
        },
        inputProps: {
          min: 1,
          max: 900,
          maxLength: 3,
          pattern: "([^0-9]*)",
        },
        startAdornment: (
          <InputAdornment
            sx={{
              padding: "0px 0px",
            }}
            position="start"
          >
            <Rotate90DegreesCcwOutlinedIcon style={{ marginLeft: -4 }} />
          </InputAdornment>
        ),
      }}
      id="outlined-basic"
      label="Canvas Rotation:"
      variant="outlined"
      required={true}
      onChange={(event) => setMessage(event.target.value)}
      onKeyPress={handlePressInput} //в событие приходит эвент
      //value={message}
    />
  </div>{" "}
  <div className={styles.field2}>
    <Zoom in={isLoading} timeout={312}>
      <TextField
        sx={{ m: -1, ml: -2, width: 200 }}
        className={styles.input}
        fullWidth
        size="small"
        name="fname3"
        inputRef={ref3}
        onFocus={handleFocus}
        type="number"
        placeholder="From 0 up to ∞"
        id="outlined-basic"
        defaultValue="500"
        label="Total Canvas Width:"
        required={true}
        variant="outlined"
        onChange={(event) => setMessage(event.target.value)}
        onKeyPress={handlePressInput} //в событие приходит эвент
        InputProps={{
          style: {
            fontSize: 16,
          },
          inputProps: {
            min: 1,
            max: 900,
            maxLength: 3,
            pattern: "([^0-9]*)",
          },
          startAdornment: (
            <InputAdornment
              sx={{
                padding: "0px 0px",
              }}
              position="start"
            >
              <ArrowRightAltIcon style={{ marginLeft: -4 }} />
            </InputAdornment>
          ),
        }}

        //value={message}
      />
    </Zoom>
  </div>
  <div className={styles.field2}>
    {" "}
    <Zoom in={isLoading} timeout={387}>
      <TextField
        sx={{ m: -1, ml: -2, width: 200 }}
        className={styles.input}
        fullWidth
        name="fname4"
        inputRef={ref4}
        size="small"
        onFocus={handleFocus}
        id="outlined-basic"
        type="number"
        label="Total Canvas Height:"
        variant="outlined"
        defaultValue="500"
        onChange={(event) => setMessage(event.target.value)}
        onKeyPress={handlePressInput} //в событие приходит эвент
        //value={message}

        InputProps={{
          style: {
            fontSize: 16,
          },
          inputProps: {
            min: 1,
            max: 900,
            maxLength: 3,
            pattern: "([^0-9]*)",
          },
          startAdornment: (
            <InputAdornment
              sx={{
                padding: "0px 0px",
              }}
              position="start"
            >
              <HeightIcon style={{ marginLeft: -4 }} />
            </InputAdornment>
          ),
        }}
        required={true}
        margin="dense"
        color="info"
        placeholder="From 0 up to ∞"
      />
    </Zoom>
  </div>
  <div className={styles.field2}>
    <Zoom in={isLoading} timeout={424}>
      <TextField
        sx={{ m: -1, ml: -2, width: 200 }}
        className={styles.input}
        fullWidth
        size="small"
        name="fname5"
        InputLabelProps={{ shrink: true }}
        inputRef={ref5}
        defaultValue="15"
        //value="15"
        onFocus={handleFocus}
        //helperText="Structure level"
        id="standard"
        type="number"
        label="Structure level:"
        variant="outlined"
        InputProps={{
          style: {
            fontSize: 16,
          },
          inputProps: {
            min: 1,
            max: 900,
            maxLength: 3,
            pattern: "([^0-9]*)",
          },
          startAdornment: (
            <InputAdornment
              sx={{
                padding: "0px 0px",
              }}
              position="start"
            >
              <DonutLargeOutlinedIcon style={{ marginLeft: -4 }} />
            </InputAdornment>
          ),
        }}
        onChange={(event) => setMessage(event.target.value)}
        onKeyPress={handlePressInput} //в событие приходит эвент
        required={true}
        margin="dense"
        color="primary"
        placeholder="From 0 up to ∞"
      />
    </Zoom>
  </div>
  <span>
    {" "}
    <Slide
      direction="up"
      timeout={142}
      in={isLoading}
      mountOnEnter
      unmountOnExit
    >
      <Button
        variant="contained"
        sx={{
          borderRadius: 28,
          boxShadow: 1,
          padding: 1.3,
          px: 2,
          mx: -11.4,
        }}
        style={{ border: "0px solid white" }}
        onClick={onCreate}
      >
        Create
      </Button>
    </Slide>
    <span> </span>
  </span>
</div>;
