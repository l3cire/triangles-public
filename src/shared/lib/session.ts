import { type SessionValue, type SessionKey } from './keys';

export const session = {
    get: (key: (typeof SessionKey)[keyof typeof SessionKey]): SessionValue[typeof key] | undefined => {
        const item = sessionStorage.getItem(key);
        if (item == null) return;

        return JSON.parse(item);
    },
    set: (key: (typeof SessionKey)[keyof typeof SessionKey], value: SessionValue[typeof key]) => {
        sessionStorage.setItem(key, JSON.stringify(value));
    },
    remove: (key: (typeof SessionKey)[keyof typeof SessionKey]) => {
        sessionStorage.removeItem(key);
    },
    clear: () => {
        sessionStorage.clear();
    },
};
