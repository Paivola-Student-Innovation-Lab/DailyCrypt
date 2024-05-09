
declare var require: {
  context: (path: string, deep?: boolean, filter?: RegExp) => any;
};

interface LanguageData {
  languagename : string;
  [key : string]: string;
}


const languageContext = import.meta.glob('./*.json', {eager: true});

export const dictionaryList: Record<string, LanguageData> = Object.keys(languageContext).reduce((acc: any, key: any) => {
  const languageKey = key.replace('./', '').replace('.json', '');
  acc[languageKey] = languageContext[key];
  return acc;
}, {});