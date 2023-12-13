use core::panic;

use wasm_bindgen::prelude::*;
mod crypt;

#[wasm_bindgen]
extern {
}

#[wasm_bindgen]
pub fn encrypt(chunk: Vec<u8>, password: &str) -> Vec<u8> {
    let encrypted = match crypt::encrypt_chunk(chunk, password) {
        Ok(result) => result,
        Err(err) => {
            panic!("Error: {}", err)
        }
    };
    encrypted
}

#[wasm_bindgen]
pub fn decrypt(chunk: Vec<u8>, password: &str) -> Vec<u8>  {
    let decrypted = match crypt::decrypt_chunk(chunk, password) {
        Ok(result) => result,
        Err(_err) => {
            [].to_vec()
        }
    };
    decrypted
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