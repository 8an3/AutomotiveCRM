import { ActionFunctionArgs, UploadHandler, json, unstable_composeUploadHandlers, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData, } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { prisma } from '~/libs';

export const action = async ({ request }: ActionFunctionArgs) => {
  const csvUploadHandler: UploadHandler = async ({
    name,
    data,
  }) => {
    if (name !== 'selected_csv') {
      return undefined;
    }
    const chunks = [];
    for await (let chunk of data) {
      chunks.push(chunk);
    }
    return await new Blob(chunks).text();
  };

  const uploadHandler: UploadHandler = unstable_composeUploadHandlers(
    csvUploadHandler,
    unstable_createMemoryUploadHandler()
  );
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);
  const csv = formData.get('selected_csv');

  if (!csv) {
    // Handle case where CSV is not present
    return json({ error: 'CSV file not found' }, { status: 400 });
  }

  const rows = csv.split('\n').map(row => row.trim());

  for (const row of rows) {
    // Your existing code to process each row
    const data = row.split(',').map((column) => column.trim());
    // ...
    await db.inventoryMotorcycle.create({
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
  });
};


export default function Index() {
  return (
    <>
      <div className="mt-10" style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: 10 }}>Upload Motorcycle Inventory</h1>
        <Form method="post" encType="multipart/form-data">
          <input type="file" accept=".csv" name="selected_csv" />
          <button type="submit" className="btn btn-sm border border-white">
            UPLOAD CSV
          </button>
        </Form>
      </div>
    </>

  );
}
