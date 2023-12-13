
use aes_gcm::{
    aead::{
        Aead, KeyInit, Result,
        consts::{B1, B0}, generic_array::GenericArray
    },
    Aes256Gcm, Nonce, Key, aes::cipher::typenum::{UInt, UTerm}
};
use sha256;

fn create_cipher(passwd: &str) -> Result<Aes256Gcm> {
    // Creates a cipher from given password, using SHA256 and AES256GCM

    let sha = sha256::digest(passwd); // Digest password (turn it into 64 hex bytes)
    let realbytes: [u8; 32] = (0..sha.len()).step_by(2).map(|byte| u8::from_str_radix(&sha[byte..byte+2], 16).unwrap()).collect::<Vec<u8>>().try_into().unwrap(); // Turn hex bytes into real bytes
    let key = Key::<Aes256Gcm>::from_slice(&realbytes); // Generate key from bytes
    let cipher = Aes256Gcm::new(&key); // Generate cipher from key
    Ok(cipher)
}

fn generate_nonce(passwd: &str) -> Result<GenericArray<u8, UInt<UInt<UInt<UInt<UTerm, B1>, B1>, B0>, B0>>> {
    let sha = sha256::digest(passwd); // Digest password (turn it into 64 hex bytes)

    let sliced = &sha[..12]; // Nonce has to be 12 bytes

    let as_bytes = sliced.as_bytes(); // Turn slice into bytes

    let nonce = Nonce::from_slice(&as_bytes); // Generate nonce from byte slice

    Ok(*nonce)
}


pub fn encrypt_chunk(bytearray: Vec<u8>, passwd: &str) -> Result<Vec<u8>> {
    let cipher = create_cipher(passwd)?;

    let nonce = generate_nonce(passwd)?;

    let encryptedbytearray = cipher.encrypt(&nonce, bytearray.as_ref())?;

    Ok(encryptedbytearray)
}

pub fn decrypt_chunk(encryptedbytearray: Vec<u8>, passwd: &str) -> Result<Vec<u8>> {
    let cipher = create_cipher(passwd)?;

    let nonce = generate_nonce(passwd)?;

    let bytearray = cipher.decrypt(&nonce, encryptedbytearray.as_ref())?;
    
    Ok(bytearray)
}