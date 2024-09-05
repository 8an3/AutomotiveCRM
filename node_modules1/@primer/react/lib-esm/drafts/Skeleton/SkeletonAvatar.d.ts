import React from 'react';
import type { AvatarProps } from '../../Avatar';
export type SkeletonAvatarProps = Pick<AvatarProps, 'size' | 'square'> & {
    /** Class name for custom styling */
    className?: string;
};
export declare const SkeletonAvatar: React.FC<SkeletonAvatarProps>;
//# sourceMappingURL=SkeletonAvatar.d.ts.map