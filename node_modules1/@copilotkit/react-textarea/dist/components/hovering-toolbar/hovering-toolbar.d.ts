import { InsertionEditorApiConfig } from '../../types/base/autosuggestions-bare-function.js';
import '@copilotkit/react-core';

interface HoveringToolbarProps {
    apiConfig: InsertionEditorApiConfig;
    contextCategories: string[];
    hoverMenuClassname: string | undefined;
}
declare const HoveringToolbar: (props: HoveringToolbarProps) => JSX.Element | null;

export { HoveringToolbar, HoveringToolbarProps };
