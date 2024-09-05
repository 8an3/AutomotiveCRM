import { DocumentPointer } from '@copilotkit/react-core';

interface SourceSearchBoxProps {
    searchTerm: string;
    suggestedFiles: DocumentPointer[];
    onSelectedFile: (filePointer: DocumentPointer) => void;
}
declare function SourceSearchBox(props: SourceSearchBoxProps): JSX.Element;
declare function Logo({ children, width, height, }: {
    children: React.ReactNode;
    width: string;
    height: string;
}): JSX.Element;

export { Logo, SourceSearchBox, SourceSearchBoxProps };
