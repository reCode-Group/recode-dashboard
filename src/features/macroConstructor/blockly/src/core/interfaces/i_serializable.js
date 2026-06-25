/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** Type guard that checks whether the given object is a ISerializable. */
export function isSerializable(obj) {
    return obj.saveState !== undefined && obj.loadState !== undefined;
}
//# sourceMappingURL=i_serializable.js.map