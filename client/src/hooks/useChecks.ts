import { useIntl } from "react-intl";
import enoughSpace from "../utils/Checkfilesize";
import usefunctionalityState from "./useFunctionalityState";
import useModal from "./useModal";
import calculateArraySize from "../utils/calculateArraySize";
function useChecks () {
    const translate = useIntl().formatMessage;
    const makeModal = useModal((state) => state.makeModal)
    const fileStore = usefunctionalityState((state) => state.filestore)
    // Check if everything is correct and if the file can be crypted
    const handleChecks = async (files: File[], password: string, passwordMismatch: boolean, isEncrypting: boolean) => {
        if (password !== "") {
            if (!passwordMismatch) {
                if (files[0]) {
                    if (isEncrypting || files.length===1)
                        // Check if there is enough space in opfs for the file
                        if(await enoughSpace(calculateArraySize(files), fileStore, isEncrypting)){
                            return true
                        }
                        // Communicate to the user if something is incorrect
                        else{
                            makeModal(translate({id: "store_failed"}), translate({id: "store_failed_text"}))
                        }
                    else{
                        makeModal(translate({id: "decrypt_multiple"}), translate({id: "decrypt_multiple_text"}));
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