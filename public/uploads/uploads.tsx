import { json } from '@remix-run/node';
import { put } from '@vercel/blob';


export async function action(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  // ⚠️ The below code is for App Router Route Handlers only
  // const blob = await put(filename, request.body, {
  //  access: 'public',
  //});

  // Here's the code for Pages API Routes:
  const blob = await put(filename, request, {
    access: 'public',
  });

  return json(blob);
}

// The next lines are required for Pages API Routes only
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
export const config = {
  api: {
    bodyParser: false,
  },
};
