/*
 * Copyright 2025 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {useCallback, useEffect, useMemo, useReducer} from "react";

// To enable type erasure, enum is intentionally not used
type ActionType = 'POPSTATE' | 'NAVIGATE';
type Action = { type: ActionType; path: string };

type RouterStoreStateType = {
    path: string
};

function routerStoreReducer(state: RouterStoreStateType, action: Action): RouterStoreStateType {
    switch (action.type) {
        case 'POPSTATE':
        case 'NAVIGATE':
            return {path: action.path};
        default:
            return state;
    }
}

export function ExampleAppProp() {
    const [routerState, dispatch] = useReducer(routerStoreReducer, {path: window.location.pathname});

    useEffect(() => {
        const onPop = () => dispatch({type: 'POPSTATE', path: window.location.pathname});
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    const navigate = useCallback((to: string) => {
        window.history.pushState({}, '', to);
        dispatch({type: 'NAVIGATE', path: to});
    }, []);

    const componentWithProp = useMemo(() => {
        if (routerState.path === '/about') {
            return <AboutPage routerState={routerState}/>;
        }
        if (routerState.path === '/') {
            return <HomePage routerState={routerState}/>;
        }
        return null;
    }, [routerState]);

    return (
        <>
            <nav>
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/about')}>About</button>
            </nav>
            {componentWithProp}
        </>
    );
}

type HomePagePropsType = {
    routerState: RouterStoreStateType
}

function HomePage({routerState}: HomePagePropsType) {
    return <>
        <div>Home</div>
        <SomeInnerHomePageComponent routerState={routerState}/>
    </>;
}

type SomeInnerHomePageComponentPropsType = {
    routerState: RouterStoreStateType
}

function SomeInnerHomePageComponent({routerState}: SomeInnerHomePageComponentPropsType) {
    return <div>Some inner component {routerState.path}</div>;
}

type AboutPagePropsType = {
    routerState: RouterStoreStateType
}

function AboutPage({routerState}: AboutPagePropsType) {
    return <div>About {routerState.path}  </div>;
}