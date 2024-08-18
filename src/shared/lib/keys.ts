/* Cookies */

export const CookieKey = {
    LOCALE: 'i18next' as const,
};

export interface CookieValue {
    [CookieKey.LOCALE]: string;
}

/* Session */

export const SessionKey = {};

export interface SessionValue {}
