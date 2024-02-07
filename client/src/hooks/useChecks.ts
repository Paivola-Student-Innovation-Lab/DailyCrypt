import enoughSpace from "../utils/Checkfilesize";
import usePlainText from "./useTranslation";
function useChecks (
makeModal: (title: string, text: string, modalQuestionOptions?:[buttontext: string, buttonfunc:()=>void][])=>void,
) {
    const PlainText = usePlainText()

    const handleChecks = async (file: File, password: string, passwordMismatch: boolean, isEncrypting: boolean, fileStore: string) => {
        if (password !== "") {
        if (!passwordMismatch) {
            if (file) {
                if(await enoughSpace(file.size, fileStore, isEncrypting)){
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
        return false
    }
    return {handleChecks}
}
export default useChecks