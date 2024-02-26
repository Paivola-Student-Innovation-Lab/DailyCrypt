import { SetStateAction } from "react";
import enoughSpace from "../utils/Checkfilesize";
import { useIntl } from "react-intl";

export function useCrypting(
    chunk: { (file: Blob, encrypting: boolean, password: string): Promise<void>; (arg0: any, arg1: boolean, arg2: any): any; },
    setProgress: { (value: SetStateAction<number>): void; (arg0: number): void; },
    setEncrypting: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; },
    setDropHidden: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; },
    makeModal: { (title: string, text: string): void; (arg0: string, arg1: string): void; },
    password: string,
    passwordMismatch: boolean,
    files: any[],
    fileStore: string
    ) {
        const translate = useIntl().formatMessage
    
        const handleCrypting = async (isEncrypting: boolean) => {
            setProgress(0)
            setEncrypting(isEncrypting)
            if (password !== "") {
            if (!passwordMismatch) {
                if (files[0]) {
                    if(await enoughSpace(files[0].size, fileStore, isEncrypting)){
                        setDropHidden(true)
                        await new Promise( res => setTimeout(res, 1) ); // Wait 1ms for the loading bar to load
                        // Chunk
                        await chunk(files[0], isEncrypting, password);
                        return true
                      }
                      else{
                        makeModal("Seems we can't store the file", "check infopage for storage information")
                      }
                }
                else {
                makeModal(translate({id: "empty_file"}), isEncrypting ? translate({id: "empty_file_encrypt"}) : translate({id: "empty_file_decrypt"}));
                }
            }
            else {
                makeModal(translate({id: "mismatch"}), translate({id: "mismatch_text"}));
            }
            }
            else{
            makeModal(translate({id: "empty_password"}), isEncrypting ? translate({id: "empty_password_encrypt"}) : translate({id: "empty_password_decrypt"}));
            }
        }
        return { handleCrypting } 
}

export default useCrypting
