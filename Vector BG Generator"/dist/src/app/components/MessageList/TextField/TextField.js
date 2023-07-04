import * as React from 'react';
import { TextField } from '@mui/material';
export const TextFi = () => {
    return (React.createElement("p", null,
        React.createElement(TextField, { type: "number", name: "fname4", defaultValue: "5", label: "Filled", focused: true, variant: "filled", helperText: "Please enter your name" })));
};
export function TextFieldNormal(props) {
    console.log("props", props);
    return (React.createElement("div", null,
        React.createElement("h1", null,
            "this: ",
            props.ref)));
}
export default TextFi;
