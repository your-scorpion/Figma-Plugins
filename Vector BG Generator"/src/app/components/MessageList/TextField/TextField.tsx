import React from 'react';
import TextField from '@mui/material/TextField';

export const TextFi = () => {
  return (
    <div>
      <TextField
        type="number"
        name="fname4"
        defaultValue="5"
        label="Filled"
        focused
        variant="filled"
        helperText="Please enter your name"
      />
    </div>
  );
};

export function TextFieldNormal(props) {
  console.log('props', props);
  return (
    <div>
      <h1>this: {props.ref}</h1>
    </div>
  );
}

export default TextFi;
