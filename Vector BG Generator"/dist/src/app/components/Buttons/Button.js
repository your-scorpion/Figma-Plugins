import * as React from 'react';
import { Switch } from '@mui/material';
import { useSelector } from "react-redux";
export const Switcher = (props) => {
    const state = useSelector(state => state);
    console.log(state);
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return React.createElement(Switch, Object.assign({}, "label", { defaultChecked: true, color: "secondary" }));
    }
    return React.createElement("div", null,
        React.createElement(Switch, Object.assign({}, "label", { defaultChecked: true, color: "primary" })));
};
export default Switcher;
