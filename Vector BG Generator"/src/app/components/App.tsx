import React from "react";
import "../styles/ui.css";
import { ThemeProvider, createTheme } from "@mui/material";
import "./palette.css";
import { MessageList } from "../components/MessageList/";
import { Creation } from "../components/Creation/";
import { Provider } from "react-redux";
import { store } from "../store";

export const App = () => {
  const darkTheme = createTheme();

  return (
    <div>
      <Provider store={store}>
        <ThemeProvider theme={darkTheme}>
          <Creation />
        </ThemeProvider>
      </Provider>
      <div>
        <MessageList />
      </div>
    </div>
  );
};

export default App;
