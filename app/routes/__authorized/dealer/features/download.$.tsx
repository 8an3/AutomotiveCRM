import { type LoaderFunction } from '@remix-run/node';
import { promises as fs } from 'fs';
import { join } from 'path';

let loader: LoaderFunction = async ({ params }) => {
  console.log('hitting downoad')
  // Get the file name from the params
  let fileName = params.fileName;

  // Read the file from the /public/upload directory
  let filePath = join(process.cwd(), 'public', 'upload', fileName);
  console.log('filePath', filePath, fileName)
  const readFile = async (filePath) => {
    const data = await fs.readFile(filePath, 'utf8');
    return data;
  };
  let fileContents = await readFile(filePath);
  return new Response(fileContents, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${fileName}`,
    },
  });
};

export default loader;
