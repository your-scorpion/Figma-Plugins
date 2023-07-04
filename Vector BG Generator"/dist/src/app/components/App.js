import * as React from 'react';
import '../styles/ui.css';
import { ThemeProvider, createTheme } from '@mui/material';
import "./palette.css";
import { MessageList } from "../components/MessageList/";
import { Creation } from "../components/Creation/";
import { Provider } from "react-redux";
import { store } from "../store";
export const App = ({}) => {
    const darkTheme = createTheme();
    return (React.createElement("div", null,
        React.createElement(Provider, { store: store },
            React.createElement(ThemeProvider, { theme: darkTheme },
                React.createElement(Creation, null))),
        React.createElement("div", null,
            React.createElement(MessageList, null))));
};
export default App;
