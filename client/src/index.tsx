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
import { ProgressProvider } from "./components/ProgressContext";
import useFunctionality from "./hooks/useFunctionality";

function Root() {
  const language = Cookies.get('userLanguage') || 'en';
  const languageContext = useContext(LanguageContext);
  const defaultDir = languageContext.dictionary[language]
  const [dir, setDir] = useState(defaultDir)
  const {modalOpen, modalTitle, modalText, makeModal, closeModal, modalButtons} = useModal();
  const {handleCrypting, progress, dropHidden, fileName, encrypt} = useFunctionality(makeModal, closeModal)
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App encryptFunc = {handleCrypting} hasOpfs={!(!navigator.storage.getDirectory)} dropHidden={dropHidden}/>,
    },
    {
      path: "info",
      element: <Info dropHidden={dropHidden}/>,
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
        <ErrorModal open={modalOpen} onClose={closeModal} title={modalTitle} text={modalText}  Buttons={modalButtons}/>
        <ProgressProvider progress={progress} encrypting={encrypt} fileName={fileName}>
          <RouterProvider router={router} />
        </ProgressProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<Root />);