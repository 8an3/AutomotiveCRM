
import { useAppContext } from "~/components/microsoft/AppContext";
import { useState, useEffect } from 'react'
import { useMsal } from "@azure/msal-react";
import { FetchDriveItems, UploadFileToDrive } from "~/components/microsoft/GraphService";
import { Button, Input } from "~/components";


export default function Root() {

  const app = useAppContext();
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();


  const [file, setFile] = useState([])
  const [fileName, setFileName] = useState([])
  const [drives, setDrives] = useState([])
  const [clientFile, setClientFile] = useState([])
  const [parentId, setParentId] = useState('root')

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleFileNameChange = (event) => {
    setFileName(event.target);
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {

      const getDrives = await graphClient?.api('/me/drives')
        .get();
      setDrives(getDrives)
      const clientName = 'Skyler'
      const getClientFile = await graphClient?.api(`/me/drive/root/search(q=${clientName})`)
        .get();
      setClientFile(getClientFile.value)
    };
    fetchUnreadCount();
  }, []);

  const fetchDriveItemContent = async (itemId) => {
    try {
      const response = await FetchDriveItems(app.authProvider!, itemId)
      console.log('Drive item content:', response);
      // Handle the response or update state with the retrieved content
    } catch (error) {
      console.error('Error fetching drive item content:', error);
      // Handle errors appropriately
    }
  };



  const uploadFileToDrive = async () => {
    if (!file) return;
    try {
      const response = await UploadFileToDrive(app.authProvider!, parentId, file, fileName)
      console.log('File uploaded successfully:', response);
      return response;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  //const download =  client.api('/me/drive/items/{item-id}/content')
  //.get();
  return (
    <div className="mx-auto mt-3">

      <div>
        <h2 className=' mx-auto  my-3'>Client Files</h2>
        <ul>
          {clientFile.length > 0 ? (
            clientFile.map((drive, index) => (
              <li key={index} >
                <strong>File:</strong> {drive.name}
                <Button variant='outline' className='mr-3' onClick={() => fetchDriveItemContent(drive.id)}>Download File</Button>

              </li>
            ))
          ) : (
            <p>No client files currently...</p>
          )}
        </ul>
      </div>
      <div className=' mx-auto  my-3' >
        <label htmlFor="img-field">File to upload</label>

      </div>
      <Input name='fileName' type='text' placeholder="Filename" onChange={handleFileNameChange} className='mx-3 w-[25%] my-3' />
      <input type="file" name="file" accept="*/*" onChange={handleFileChange} />
      <Button variant='outline' onClick={uploadFileToDrive}>Upload File</Button>
      <div>
        <h2>List of Drives</h2>
        <ul>
          {drives.length > 0 ? (
            <ul>
              {drives.map((drive, index) => (
                <li key={index}>
                  <strong>Name:</strong> {drive.value.name}, <strong>Type:</strong> {drive.value.driveType}
                  {/* Add more properties based on your drive object */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No drives currently...</p>
          )}

        </ul>
      </div>
    </div>
  )
}
