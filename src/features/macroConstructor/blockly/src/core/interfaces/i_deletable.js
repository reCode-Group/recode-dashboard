/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** Returns whether the given object is an IDeletable. */
export function isDeletable(obj) {
    return (obj['isDeletable'] !== undefined &&
        obj['dispose'] !== undefined &&
        obj['setDeleteStyle'] !== undefined);
}
//# sourceMappingURL=i_deletable.js.map