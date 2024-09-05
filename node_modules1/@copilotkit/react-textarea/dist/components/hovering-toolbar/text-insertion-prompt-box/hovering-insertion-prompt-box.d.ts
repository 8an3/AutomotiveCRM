import { EditingEditorState, InsertionEditorApiConfig } from '../../../types/base/autosuggestions-bare-function.js';
import '@copilotkit/react-core';

interface Props {
    editorState: EditingEditorState;
    apiConfig: InsertionEditorApiConfig;
    performInsertion: (insertedText: string) => void;
    closeWindow: () => void;
    contextCategories: string[];
}
declare const HoveringInsertionPromptBox: (props: Props) => JSX.Element;

export { HoveringInsertionPromptBox, Props };
