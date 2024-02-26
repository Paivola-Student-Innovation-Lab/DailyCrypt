import { useIntl } from "react-intl";
import enoughSpace from "../utils/Checkfilesize";
import usefunctionalityState from "./useFunctionalityState";
import useModal from "./useModal";
function useChecks () {
    const translate = useIntl().formatMessage;
    const makeModal = useModal((state) => state.makeModal)
    const fileStore = usefunctionalityState((state) => state.filestore)
    //check if verything is correct and file can be crypted
    const handleChecks = async (file: File, password: string, passwordMismatch: boolean, isEncrypting: boolean) => {
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
        return false
    }
    return {handleChecks}
}
export default useChecks