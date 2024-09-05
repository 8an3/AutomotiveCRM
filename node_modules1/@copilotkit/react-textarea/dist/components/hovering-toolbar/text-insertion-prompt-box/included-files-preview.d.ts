import { DocumentPointer } from '@copilotkit/react-core';
import React__default from 'react';

interface IncludedFilesPreviewProps {
    includedFiles: DocumentPointer[];
    setIncludedFiles: React__default.Dispatch<React__default.SetStateAction<DocumentPointer[]>>;
}
declare const IncludedFilesPreview: ({ includedFiles, setIncludedFiles, }: IncludedFilesPreviewProps) => JSX.Element;
interface FileChipPreviewProps {
    filePointer: DocumentPointer;
    onDelete: () => void;
}
declare const FileChipPreview: ({ filePointer, onDelete }: FileChipPreviewProps) => JSX.Element;

export { FileChipPreview, FileChipPreviewProps, IncludedFilesPreview, IncludedFilesPreviewProps };
