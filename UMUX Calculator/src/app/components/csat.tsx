import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import { Typography } from "@mui/material";
//import { styled } from '@mui/material/styles';
import PopoverIconButton2 from "./csatinf"; // Adjust the path based on your file structure

const DiscreteSliderLabel = () => {
  function valuetext(value) {
    return `${value}`;
  }

  const [sliderValues, setSliderValues] = useState({
    sliderValue1: 3,
    sliderValue2: 3,
    sliderValue3: 3,
    sliderValue4: 3,
    sliderValue5: 3,
    sliderValue6: 3,
    sliderValue7: 3,
  });

  const [switchValues, setSwitchValues] = useState({
    switch1: true,
    switch2: false,
    switch3: false,
    switch4: false,
    switch5: false,
    switch6: false,
    switch7: false,
  });

  const handleSliderChange = (sliderNumber, newValue) => {
    setSliderValues((prevValues) => ({
      ...prevValues,
      [`sliderValue${sliderNumber}`]: newValue,
    }));
  };

  const handleSwitchChange = (switchNumber) => {
    setSwitchValues((prevValues) => ({
      ...prevValues,
      [`switch${switchNumber}`]: !prevValues[`switch${switchNumber}`],
    }));
  };

  const calculateCSAT = () => {
    const totalSliders = Object.values(switchValues).filter(Boolean).length;

    const totalSliderValues = Object.keys(sliderValues).reduce(
      (total, sliderKey) => {
        return (
          total +
          (switchValues[`switch${sliderKey.slice(-1)}`]
            ? sliderValues[sliderKey]
            : 0)
        );
      },
      0,
    );

    const averageSliderValue = totalSliderValues / totalSliders;

    return isNaN(averageSliderValue) ? 0 : (averageSliderValue / 5) * 100;
  };

  return (
    <div>
      {/* <span>
        <AlertTitle sx={{ fontSize: 12, color: "#A1B2C7" }}>
          CSAT calculator
        </AlertTitle>{" "}
      </span>*/}

      <span style={{ marginLeft: "193px" }}>
        {" "}
        <PopoverIconButton2 />
      </span>

      <Grid
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        container
        spacing={3.42}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((respondent) => (
          <Grid item xs={4} key={respondent}>
            <Box sx={{ width: 240, marginLeft: "4px" }}>
              <div style={{ marginLeft: "-131px" }}>
                {" "}
                <Switch
                  size="small"
                  checked={switchValues[`switch${respondent}`]}
                  onChange={() => handleSwitchChange(respondent)}
                />{" "}
                Respondent {respondent}
              </div>

              <Slider
                sx={{
                  marginTop: "-6px",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#fff", // Change the thumb color
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "#A9A9A9", // Change the rail color
                  },
                  "& .MuiSlider-mark": {
                    backgroundColor: "#A9A9A9", // Change the mark color
                  },
                  "& .MuiSlider-markLabel": {
                    color: "#000", // Change the mark label color
                  },
                }}
                aria-label="Always visible"
                defaultValue={3}
                onChange={(_, newValue) =>
                  handleSliderChange(respondent, newValue)
                }
                getAriaValueText={valuetext}
                step={1}
                valueLabelDisplay="auto"
                min={1}
                max={5}
                disabled={!switchValues[`switch${respondent}`]}
              />
            </Box>{" "}
          </Grid>
        ))}
      </Grid>

      <span>
        <Typography variant="h5" sx={{ paddingTop: "22px" }}>
          CSAT: {Math.ceil(calculateCSAT())}%
        </Typography>
      </span>
    </div>
  );
};

export default DiscreteSliderLabel;
