import init from "rustend";
import { encrypt, decrypt, get_cipher_key, get_nonce } from "rustend";

const useWasm = () => {
  init();
  return {encrypt, decrypt, get_cipher_key, get_nonce};
};

export default useWasm;
