import type { ActionArgs, UploadHandler, LoaderArgs } from '@remix-run/node';
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  unstable_createFileUploadHandler,
  type ActionFunction
} from '@remix-run/node';
import { Form, useActionData, Link, useLoaderData, useFetcher } from '@remix-run/react';
import { prisma } from '~/libs';
import {
  AvatarAuto, Badge, Debug, RemixLink, Button,
  ButtonLink,
  PageAdminHeader,
  RemixForm, Card, CardContent, Input, Label, Select, SelectTrigger, SelectContent, SelectItem, Avatar, AvatarFallback, AvatarImage, PopoverTrigger, PopoverContent, Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, Popover, CardHeader, CardTitle, CardDescription,
} from "~/components";
import { useState } from 'react';
import { parseCSVFromFile } from "~/utils/parse-csv";
import { parseXLSXFromFile } from "~/utils/parse-xlsx";
import {
  allowedMimeTypes,
  isUploadedFile,
  uploadHandler,
} from "~/utils/upload-handler";


export const action = async ({ request }: ActionArgs) => {
  try {

    const formData = await parseMultipartFormData(request, uploadHandler);
    console.log('formData:', formData);

    const csv = formData ? formData.get('selected_csv') : undefined;

    if (!csv) { throw new Error('CSV file not found in form data.'); }

    const rows = csv.split('\n').slice(1); // Skip header row

    for (const row of rows) {
      const data = row.split(',').map((column) => column.trim());

      await prisma.inventoryMotorcycle.create({
        data: {
          packageNumber: data[0],
          packagePrice: data[1],
          stockNumber: data[2],
          type: data[3],
          class: data[4],
          year: data[5],
          make: data[6],
          model: data[7],
          modelName: data[8],
          submodel: data[9],
          subSubmodel: data[10],
          price: data[11],
          exteriorColor: data[12],
          mileage: data[13],
          consignment: data[14].toLowerCase() === 'true',
          onOrder: data[15].toLowerCase() === 'true',
          expectedOn: data[16],
          status: data[17],
          orderStatus: data[18],
          hdcFONumber: data[19],
          hdmcFONumber: data[20],
          vin: data[21],
          age: parseInt(data[22], 10),
          floorPlanDueDate: data[23],
          location: data[24],
          stocked: data[25].toLowerCase() === 'true',
          stockedDate: data[26],
          isNew: data[27].toLowerCase() === 'true',
          actualCost: data[28],
          mfgSerialNumber: data[29],
          engineNumber: data[30],
          plates: data[31],
          keyNumber: data[32],
          length: data[33],
          width: data[34],
          engine: data[35],
          fuelType: data[36],
          power: data[37],
          chassisNumber: data[38],
          chassisYear: data[39],
          chassisMake: data[40],
          chassisModel: data[41],
          chassisType: data[42],
          registrationState: data[43],
          registrationExpiry: data[44],
          grossWeight: data[45],
          netWeight: data[46],
          insuranceCompany: data[47],
          policyNumber: data[48],
          insuranceAgent: data[49],
          insuranceStartDate: data[50],
          insuranceEndDate: data[51],
        },
      });
    }

    console.log(`csv`, csv);
    return json({
      csv,
      success: true,
    });
  } catch (error) {
    console.error('Error in action:', error);
    return json({
      error: error.message || 'Internal Server Error',
      success: false,
    }, { status: 500 });
  }
};
/// thios works just foundd it  https://stackblitz.com/edit/node-ubpgp5?file=app%2Froutes%2Findex.tsx
/**export const action = async ({ request }: ActionArgs) => {
  const csvUploadHandler: UploadHandler = async ({
    name,
    filename,
    data,
    contentType,
  }) => {
    if (name !== 'selected_csv') {
      return undefined;
    }
    let chunks = [];
    for await (let chunk of data) {
      chunks.push(chunk);
    }

    return await new Blob(chunks, { type: contentType }).text();
  };

  const uploadHandler: UploadHandler = composeUploadHandlers(
    csvUploadHandler,
    createMemoryUploadHandler()
  );
  const formData = await parseMultipartFormData(request, uploadHandler);
  const csv = formData.get('selected_csv');

  // alternate method using just memeoryUploadHandler
  // const uploadHandler = createMemoryUploadHandler();
  // const formData = await parseMultipartFormData(request, uploadHandler);
  // const csvFile = formData.get('selected_csv') as File;
  // const csv = await csvFile.text();

  console.log(`csv`, csv);
  return json({
    csv,
  });
}; */

export default function FormCard() {
  const [cardQuantity, setCardQuantity] = useState(0);
  const [cardAmount, setCardAmount] = useState(0);
  const contactFileUploader = useFetcher();
  const loaderData = useLoaderData()

  const totalCardQuantity =
    (cardQuantity || contactFileUploader.data?.length) ?? 0;

  const submitUpload = (formData: FormData) => {
    contactFileUploader.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className='text-white border border-white rounded-md mx-auto mt-10'>
      <Form style={{ display: "flex", flexDirection: "column" }}>


        <contactFileUploader.Form
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.nativeEvent.preventDefault();

            const file = e.dataTransfer.files?.[0];

            if (!file) return;

            const formData = new FormData();
            formData.set("import_file", file);

            submitUpload(formData);
          }}
          onChange={(e) => {
            const formData = new FormData(e.currentTarget);

            submitUpload(formData);
          }}
        >
          <div>
            <label htmlFor="import_file">
              <span>Upload a file</span>
              <input id="import_file" name="import_file" type="file" />
            </label>
            <p>or drag and drop</p>
          </div>
          <p>XLSX, CSV up to 5MB</p>
        </contactFileUploader.Form>

        <p>Liste des gens : </p>
        <pre>{JSON.stringify(contactFileUploader.data)}</pre>

        <div
          style={{
            border: "1px solid black",
            width: "fit-content",
            padding: 12,
            marginTop: 50,
          }}
        >
          <p>Quantité de cartes : {totalCardQuantity}</p>
          <p>Prix final de l'opération' : {totalCardQuantity * cardAmount}€</p>
        </div>
      </Form>
    </div>
  );
}

async function createOrUpdateYourModel(data) {
  return prisma.inventoryMotorcycle.create({
    data: {
      packageNumber: data[0].trim(),
      packagePrice: data[1].trim(),
      stockNumber: data[2].trim(),
      type: data[3].trim(),
      class: data[4].trim(),
      year: data[5].trim(),
      make: data[6].trim(),
      model: data[7].trim(),
      modelName: data[8].trim(),
      submodel: data[9].trim(),
      subSubmodel: data[10].trim(),
      price: data[11].trim(),
      exteriorColor: data[12].trim(),
      mileage: data[13].trim(),
      consignment: data[14].trim().toLowerCase() === 'true', // Parse boolean
      onOrder: data[15].trim().toLowerCase() === 'true', // Parse boolean
      expectedOn: data[16].trim(), // Assuming date format
      status: data[17].trim(),
      orderStatus: data[18].trim(),
      hdcFONumber: data[19].trim(),
      hdmcFONumber: data[20].trim(),
      vin: data[21].trim(),
      age: parseInt(data[22].trim(), 10), // Parse integer
      floorPlanDueDate: data[23].trim(), // Assuming date format
      location: data[24].trim(),
      stocked: data[25].trim().toLowerCase() === 'true', // Parse boolean
      stockedDate: data[26].trim(), // Assuming date format
      isNew: data[27].trim().toLowerCase() === 'true', // Parse boolean
      actualCost: data[28].trim(),
      mfgSerialNumber: data[29].trim(),
      engineNumber: data[30].trim(),
      plates: data[31].trim(),
      keyNumber: data[32].trim(),
      length: data[33].trim(),
      width: data[34].trim(),
      engine: data[35].trim(),
      fuelType: data[36].trim(),
      power: data[37].trim(),
      chassisNumber: data[38].trim(),
      chassisYear: data[39].trim(),
      chassisMake: data[40].trim(),
      chassisModel: data[41].trim(),
      chassisType: data[42].trim(),
      registrationState: data[43].trim(),
      registrationExpiry: data[44].trim(), // Assuming date format
      grossWeight: data[45].trim(),
      netWeight: data[46].trim(),
      insuranceCompany: data[47].trim(),
      policyNumber: data[48].trim(),
      insuranceAgent: data[49].trim(),
      insuranceStartDate: data[50].trim(), // Assuming date format
      insuranceEndDate: data[51].trim(), // Assuming date format
    },
  });
}
/** <div className='mt-5 mb-5' style={{ textAlign: 'center' }}>
        <h1 className='text-white' style={{ marginBottom: 10 }}>Export Motorcycle Inventory - CSV</h1>
        <Button onClick={() => Click1()} download="inventoryMotorcycles.csv" className="btn btn-sm text-white border-white border py-2 px-3 rounded-md mb-5">
          DOWNLOAD CSV
        </Button>
      </div> */
