/*
 * Copyright 2026 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {lazy, memo} from "react";
import RouterRoot from "../../router/store/lazy-load/router-root.tsx";
import {useRouterHook} from "../../router/store/lazy-load/router-hook.ts";

const routes = {
    '/': lazy(() => delayForDemo(import('../../App.tsx'))),
    '/register': lazy(() => delayForDemo(import('../../register.tsx'))),
    '/login': lazy(() => delayForDemo(import('../../login.tsx'))),
    '/todos': lazy(() => delayForDemo(import('../../todo.tsx'))),
};

function delayForDemo(promise: any) {
    return new Promise(resolve => {
        setTimeout(resolve, 5000);
    }).then(() => promise);
}

// useTransition
export function ExampleAppFinal() {
    return <>
        <ExampleAppNavMemoized/>
        <RouterRoot routes={routes}/>
    </>;
}

const ExampleAppNavMemoized = memo(ExampleAppNav);

function ExampleAppNav() {
    return (
        <nav>
            <ExampleHomeButtonMemoized/>
            <ExampleRegisterButtonMemoized/>
            <ExampleLoginButtonMemoized/>
            <ExampleTodosButtonMemoized/>
        </nav>
    );
}

// The code below will all be fixed with React Compiler and we can just use a loop instead
const ExampleHomeButtonMemoized = memo(ExampleHomeButton);

function ExampleHomeButton() {
    const {navigate} = useRouterHook();
    return <button onClick={() => navigate('/')}>Home</button>;
}

const ExampleRegisterButtonMemoized = memo(ExampleRegisterButton);

function ExampleRegisterButton() {
    const {navigate} = useRouterHook();
    return <button onClick={() => navigate('/register')}>Register</button>;
}

const ExampleLoginButtonMemoized = memo(ExampleLoginButton);

function ExampleLoginButton() {
    const {navigate} = useRouterHook();
    return <button onClick={() => navigate('/login')}>Login</button>;
}

const ExampleTodosButtonMemoized = memo(ExampleTodosButton);

function ExampleTodosButton() {
    const {navigate} = useRouterHook();
    return <button onClick={() => navigate('/todos')}>Todos</button>;
}