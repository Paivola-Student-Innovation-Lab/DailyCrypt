import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import App from "./App";
import "./index.module.css";
import Info from "./components/Infopage";
import { dictionaryList } from "./languages";
import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Cookies from "js-cookie";
import { IntlProvider } from "react-intl";

function Root() {
  let defaultLanguage = Cookies.get('userLanguage') || 'en';
  if (!dictionaryList[defaultLanguage]) {
      defaultLanguage = 'en';
  }
  const defaultDir = dictionaryList[defaultLanguage].languageDirection;

  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [dir, setDir] = useState(defaultDir)

  useEffect(() => {
      // Save the user's language preference to a cookie.
      Cookies.set('userLanguage', currentLanguage, {
          sameSite: 'None',
          secure: true,
      });
      setDir(dictionaryList[currentLanguage].languageDirection)
    }, [currentLanguage]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App setLanguage={setCurrentLanguage} />,
    },
    {
      path: "info",
      element: <Info setLanguage={setCurrentLanguage} />,
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
    <IntlProvider locale={currentLanguage} messages={dictionaryList[currentLanguage]}>
      <div dir={dir}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </div>
    </IntlProvider>
  );
}

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<Root />);