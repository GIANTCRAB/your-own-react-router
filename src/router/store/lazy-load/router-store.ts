/*
 * Copyright 2025 Huiren Woo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

// router-store.ts
export type RouterStoreNotifyCallbackType = () => void;

export type RouterStoreDataType = {
    path: string;
};

type RouterStoreDataUpdateType = {
    path: string;
};

let cachedData: Readonly<RouterStoreDataType> = {
    path: window.location.pathname,
};

type RouterStoreType = {
    getSnapshot: () => Readonly<RouterStoreDataType>,
    updateData: (data: RouterStoreDataUpdateType) => void,
    subscribe: (callback: RouterStoreNotifyCallbackType) => void,
    unsubscribe: (callback: RouterStoreNotifyCallbackType) => void,
};

let subscribers: Readonly<Set<RouterStoreNotifyCallbackType>> = new Set();

function emitChange() {
    for (const subscriber of subscribers) {
        subscriber();
    }
}

export const routerStore: RouterStoreType = {
    getSnapshot: () => cachedData,
    updateData: (data) => {
        if (data.path !== cachedData.path) {
            cachedData = {
                path: data.path,
            };
            window.history.pushState(null, "", data.path);
            emitChange();
        }
    },
    subscribe: (subscription) => {
        const subscribersClone = new Set(subscribers);
        subscribersClone.add(subscription);
        subscribers = subscribersClone;
    },
    unsubscribe: (subscription) => {
        const subscribersClone = new Set(subscribers);
        subscribersClone.delete(subscription);
        subscribers = subscribersClone;
    },
};