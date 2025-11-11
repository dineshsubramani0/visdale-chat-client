import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_SECRET_KEY;

export const encrypt = (data: unknown): string => {
  try {
    const text = JSON.stringify(data);
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (err) {
    console.error('Encryption failed', err);
    return '';
  }
};

export const decrypt = (encryptedText: string): unknown => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    const text = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(text);
  } catch (err) {
    console.error('Decryption failed', err);
    return null;
  }
};
