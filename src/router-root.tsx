/*
 * Copyright 2025 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

// router-root.tsx
import {
    type ComponentType,
    type LazyExoticComponent,
    memo,
    type ReactElement,
    useCallback,
    useLayoutEffect,
    useState,
    useTransition
} from "react";
import {useRouterHook} from "./router-hook.ts";
import {LOADING_INFO_COMPONENT_ID} from "./__tests__/test-router-root-constants.ts";

type RouterRootRouteType = {
    [route: string]: LazyExoticComponent<ComponentType>;
};

type RouterRootPropsType = {
    routes: RouterRootRouteType,
};

function RouterRoot({routes}: RouterRootPropsType) {
    const {data, navigate} = useRouterHook();
    const [isPending, startTransition] = useTransition();
    const [readyElement, setReadyElement] = useState<ReactElement | null>(null);
    const makeElement = useCallback((path: string) => {
        const LazyElement = routes[path];
        if (LazyElement != null) {
            return <LazyElement/>
        }
        return null;
    }, [routes]);

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

    useLayoutEffect(() => {
        startTransition(() => {
            setReadyElement(makeElement(data.path));
        });
    }, [data.path, makeElement]);

    return (
        <div>
            {isPending ? <div data-testid={LOADING_INFO_COMPONENT_ID}>Loading...</div> : null}
            {readyElement}
        </div>
    );
}

export default memo(RouterRoot);