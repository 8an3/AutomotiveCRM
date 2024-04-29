import React, { useState, useRef, useEffect } from 'react';
import {
  Form,
  useActionData,
  useSubmit,
  useLoaderData,
  useLocation,
  useParams
} from "@remix-run/react";
import {
  type ActionFunction,
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { put } from '@vercel/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';

export let action: ActionFunction = async ({ request }) => {
  const body = await request.json()

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'file/csv'],
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('blob upload completed', blob, tokenPayload);
      },
    });

    return json(jsonResponse);
  } catch (error) {
    return json(
      { error: error.message },
      { status: 400 }
    );
  }
};

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState(null);
  const submit = useSubmit();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error('No file selected');
    }

    const file = inputFileRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await submit(formData, { action: '/api/avatar/upload' });
    const newBlob = await response.json();

    setBlob(newBlob);
  };
  //

  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const ws = new WebSocket("ws://localhost:3000/");
      ws.onmessage = ({ data }) => {
        setMessage(data);
        console.log(message);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      <h1>Upload Your Avatar</h1>

      <Form
        onSubmit={async (event) => {
          event.preventDefault();

          if (!inputFileRef.current?.files) {
            throw new Error('No file selected');
          }

          const file = inputFileRef.current.files[0];

          const newBlob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/avatar/upload',
          });

          setBlob(newBlob);
        }}
      >
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </Form>
      <hr />
      <h3>
        {message}<p>test</p>
      </h3>
      <hr />
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
}
