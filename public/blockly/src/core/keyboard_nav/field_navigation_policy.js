/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { Field } from '../field.js';
/**
 * Set of rules controlling keyboard navigation from a field.
 */
export class FieldNavigationPolicy {
    /**
     * Returns null since fields do not have children.
     *
     * @param _current The field to navigate from.
     * @returns Null.
     */
    getFirstChild(_current) {
        return null;
    }
    /**
     * Returns the parent block of the given field.
     *
     * @param current The field to navigate from.
     * @returns The given field's parent block.
     */
    getParent(current) {
        return current.getSourceBlock();
    }
    /**
     * Returns the next field or input following the given field.
     *
     * @param current The field to navigate from.
     * @returns The next field or input in the given field's block.
     */
    getNextSibling(current) {
        const input = current.getParentInput();
        const block = current.getSourceBlock();
        if (!block)
            return null;
        const curIdx = block.inputList.indexOf(input);
        let fieldIdx = input.fieldRow.indexOf(current) + 1;
        for (let i = curIdx; i < block.inputList.length; i++) {
            const newInput = block.inputList[i];
            const fieldRow = newInput.fieldRow;
            if (fieldIdx < fieldRow.length)
                return fieldRow[fieldIdx];
            fieldIdx = 0;
            if (newInput.connection?.targetBlock()) {
                return newInput.connection.targetBlock();
            }
        }
        return null;
    }
    /**
     * Returns the field or input preceding the given field.
     *
     * @param current The field to navigate from.
     * @returns The preceding field or input in the given field's block.
     */
    getPreviousSibling(current) {
        const parentInput = current.getParentInput();
        const block = current.getSourceBlock();
        if (!block)
            return null;
        const curIdx = block.inputList.indexOf(parentInput);
        let fieldIdx = parentInput.fieldRow.indexOf(current) - 1;
        for (let i = curIdx; i >= 0; i--) {
            const input = block.inputList[i];
            if (input.connection?.targetBlock() && input !== parentInput) {
                return input.connection.targetBlock();
            }
            const fieldRow = input.fieldRow;
            if (fieldIdx > -1)
                return fieldRow[fieldIdx];
            // Reset the fieldIdx to the length of the field row of the previous
            // input.
            if (i - 1 >= 0) {
                fieldIdx = block.inputList[i - 1].fieldRow.length - 1;
            }
        }
        return null;
    }
    /**
     * Returns whether or not the given field can be navigated to.
     *
     * @param current The instance to check for navigability.
     * @returns True if the given field can be focused and navigated to.
     */
    isNavigable(current) {
        return (current.canBeFocused() &&
            (current.isClickable() || current.isCurrentlyEditable()) &&
            !(current.getSourceBlock()?.isSimpleReporter() &&
                current.isFullBlockField()) &&
            current.getParentInput().isVisible());
    }
    /**
     * Returns whether the given object can be navigated from by this policy.
     *
     * @param current The object to check if this policy applies to.
     * @returns True if the object is a Field.
     */
    isApplicable(current) {
        return current instanceof Field;
    }
}
//# sourceMappingURL=field_navigation_policy.js.map