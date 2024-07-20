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
import { useClickOutside } from "./customHookClickOutside"; // Adjust the path as needed
import Bg2 from "./Bg2";

declare function require(path: string): any;

export const MessageList = () => {
  const styles = useStyles();
  const [messages, setMessages] = useState([]);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);

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

  const handleClickPopover1 = (event: React.MouseEvent<HTMLDivElement>) => {
    //console.log(event.currentTarget); // Check if this is a valid DOM element
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const ref = useClickOutside(handleClose);

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
        <div className={styles.field2}>
          {" "}
          <span>
            <br></br>
          </span>
          <Zoom in={isLoading} timeout={256}>
            <div>
              <>
                <Box
                  sx={{
                    cursor: "pointer",
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
                        "&:hover": {
                          scale: "1.032", // Slightly enlarge the card on hover
                          filter: "contrast(1.08)",
                          borderRadius: "4px",
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
                            //id={id}
                            open={open}
                            anchorEl={anchorEl}
                            //onClick={handlePopoverClose}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            onClose={handleClose}
                            ref={ref}
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
        <Zoom in={isLoading} timeout={456}>
          <div>
            <>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  maxWidth: "110px",
                  width: "100%",
                  cursor: "pointer",
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
                          minWidth: "130px",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          "&:hover": {
                            scale: "1.032", // Slightly enlarge the card on hover
                            filter: "contrast(1.08)",
                            borderRadius: "4px",
                          },
                        }}
                      >
                        {" "}
                        <Bg1
                          style={{
                            width: "110px",
                            height: "110px",
                          }}
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

        <div>
          <div>
            <Slide
              timeout={832}
              direction="up"
              in={isLoading}
              mountOnEnter
              unmountOnExit
            >
              <Divider
                variant="middle"
                sx={{ marginTop: "12px", marginLeft: "-24px" }}
              />
            </Slide>{" "}
            <Slide direction="up" in={isLoading} mountOnEnter unmountOnExit>
              <span style={{ marginLeft: "-44px", marginTop: "48px" }}>
                <Button
                  variant="outlined"
                  sx={{
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
