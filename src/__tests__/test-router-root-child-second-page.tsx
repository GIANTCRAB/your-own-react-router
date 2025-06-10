/*
 * Copyright 2025 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {memo} from "react";
import {CHILD_SECOND_PAGE_CONTENT_DATA, CHILD_SECOND_PAGE_CONTENT_ID} from "./test-router-root-constants.ts";

function TestRouterRootChildSecondPage() {
    return <div>
        <div>Other forms of data in child second page</div>
        <div data-testid={CHILD_SECOND_PAGE_CONTENT_ID}>{CHILD_SECOND_PAGE_CONTENT_DATA}</div>
        <div>Some other data that does not matter</div>
    </div>;
}

export default memo(TestRouterRootChildSecondPage);