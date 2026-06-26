/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** Returns whether the given object is an IDraggable or not. */
export function isDraggable(obj) {
    return (obj.getRelativeToSurfaceXY !== undefined &&
        obj.isMovable !== undefined &&
        obj.startDrag !== undefined &&
        obj.drag !== undefined &&
        obj.endDrag !== undefined &&
        obj.revertDrag !== undefined);
}
//# sourceMappingURL=i_draggable.js.map