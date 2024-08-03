
import {
  json,
  unstable_createFileUploadHandler,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { prisma } from '~/libs';
import type { ActionArgs, ActionFunction, UploadHandler } from '@remix-run/node';
import { useEffect, useState, useRef } from 'react';


export const action: ActionFunction = async ({ request }) => {
  // Your action logic here

  return json({ ok: 200 }, {
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'same-origin'
    }
  });
};

export default function Index() {

  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);
  const MyIFrameComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const handleHeightMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'iframeHeight' && event.data.height) {
          setIsLoading(false);

          if (iFrameRef.current) {
            iFrameRef.current.style.height = `${event.data.height}px`;
          }
        }
      };

      if (iFrameRef.current) {
        // iFrameRef.current.src = 'http://localhost:3000/body';
        iFrameRef.current.src = 'https://crmsat.vercel.app/admin/import/motorcycle';
        window.addEventListener('message', handleHeightMessage);
      }

      return () => {
        if (iFrameRef.current) {
          window.removeEventListener('message', handleHeightMessage);
        }
      };
    }, []);

    return (
      <>
        <div className="h-full w-full ">
          <iframe
            ref={iFrameRef}
            title="my-iframe"
            width="100%"
            className=' border-none'
            style={{ minHeight: '840px' }}
          />
        </div>
      </>
    );
  };
  return (
    <div style={{ textAlign: 'center' }}>
      <MyIFrameComponent />
    </div>
  );
}

/***/

