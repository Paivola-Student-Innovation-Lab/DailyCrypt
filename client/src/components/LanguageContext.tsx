import { createContext, useEffect, useState } from 'react';
import { dictionaryList } from '../languages';
import Cookies from 'js-cookie';

export const LanguageContext = createContext({
  userLanguage: 'en',
  dictionary: dictionaryList.en,
  userLanguageChange: (newLanguage: string) => {}
});

export function LanguageProvider({ children, dir, setDir } : {children:any, dir:string, setDir:any}) {
    let defaultLanguage = Cookies.get('userLanguage') || 'en';
    if (!(defaultLanguage in Object.keys(dictionaryList))) {
        defaultLanguage = 'en';
    }
    const [userLanguage, setUserLanguage] = useState(defaultLanguage);

    useEffect(() => {
        // Save the user's language preference to a cookie.
        Cookies.set('userLanguage', userLanguage, {
            sameSite: 'None',
            secure: true,
        });
        setDir(dictionaryList[userLanguage].languagedirection)
      }, [userLanguage]);

    const provider = {
        userLanguage,
        dictionary: dictionaryList[userLanguage],
        userLanguageChange: (newLanguage: string) => {
            setUserLanguage(newLanguage);
        },
    };

    return (
        <LanguageContext.Provider value={provider}>
            <div dir={dir}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
}