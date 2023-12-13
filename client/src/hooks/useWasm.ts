import init from "rustend";
import { encrypt, decrypt } from "rustend";

const useWasm = () => {
  init();
  return {encrypt, decrypt};
};

export default useWasm;
