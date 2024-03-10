import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import LightbulbCircleIcon from "@mui/icons-material/LightbulbCircle";
import Typography from '@mui/material/Typography';


const PopoverIconButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'popover-id' : undefined;

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ mt: -8, ml: 11 }}
        color="primary"
        edge="start"
        size="small"
        aria-label="Help me with it please"
      >
        <LightbulbCircleIcon color="primary" />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {/* Content of your popover */}
        <Typography align="left" variant="body2" sx={{ p: 2 }}>
                      UMUX is a measure of complexity. Responses are coded by
                      the user from 1 to 7, from disagreement to agreement, with
                      1 being the most negative and 7 the most positive.
                      <br />
                      <br />
                      UMUX scores are converted to a 0-100 point scale using a
                      simple linear transformation. The formula in this plugin
                      for UMUX = ((q1 / 7) + (q2 / 7)) / 2 x 100, which gives a
                      range of 14 to 100.
                      <br />
                      <br />
                      In a case of 5, simply replace all 7 with 5 in the
                      equation. The range will be from 20 to 100.
                    </Typography>
      </Popover>
    </>
  );
};

export default PopoverIconButton;
