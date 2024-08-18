import Cookies, { type CookieGetOptions, type CookieSetOptions } from 'universal-cookie';
import { type CookieKey, type CookieValue } from './keys';

const cookiesObject = new Cookies();

export const cookies = {
    set: (
        key: (typeof CookieKey)[keyof typeof CookieKey],
        value: CookieValue[typeof key],
        options?: CookieSetOptions
    ) => {
        cookiesObject.set(key, value, options);
    },
    get: (key: (typeof CookieKey)[keyof typeof CookieKey], options?: CookieGetOptions) => {
        return cookiesObject.get(key, options) as CookieValue[typeof key] | undefined;
    },
    remove: (key: (typeof CookieKey)[keyof typeof CookieKey], options?: CookieSetOptions) => {
        cookiesObject.remove(key, options);
    },
};
