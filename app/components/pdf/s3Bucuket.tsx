import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { SaveMyDoc } from '~/utils/docTemplates/create.server'
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";

const s3 = new S3Client({
  accessKeyId: process.env.ACCESS_KEY || '',
  secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
  region: process.env.REGION || '',
})

export function SaveToSThree() {
  const { userId, user } = useLoaderData();

  useEffect(() => {
    const handleMessage = (event) => {
      console.log(event.data); // { myData: 'Hello, world!' }
      localStorage.setItem('doc', JSON.stringify(event.data));
      localStorage.setItem('userId', userId);
    };
    window.addEventListener('message', handleMessage);


    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [userId]);

  if (localStorage.getItem('doc') && localStorage.getItem('userId')) {
    async function saveDoc() {

      const fileContent = localStorage.getItem('doc')
      const userId = localStorage.getItem('userId');
      const docName = localStorage.getItem('docName');
      const dept = localStorage.getItem('dept');
      const category = localStorage.getItem('category');
      const fileName = (docName + userId)
      let results;

      const uploadFile = async (fileContent) => {
        const params = {
          Bucket: 'dealersalesapp',
          Key: fileName,
          Body: fileContent
        };
        try {
          const results = await s3.send(new PutObjectCommand(params));
          console.log("Successfully uploaded file to S3", results);
        } catch (err) {
          console.error("Error uploading file to S3", err);
        }
      };
      uploadFile(fileContent);
      if (results.Location) {
        console.log(`File uploaded successfully. ${results.Location}`);

        const doc = results.Location;
        const dbData = { doc, userId, category, dept, docName, fileName }
        const savingDoc = await SaveMyDoc(dbData);
        console.log('savingDoc', savingDoc, doc, 'doc')
        return json({ savingDoc })
      }
    }
    saveDoc()
  }
}

