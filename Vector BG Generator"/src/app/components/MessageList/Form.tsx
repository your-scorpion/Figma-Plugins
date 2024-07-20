import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import InputAdornment from "@mui/material/InputAdornment";
import { useStyles } from "./use-styles";
import { TextField } from "@mui/material";
import HeightIcon from "@mui/icons-material/Height";
import Zoom from "@mui/material/Zoom";
import DonutLargeOutlinedIcon from "@mui/icons-material/DonutLargeOutlined";
import { useRef } from "react";
import Rotate90DegreesCcwOutlinedIcon from "@mui/icons-material/Rotate90DegreesCcwOutlined";
import { useState } from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const Dsd: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null); // Ref for the form element

  const [isLoading, setIsLoading] = React.useState(true);
  //const formTotal = document.getElementById("formTotal") as HTMLFormElement;
  const styles = useStyles();
  React.useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(true); // Set isLoading to false after 2 seconds
    }, 2000);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(loadingTimeout);
  }, []);
  const handleFocus = (event) => event.target.select();

  const ref3 = useRef<HTMLInputElement>(null);
  const ref5 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);
  const handlePressInput = (event) => {
    //отправка по энтеру
    if (event.code === "Enter") {
      sendMessage();
    }
  };

  const ref2 = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState(""); //текущее значение и функция для обновления значения
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (message) {
      setMessages([...messages, { author: "user", message }]); //спред-оператор
      setMessage("");
    } else {
      console.log("AAAd A!");
    }
  };

  const onCreate = () => {
    const formTotal = formRef.current;
    if (!formTotal) return;

    let pluginFormData = new FormData(formTotal);
    console.log("FormData entries:");
    for (let [key, value] of pluginFormData.entries()) {
      console.log(`${key}: ${value}`);
    }

    let formDataObj: any = {};
    for (let [key, value] of pluginFormData.entries()) {
      formDataObj[key] = +value; // Convert the value to a number
    }

    console.log("FormDataObj:", formDataObj);

    parent.postMessage(
      { pluginMessage: { type: "create-rectangles", formDataObj } },
      "*"
    );
  };

  return (
    <form ref={formRef} id="formTotal" autoComplete="on">
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
            onFocus={handleFocus}
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
      <Box sx={{}}>
        <span>
          {" "}
          <Slide direction="up" timeout={142} in={isLoading}>
            <Button
              variant="contained"
              sx={{
                borderRadius: 28,
                boxShadow: 1,
                padding: 1.3,
                px: 2,
              }}
              style={{ border: "0px solid white" }}
              onClick={onCreate}
            >
              Create
            </Button>
          </Slide>
        </span>
      </Box>
    </form>
  );
};

export default Dsd;
