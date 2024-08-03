import React, { useEffect } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { Button } from '~/components';




const BarcodeScanner = () => {
  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    console.log('ZXing code reader initialized');

    const hints = new Map();
    const formats = [
      BarcodeFormat.PDF_417,
      BarcodeFormat.QR_CODE,
      BarcodeFormat.ITF,
      // Add support for PDF417 format
      BarcodeFormat.PDF_417,
      BarcodeFormat.PDF_417,
      BarcodeFormat.PDF_417,
      BarcodeFormat.PDF_417,
    ];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

    codeReader.getVideoInputDevices()
      .then((videoInputDevices) => {
        const sourceSelect = document.getElementById('sourceSelect');
        let selectedDeviceId = videoInputDevices[0].deviceId;

        if (videoInputDevices.length > 1) {
          videoInputDevices.forEach((element) => {
            const sourceOption = document.createElement('option');
            sourceOption.text = element.label;
            sourceOption.value = element.deviceId;
            sourceSelect.appendChild(sourceOption);
          });

          sourceSelect.onchange = () => {
            selectedDeviceId = sourceSelect.value;
          };

          const sourceSelectPanel = document.getElementById('sourceSelectPanel');
          sourceSelectPanel.style.display = 'block';
        }

        document.getElementById('startButton').addEventListener('click', () => {
          codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video', hints).then((result) => {
            console.log(result);
            document.getElementById('result').textContent = result.text;
          }).catch((err) => {
            console.error(err);
            document.getElementById('result').textContent = err;
          });
          console.log(`Started decode from camera with id ${selectedDeviceId}`);
        });

        document.getElementById('resetButton').addEventListener('click', () => {
          document.getElementById('result').textContent = '';
          codeReader.reset();
          console.log('Reset.');
        });

        document.getElementById('imageUploadButton').addEventListener('change', async (event) => {
          const file = event.target.files[0];
          if (file) {
            const imageUrl = URL.createObjectURL(file);
            try {
              const result = await codeReader.decodeFromImageUrl(imageUrl, hints);
              document.getElementById('result').textContent = result.text;
              console.log(result);
            } catch (err) {
              console.error(err);
              document.getElementById('result').textContent = err;
            }
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <main className="wrapper text-white" style={{ paddingTop: '2em' }}>
      <section className="container" id="demo-content">
        <h1 className="title">Scan barcode from Video Camera or Image</h1>
        <div>
          <Button size='sm' className="button bg-[ff0000] mr-3" id="startButton">Start</Button>
          <Button size='sm' className="button bg-[ff0000] mr-3" id="resetButton">Reset</Button>
          <input type="file" id="imageUploadButton" accept="image/*" style={{ display: 'inline-block', marginLeft: '10px' }} />
        </div>
        <div style={{ padding: 0, width: '200px', maxHeight: '200px', overflow: 'hidden', border: '1px solid gray' }}>
          <video id="video" style={{ width: '200px' }}></video>
        </div>
        <div id="sourceSelectPanel" style={{ display: 'none' }}>
          <label htmlFor="sourceSelect">Change video source:</label>
          <select id="sourceSelect" style={{ maxWidth: '400px' }}></select>
        </div>
        <label>Result:</label>
        <pre><code id="result"></code></pre>
      </section>
      <div className='mt-10' >
      </div>
    </main>
  );
};

export default BarcodeScanner;
