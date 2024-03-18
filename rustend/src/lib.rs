use core::panic;

use wasm_bindgen::prelude::*;
mod crypt;

#[wasm_bindgen]
extern {
}

#[wasm_bindgen]
pub fn encrypt(chunk: Vec<u8>, nonce_vec: Vec<u8>, keybytes: Vec<u8>) -> Vec<u8> {
    match crypt::encrypt_chunk(chunk, nonce_vec, keybytes) {
        Ok(result) => result,
        Err(err) => {
            panic!("Error: {}", err)
        }
    }
}

#[wasm_bindgen]
pub fn decrypt(chunk: Vec<u8>, nonce_vec: Vec<u8>, keybytes: Vec<u8>) -> Vec<u8>  {
    match crypt::decrypt_chunk(chunk, nonce_vec, keybytes) {
        Ok(result) => result,
        Err(_err) => {
            [].to_vec()
        }
    }
}

#[wasm_bindgen]
pub fn get_cipher_key(passwd: &str) -> Vec<u8> {
    let sha = sha256::digest(passwd); // Digest password (turn it into 64 hex bytes)
    (0..sha.len()).step_by(2).map(|byte| u8::from_str_radix(&sha[byte..byte+2], 16).unwrap()).collect::<Vec<u8>>().try_into().unwrap() // Turn hex bytes into real bytes
}


#[wasm_bindgen]
pub fn get_nonce(password: &str) -> Vec<u8> {
    let nonce = match crypt::generate_nonce(password) {
        Ok(result) => result,
        Err(err) => {
            panic!("Error: {}", err)
        }
    };
    nonce.to_vec()
}

#[cfg(test)]
mod tests {
    use std::str::from_utf8;

    use crate::crypt::{encrypt_chunk, decrypt_chunk};


    fn encrypt_decrypt(plaintext: &str, passwd: &str)  {
        match encrypt_chunk(plaintext.as_bytes().to_vec(), passwd) {
            Ok(t) => {
                match decrypt_chunk(t, passwd) {
                    Ok(m) => {
                        let newplaintext = from_utf8(&m).unwrap();
                        assert_eq!(plaintext, newplaintext);
                    },
                    Err(e) => println!("{}", e),
                }
            }
            Err(e) => println!("{}", e)
        }
    }

    #[test]
    fn random_inputs() {
        let plaintext = "Rust";
        let passwd = "hallo";
        encrypt_decrypt(plaintext, passwd);
    }

    #[test]
    fn empty_text() {
        let plaintext = "";
        let passwd = "hallo";
        encrypt_decrypt(plaintext, passwd);
    }

    #[test]
    fn empty_passwd() {
        let plaintext = "Rust";
        let passwd = "";
        encrypt_decrypt(plaintext, passwd);
    }

    #[test]
    fn empty_inputs() {
        let plaintext = "";
        let passwd = "";
        encrypt_decrypt(plaintext, passwd);
    }
}