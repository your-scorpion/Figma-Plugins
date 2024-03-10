import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import LightbulbCircleIcon from "@mui/icons-material/LightbulbCircle";
import { Grow } from "@mui/material";
import Typography from "@mui/material/Typography";

const PopoverIconButton2 = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "popover-id" : undefined;

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {" "}
      <IconButton
        onClick={handleClick}
        sx={{ mt: 4, ml: 11, marginTop: "-49px" }}
        color="primary"
        edge="start"
        size="small"
      >
        <LightbulbCircleIcon color="primary" />
      </IconButton>{" "}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* Content of your popover */}
        <Grow
          in={isMounted}
          style={{ transformOrigin: "23 43 22" }}
          {...(isMounted ? { timeout: 730 } : {})}
        >
          <span>
            <Typography align="left" variant="body2" sx={{ p: 2 }}>
              CSAT (Satisfaction Score) assesses satisfaction. The level of
              customer satisfaction after interacting with a product or service.
              An increase in CSAT can be the result of an improved UX. <br />
              <br /> The formula in this plugin is: CSAT = Sum of all Rating
              Scores/Sum of Maximum Scores x 100. Example: 5+3+1 / 5+5+5 x 100 =
              9/15 x 100 = 60%
            </Typography>{" "}
          </span>
        </Grow>
      </Popover>{" "}
    </>
  );
};

export default PopoverIconButton2;
