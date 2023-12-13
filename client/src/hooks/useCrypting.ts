import { SetStateAction } from "react";
import enoughSpace from "../utils/Checkfilesize";
import usePlainText from "./useTranslation";

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
        const PlainText = usePlainText()
    
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
                makeModal(PlainText("empty_file"), isEncrypting ? PlainText("empty_file_encrypt") : PlainText("empty_file_decrypt"));
                }
            }
            else {
                makeModal(PlainText("mismatch"), PlainText("mismatch_text"));
            }
            }
            else{
            makeModal(PlainText("empty_password"), isEncrypting ? PlainText("empty_password_encrypt") : PlainText("empty_password_decrypt"));
            }
        }
        return { handleCrypting } 
}

export default useCrypting
