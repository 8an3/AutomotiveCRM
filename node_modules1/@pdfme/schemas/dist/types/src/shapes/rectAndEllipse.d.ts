import { Schema } from '@pdfme/common';
interface ShapeSchema extends Schema {
    type: 'ellipse' | 'rectangle';
    borderWidth: number;
    borderColor: string;
    color: string;
}
export declare const rectangle: {
    propPanel: {
        defaultSchema: {
            type: "ellipse" | "rectangle";
            borderWidth: number;
            borderColor: string;
            color: string;
            position: {
                x: number;
                y: number;
            };
            width: number;
            height: number;
            content?: string | undefined;
            rotate?: number | undefined;
            opacity?: number | undefined;
            readOnly?: boolean | undefined;
            required?: boolean | undefined;
        };
        schema: ((propPanelProps: Omit<{
            rootElement: HTMLDivElement;
            activeSchema: {
                width: number;
                height: number;
                type: string;
                position: {
                    x: number;
                    y: number;
                };
                id: string;
                key: string;
                opacity?: number | undefined;
                rotate?: number | undefined;
                required?: boolean | undefined;
                content?: string | undefined;
                readOnly?: boolean | undefined;
            };
            activeElements: HTMLElement[];
            changeSchemas: import("@pdfme/common").ChangeSchemas;
            schemas: {
                width: number;
                height: number;
                type: string;
                position: {
                    x: number;
                    y: number;
                };
                id: string;
                key: string;
                opacity?: number | undefined;
                rotate?: number | undefined;
                required?: boolean | undefined;
                content?: string | undefined;
                readOnly?: boolean | undefined;
            }[];
            options: import("@pdfme/common").UIOptions;
            theme: import("antd").GlobalToken;
            i18n: (key: string) => string;
        }, "rootElement">) => Record<string, Partial<import("form-render").SchemaBase>>) | Record<string, Partial<import("form-render").SchemaBase>>;
        widgets?: Record<string, (props: import("@pdfme/common").PropPanelWidgetProps) => void> | undefined;
    };
    icon: string;
    pdf: (arg: import("@pdfme/common").PDFRenderProps<ShapeSchema>) => void | Promise<void>;
    ui: (arg: import("@pdfme/common").UIRenderProps<ShapeSchema>) => void | Promise<void>;
    uninterruptedEditMode?: boolean | undefined;
};
export declare const ellipse: {
    propPanel: {
        defaultSchema: {
            type: "ellipse" | "rectangle";
            borderWidth: number;
            borderColor: string;
            color: string;
            position: {
                x: number;
                y: number;
            };
            width: number;
            height: number;
            content?: string | undefined;
            rotate?: number | undefined;
            opacity?: number | undefined;
            readOnly?: boolean | undefined;
            required?: boolean | undefined;
        };
        schema: ((propPanelProps: Omit<{
            rootElement: HTMLDivElement;
            activeSchema: {
                width: number;
                height: number;
                type: string;
                position: {
                    x: number;
                    y: number;
                };
                id: string;
                key: string;
                opacity?: number | undefined;
                rotate?: number | undefined;
                required?: boolean | undefined;
                content?: string | undefined;
                readOnly?: boolean | undefined;
            };
            activeElements: HTMLElement[];
            changeSchemas: import("@pdfme/common").ChangeSchemas;
            schemas: {
                width: number;
                height: number;
                type: string;
                position: {
                    x: number;
                    y: number;
                };
                id: string;
                key: string;
                opacity?: number | undefined;
                rotate?: number | undefined;
                required?: boolean | undefined;
                content?: string | undefined;
                readOnly?: boolean | undefined;
            }[];
            options: import("@pdfme/common").UIOptions;
            theme: import("antd").GlobalToken;
            i18n: (key: string) => string;
        }, "rootElement">) => Record<string, Partial<import("form-render").SchemaBase>>) | Record<string, Partial<import("form-render").SchemaBase>>;
        widgets?: Record<string, (props: import("@pdfme/common").PropPanelWidgetProps) => void> | undefined;
    };
    icon: string;
    pdf: (arg: import("@pdfme/common").PDFRenderProps<ShapeSchema>) => void | Promise<void>;
    ui: (arg: import("@pdfme/common").UIRenderProps<ShapeSchema>) => void | Promise<void>;
    uninterruptedEditMode?: boolean | undefined;
};
export {};
