import type { ActionArgs, UploadHandler, LoaderArgs } from '@remix-run/node';
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/node';
import { Form, useActionData, Link, useLoaderData } from '@remix-run/react';
import { prisma } from '~/libs';
import {
  AvatarAuto, Badge, Debug, RemixLink, Button,
  ButtonLink,
  PageAdminHeader,
  RemixForm, Card, CardContent, Input, Label, Select, SelectTrigger, SelectContent, SelectItem, Avatar, AvatarFallback, AvatarImage, PopoverTrigger, PopoverContent, Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, Popover, CardHeader, CardTitle, CardDescription,
} from "~/components";

export const action = async ({ request }: ActionArgs) => {
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

  const rows = csv.split('\n').slice(1); // Skip header row

  const parsedData = rows.map((row) => {
    const columns = row.split(',');
    return createOrUpdateYourModel(columns);
  });

  // Save each row to the database
  await Promise.all(parsedData);

  console.log(`csv`, csv);
  return json({
    csv,
    success: true,
  });
};

export const loader = async ({ request }: LoaderArgs) => {
  const inventoryMotorcycles = await prisma.inventoryMotorcycle.findMany();

  // Check if inventoryMotorcycles is not empty
  if (inventoryMotorcycles.length > 0) {
    const headers = Object.keys(inventoryMotorcycles[0]).join(',');

    const csvContent = inventoryMotorcycles.map(motorcycle => {
      return Object.values(motorcycle).join(',');
    }).join('\n');

    return { csvContent: headers + '\n' + csvContent };
  } else {
    // Return an empty CSV if there are no motorcycles
    return { csvContent: '' };
  }
};
export default function Index() {
  const { csvContent } = useLoaderData();
  const Click1 = () => {
    const blob = new Blob([csvContent], { type: 'text/csv' });

    let url = URL.createObjectURL(blob);
    console.log("button");
    window.open(url, "_blank");
  };
  return (
    <div className='border border-white rounded-md w-[500px] justify-center mx-auto' style={{ textAlign: 'center' }}>
      <h1 className='text-white mt-5' style={{ marginBottom: 10 }}>Import Motorcycle Inventory - CSV</h1>
      <Form method="post" encType="multipart/form-data" className='items-center'>
        <input type='file' accept=".csv" name="selected_csv" className='text-white border-white' />
        <Button type="submit" className="btn btn-sm text-white border-white  border py-2 px-3">
          UPLOAD CSV
        </Button>
      </Form>
      <div className='mt-5 mb-5' style={{ textAlign: 'center' }}>
        <h1 className='text-white' style={{ marginBottom: 10 }}>Export Motorcycle Inventory - CSV</h1>
        <Button onClick={() => Click1()} download="inventoryMotorcycles.csv" className="btn btn-sm text-white border-white border py-2 px-3 rounded-md mb-5">
          DOWNLOAD CSV
        </Button>
      </div>
    </div>
  );
}
