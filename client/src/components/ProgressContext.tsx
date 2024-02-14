import { createContext } from "react";

export const ProgressContext = createContext({
    progress: 0,
    encrypting: true,
    fileName: "file",
    paused: false
  });
  export function ProgressProvider({children, progress, encrypting, fileName, paused} : {children:any, progress: number, encrypting: boolean, fileName: string, paused: boolean}) {
      const provider = {
        progress,
        encrypting,
        fileName,
        paused
      }
      return (
          <ProgressContext.Provider value={provider}>
            {children}
          </ProgressContext.Provider>
      );
  }