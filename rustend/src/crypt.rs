
use aes_gcm::{
    aead::{
        Aead, KeyInit, Result,
        consts::{B1, B0}, generic_array::GenericArray
    },
    Aes256Gcm, Nonce, Key, aes::cipher::typenum::{UInt, UTerm}
};
use sha256;


pub fn create_cipher(bytes: Vec<u8>) -> Result<Aes256Gcm> {
    // Creates a cipher from given key bytes
    let key = Key::<Aes256Gcm>::from_slice(&bytes); // Generate key from bytes
    let cipher = Aes256Gcm::new(&key); // Generate cipher from key
    Ok(cipher)
}

pub fn generate_nonce(passwd: &str) -> Result<GenericArray<u8, UInt<UInt<UInt<UInt<UTerm, B1>, B1>, B0>, B0>>> {
    let sha = sha256::digest(passwd); // Digest password (turn it into 64 hex bytes)

    let sliced = &sha[..12]; // Nonce has to be 12 bytes

    let as_bytes = sliced.as_bytes(); // Turn slice into bytes

    let nonce = Nonce::from_slice(&as_bytes); // Generate nonce from byte slice

    Ok(*nonce)
}


pub fn encrypt_chunk(bytearray: Vec<u8>, nonce_vec: Vec<u8>, keybytes: Vec<u8> ) -> Result<Vec<u8>> {
    let cipher = create_cipher(keybytes)?;

    let nonce = GenericArray::from_slice(&nonce_vec);

    let encryptedbytearray = cipher.encrypt(&nonce, bytearray.as_ref())?;

    Ok(encryptedbytearray)
}

pub fn decrypt_chunk(encryptedbytearray: Vec<u8>, nonce_vec: Vec<u8>, keybytes: Vec<u8>) -> Result<Vec<u8>> {
    let cipher = create_cipher(keybytes)?;

    let nonce = GenericArray::from_slice(&nonce_vec);

    let bytearray = cipher.decrypt(&nonce, encryptedbytearray.as_ref())?;
    
    Ok(bytearray)
}