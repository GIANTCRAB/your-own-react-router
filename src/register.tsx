/*
 * Copyright 2026 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {type ChangeEvent, memo, useCallback, useMemo, useState} from "react";

function Register() {
    const [registerUsername, setRegisterUsername] = useState<string | null>(null);
    const [registerEmail, setRegisterEmail] = useState<string | null>(null);
    const registerUsernameOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setRegisterUsername(e.target.value);
    }, []);
    const registerEmailOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setRegisterEmail(e.target.value);
    }, []);
    const submitDisabled = useMemo(() => registerUsername == null || registerEmail == null, [registerEmail, registerUsername]);

    return <>
        <h1>Register Page</h1>
        <form>
            <label htmlFor='register-username'>Username</label>
            <input id='register-username' placeholder='Johnny' value={registerUsername ?? ''}
                   onChange={registerUsernameOnChange}/>
            <label htmlFor='register-email'>Email</label>
            <input id='register-email' placeholder='lol@example.org' value={registerEmail ?? ''}
                   onChange={registerEmailOnChange}/>
            <input type='submit' value='Register' disabled={submitDisabled}/>
        </form>
        <div>
            <h2>Your registration details</h2>
            <div>Username: {registerUsername}</div>
            <div>Email: {registerEmail}</div>
        </div>
    </>;
}

export default memo(Register);