import { useIntl } from "react-intl";
import enoughSpace from "../utils/Checkfilesize";
import usefunctionalityState from "./useFunctionalityState";
import useModal from "./useModal";
import calculateArraySize from "../utils/calculateArraySize";
function useChecks () {
    const translate = useIntl().formatMessage;
    const makeModal = useModal((state) => state.makeModal)
    const fileStore = usefunctionalityState((state) => state.filestore)
    //check if verything is correct and file can be crypted
    const handleChecks = async (files: File[], password: string, passwordMismatch: boolean, isEncrypting: boolean) => {
        if (password === "") {
            makeModal(translate({id: "empty_password"}), isEncrypting ? translate({id: "empty_password_encrypt"}) : translate({id: "empty_password_decrypt"}));
        }
        else if (passwordMismatch) {
            makeModal(translate({id: "mismatch"}), translate({id: "mismatch_text"}));
        }
        else if (!files[0]) {
            makeModal(translate({id: "empty_file"}), isEncrypting ? translate({id: "empty_file_encrypt"}) : translate({id: "empty_file_decrypt"}));
        }
        //check if there is enough space in opfs for the file
        else if (!await enoughSpace(calculateArraySize(files), fileStore, isEncrypting)) {
            makeModal("Seems we can't store the file", "check infopage for storage information")
        }
        else if (files.length !== 1 && !isEncrypting) {
            makeModal("you can't decrypt multiple files at once", "you can't decrypt multiple files at once")
            }
        else{
            return true
        }
        return false
    }
    return {handleChecks}
}
export default useChecks