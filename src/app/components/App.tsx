import React from "react";
import { ThemeProvider } from "emotion-theming";
import theme from "@rebass/preset";

import Header from "./Header";

const App = ({ children }: { children?: any }) => {
  return (
    <main>
      <ThemeProvider theme={theme}>
        <Header />
        {children}
      </ThemeProvider>
    </main>
  );
};

export default App;
