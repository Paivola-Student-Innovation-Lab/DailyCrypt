import { createContext } from "react";

export const ProgressContext = createContext({
    progress: 0,
    encrypting: true,
    fileName: "file"
  });
  export function ProgressProvider({children, progress, encrypting, fileName} : {children:any, progress: number, encrypting: boolean, fileName: string}) {
      const provider = {
        progress,
        encrypting,
        fileName
      }
      return (
          <ProgressContext.Provider value={provider}>
            {children}
          </ProgressContext.Provider>
      );
  }