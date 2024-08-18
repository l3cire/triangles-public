import { Suspense, lazy } from 'react';

const MainPageAsync = lazy(async () => await import('./MainPage'));

export const MainPageSuspense: React.FC = () => {
    return (
        <Suspense fallback={<span>Loading...</span>}>
            <MainPageAsync />
        </Suspense>
    );
};
