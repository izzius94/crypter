import Crypter from './lib/Crypter';

let _crypter: Crypter;

/**
 * Init the module
 * @param key The key used to encrypt/decrypt strings
 */
export function init(key: string) {
    _crypter = new Crypter(key)
}

/**
 * Encrypt a string
 * @param value The string to be encrypted
 */
export function encrypt(value: string) {
    check()
    return _crypter.encrypt(value)
}

/**
 * Dencrypt a string
 * @param value The hash to be decripted
 */
export function decrypt(hash: string) {
    check()
    return _crypter.decrypt(hash);
}

/**
 * Check if the moduke is loaded correctly
 */
function check() {
    if (!_crypter) {
        throw Error("Key not set");
    }
}