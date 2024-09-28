import { createReadableStreamFromReadable } from '@remix-run/node';
import { Readable } from 'node:stream';
import { prisma } from '~/libs';

export const loader = async () => {
  // Fetch data from the 'accessory' table using Prisma
  const data = await prisma.accessory.findMany();

  // Define the CSV headers
  const headers = [
    "id",
    "createdAt",
    "updatedAt",
    "partNumber",
    "brand",
    "name",
    "price",
    "cost",
    "quantity",
    "minQuantity",
    "description",
    "category",
    "subCategory",
    "onOrder",
    "distributer",
    "location",
    "note",
    "workOrderSuggestion",
  ];
  const testData = {
    "id": "id",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    "partNumber": "partNumber",
    "brand": "brand",
    "name": "name",
    "price": 10.05,
    "cost": 10.05,
    "quantity": 5,
    "minQuantity": 5,
    "description": "description",
    "category": "category",
    "subCategory": "subCategory",
    "onOrder": 5,
    "distributer": "distributer",
    "location": "location",
    "note": "note",
    "workOrderSuggestion": "workOrderSuggestion",
  }
  const csvData = data.length > 0 ? data : [testData];

  // Map the data to CSV rows
  const rows = csvData.map(entry => [
    entry.id,
    entry.createdAt,
    entry.updatedAt,
    entry.partNumber,
    entry.brand,
    entry.name,
    entry.price,
    entry.cost,
    entry.quantity,
    entry.minQuantity,
    entry.description,
    entry.category,
    entry.subCategory,
    entry.onOrder,
    entry.distributer,
    entry.location,
    entry.note,
    entry.workOrderSuggestion,
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
      'Content-Disposition': 'attachment; filename="Accessories.csv"',
      'Content-Type': 'text/csv',
    },
  });
};
