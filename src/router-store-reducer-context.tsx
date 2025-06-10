/*
 * Copyright 2025 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {createContext, type ReactNode, useCallback, useContext, useEffect, useReducer} from "react";

// To enable type erasure, enum is intentionally not used
type ActionType = 'POPSTATE' | 'NAVIGATE';
type Action = { type: ActionType; path: string };

type RouterStoreStateType = {
    path: string
};

type RouterContextType = RouterStoreStateType & { navigate: (to: string) => void };

function routerStoreReducer(state: RouterStoreStateType, action: Action): RouterStoreStateType {
    switch (action.type) {
        case 'POPSTATE':
        case 'NAVIGATE':
            return {path: action.path};
        default:
            return state;
    }
}

const RouterContext = createContext<RouterContextType>({
    path: window.location.pathname,
    navigate: () => {
    },
});

type RouterProviderPropsType = {
    children: ReactNode
};

function RouterProvider({children}: RouterProviderPropsType) {
    const [state, dispatch] = useReducer(routerStoreReducer, {path: window.location.pathname});

    useEffect(() => {
        const onPop = () => dispatch({type: 'POPSTATE', path: window.location.pathname});
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    const navigate = useCallback((to: string) => {
        window.history.pushState({}, '', to);
        dispatch({type: 'NAVIGATE', path: to});
    }, []);

    return (
        <RouterContext.Provider value={{path: state.path, navigate}}>
            {children}
        </RouterContext.Provider>
    );
}

export function ExampleAppContext() {
    return (
        <RouterProvider>
            <ExampleAppNav/>
            <ExampleAppContent/>
        </RouterProvider>
    );
}

function ExampleAppNav() {
    const {navigate} = useContext(RouterContext);
    return (
        <nav>
            <button onClick={() => navigate('/')}>Home</button>
            <button onClick={() => navigate('/about')}>About</button>
        </nav>
    );
}

function ExampleAppContent() {
    const {path} = useContext(RouterContext);
    return path === '/about' ? <AboutPage/> : <HomePage/>;
}

function HomePage() {
    return <>
        <div>Home</div>
        <SomeInnerHomePageComponent/>
    </>;
}

function SomeInnerHomePageComponent() {
    const {path} = useContext(RouterContext);
    return <div>Some inner component {path}</div>;
}

function AboutPage() {
    const {path} = useContext(RouterContext);
    return <div>About {path}  </div>;
}