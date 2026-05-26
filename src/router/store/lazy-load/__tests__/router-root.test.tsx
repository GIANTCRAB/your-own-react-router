/*
 * Copyright 2026 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {describe, expect, test, vi} from "vitest";
import {act, render, renderHook, screen} from "@testing-library/react";
import RouterRoot from "../router-root.tsx";
import {lazy} from "react";
import {
    CHILD_PAGE_CONTENT_DATA,
    CHILD_PAGE_CONTENT_ID,
    CHILD_SECOND_PAGE_CONTENT_DATA,
    CHILD_SECOND_PAGE_CONTENT_ID,
    LOADING_INFO_COMPONENT_ID
} from "../../../../__tests__/test-router-root-constants.ts";
import {useRouterHook} from "../router-hook.ts";

const testRoutes = {
    '/': lazy(() => import('../../../../__tests__/test-router-root-child-page.tsx')),
    '/other-page': lazy(() => import('../../../../__tests__/test-router-root-child-second-page.tsx'))
};

describe('router-root', () => {
    test('renders with no routes', async () => {
        await act(async () => {
            render(<RouterRoot routes={{}}/>);
        });

        const element = screen.queryByTestId(LOADING_INFO_COMPONENT_ID);
        expect(element).toBeNull();
    });

    test('renders loading text when initialising', async () => {
        await act(async () => {
            render(<RouterRoot routes={testRoutes}/>);
        });

        const element = screen.queryByTestId(LOADING_INFO_COMPONENT_ID);
        expect(element).toBeDefined();
    });

    test('renders with routes with content', async () => {
        await act(async () => {
            render(<RouterRoot routes={testRoutes}/>);
        });

        const element = await screen.findByTestId(CHILD_PAGE_CONTENT_ID);
        expect(element).toBeDefined();
        expect(element.innerHTML).toBe(CHILD_PAGE_CONTENT_DATA);
    });

    test('renders updated content with route changes', async () => {
        const {result} = renderHook(() => useRouterHook());
        await act(async () => {
            render(<RouterRoot routes={testRoutes}/>);
        });

        vi.useFakeTimers();
        await act(async () => {
            result.current.navigate('/other-page');
            vi.runAllTimers();
        });
        vi.useRealTimers();

        const element = await screen.findByTestId(CHILD_SECOND_PAGE_CONTENT_ID);
        expect(element).toBeDefined();
        expect(element.innerHTML).toBe(CHILD_SECOND_PAGE_CONTENT_DATA);
    });
});
