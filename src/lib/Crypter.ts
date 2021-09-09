import * as crypto from 'crypto';
import {randomBytes, createCipheriv, createDecipheriv, createHmac, Hmac} from 'crypto';

export default class {
    private readonly _key: string;

    constructor(key: string) {
        if (key.length !== 32) {
            throw Error('Invalid key lenght.');
        }

        this._key = key;
    }

    public encrypt(value: string) {
        const iv        = randomBytes(16);
        const iv_based  = iv.toString('base64');
        const cipher    = createCipheriv('AES-256-CBC', Buffer.from(this._key), iv);
        const encrypted = cipher.update(value);
        const value_64  = Buffer.concat([encrypted, cipher.final()]).toString('base64');

        return Buffer.from(
            JSON.stringify({
                iv: iv_based,
                value: value_64,
                mac: this.hash(iv_based, value_64).digest('hex')
            })
        ).toString('base64');
    }

    public decrypt(payload: string) {
        const data      = this.getJsonPayload(payload);
        const decipher  = createDecipheriv('AES-256-CBC', Buffer.from(this._key), Buffer.from(data.iv, 'base64'));
        const decrypted = decipher.update(data.value, 'base64');

        return Buffer.concat([decrypted, decipher.final()]).toString();
    }

    protected hash(iv: string, value: string): Hmac {
        var hmac = createHmac('sha256', this._key);
        hmac.update(iv + value);

        return hmac; 
    }

    protected getJsonPayload(payload: string) {
        const data: IPayload = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));

        if (!this.validJson(data)) {
            throw new Error('Invalid payload');
        }
    
        if(!this.validMac(data)) {
            throw new Error('Invalid MAC');
        }

        return data;
    }

    protected validJson(payload: IPayload): boolean {
        return typeof payload === 'object' && (!!payload.iv && !!payload.value && !!payload.mac) && Buffer.from(payload.iv, 'base64').toString('ascii').length === 16;
    }

    protected validMac(payload: IPayload): boolean {
        return crypto.timingSafeEqual(
            Buffer.from(this.hash(payload.iv, payload.value).digest('base64'), 'base64'),
            Buffer.from(payload.mac, 'hex')
        )
    }
}

interface IPayload {
    iv: string,
    value: string,
    mac: string
}
