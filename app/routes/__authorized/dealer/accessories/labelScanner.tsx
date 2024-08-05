import { useFetcher } from "@remix-run/react";
import { Scan } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button, Input } from "~/components";
import ScanSound from '~/images/scan.mp4'
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType, NotFoundException, ChecksumException, FormatException } from '@zxing/library';
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));


export default function LabelScanner() {
  let addProduct = useFetcher();
  let formRef = useRef();
  const [open, setOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState('')
  const [data, setData] = useState('')

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    console.log('ZXing code reader initialized');

    const hints = new Map();
    const formats = [
      BarcodeFormat.PDF_417,
      BarcodeFormat.QR_CODE,
      BarcodeFormat.ITF,
      BarcodeFormat.CODE_128,
      BarcodeFormat.EAN_13,
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


        document.getElementById('startButton').addEventListener('click', async () => {
          let stopScanning = false;

          while (!stopScanning) {
            try {
              const result = await codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video', hints);
              setScannedCode(result.text);
              playScanSound();
              console.log('result', result);
              await new Promise(resolve => setTimeout(resolve, 5000));
              codeReader.reset();
            } catch (err) {
              console.error('error', err);
            }
          }
          console.log('Stopped scanning');
        });

        document.getElementById('resetButton').addEventListener('click', () => {
          document.getElementById('result').textContent = '';
          codeReader.reset();
          setScannedCode('')
          console.log('Reset.');
        });

        let listener = (event) => {
          // if ((event.metaKey || event.ctrlKey) && event.key === "s") {
          if (event.key === 'F1') {
            event.preventDefault();
            codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video', hints).then((result) => {
              console.log(result);
              /// document.getElementById('result').textContent = result.text;
              setScannedCode(result.text)
            }).catch((err) => {
              console.error(err);
              //  document.getElementById('result').textContent = err;
            });
          }
          // if ((event.metaKey || event.ctrlKey) && event.key === "r") {
          if (event.key === 'F2') {
            event.preventDefault();
            codeReader.reset();
            setScannedCode('')
            console.log('Reset.');
          }
        };

        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const swrFetcher = (url) => fetch(url).then((res) => res.json());

  const { data: swrData, error, isLoading } = useSWR('/dealer/accessories/products/search/all', swrFetcher)

  useEffect(() => {
    if (scannedCode) {
      try {
        console.log(swrData, 'result');
        if (!Array.isArray(swrData)) {
          console.error('Products is not an array or is undefined', swrData);
          return;
        }

        const result = swrData.filter((product) =>
          product.id?.toLowerCase().includes(scannedCode.toLowerCase())
        );
        console.log(result, 'filtered result');

        if (result.length > 0) {
          setOpen(true)
          setData(result)
        }
      } catch (err) {
        console.error('error', err);
      }
    }

  }, [scannedCode]);


  return (
    <>
      <div className=" fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]  ">
        <main className="wrapper text-white mx-auto " >
          <section className="container" id="demo-content">
            <div className='flex items-center'>

              <div className='flex flex-col items-center  mx-auto' >
                <div className='rounded-[5px] border border-border relative group' style={{ padding: 0, width: '150px', maxHeight: '100px', overflow: 'hidden', border: ' ' }}>
                  <video id="video" style={{ width: '150px' }}></video>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm  bg-primary absolute left-2.5 top-2.5  opacity-0 transition-opacity group-hover:opacity-100 "
                    id="startButton"
                  >
                    <Scan className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only text-foreground">Scan</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm   absolute right-2.5 top-2.5  opacity-0 transition-opacity group-hover:opacity-100 "
                    id="resetButton"
                  >
                    <Scan className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only text-foreground">Reset</span>
                  </Button>
                  <div id="sourceSelectPanel" style={{ display: 'none' }}>
                    <select id="sourceSelect" className='b-rounded-[5px] px-3 py-1 bg-background text-foreground border-border border   opacity-0 transition-opacity group-hover:opacity-100 ' style={{ maxWidth: '150px' }}></select>
                  </div>
                </div>
                <div style={{ display: 'none' }}>
                  <div style={{ padding: 0, width: '100px', maxHeight: '100px', overflow: 'hidden', border: '1px solid gray' }}>
                    <video id="video" style={{ width: '100px' }}></video>
                  </div>
                  <input className='text-background bg-background border-background' type="file" id="imageUploadButton" accept="image/*" style={{ display: 'inline-block', }} />
                  <label className='text-background' htmlFor="sourceSelect">Change video source:</label>
                  <label className='text-background' >Result:</label>
                  <pre><code className='text-background' id="result"></code></pre>
                  <addProduct.Form
                    method="post"
                    ref={formRef}
                    className='mr-auto'
                    onSubmit={(event) => {
                      wait().then(() => setOpen(false));
                      event.preventDefault();
                    }}>
                    <div className="relative ml-auto flex-1 md:grow-0">
                      <input
                        name='intent'
                        defaultValue='updateOrder'
                        type='hidden'
                      />
                      <Input
                        name="accessoryId"
                        defaultValue={scannedCode}
                        type='hidden'
                        onChange={() => {
                          let products;
                          products = addProduct.load('/dealer/accessories/products/search/all')
                          console.log(products, 'products')
                          let result;
                          result = products.filter(
                            (result) =>
                              result.id?.toLowerCase().includes(scannedCode)
                          );
                        }}
                        placeholder="Search..."
                        className="w-full rounded-lg bg-background pl-8 max-w-[400px]"
                      />
                    </div>
                  </addProduct.Form>
                </div>
              </div>
            </div>
          </section>
        </main>



        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>{data.name}</DrawerTitle>
                <DrawerDescription className='text-muted-foreground'>  {data.brand}</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0 flex flex-col items-center justify-center">
                <p className='text-foreground text-center'>
                  {data.description}
                </p>
                <ul className="grid gap-3 text-sm mt-2">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      ID
                    </span>
                    <span>{data.id}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Category
                    </span>
                    <span>{data.category}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Sub Category
                    </span>
                    <span>{data.subCategory}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Distributor
                    </span>
                    <span>{data.distributor}</span>
                  </li>

                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Location
                    </span>
                    <Input className='border border-border bg-background' name='location' defaultValue={data.location} />
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      On Order
                    </span>
                    <Input className='border border-border bg-background' name=' onOrder' defaultValue={data.onOrder} />
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Price
                    </span>
                    <Input className='border border-border bg-background' name='price' defaultValue={data.price} />
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Quantitiy
                    </span>
                    <Input className='border border-border bg-background' name='quantity' defaultValue={data.quantity} />
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Order
                    </span>
                    <Input className='border border-border bg-background' name='order' />
                  </li>
                </ul>
              </div>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

    </>
  )
}

export function playScanSound() {
  const audio = new Audio(ScanSound);
  audio.play();
}
const test =
{
  "showOrder": [
    {
      "id": "clzgd568v00w7uozw7be9j77i",
      "createdAt": "2024-08-05T02:19:22.975Z",
      "status": "Quote",
      "updatedAt": "2024-08-05T02:19:22.975Z",
      "userName": "Skyler Zanth",
      "dept": "Sales",
      "userEmail": "skylerzanth@outlook.com",
      "total": 3582.97,
      "discount": null,
      "discPer": null,
      "sendToAccessories": null,
      "accessoriesCompleted": null,
      "clientfileId": "clzgd565h00vjuozwiw4hlia8",
      "AccessoriesOnOrders": [
        {
          "id": "clzgd569500w8uozw26x5lfh3",
          "quantity": 1,
          "accOrderId": "clzgd568v00w7uozw7be9j77i",
          "accessoryId": "clzgd568900w1uozwupdt1y5q",
          "status": "Fulfilled",
          "orderNumber": null,
          "accessory": {
            "id": "clzgd568900w1uozwupdt1y5q",
            "accessoryNumber": 6,
            "brand": "FOX",
            "name": "T-Shirt XL",
            "price": 80.79,
            "cost": 40.79,
            "quantity": 60,
            "description": "Shirt with Fox",
            "category": "Casual Wear",
            "subCategory": "T-Shirts",
            "onOrder": 30,
            "distributer": "FOX",
            "location": "Wall 1",
            "note": null
          }
        },
        {
          "id": "clzgd569500w9uozws8x7cahr",
          "quantity": 1,
          "accOrderId": "clzgd568v00w7uozw7be9j77i",
          "accessoryId": "clzgd568d00w2uozwm8jrhqww",
          "status": "Fulfilled",
          "orderNumber": null,
          "accessory": {
            "id": "clzgd568d00w2uozwm8jrhqww",
            "accessoryNumber": 7,
            "brand": "BMW-Motorrad",
            "name": "Riders Jacket XL",
            "price": 700,
            "cost": 650,
            "quantity": 70,
            "description": "Casual riding jacket.",
            "category": "Motorcycle Jackets",
            "subCategory": "Protective Wear",
            "onOrder": 35,
            "distributer": "BMW-Motorrad",
            "location": "Wall 2",
            "note": null
          }
        },
        {
          "id": "clzgd569500wauozwf0ebfccb",
          "quantity": 1,
          "accOrderId": "clzgd568v00w7uozw7be9j77i",
          "accessoryId": "clzgd568g00w3uozwwi0gh11y",
          "status": "Fulfilled",
          "orderNumber": null,
          "accessory": {
            "id": "clzgd568g00w3uozwwi0gh11y",
            "accessoryNumber": 8,
            "brand": "BMW-Motorrad",
            "name": "Casual Riding Kevlar Jeans XL",
            "price": 800.59,
            "cost": 750.59,
            "quantity": 80,
            "description": "Kevlar jeans for casual riding",
            "category": "Motorcycle pants",
            "subCategory": "Protective Wear",
            "onOrder": 40,
            "distributer": "BMW-Motorrad",
            "location": "Wall 2",
            "note": null
          }
        },
        {
          "id": "clzgd569500wbuozwyebiumgx",
          "quantity": 1,
          "accOrderId": "clzgd568v00w7uozw7be9j77i",
          "accessoryId": "clzgd568k00w4uozwqsoc428l",
          "status": "Fulfilled",
          "orderNumber": null,
          "accessory": {
            "id": "clzgd568k00w4uozwqsoc428l",
            "accessoryNumber": 9,
            "brand": "BMW-Motorrad",
            "name": "Riding Casual Boot Size 12",
            "price": 900,
            "cost": 850,
            "quantity": 90,
            "description": "Casual designed boot for casual riding",
            "category": "Motorcycle boots",
            "subCategory": "Protective Wear",
            "onOrder": 45,
            "distributer": "BMW-Motorrad",
            "location": "Boot Section",
            "note": null
          }
        },
        {
          "id": "clzgd569500wcuozwc45wg8b9",
          "quantity": 1,
          "accOrderId": "clzgd568v00w7uozw7be9j77i",
          "accessoryId": "clzgd568n00w5uozwatpppfmr",
          "status": "Fulfilled",
          "orderNumber": null,
          "accessory": {
            "id": "clzgd568n00w5uozwatpppfmr",
            "accessoryNumber": 10,
            "brand": "FOX",
            "name": "Riding Gloves XL",
            "price": 101.59,
            "cost": 75.59,
            "quantity": 100,
            "description": "Fox riding glove",
            "category": "Protective Wear",
            "subCategory": "Gloves",
            "onOrder": 50,
            "distributer": "FOX",
            "location": "wall 6",
            "note": null
          }
        },
        {
          "id": "clzgd569500wduozwlh6owzgj",
          "quantity": 1,
          "accOrderId": "clzgd568v00w7uozw7be9j77i",
          "accessoryId": "clzgd568600w0uozwt90mnwfm",
          "status": "Fulfilled",
          "orderNumber": null,
          "accessory": {
            "id": "clzgd568600w0uozwt90mnwfm",
            "accessoryNumber": 5,
            "brand": "Brand E",
            "name": "Accessory 5",
            "price": 500,
            "cost": 450,
            "quantity": 50,
            "description": "Description 5",
            "category": "Category 5",
            "subCategory": "SubCategory 5",
            "onOrder": 25,
            "distributer": "Distributor 5",
            "location": "Location 5",
            "note": null
          }
        },
        {
          "id": "clzgd569500weuozw8tierfsh",
          "quantity": 1,
          "accOrderId": "clzgd568v00w7uozw7be9j77i",
          "accessoryId": "clzgd568100vzuozwwijpxibt",
          "status": "Fulfilled",
          "orderNumber": null,
          "accessory": {
            "id": "clzgd568100vzuozwwijpxibt",
            "accessoryNumber": 4,
            "brand": "Brand D",
            "name": "Accessory 4",
            "price": 400,
            "cost": 350,
            "quantity": 40,
            "description": "Description 4",
            "category": "Category 4",
            "subCategory": "SubCategory 4",
            "onOrder": 20,
            "distributer": "Distributor 4",
            "location": "Location 4",
            "note": null
          }
        }
      ],
      "Payments": []
    },
    {
      "id": "clzgd56b600wguozwsizyp8lh",
      "createdAt": "2024-08-05T02:19:22.975Z",
      "status": "Quote",
      "updatedAt": "2024-08-05T02:19:22.975Z",
      "userName": "Skyler Zanth",
      "dept": "Sales",
      "userEmail": "skylerzanth@outlook.com",
      "total": 2582.97,
      "discount": null,
      "discPer": null,
      "sendToAccessories": null,
      "accessoriesCompleted": null,
      "clientfileId": "clzgd565h00vjuozwiw4hlia8",
      "AccessoriesOnOrders": [],
      "Payments": []
    }
  ],
  "userId": "clzgd56a600whuozwtdulx0e2",
  "createdAt": "2024-08-05T02:19:22.975Z",
  "updatedAt": "2024-08-05T02:19:22.975Z"
}
