import { CustomEditor } from '../../types/base/custom-editor.js';
import { Operation } from 'slate';
import { HistoryEditor } from 'slate-history';
import 'slate-react';

type ShouldSaveToHistory = (op: Operation, prev: Operation | undefined) => boolean;
declare const withPartialHistory: <T extends CustomEditor>(editor: T, shouldSave: ShouldSaveToHistory) => T & HistoryEditor;
declare const defaultShouldSave: (op: Operation, prev: Operation | undefined) => boolean;

export { ShouldSaveToHistory, defaultShouldSave, withPartialHistory };
