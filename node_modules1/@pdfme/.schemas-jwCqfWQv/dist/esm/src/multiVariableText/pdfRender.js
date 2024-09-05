import { pdfRender as parentPdfRender } from '../text/pdfRender';
import { substituteVariables } from './helper';
export const pdfRender = async (arg) => {
    const { value, schema, ...rest } = arg;
    const renderArgs = {
        value: substituteVariables(schema.text || '', value),
        schema,
        ...rest,
    };
    await parentPdfRender(renderArgs);
};
//# sourceMappingURL=pdfRender.js.map