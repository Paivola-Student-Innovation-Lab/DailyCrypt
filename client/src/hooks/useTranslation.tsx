import { useContext } from "react";
import { LanguageContext } from "../components/LanguageContext";

export default function useTranslation() {  
    const languageContext = useContext(LanguageContext);

    const translate = (key: string, options?: string) => {
      const translation = languageContext.dictionary[key];

      if (!translation) {
        return key;
      }

      if (key === "time_remaining") {
        if (!options) {
          return key;
        }
        const parsedOptions = JSON.parse(options);
        return translateTimeRemaining(translation, [parsedOptions.hours, parsedOptions.minutes, parsedOptions.seconds]);
      }

      if (key.endsWith("_plural")) {
        if (options) {
          const parsedTranslation = JSON.parse(translation);
          const parsedOptions = JSON.parse(options);
          return interpolate(pluralFormFor(parsedTranslation, parsedOptions.count), parsedOptions)
        }
        else {return key;}
        
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
    

    const pluralFormFor = (forms: { [x: string]: any; }, count: number) => {
      const matchingForm = new Intl.PluralRules(languageContext.userLanguage).select(count);
      return forms[matchingForm];
    }


    const determineCase = (translationString: string, context: Record<string, any>): string | null => {
      const cases = translationString.split('|');
      for (const item of cases) {
          const placeholders = item.match(/{\s*\w+\s*}/g) || [];
          if (placeholders.every(placeholder => context.hasOwnProperty(placeholder.replace(/[{}]/g, '').trim()))) {
              return item;
          }
      }
      return null;
    };

    const translateTimeRemaining = (message: string, [hours, minutes, seconds]: [number, number, number]) => {
      if (typeof message !== 'string' || !message.includes('|')) {
        throw new Error('Invalid message format');
      }
      
      const translation = message.split('|');

      const hPlural: {} = languageContext.dictionary["hour_plural"];
      const mPlural: {} = languageContext.dictionary["minute_plural"];
      const sPlural: {} = languageContext.dictionary["second_plural"];
  
    if (hours > 0) {
      return interpolate(translation[0], {
        hours: interpolate(pluralFormFor(hPlural, hours), {count: hours.toString()}),
        minutes: interpolate(pluralFormFor(mPlural, minutes), {count: minutes.toString()}),
        seconds: interpolate(pluralFormFor(sPlural, seconds), {count: seconds.toString()})
      });
    } else if (minutes > 0) {
      return interpolate(translation[1], {
        minutes: interpolate(pluralFormFor(mPlural, minutes), {count: minutes.toString()}),
        seconds: interpolate(pluralFormFor(sPlural, seconds), {count: seconds.toString()})
      });
    } else {
      return interpolate(translation[2], {
        seconds: interpolate(pluralFormFor(sPlural, seconds), {count: seconds.toString()})
      });
    }
  };
    
    return translate;
};