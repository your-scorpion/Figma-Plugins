import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Button } from '@mui/material';
import { useStyles } from "./use-styles";
import { TextField } from '@mui/material';
import { Chip } from '@mui/material';
import { Avatar } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import InputAdornment from '@mui/material/InputAdornment';
import Rotate90DegreesCcwOutlinedIcon from '@mui/icons-material/Rotate90DegreesCcwOutlined';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import HeightIcon from '@mui/icons-material/Height';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
export const MessageList = () => {
    const styles = useStyles();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const ref = useRef(null);
    const onCreate = () => {
        let pluginFormData = new FormData(formTotal);
        let formDataObj = {};
        for (let [key, value] of pluginFormData.entries()) {
            formDataObj[key] = +value;
        }
        parent.postMessage({ pluginMessage: { type: 'create-rectangles', formDataObj } }, '*');
    };
    const onCancel = () => {
        parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
    };
    React.useEffect(() => {
        window.onmessage = (event) => {
            const { type, message } = event.data.pluginMessage;
            if (type === 'create-rectangles') {
                console.log(`Figma Says: ${message}`);
            }
        };
    }, []);
    const ref2 = useRef(null);
    useEffect(() => {
        var _a;
        (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, []);
    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const ref5 = useRef(null);
    useEffect(() => {
        let timerId = null;
        return () => clearInterval(timerId);
    }, [messages]);
    const sendMessage = () => {
        if (message) {
            setMessages([...messages, { author: "Last value: ", message }]);
            setMessage("");
        }
        else { }
    };
    const handlePressInput = (event) => {
        if (event.code === "KeyW") {
            sendMessage();
        }
    };
    const handleFocus = (event) => event.target.select();
    return (React.createElement("div", { className: styles.wrapper },
        messages.map((message, index) => (React.createElement("div", { key: index, ref: ref2 },
            message.author,
            message.message,
            React.createElement("hr", null)))),
        React.createElement("form", { id: "formTotal", autoComplete: "on" },
            React.createElement(Chip, { label: "All values must be greater than 0", variant: "outlined", color: "secondary", size: "small", avatar: React.createElement(Avatar, { sx: { bgcolor: deepPurple[100] } }, "!") }),
            React.createElement("div", { className: styles.field2 },
                " ",
                React.createElement("span", null,
                    React.createElement("br", null)),
                React.createElement(TextField, { sx: { m: -1, ml: -2, width: 200 }, className: styles.input, fullWidth: true, name: "fname2", size: "small", placeholder: "From 0 up to \u221E", defaultValue: "180", type: "number", inputRef: ref2, onFocus: handleFocus, InputProps: {
                        style: {
                            fontSize: 16
                        },
                        inputProps: {
                            min: 1,
                            max: 900,
                            maxLength: 3,
                            pattern: "([^0-9]*)",
                        },
                        startAdornment: (React.createElement(InputAdornment, { sx: {
                                padding: "0px 0px",
                            }, position: "start" },
                            React.createElement(Rotate90DegreesCcwOutlinedIcon, { style: { marginLeft: -4 } })))
                    }, id: "outlined-basic", label: "Canvas Rotation:", variant: "outlined", required: true, onChange: (event) => setMessage(event.target.value), onKeyPress: handlePressInput })),
            React.createElement("div", { className: styles.field2 },
                React.createElement(TextField, { sx: { m: -1, ml: -2, width: 200 }, className: styles.input, fullWidth: true, size: "small", name: "fname3", inputRef: ref3, onFocus: handleFocus, type: "number", placeholder: "From 0 up to \u221E", id: "outlined-basic", defaultValue: "500", label: "Total Canvas Width:", required: true, variant: "outlined", onChange: (event) => setMessage(event.target.value), onKeyPress: handlePressInput, InputProps: {
                        style: {
                            fontSize: 16
                        },
                        inputProps: {
                            min: 1,
                            max: 900,
                            maxLength: 3,
                            pattern: "([^0-9]*)",
                        },
                        startAdornment: (React.createElement(InputAdornment, { sx: {
                                padding: "0px 0px",
                            }, position: "start" },
                            React.createElement(ArrowRightAltIcon, { style: { marginLeft: -4 } })))
                    } })),
            React.createElement("div", { className: styles.field2 },
                React.createElement(TextField, { sx: { m: -1, ml: -2, width: 200 }, className: styles.input, fullWidth: true, name: "fname4", inputRef: ref4, size: "small", onFocus: handleFocus, id: "outlined-basic", type: "number", label: "Total Canvas Height:", variant: "outlined", defaultValue: "500", onChange: (event) => setMessage(event.target.value), onKeyPress: handlePressInput, InputProps: {
                        style: {
                            fontSize: 16
                        },
                        inputProps: {
                            min: 1,
                            max: 900,
                            maxLength: 3,
                            pattern: "([^0-9]*)",
                        },
                        startAdornment: (React.createElement(InputAdornment, { sx: {
                                padding: "0px 0px",
                            }, position: "start" },
                            React.createElement(HeightIcon, { style: { marginLeft: -4 } })))
                    }, required: true, margin: "dense", color: "info", placeholder: "From 0 up to \u221E" })),
            React.createElement("div", { className: styles.field2 },
                React.createElement(TextField, { sx: { m: -1, ml: -2, width: 200 }, className: styles.input, fullWidth: true, size: "small", name: "fname5", InputLabelProps: { shrink: true }, inputRef: ref5, defaultValue: "15", onFocus: handleFocus, id: "standard", type: "number", label: "Structure level:", variant: "outlined", InputProps: {
                        style: {
                            fontSize: 16
                        },
                        inputProps: {
                            min: 1,
                            max: 900,
                            maxLength: 3,
                            pattern: "([^0-9]*)",
                        },
                        startAdornment: (React.createElement(InputAdornment, { sx: {
                                padding: "0px 0px",
                            }, position: "start" },
                            React.createElement(DonutLargeOutlinedIcon, { style: { marginLeft: -4 } })))
                    }, onChange: (event) => setMessage(event.target.value), onKeyPress: handlePressInput, required: true, margin: "dense", color: "primary", placeholder: "From 0 up to \u221E" })),
            React.createElement("div", null,
                React.createElement(Button, { variant: "contained", sx: { borderRadius: 28, boxShadow: 1, padding: 1.3, px: 2, mx: -11.4 }, style: { border: '0px solid white' }, onClick: onCreate }, "Create"),
                " ",
                React.createElement("span", null, "             "),
                React.createElement(Button, { variant: "outlined", sx: { borderRadius: 28, boxShadow: 1, padding: 1.3, px: 2, mx: -11.4 }, onClick: onCancel }, "Cancel")))));
};
