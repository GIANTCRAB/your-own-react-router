/*
 * Copyright 2025 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {afterEach, beforeEach, describe, expect, type MockInstance, test, vi} from "vitest";
import {act, fireEvent, render, renderHook, type RenderResult} from "@testing-library/react";
import RouterRoot from "./router-root.tsx";
import {useRouterHook} from "./router-hook.ts";

describe('router-root with event spying', () => {
    let addSpy: MockInstance;
    let removeSpy: MockInstance;
    let originalAdd: typeof window.addEventListener;
    let originalRemove: typeof window.removeEventListener;
    let capturedHandler: EventListenerOrEventListenerObject | null = null;

    beforeEach(() => {
        originalAdd = window.addEventListener.bind(window);
        originalRemove = window.removeEventListener.bind(window);
        addSpy = vi.spyOn(window, 'addEventListener')
            .mockImplementation(
                (
                    type,
                    listener,
                    options
                ) => {
                    if (type === 'popstate') {
                        capturedHandler = listener;
                    }
                    originalAdd(type, listener, options);
                });
        removeSpy = vi.spyOn(window, 'removeEventListener')
            .mockImplementation(
                (
                    type,
                    listener,
                    options
                ) => {
                    originalRemove(type, listener, options);
                }
            );
        vi.useFakeTimers();
    });

    afterEach(() => {
        addSpy.mockRestore();
        removeSpy.mockRestore();
        capturedHandler = null;
        vi.useRealTimers();
    });

    test('registers and then removes the popstate listener on unmount', async () => {
        let componentRenderResult: RenderResult;
        await act(async () => {
            componentRenderResult = render(
                <RouterRoot routes={{}}/>
            );
        });

        expect(addSpy).toHaveBeenCalledWith('popstate', capturedHandler);
        await act(async () => {
            componentRenderResult.unmount();
        });
        expect(removeSpy).toHaveBeenCalledWith('popstate', capturedHandler);
    });

    test('should not be listening after unmount', async () => {
        let componentRenderResult: RenderResult;
        await act(async () => {
            componentRenderResult = render(
                <RouterRoot routes={{}}/>
            );
        });
        const {result} = renderHook(() => useRouterHook());

        expect(result.current.data.path).toBe('/');
        await act(async () => {
            window.history.pushState(null, '', '/about');
            fireEvent.popState(window, {});
            vi.runAllTimers();
        });
        expect(result.current.data.path).toBe('/about');
        await act(async () => {
            componentRenderResult.unmount();
        });
        await act(async () => {
            window.history.pushState(null, '', '/');
            fireEvent.popState(window, {});
            vi.runAllTimers();
        });
        expect(result.current.data.path).toBe('/about');
    });
});