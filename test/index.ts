import * as crypter from '../src';

crypter.init('c2VjcmV0NTY1NjU2NjI2NTU5Z2JiZmc=');

const value = 'Test encryption';
const encrypted = crypter.encrypt(value);
const decrypted = crypter.decrypt(encrypted);

console.log(`Origial value "${value}"`);
console.log(`Value encrypted "${encrypted}"`);
console.log(`Value decrypted "${decrypted}", Test verification: ${value === decrypted}`)