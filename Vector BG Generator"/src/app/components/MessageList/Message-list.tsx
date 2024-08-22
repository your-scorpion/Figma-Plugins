import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@mui/material";
import { useStyles } from "./use-styles";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
//import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Slide from "@mui/material/Slide";
import Zoom from "@mui/material/Zoom";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import { useRef } from "react";
import Dsd from "./Form";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Unstable_Grid2";
import Bg1 from "./Bg1";
//import { useClickOutside } from "./customHookClickOutside"; // Adjust the path as needed
import Bg2 from "./Bg2";
import Bg3 from "./Bg3";

declare function require(path: string): any;

export const MessageList = () => {
  const styles = useStyles();
  const [messages, setMessages] = useState([]);

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  const onCreate2 = () => {
    //@ts-ignore
    let pluginFormData = new FormData(formTotal);
    let formDataObj22 = {};
    for (let [key, value] of pluginFormData.entries()) {
      formDataObj22[key] = +value;
      //console.log(formDataObj);
    }
    //console.log("заебок");
    parent.postMessage(
      { pluginMessage: { type: "create-grandge", formDataObj22 } },
      "*"
    );
  };

  const onCreate3 = () => {
    //@ts-ignore
    let pluginFormData = new FormData(formTotal);
    let formDataObj22 = {};
    for (let [key, value] of pluginFormData.entries()) {
      formDataObj22[key] = +value;
      //console.log(formDataObj);
    }
    //console.log("заебок");
    parent.postMessage(
      { pluginMessage: { type: "create-complex-abstract", formDataObj22 } },
      "*"
    );
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Assume the page loading process takes 2 seconds
    const loadingTimeout = setTimeout(() => {
      setIsLoading(true); // Set isLoading to false after 2 seconds
    }, 2000);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(loadingTimeout);
  }, []);

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === "create-rectangles") {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    let timerId = null;

    if (messages.length && lastMessage?.author !== "Bot") {
      timerId = setTimeout(() => {
        setMessages([...messages, { author: "Bot", message: "hi!" }]);
      }, 742);
    }

    return () => clearTimeout(timerId);
  }, [messages]);
  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClickPopover1 = (event: React.MouseEvent<HTMLDivElement>) => {
    //console.log(event.currentTarget); // Check if this is a valid DOM element
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const [hover, setHover] = useState(false);

  const style = {
    width: "110px",
    height: hover ? "110px" : "110px",
    transition: "transform 0.2s, filter 0.2s", // Smooth transition for transform and filter
    transform: hover ? "scale(1.8)" : "scale(1)", // Enlarge on hover
    filter: hover ? "brightness(1.2)" : "brightness(1)", // Adjust brightness on hover
  };

  const [hover2, setHover2] = useState(false);

  const style2 = {
    width: "110px",
    height: hover2 ? "110px" : "110px",
    transition: "transform 0.2s, filter 0.2s", // Smooth transition for transform and filter
    transform: hover2 ? "scale(1.8)" : "scale(1)", // Enlarge on hover
    filter: hover2 ? "brightness(1.2)" : "brightness(1)", // Adjust brightness on hover
  };

  const ref2 = useRef(null);
  useEffect(() => {
    // Check if ref2 is not null before calling focus
    if (ref2.current) {
      ref2.current.focus();
    }
  }, []);
  return (
    //компонент возвращает верстку
    <div className={styles.wrapper}>
      {messages.map((message, index) => (
        <div key={index} ref={ref2}>
          {message.author}
          {message.message}
          <hr />
        </div>
      ))}

      <form
        id="formTotal"
        autoComplete="on"
        style={{
          padding: "0px 4px",
          marginTop: "-29px",
          marginLeft: "40px",
          backgroundColor: "#f8fafe",
          borderRadius: "19px",
        }}
      >
        <div className={styles.field3} style={{ paddingTop: "24px" }}>
          {" "}
          <span>
            <br></br>
          </span>
          <Zoom in={isLoading} timeout={256}>
            <div>
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    minWidth: "110px",
                    width: "100%",
                  }}
                >
                  <span>
                    <Card
                      onClick={handleClickPopover1}
                      sx={{
                        minWidth: 125,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transition: "transform 0.2s, filter 1.2s", // Smooth transition
                        "&:hover": {
                          scale: "1.032", // Slightly enlarge the card on hover
                          filter: "contrast(1.08)",
                          borderRadius: "4px",
                          transform: "rotate(90deg)",
                        },
                        "&:active": {
                          scale: "0.98", // Slightly shrink the card when pressed
                          filter: "contrast(1.0)", // Optionally adjust filter on press
                          boxShadow: "none", // Remove box-shadow or change it when pressed
                          transform: "rotate(85deg)", // Optional: slightly adjust rotation on press
                        },
                      }}
                    >
                      <Bg2
                        style={{
                          width: "110px",
                          height: "110px",
                        }}
                      />
                      <CardContent></CardContent>{" "}
                      <div>
                        {" "}
                        <Grid container spacing={2}>
                          <Popover
                            id={open ? "simple-popover" : undefined}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                          >
                            <Grid sx={{ minWidth: 225 }} xs={8}>
                              <Dsd />
                            </Grid>
                          </Popover>
                        </Grid>
                      </div>
                    </Card>
                  </span>
                </Box>
              </>
            </div>
          </Zoom>
        </div>
        {/* Second Texture */}
        <div className={styles.field3}>
          <Zoom in={isLoading} timeout={456}>
            <div>
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    maxWidth: "110px",
                    width: "100%",
                  }}
                >
                  <span>
                    <Slide
                      direction="up"
                      in={isLoading}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Tooltip title="Monochromatic Grunge Geometric Texture">
                        <Card
                          onClick={onCreate2}
                          sx={{
                            minWidth: 125,
                            boxShadow: 1,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            transform: "scale(1)", // Set initial scale
                            transition:
                              "transform 0.2s ease-in-out, filter 1.2s ease-in-out", // Smooth transition
                            "&:hover": {
                              scale: "1.032", // Slightly enlarge the card on hover
                              filter: "contrast(1.08)",
                              borderRadius: "4px",
                              boxShadow: 8,
                            },
                            "&:active": {
                              scale: "0.98", // Slightly shrink the card when pressed
                              filter: "contrast(1.0)", // Optionally adjust filter on press
                              boxShadow: "none", // Remove box-shadow or change it when pressed
                              transform: "rotate(85deg)", // Optional: slightly adjust rotation on press
                            },
                            // Target the Bg2 component specifically
                          }}
                        >
                          {" "}
                          <Bg1
                            style={style}
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                          />
                          <CardContent></CardContent>{" "}
                          <div>
                            {" "}
                            <Grid container spacing={2}></Grid>
                          </div>
                        </Card>
                      </Tooltip>
                    </Slide>
                  </span>
                </Box>
              </>
            </div>
          </Zoom>
        </div>

        <div className={styles.field3}>
          <Zoom in={isLoading} timeout={956}>
            <div>
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    maxWidth: "110px",
                    width: "100%",
                  }}
                >
                  <span>
                    <Slide
                      direction="up"
                      in={isLoading}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Tooltip title="Abstract marbles and lines">
                        <Card
                          onClick={onCreate3}
                          sx={{
                            minWidth: "130px",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            "&:hover": {
                              scale: "1.032", // Slightly enlarge the card on hover
                              filter: "contrast(1.08)",
                              borderRadius: "4px",
                            },
                            "&:active": {
                              scale: "0.98", // Slightly shrink the card when pressed
                              filter: "contrast(2.0)", // Optionally adjust filter on press
                              boxShadow: "none", // Remove box-shadow or change it when pressed
                            },
                          }}
                        >
                          {" "}
                          <Bg3
                            style={style2}
                            onMouseEnter={() => setHover2(true)}
                            onMouseLeave={() => setHover2(false)}
                          />
                          <CardContent></CardContent>{" "}
                          <div>
                            {" "}
                            <Grid container spacing={2}></Grid>
                          </div>
                        </Card>
                      </Tooltip>
                    </Slide>
                  </span>
                </Box>
              </>
            </div>
          </Zoom>
        </div>
        <div>
          <div>
            <Zoom in={isLoading}>
              <Divider
                variant="middle"
                sx={{
                  scale: "1.62",
                  marginTop: "8px",
                  marginLeft: "-24px",
                  marginButtom: "8px",
                }}
              />
            </Zoom>{" "}
            <Slide direction="up" in={isLoading} mountOnEnter unmountOnExit>
              <span style={{ marginLeft: "-44px", marginTop: "48px" }}>
                <Button
                  variant="outlined"
                  sx={{
                    marginTop: "8px",
                    borderRadius: 28,
                    boxShadow: 1,
                    padding: 1.3,
                    px: 8,
                    mx: -12,
                  }}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </span>
            </Slide>
          </div>
        </div>
      </form>
    </div>
  );
};
