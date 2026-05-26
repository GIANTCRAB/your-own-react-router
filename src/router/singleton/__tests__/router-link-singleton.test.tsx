/*
 * Copyright 2026 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import {act, fireEvent, render, renderHook, screen} from "@testing-library/react";
import {TEST_ROUTER_LINK_ABOUT_PAGE_TEST_ID} from "../../../__tests__/test-router-link-constants.ts";
import {useRouterHookSingleton} from "../router-hook-singleton.ts";
import RouterLinkSingleton from "../router-link-singleton.tsx";

describe('router-link-singleton', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('renders router link with clickable navigation', async () => {
        const {result} = renderHook(() => useRouterHookSingleton());
        render(<RouterLinkSingleton data-testid={TEST_ROUTER_LINK_ABOUT_PAGE_TEST_ID} to={'/about'}>About
            Page</RouterLinkSingleton>);
        expect(result.current.data.path).toBe('/');
        const routerLinkAboutPage = screen.getByTestId(TEST_ROUTER_LINK_ABOUT_PAGE_TEST_ID);

        await act(async () => {
            fireEvent.click(routerLinkAboutPage);
            vi.runAllTimers();
        });
        expect(result.current.data.path).toBe('/about');
    });
});