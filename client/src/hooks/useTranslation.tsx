import { useContext } from "react";
import { LanguageContext } from "../components/LanguageContext";

export default function useTranslation() {  
    const languageContext = useContext(LanguageContext);
    const translate = (key: string, options?: string) => {
        const translation = languageContext.dictionary[key] || key;
        if (translation===key) {
            return key;
        }
        const translated = options ? interpolate(translation, JSON.parse(options)) : translation;

        return translated;
    }

    const interpolate = (message: string, interpolations: Record<string, string>) => {
        return Object.keys(interpolations).reduce(
          (interpolated, key) =>
            interpolated.replace(
              new RegExp(`{\s*${key}\s*}`, "g"),
              interpolations[key],
            ),
          message,
        );
      }
    
    return translate;
};