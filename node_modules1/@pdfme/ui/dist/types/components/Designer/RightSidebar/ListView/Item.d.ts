import React from 'react';
import { DraggableSyntheticListeners } from '@dnd-kit/core';
interface Props {
    value: React.ReactNode;
    icon?: React.ReactNode;
    style?: React.CSSProperties;
    status?: 'is-warning' | 'is-danger';
    title?: string;
    required?: boolean;
    readOnly?: boolean;
    dragOverlay?: boolean;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    dragging?: boolean;
    sorting?: boolean;
    transition?: string;
    transform?: {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
    } | null;
    fadeIn?: boolean;
    listeners?: DraggableSyntheticListeners;
}
declare const Item: React.MemoExoticComponent<React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLLIElement>>>;
export default Item;
