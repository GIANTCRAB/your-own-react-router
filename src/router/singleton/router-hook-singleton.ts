/*
 * Copyright 2025 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {useCallback, useMemo} from "react";

type RouterStoreDataType = {
    path: string;
};

type RouterHookType = {
    data: Readonly<RouterStoreDataType>,
    subscribe: (listener: () => void) => void,
    unsubscribe: (listener: () => void) => void,
    navigate: (path: string) => void,
};

type RouterManagerType = {
    listeners: Array<() => void>,
    data: RouterStoreDataType
};

let routerManager: RouterManagerType;

const getRouterManager = (): RouterManagerType => {
    if (routerManager != null) {
        return routerManager;
    }
    routerManager = {
        listeners: [],
        data: {
            path: window.location.pathname,
        }
    };
    return routerManager;
}

function emitChange() {
    const routerManager = getRouterManager();
    for (const listener of routerManager.listeners) {
        listener();
    }
}

export function useRouterHookSingleton(): RouterHookType {
    const routerData = useMemo(() => getRouterManager().data, []);
    const subscribe = useCallback((listener: () => void) => {
        getRouterManager().listeners.push(listener);
    }, []);
    const unsubscribe = useCallback((listener: () => void) => {
        const routerManager = getRouterManager();
        const index = routerManager.listeners.indexOf(listener);
        if (index !== -1) {
            routerManager.listeners.splice(index, 1);
        }
    }, []);
    const navigate = useCallback((to: string) => {
        const currentPath = routerData.path;
        if (to !== currentPath) {
            console.log('update route to: ', to);
            getRouterManager().data.path = to;
            window.history.pushState(null, "", to);
            emitChange();
        }
    }, [routerData]);

    return {
        data: routerData,
        subscribe,
        unsubscribe,
        navigate
    }
}