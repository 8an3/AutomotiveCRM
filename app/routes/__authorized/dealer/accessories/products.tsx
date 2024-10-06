import React, { useEffect, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  Eye,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Plus,
  Printer,
  Scan,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  User,
  Users2,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { Outlet, Link, useFetcher, useActionData, useSubmit, useLoaderData } from "@remix-run/react"
import { json, LoaderFunction, redirect } from "@remix-run/node"
import { prisma } from "~/libs"
import IndeterminateCheckbox, { EditableText, Filter } from '~/components/shared/shared'
import { getSession } from "~/sessions/auth-session.server"
import { GetUser } from "~/utils/loader.server"
import financeFormSchema from "~/overviewUtils/financeFormSchema"
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Select } from "~/components"

export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")

  const user = await GetUser(email)
  if (!user) { redirect('/login') }

  return json({ user });
}

export async function action({ request, params }: LoaderFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const intent = formData.intent;
  if (intent === 'updateProduct') {
    const update = await prisma.accessories.update({
      where: { id: formData.id },
      data: {
        [formPayload.colName]: formPayload.name,
      }
    })
    console.log(update, 'update')
    return json({ update })
  }

  const hasAdminPosition = user?.positions.some(position => position.position === 'Administrator' || position.position === 'Manager');

  if (hasAdminPosition) {
    if (intent === 'updateProductManager') {
      const update = await prisma.accessories.update({
        where: { id: formData.id },
        data: {
          [formPayload.colName]: formPayload.name,
        }
      })
      console.log(update, 'update')
      return json({ update })
    } else if (intent === 'updateProductManagerCost') {
      const update = await prisma.accessories.update({
        where: { id: formData.id },
        data: {
          [formPayload.colName]: parseFloat(formPayload.name),
        }
      })
      console.log(update, 'update')
      return json({ update })
    } else return null
  }
}

export default function SearchCustomers() {
  const data = useActionData()
  let ref = useRef();
  let formRef = useRef();
  let search = useFetcher();
  const { user } = useLoaderData()
  let addProduct = useFetcher();

  const [hidden, setHidden] = useState(false)
  const [scannedCode, setScannedCode] = useState()
  const [newScan, setNewScan] = useState(false)
  const hasAdminPosition = user.positions.some(position => position.position === 'Administrator' || position.position === 'Manager');

  // -------------------------------------   scanner
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


        document.getElementById('startButton').addEventListener('click', async () => {
          let stopScanning = false;

          while (!stopScanning) {
            try {
              const result = await codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video', hints);
              setScannedCode(result.text);
              console.log('result', result);
              if (result.text.length > 3) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                codeReader.reset();
              }
            } catch (err) {
              console.error('error', err);
              //setScannedCode('');
              // Wait for 1 second before resetting and trying again
              // await new Promise(resolve => setTimeout(resolve, 1000));
              //   codeReader.reset();
            }
          }
          console.log('Stopped scanning');
        });
        /**  document.getElementById('startButton').addEventListener('click',   () => {
          setNewScan(true)
          codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video', hints).then((result) => {
            console.log(result);
            document.getElementById('result').textContent = result.text;
            setScannedCode(result.text)
          }).catch((err) => {
            setNewScan(false)
            console.error(err);
            document.getElementById('result').textContent = err;
          });
          await new Promise(resolve => setTimeout(resolve, 5000));

          codeReader.reset();

          console.log(`Started decode from camera with id ${selectedDeviceId}`);
        }); */
        /**   document.getElementById('startButton').addEventListener('click', async () => {
                  try {
                    const result = await codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video', hints);
                    setScannedCode(result.text);
                    console.log('result', result);
                  } catch (err) {
                    console.error('error', err);
                    codeReader.reset();
                  }
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  codeReader.reset();
                }); */

        document.getElementById('resetButton').addEventListener('click', () => {
          document.getElementById('result').textContent = '';
          codeReader.reset();
          setScannedCode('')
          setNewScan(false)
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
              setNewScan(true)
              setScannedCode(result.text)
            } catch (err) {
              setNewScan(false)
              console.error(err);
              document.getElementById('result').textContent = err;
            }
          }
        });
        let listener = (event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "s") {
            event.preventDefault();
            codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video', hints).then((result) => {
              console.log(result);
              document.getElementById('result').textContent = result.text;
              setScannedCode(result.text)
            }).catch((err) => {
              setNewScan(false)
              console.error(err);
              document.getElementById('result').textContent = err;
            });
          }
        };
        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (scannedCode) {
      const formData = new FormData();
      formData.append("q", scannedCode);
      search.submit(formData, { method: "get", action: '/dealer/accessories/products/search/id' });
    }
  }, [scannedCode]);
  console.log(JSON.stringify(search.data), data, 'serarch')



  return (
    <Card x-chunk="dashboard-05-chunk-3 " className='mx-5 w-[95%] '>
      <CardHeader className="px-7">
        <CardTitle>
          <div className='flex justify-between items-center'>
            <p>Accessories</p>
            <div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 text-sm mr-2"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Create New Accessory</span>
              </Button>
              {hasAdminPosition && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm mr-2"
                    onClick={() => setHidden(prevState => !prevState)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Show Hidden</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                    onClick={() => setHidden(prevState => !prevState)}
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Print current list's barcodes</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardTitle>
        <CardDescription className='flex items-center'>
          <search.Form method="get" action='/dealer/accessories/products/search'>
            <div className="relative ml-auto flex-1 md:grow-0 ">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={ref}
                type="search"
                name="q"
                onChange={e => {
                  //   search.submit(`/dealer/accessories/search?name=${e.target.value}`);
                  search.submit(e.currentTarget.form);
                }}
                autoFocus
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
          </search.Form>
          <div className="relative flex-1 md:grow-0 ml-auto  ">
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
                      <addProduct.Form method="post" ref={formRef} className='mr-auto'>
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
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className='border-border'>
              <TableHead>
                Brand & Name
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                Description
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                Category
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                Sub Category
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                On Order
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                Distributer
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                Location
              </TableHead>
              {hidden &&
                <TableHead className="hidden md:table-cell">
                  Cost
                </TableHead>}

              <TableHead className="hidden sm:table-cell">
                Price
              </TableHead>
              <TableHead className="text-right">
                Quantity
              </TableHead>

            </TableRow>
          </TableHeader>
          <TableBody className='max-h-[700px] h-auto overflow-y-auto text-foreground'>
            {search.data &&
              search.data.map((result, index) => (
                <TableRow key={index} className="hover:bg-accent border-border">
                  <TableCell>
                    {hasAdminPosition ? (
                      <div className="">
                        <div className="font-medium">
                          <EditableText
                            value={result.name}
                            fieldName="name"
                            inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  "
                            buttonClassName="text-center py-1 px-2 text-foreground"
                            buttonLabel={`Edit name`}
                            inputLabel={`Edit name`}
                          >
                            <input type="hidden" name="intent" value='updateProductManager' />
                            <input type="hidden" name="id" value={result.id} />
                            <input type="hidden" name="colName" value='name' />
                          </EditableText>
                        </div>
                        <div className="text-sm text-muted-foreground ">
                          <EditableText
                            value={result.brand}
                            fieldName="name"
                            inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  "
                            buttonClassName="text-center py-1 px-2 text-muted-foreground"
                            buttonLabel={`Edit brand`}
                            inputLabel={`Edit brand`}
                          >
                            <input type="hidden" name="intent" value='updateProductManager' />
                            <input type="hidden" name="id" value={result.id} />
                            <input type="hidden" name="colName" value='brand' />
                          </EditableText>
                        </div>
                      </div>
                    ) : (
                      <div className='grid grid-cols-1' >
                        <p className='font-medium'>{result.name}</p>
                        <p className='text-muted-foreground'>{result.brand}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {hasAdminPosition ? (
                      <EditableText
                        value={result.description}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  "
                        buttonClassName="text-center py-1 px-2 text-muted-foreground"
                        buttonLabel={`Edit description`}
                        inputLabel={`Edit description`}
                      >
                        <input type="hidden" name="intent" value='updateProductManager' />
                        <input type="hidden" name="id" value={result.id} />
                        <input type="hidden" name="colName" value='description' />
                      </EditableText>
                    ) : (
                      <div className='grid grid-cols-1' >
                        <p className='text-muted-foreground'>{result.description}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {hasAdminPosition ? (
                      <EditableText
                        value={result.category}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  "
                        buttonClassName="text-center py-1 px-2 text-muted-foreground"
                        buttonLabel={`Edit category`}
                        inputLabel={`Edit category`}
                      >
                        <input type="hidden" name="intent" value='updateProductManager' />
                        <input type="hidden" name="id" value={result.id} />
                        <input type="hidden" name="colName" value='category' />
                      </EditableText>
                    ) : (
                      <div className='grid grid-cols-1' >
                        <p className='text-muted-foreground'>{result.category}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {hasAdminPosition ? (
                      <EditableText
                        value={result.subCategory}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2"
                        buttonClassName="text-center py-1 px-2 text-muted-foreground"
                        buttonLabel={`Edit subCategory`}
                        inputLabel={`Edit subCategory`}
                      >
                        <input type="hidden" name="intent" value='updateProductManager' />
                        <input type="hidden" name="id" value={result.id} />
                        <input type="hidden" name="colName" value='subCategory' />
                      </EditableText>
                    ) : (
                      <div className='grid grid-cols-1' >
                        <p className='text-muted-foreground'>{result.subCategory}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {hasAdminPosition ? (
                      <EditableText
                        value={result.onOrder}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[30px] "
                        buttonClassName="text-center py-1 px-2 text-foreground"
                        buttonLabel={`Edit onOrder`}
                        inputLabel={`Edit onOrder`}
                      >
                        <input type="hidden" name="intent" value='updateProductManager' />
                        <input type="hidden" name="id" value={result.id} />
                        <input type="hidden" name="colName" value='onOrder' />
                      </EditableText>
                    ) : (
                      <div className='grid grid-cols-1' >
                        <p className=''>{result.onOrder}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {hasAdminPosition ? (
                      <EditableText
                        value={result.distributer}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  "
                        buttonClassName="text-center py-1 px-2 text-muted-foreground"
                        buttonLabel={`Edit distributer`}
                        inputLabel={`Edit distributer`}
                      >
                        <input type="hidden" name="intent" value='updateProductManager' />
                        <input type="hidden" name="id" value={result.id} />
                        <input type="hidden" name="colName" value='distributer' />
                      </EditableText>
                    ) : (
                      <div className='grid grid-cols-1' >
                        <p className='text-muted-foreground'>{result.brand}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {hasAdminPosition ? (
                      <EditableText
                        value={result.location}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 "
                        buttonClassName="text-center py-1 px-2 text-foreground"
                        buttonLabel={`Edit location`}
                        inputLabel={`Edit location`}
                      >
                        <input type="hidden" name="intent" value='updateProduct' />
                        <input type="hidden" name="id" value={result.id} />
                        <input type="hidden" name="colName" value='location' />
                      </EditableText>
                    ) : (
                      <div className='grid grid-cols-1' >
                        <p className=''>{result.brand}</p>
                      </div>
                    )}

                  </TableCell>
                  {hidden &&
                    <TableCell className="hidden md:table-cell">

                      {hasAdminPosition ? (
                        <EditableText
                          value={result.cost}
                          fieldName="name"
                          inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[50px] "
                          buttonClassName="text-center py-1 px-2 text-foreground"
                          buttonLabel={`Edit cost`}
                          inputLabel={`Edit cost`}
                        >
                          <input type="hidden" name="intent" value='updateProductManagerCost' />
                          <input type="hidden" name="id" value={result.id} />
                          <input type="hidden" name="colName" value='cost' />
                        </EditableText>
                      ) : (
                        <div className='grid grid-cols-1' >
                          <p className=''>{result.cost}</p>
                        </div>
                      )}
                    </TableCell>

                  }
                  <TableCell className="hidden md:table-cell">
                    {hasAdminPosition ? (
                      <EditableText
                        value={result.price}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[50px] "
                        buttonClassName="text-center py-1 px-2 text-foreground"
                        buttonLabel={`Edit price`}
                        inputLabel={`Edit price`}
                      >
                        <input type="hidden" name="intent" value='updateProductManagerCost' />
                        <input type="hidden" name="id" value={result.id} />
                        <input type="hidden" name="colName" value='price' />
                      </EditableText>
                    ) : (
                      <div className='grid grid-cols-1' >
                        <p className=''>{result.price}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {hasAdminPosition ? (
                      <EditableText
                        value={result.quantity}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[30px] "
                        buttonClassName="text-right py-1 px-2 text-foreground"
                        buttonLabel={`Edit quantity`}
                        inputLabel={`Edit quantity`}
                      >
                        <input type="hidden" name="intent" value='updateProduct' />
                        <input type="hidden" name="id" value={result.id} />
                        <input type="hidden" name="colName" value='quantity' />
                      </EditableText>
                    ) : (
                      <div className='grid grid-cols-1' >
                        <p className=''>{result.quantity}</p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}

          </TableBody>
        </Table>

      </CardContent>
    </Card>
  )
}



export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/favicons/calendar.svg' },
];

export const meta = () => {
  return [
    { title: "Inventory || PAC || Dealer Sales Assistant" },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content:
        "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: "Automotive Sales, dealership sales, automotive CRM",
    },
  ];
};
