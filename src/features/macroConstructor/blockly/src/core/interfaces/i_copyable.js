/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** @returns true if the given object is copyable. */
export function isCopyable(obj) {
    return obj.toCopyData !== undefined;
}
//# sourceMappingURL=i_copyable.js.map