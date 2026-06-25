/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { IconType } from '../icons/icon_types.js';
import { hasBubble } from './i_has_bubble.js';
import { isIcon } from './i_icon.js';
import { isSerializable } from './i_serializable.js';
/** Checks whether the given object is an ICommentIcon. */
export function isCommentIcon(obj) {
    return (isIcon(obj) &&
        hasBubble(obj) &&
        isSerializable(obj) &&
        obj['setText'] !== undefined &&
        obj['getText'] !== undefined &&
        obj['setBubbleSize'] !== undefined &&
        obj['getBubbleSize'] !== undefined &&
        obj['setBubbleLocation'] !== undefined &&
        obj['getBubbleLocation'] !== undefined &&
        obj.getType() === IconType.COMMENT);
}
//# sourceMappingURL=i_comment_icon.js.map