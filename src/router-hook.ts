/*
 * Copyright 2025 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

// router-hook.ts
import {routerStore, type RouterStoreDataType, type RouterStoreNotifyCallbackType} from "./router-store.ts";
import {useCallback, useSyncExternalStore} from "react";

type RouterHookType = {
    data: Readonly<RouterStoreDataType>,
    navigate: (path: string) => void,
};

function subscribe(callback: RouterStoreNotifyCallbackType) {
    routerStore.subscribe(callback);
    return () => {
        routerStore.unsubscribe(callback);
    }
}

export function useRouterHook(): RouterHookType {
    const data = useSyncExternalStore(
        subscribe,
        routerStore.getSnapshot
    );

    const navigate = useCallback((to: string) => {
        // Intentional setTimeout to make page navigation seem slower
        setTimeout(() => {
            routerStore.updateData({path: to});
        }, 1000);
    }, []);

    return {data, navigate};
}