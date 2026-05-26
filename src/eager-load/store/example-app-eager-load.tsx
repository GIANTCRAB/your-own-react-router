/*
 * Copyright 2026 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

// example-app-eager-load.tsx
import {useRouterHook} from "../../router/store/lazy-load/router-hook.ts";
import App from "../../App.tsx";
import Register from "../../register.tsx";
import Login from "../../login.tsx";
import Todo from "../../todo.tsx";
import RouterRootEagerLoad from "../../router/store/eager-load/router-root-eager-load.tsx";

const routes = {
    '/': <App/>,
    '/register': <Register/>,
    '/login': <Login/>,
    '/todos': <Todo/>,
};

export function ExampleAppEagerLoad() {
    return <>
        <ExampleAppNav/>
        <RouterRootEagerLoad routes={routes}/>
    </>;
}

function ExampleAppNav() {
    const {navigate} = useRouterHook();
    return (
        <nav>
            <button onClick={() => navigate('/')}>Home</button>
            <button onClick={() => navigate('/register')}>Register</button>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/todos')}>Todos</button>
        </nav>
    );
}