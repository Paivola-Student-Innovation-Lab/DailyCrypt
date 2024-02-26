import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import App from "./App";
import "./index.module.css";
import Info from "./components/Infopage";
import ErrorModal from "./components/ErrorModal";
import { LanguageContext } from "./components/LanguageContext";
import { useContext, useState } from "react";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { LanguageProvider } from "./components/LanguageContext";
import Cookies from "js-cookie";
import useModal from "./hooks/useModal";
import useFunctionality from "./hooks/useFunctionality";

function Root() {
  const language = Cookies.get('userLanguage') || 'en';
  const languageContext = useContext(LanguageContext);
  const defaultDir = languageContext.dictionary[language]
  const [dir, setDir] = useState(defaultDir)
  const {handleCrypting} = useFunctionality()
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App encryptFunc = {handleCrypting}/>,
    },
    {
      path: "info",
      element: <Info/>,
    }
  ]);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#29c08d",
      },
    },
  });

  return (
    <LanguageProvider dir={dir} setDir={setDir}>
      <ThemeProvider theme={theme}>
        <ErrorModal/>
        <RouterProvider router={router} />
      </ThemeProvider>
    </LanguageProvider>
  );
}

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<Root />);