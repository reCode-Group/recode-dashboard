/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Determines whether the provided object fulfills the contract of
 * IFocusableTree.
 *
 * @param object The object to test.
 * @returns Whether the provided object can be used as an IFocusableTree.
 */
export function isFocusableTree(object) {
    return (object &&
        'getRootFocusableNode' in object &&
        'getRestoredFocusableNode' in object &&
        'getNestedTrees' in object &&
        'lookUpFocusableNode' in object &&
        'onTreeFocus' in object &&
        'onTreeBlur' in object);
}
//# sourceMappingURL=i_focusable_tree.js.map