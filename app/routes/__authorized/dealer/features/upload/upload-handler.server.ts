import { Readable } from 'stream';
import { UploadHandler } from 'remix';

const uploadStreamToCloudStorage = async (fileStream: Readable, fileName: string) => {

  const cloudStorage = new Storage();
  const file = cloudStorage.bucket(bucketName).file(fileName);

  async function streamFileUpload() {
    fileStream.pipe(file.createWriteStream()).on('finish', () => {
      // The file upload is complete
    });

    console.log(`${fileName} uploaded to ${bucketName}`);
  }

  streamFileUpload().catch(console.error);

  return fileName;
};

export const cloudStorageUploaderHandler: UploadHandler = async ({
  filename,
  stream: fileStream,
}) => {
  return await uploadStreamToCloudStorage(fileStream, filename);
};
