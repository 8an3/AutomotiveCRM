import type { ActionArgs, UploadHandler } from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import axios from "axios";
import sha1, { type Hasher } from 'js-sha1';

import { uploadImage, createImageTag, getAssetInfo } from "~/utils/utils.server";

export const action = async ({ request }: ActionArgs) => {
  const uploadHandler: UploadHandler = composeUploadHandlers(
    async ({ name, data }) => {
      if (name !== "img") {
        return undefined;
      }

      const uploadedImage = await uploadImage(data);
      // Upload the image
      const publicId = await uploadImage(data);

      // Get the colors in the image
      const colors = await getAssetInfo(publicId);

      // Create an image tag, using two of the colors in a transformation
      const imageTag = await createImageTag(publicId, colors[0][0], colors[1][0]);

      // Log the image tag to the console
      console.log(imageTag);
      return uploadedImage
    },
    createMemoryUploadHandler(),
  );

  const formData = await parseMultipartFormData(request, uploadHandler);
  const imgSrc = formData.get("img");
  const imgDesc = formData.get("desc");
  if (!imgSrc) {
    return json({ error: "something wrong", imgDesc: null, imgSrc: null });
  }

  return json({ error: null, imgDesc, imgSrc });
};

export default function Index() {
  const data = useActionData<typeof action>();

  return (
    <>
      <Form method="post" encType="multipart/form-data">
        <label htmlFor="img-field">Image to upload</label>
        <input id="img-field" type="file" name="img" accept="image/*" />
        <label htmlFor="img-desc">Image description</label>
        <input id="img-desc" type="text" name="desc" />
        <button type="submit">upload to cloudinary</button>
      </Form>
      {data?.error ? <h2>{data.error}</h2> : null}

      {data?.imgSrc ? (
        <>
          <h2>uploaded image</h2>
          <img src={data.imgSrc} alt={data.imgDesc || "Upload result"} />
        </>
      ) : null}
    </>
  );
}
