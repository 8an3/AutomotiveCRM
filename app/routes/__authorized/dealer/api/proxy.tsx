// app/routes/api/proxy.ts
import { LoaderFunction } from "@remix-run/node";

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const itemId = url.searchParams.get("itemId");

  if (!itemId) {
    return new Response("Item ID is required", { status: 400 });
  }


  try {
    const response = await graphClient
      .api(`/me/drive/items/${itemId}/content`)
      .responseType("arraybuffer")
      .get();

    const fileContent = response.body;

    return new Response(fileContent, {
      headers: {
        "Content-Type": response.headers["content-type"] || "application/octet-stream",
        "Content-Disposition": response.headers["content-disposition"] || `attachment; filename="${itemId}"`,
        "Content-Length": response.headers["content-length"]
      }
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    return new Response("Error fetching file", { status: 500 });
  }
};
