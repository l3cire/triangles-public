import type app from 'public/locales/en/app.json';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'app';
        resources: {
            app: typeof app;
        };
    }
}
