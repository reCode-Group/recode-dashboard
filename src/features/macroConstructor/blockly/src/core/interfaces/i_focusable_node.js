/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Determines whether the provided object fulfills the contract of
 * IFocusableNode.
 *
 * @param object The object to test.
 * @returns Whether the provided object can be used as an IFocusableNode.
 */
export function isFocusableNode(object) {
    return (object &&
        'getFocusableElement' in object &&
        'getFocusableTree' in object &&
        'onNodeFocus' in object &&
        'onNodeBlur' in object &&
        'canBeFocused' in object);
}
//# sourceMappingURL=i_focusable_node.js.map