import { createReadableStreamFromReadable } from '@remix-run/node';
import { Readable } from 'node:stream';
import { prisma } from '~/libs';

export const loader = async () => {
  // Fetch data from the 'inventoryMotorcycle' table using Prisma
  const data = await prisma.inventoryMotorcycle.findMany();

  // Define the CSV headers
  const headers = [
    "packageNumber",
    "packagePrice",
    "stockNumber",
    "type",
    "class",
    "year",
    "make",
    "model",
    "modelName",
    "submodel",
    "subSubmodel",
    "price",
    "exteriorColor",
    "mileage",
    "consignment",
    "onOrder",
    "expectedOn",
    "status",
    "orderStatus",
    "hdcFONumber",
    "hdmcFONumber",
    "vin",
    "age",
    "floorPlanDueDate",
    "location",
    "stocked",
    "stockedDate",
    "isNew",
    "actualCost",
    "mfgSerialNumber",
    "engineNumber",
    "plates",
    "keyNumber",
    "length",
    "width",
    "engine",
    "fuelType",
    "power",
    "chassisNumber",
    "chassisYear",
    "chassisMake",
    "chassisModel",
    "chassisType",
    "registrationState",
    "registrationExpiry",
    "grossWeight",
    "netWeight",
    "insuranceCompany",
    "policyNumber",
    "insuranceAgent",
    "insuranceStartDate",
    "insuranceEndDate",
    "sold"
  ];

  // Map the data to CSV rows
  const rows = data.map(entry => [
    entry.packageNumber,
    entry.packagePrice,
    entry.stockNumber,
    entry.type,
    entry.class,
    entry.year,
    entry.make,
    entry.model,
    entry.modelName,
    entry.submodel,
    entry.subSubmodel,
    entry.price,
    entry.exteriorColor,
    entry.mileage,
    entry.consignment,
    entry.onOrder,
    entry.expectedOn,
    entry.status,
    entry.orderStatus,
    entry.hdcFONumber,
    entry.hdmcFONumber,
    entry.vin,
    entry.age,
    entry.floorPlanDueDate,
    entry.location,
    entry.stocked,
    entry.stockedDate,
    entry.isNew,
    entry.actualCost,
    entry.mfgSerialNumber,
    entry.engineNumber,
    entry.plates,
    entry.keyNumber,
    entry.length,
    entry.width,
    entry.engine,
    entry.fuelType,
    entry.power,
    entry.chassisNumber,
    entry.chassisYear,
    entry.chassisMake,
    entry.chassisModel,
    entry.chassisType,
    entry.registrationState,
    entry.registrationExpiry,
    entry.grossWeight,
    entry.netWeight,
    entry.insuranceCompany,
    entry.policyNumber,
    entry.insuranceAgent,
    entry.insuranceStartDate,
    entry.insuranceEndDate,
    entry.sold
  ].map(value => (value === null ? '' : value)).join(','));

  // Combine headers and rows into a single CSV string
  const csvContent = [headers.join(','), ...rows].join('\n');

  // Create a readable stream from the CSV string
  const file = createReadableStreamFromReadable(
    Readable.from([csvContent]),
  );

  // Return the response with appropriate headers for downloading the CSV file
  return new Response(file, {
    headers: {
      'Content-Disposition': 'attachment; filename="UnitInventory.csv"',
      'Content-Type': 'text/csv',
    },
  });
};
