/*
 * Copyright 2026 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

// router-root-basic.tsx
import {
    type ComponentType,
    type LazyExoticComponent,
    memo,
    Suspense,
    useCallback,
    useLayoutEffect,
    useMemo
} from "react";
import {useRouterHook} from "../store/lazy-load/router-hook.ts";

type RouterRootRouteType = {
    [route: string]: LazyExoticComponent<ComponentType>;
};

type RouterRootPropsType = {
    routes: RouterRootRouteType,
};

function RouterRootBasic({routes}: RouterRootPropsType) {
    const {data, navigate} = useRouterHook();
    const makeElement = useCallback((path: string) => {
        const LazyElement = routes[path];
        if (LazyElement != null) {
            return <LazyElement/>
        }
        return null;
    }, [routes]);
    const readyElement = useMemo(() => makeElement(data.path), [data.path, makeElement]);

    const popStateListener = useCallback(() => {
        if (window.location.pathname != data.path) {
            navigate(window.location.pathname);
        }
    }, [data.path, navigate]);

    useLayoutEffect(() => {
        window.addEventListener('popstate', popStateListener);
        return () => {
            window.removeEventListener('popstate', popStateListener);
        }
    }, [popStateListener]);

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                {readyElement}
            </Suspense>
        </div>
    );
}

export default memo(RouterRootBasic);