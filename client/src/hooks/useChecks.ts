import enoughSpace from "../utils/Checkfilesize";
import useModal from "./useModal";
import usePlainText from "./useTranslation";
function useChecks () {
    const PlainText = usePlainText()
    const makeModal = useModal((state) => state.makeModal)
    //check if verything is correct and file can be crypted
    const handleChecks = async (file: File, password: string, passwordMismatch: boolean, isEncrypting: boolean, fileStore: string) => {
        if (password !== "") {
        if (!passwordMismatch) {
            if (file) {
                //check if there is enough space in opfs for the file
                if(await enoughSpace(file.size, fileStore, isEncrypting)){
                    return true
                }
        //communicate to the user if something is inccorrect
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