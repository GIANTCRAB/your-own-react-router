/*
 * Copyright 2026 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

// router-root-eager-load.tsx
import {memo, type ReactElement, useCallback, useLayoutEffect} from "react";
import {useRouterHook} from "../lazy-load/router-hook.ts";

type RouterRootEagerLoadRouteType = {
    [route: string]: ReactElement;
};

type RouterRootEagerLoadPropsType = {
    routes: RouterRootEagerLoadRouteType,
};

function RouterRootEagerLoad({routes}: RouterRootEagerLoadPropsType) {
    const {data, navigate} = useRouterHook();

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
            {routes[data.path]}
        </div>
    );
}

export default memo(RouterRootEagerLoad);