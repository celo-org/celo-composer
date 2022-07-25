import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import React, { PropsWithChildren, useContext, useEffect } from "react";

export const CustomThemeContext = React.createContext<{
  theme?: boolean;
  setTheme: (active?: boolean) => void;
}>({
  theme: undefined,
  setTheme: () => {},
});
export const CustomThemeProvider = (props: PropsWithChildren<{}>) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [theme, setTheme] = React.useState(prefersDarkMode);
  const themeString = (b: boolean) => (b ? "dark" : "light");
  const switchTheme = (checked: boolean) => {
    console.log(checked);
    if (checked === null) setTheme(theme);
    else setTheme(checked);
  };
  const { children } = props;
  const mTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeString(theme),
        },
      }),
    [theme]
  );
  useEffect(() => {
    theme ? document.body.classList.add("tw-dark") : document.body.classList.remove("tw-dark");
  }, [theme])
  return (
    <CustomThemeContext.Provider
      value={{
        theme,
        setTheme: switchTheme,
      }}
    >
      <ThemeProvider theme={mTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(CustomThemeContext);
