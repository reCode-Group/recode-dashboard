/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { isFocusableNode } from './i_focusable_node.js';
/** Checks whether the given object is an ISelectable. */
export function isSelectable(obj) {
    return (typeof obj.id === 'string' &&
        obj.workspace !== undefined &&
        obj.select !== undefined &&
        obj.unselect !== undefined &&
        isFocusableNode(obj));
}
//# sourceMappingURL=i_selectable.js.map