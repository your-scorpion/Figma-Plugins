import * as React from 'react';
// @ts-ignore

import Box from '@mui/material/Box';
// @ts-ignore
import TextField from '@mui/material/TextField';
// @ts-ignore
import { InputAdornment } from '@mui/material';
// @ts-ignore
import Filter1TwoToneIcon from '@mui/icons-material/Filter1TwoTone';

function StateTextFields() { //главное имя
  const [time, setTime] = React.useState('3');


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  



  
  console.log(time);

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      >

      <TextField
        inputProps={{ min: "1", max:"10", type: 'number'}}
        id="outlined-name"
        label="Name"
        placeholder="dddd"
        value={name}
        onChange={handleChange}

        InputProps={{
        startAdornment: (
            <InputAdornment position="end">
              <Filter1TwoToneIcon />
            </InputAdornment>
            ),
        }}

      />


    </Box>
  );
}







export default StateTextFields;