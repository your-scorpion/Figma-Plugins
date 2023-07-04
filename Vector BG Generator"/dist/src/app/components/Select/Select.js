import * as React from 'react';
import { ButtonGroup, Button } from '@mui/material';
export const BtnGroup = () => {
    return (React.createElement("p", null,
        React.createElement(ButtonGroup, { variant: "contained", "aria-label": "outlined button group" },
            React.createElement(Button, null, "One"),
            React.createElement(Button, null, "Two"),
            React.createElement(Button, null, "Three"),
            React.createElement(Button, null, "One"),
            React.createElement(Button, null, "Two"),
            React.createElement(Button, null, "Three"))));
};
export default BtnGroup;
