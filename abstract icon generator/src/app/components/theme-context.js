import React, { createContext, useState, useCallback } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';

const defaultValue = 'default';
export const ThemeContext = createContext(defaultValue);

const themes = {
  dark: {
    color: "#938261",
  },
  light: {
    color: "#137532",
  },
};

const themesMUI = {
  dark: createTheme({
    palette: {
      primary: {
        main: '#839292',
      },
    },
  }),
  light: createTheme({
    palette: {
      primary: {
        main: '#410372',
      },
    },
  }),
};

export const CustomThemeProvider = ({ children, initialTheme = 'light' }) => {
  const [theme, setTheme] = useState({
    theme: themes[initialTheme],
    name: initialTheme,
  });

  const themeSetter = useCallback((name) => {
    if (themes[name]) {
      setTheme({
        name,
        theme: themes[name],
      });
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, themeSetter }}>
      <ThemeProvider theme={themesMUI[theme.name]}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

CustomThemeProvider.propTypes = {
  children: PropTypes.node,
  initialTheme: PropTypes.oneOf(['dark', 'light']),
};

CustomThemeProvider.defaultProps = {
  initialTheme: 'light',
};
