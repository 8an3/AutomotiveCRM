// components/FileDownloader.js
import React from 'react';

const FileDownloader = ({ itemId }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/proxy?itemId=${itemId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]
        : 'downloaded-file';
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <button onClick={handleDownload}>
      Download File
    </button>
  );
};

export default FileDownloader;
