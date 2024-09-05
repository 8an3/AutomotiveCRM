import React from 'react';
import { OnDragStart as _OnDragStart, OnSelect as _OnSelect } from 'react-selecto';
type Props = {
    container: HTMLElement | null;
    continueSelect: boolean;
    onDragStart: (e: _OnDragStart) => void;
    onSelect: (e: _OnSelect) => void;
};
declare const _Selecto: (props: Props) => React.JSX.Element;
export default _Selecto;
