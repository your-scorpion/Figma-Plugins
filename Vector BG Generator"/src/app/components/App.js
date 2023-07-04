"use strict";
exports.__esModule = true;
var React = require("react");
require("../styles/ui.css");
var material_1 = require("@mui/material");
var material_2 = require("@mui/material");
require("./palette.css");
var MessageList_1 = require("../components/MessageList/");
var Buttons_1 = require("../components/Buttons/");
var Select_1 = require("../components/Select/");
var TextField_1 = require("../components/MessageList/TextField/");

var App = function () {
    var textboxRef = React.useRef();

    var onCreate = function () {
        var count = parseInt(textboxRef.current.value, 10);
        parent.postMessage({ pluginMessage: { type: 'create-rectangles', count: count } }, '*');
    };

    var onCancel = function () {
        parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
    };

    React.useEffect(function () {
        // This is how we read messages sent from the plugin controller
        window.onmessage = function (event) {
            var _a = event.data.pluginMessage, type = _a.type, message = _a.message;
            if (type === 'create-rectangles') {
                console.log("Figma Says: " + message);
            }
        };
    }, []);

    var darkTheme = (0, material_1.createTheme)();

    return (
        <div>
            <TextField_1.TextFieldNormal ref={textboxRef} />

            <material_1.ThemeProvider theme={darkTheme}>
                <div><MessageList_1.MessageList /></div>
                <h2>It's not even</h2>
                Count: <input ref={textboxRef} />

                <Buttons_1.Switcher />
                <Select_1.BtnGroup />

                <material_2.Button variant="contained" onClick={onCreate}>Create</material_2.Button>
                <material_2.Button variant="outlined" onClick={onCancel}>Cancel</material_2.Button>
            </material_1.ThemeProvider>
        </div>
    );
};

exports["default"] = App;
