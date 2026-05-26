/*
 * Copyright 2026 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {memo, useCallback, useEffect, useRef, useState, useTransition} from "react";

function ComponentWithFetchCall() {
    const abortControllerRef = useRef<AbortController | null>(null);
    useEffect(() => {
        abortControllerRef.current = new AbortController();
    }, []);
    useEffect(() => {
        return () => {
            const abortController = abortControllerRef.current;
            if (abortController != null) {
                abortController.abort();
            }
        };
    }, []);

    const [, startTransition] = useTransition();
    const [, setData] = useState<string>('');
    const fetchDataCall = useCallback(() => {
        startTransition(async () => {
            try {
                await fetch('some-data.json', {
                    signal: abortControllerRef.current?.signal,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                startTransition(() => {
                    setData('some data');
                });
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error);
                }
            }
        })
    }, []);

    return <>
        <h1>Title here</h1>
        <ComponentButton onClick={fetchDataCall}/>
    </>;
}

type ComponentButtonProps = {
    onClick: () => void;
}

function ComponentButton({onClick}: ComponentButtonProps) {
    return <button onClick={onClick}>Some button</button>;
}

export default memo(ComponentWithFetchCall);