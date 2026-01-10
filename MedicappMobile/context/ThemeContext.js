import React, { createContext, useState } from 'react';

const darkTheme = {
  primary: '#1a1a1a',
  secondary: '#2d2d2d',
  text: '#ffffff',
  accent: '#007AFF',
  background: '#121212',
  card: '#1e1e1e',
  border: '#333333',
  notification: '#ff3b30',
};

const lightTheme = {
  primary: '#ffffff',
  secondary: '#f5f5f5',
  text: '#000000',
  accent: '#007AFF',
  background: '#ffffff',
  card: '#ffffff',
  border: '#e0e0e0',
  notification: '#ff3b30',
};

export const ThemeContext = createContext({
  theme: darkTheme,
  isDarkMode: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 