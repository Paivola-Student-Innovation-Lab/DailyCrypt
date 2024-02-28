import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import App from "./App";
import "./index.module.css";
import Info from "./components/Infopage";
import ErrorModal from "./components/ErrorModal";
import { dictionaryList } from "./languages";
import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Cookies from "js-cookie";
import useFunctionality from "./hooks/useFunctionality";
import { IntlProvider } from "react-intl";
function DailyCrypt (props: any){
  const {handleCrypting} = useFunctionality()
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App encryptFunc = {handleCrypting} setLanguage={props.setCurrentLanguage} />,
    },
    {
      path: "info",
      element: <Info setLanguage={props.setCurrentLanguage} />,
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
    
      <div dir={props.dir}>
        <ThemeProvider theme={theme}>
          <ErrorModal/>
          <RouterProvider router={router} />
        </ThemeProvider>
      </div>
    
  );
}
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
    return(
      <IntlProvider locale={currentLanguage} messages={dictionaryList[currentLanguage]}>
        <DailyCrypt dir={dir} setCurrentLanguage={setCurrentLanguage}/>
      </IntlProvider>

    )
  
}

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<Root />);