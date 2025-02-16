import ReactDOM from 'react-dom/client';
import {Suspense} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';

import {Provider as ReduxProvider} from 'react-redux';
import AuthProvider from './components/auth/auth-provider.jsx';

import App from './app';
import {store} from "./store";

import "./i18n";

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ReduxProvider store={store}>
        <HelmetProvider>
            <BrowserRouter>
                <Suspense>
                    <AuthProvider>
                        <App/>
                    </AuthProvider>
                </Suspense>
            </BrowserRouter>
        </HelmetProvider>
    </ReduxProvider>
);

serviceWorkerRegistration.unregister();