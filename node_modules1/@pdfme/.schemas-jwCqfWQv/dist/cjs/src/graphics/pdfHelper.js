"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfToImage = exports.isPdf = void 0;
const cacheKey_1 = require("./cacheKey");
function isPdf(content) {
    return content.startsWith('data:application/pdf;');
}
exports.isPdf = isPdf;
/**
 * convert pdf to blob image url
 * @param content
 */
const pdfToImage = async ({ schema, value, _cache, pdfJs, }) => {
    // using value from cache to prevent rerending pdf to image
    const pdfImageCacheKey = (0, cacheKey_1.getCacheKey)(schema, value);
    const imageSrc = _cache.get(pdfImageCacheKey);
    if (imageSrc)
        return imageSrc;
    const pdfDoc = await pdfJs.getDocument({ url: value }).promise;
    const page = await pdfDoc.getPage(1);
    const canvas = document.createElement('canvas');
    const viewport = page.getViewport({ scale: 1 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const canvasContext = canvas.getContext('2d');
    await page.render({ canvasContext, viewport }).promise;
    const image = await _canvasToObjectUrl(canvas);
    _cache.set(pdfImageCacheKey, image);
    return image;
};
exports.pdfToImage = pdfToImage;
/**
 * convert canvas to blob url
 * @param canvas
 */
const _canvasToObjectUrl = async (canvas) => {
    return new Promise((resolve, reject) => {
        canvas.toBlob(function (blob) {
            if (!blob) {
                reject('inavlid canvas');
            }
            else {
                const url = URL.createObjectURL(blob);
                resolve(url);
            }
        });
    });
};
//# sourceMappingURL=pdfHelper.js.map