/*
 * Copyright 2025 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useRouterHook} from "./router-hook.ts";

describe('useRouterHook', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('returns the current path', () => {
        const {result} = renderHook(() => useRouterHook());
        expect(result.current.data.path).toBe('/');
    });

    test('updates when navigate() is called', () => {
        const {result} = renderHook(() => useRouterHook());
        act(() => {
            result.current.navigate('/about');
            vi.runAllTimers();
        });
        expect(result.current.data.path).toBe('/about');
    });

    test('updates all mounted hook instances', () => {
        const hookA = renderHook(() => useRouterHook());
        const hookB = renderHook(() => useRouterHook());

        act(() => {
            hookB.result.current.navigate('/about');
            vi.runAllTimers();
        });
        expect(hookA.result.current.data.path).toBe('/about');
        expect(hookB.result.current.data.path).toBe('/about');
    });

    test('unsubscribes cleanly upon unmount', () => {
        const hookA = renderHook(() => useRouterHook());
        const hookB = renderHook(() => useRouterHook());

        // Unmount hookB and navigate again
        hookB.unmount();
        act(() => {
            hookA.result.current.navigate('/about');
            vi.runAllTimers();
        });
        expect(hookA.result.current.data.path).toBe('/about');
    });
});
