
declare var require: {
  context: (path: string, deep?: boolean, filter?: RegExp) => any;
};

interface LanguageData {
  languagename : string;
  [key : string]: string;
}

const languageContext = require.context('./', false, /\.json$/);

export const dictionaryList: Record<string, LanguageData> = languageContext.keys().reduce((acc: any, key: any) => {
  const languageKey = key.replace('./', '').replace('.json', '');
  acc[languageKey] = languageContext(key);
  return acc;
}, {});