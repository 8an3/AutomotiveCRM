// Import necessary packages
import { json, LoaderFunction, useRouteData } from "@remix-run/node";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

// Configure multer
const upload = multer({ dest: "uploads/imports" });

// Loader function to handle file upload
export let loader: LoaderFunction = async ({ request }) => {
  const form = new FormData(await request.formData());
  const file = form.get("file");
  if (file && file instanceof File) {
    const results = [];
    fs.createReadStream(file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        // Here you can update your database with the data from the CSV file
        console.log(results);
      });
  }
  return json({ status: "success" });
};

// Component to render the form
export default function ImportData() {
  let data = useRouteData();

  return (
    <div>
      <form method="post" encType="multipart/form-data">
        <input type="file" name="file" accept=".csv" />
        <button type="submit">Upload</button>
      </form>
      {data.status === "success" && <p>File uploaded successfully!</p>}
    </div>
  );
}
