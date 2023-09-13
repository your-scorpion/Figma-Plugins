import * as React from "react";
import { keyframes } from "@emotion/react";
import LinearProgress from "@mui/material/LinearProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Slide from "@mui/material/Slide";



const myKeyframe = keyframes`
    0 %  { -webkit-transform : rotate(10deg) scale(12); 
      animation-timing-function: ease-in;},
    30%  { -webkit-transform : rotate(320deg) scale(0.5); 
    100% { -webkit-transform : rotate(10deg) scale(12); }
`;

const innerTheme = createTheme({
  palette: {
    primary: {
      main: "#914EFF"
    }
  }
});


function LinearIndeterminate() {
  return (

    <ThemeProvider theme={innerTheme}>


      <LinearProgress
        variant="indeterminate"
        sx={{
          animationDuration: "33s",
          animation: `${myKeyframe} 3.53s infinite ease`,
          height: "60px",
          boxShadow: "8px 7px 24px 8px rgba(145, 78, 255, 0.6)",
          width: "60px",
          backgroundColor: "rgba(145, 78, 255, 0.6)",
          borderRadius: "32px",
          "& .MuiLinearProgress-bar": {
            boxShadow: "0px 4px 34px 14px rgba(145, 78, 255, 1)",
            animationDuration: "2.42s",
            borderRadius: "55px",
            height: "20px",
            width: '32px'
          },
          "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: "rgba(145, 78, 255, 0.6)"
          }
        }}
      />

    </ThemeProvider>


  );
}

export { LinearIndeterminate };
