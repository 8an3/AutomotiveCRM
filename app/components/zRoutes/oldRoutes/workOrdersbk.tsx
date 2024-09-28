import { createReadableStreamFromReadable } from '@remix-run/node';
import { Readable } from 'node:stream';
import { prisma } from '~/libs';

export const loader = async () => {
  const data = await prisma.clientfile.findMany();

  const headers = [
    "workOrderId",
    "unit",
    "mileage",
    "vin",
    "tag",
    "motor",
    "color",
    "budget",
    "waiter",
    "totalLabour",
    "totalParts",
    "subTotal",
    "total",
    "writer",
    "userEmail",
    "tech",
    "techEmail",
    "notes",
    "customerSig",
    "status",
    "location",
    "quoted",
    "paid",
    "remaining",
    "FinanceUnitId",
    "ServiceUnitId",
    "financeId",
    "clientfileId",
    "note",
    "closedAt",
    "createdAt",
    "updatedAt",
  ];


  const testData = {
    "workOrderId": 52,
    "unit": "unit",
    "mileage": "mileage",
    "vin": "vin",
    "tag": "tag",
    "motor": "motor",
    "color": "color",
    "budget": "budget",
    "waiter": false,
    "totalLabour": 10.05,
    "totalParts": 10.05,
    "subTotal": 10.05,
    "total": 10.05,
    "writer": "writer",
    "userEmail": "userEmail",
    "tech": "tech",
    "techEmail": "techEmail",
    "discDollar": 10.05,
    "discPer": 10.05,
    "notes": "notes",
    "customerSig": "customerSig",
    "status": "status",
    "location": "location",
    "quoted": "quoted",
    "paid": "paid",
    "remaining": "remaining",
    "FinanceUnitId": "FinanceUnitId",
    "ServiceUnitId": "ServiceUnitId",
    "financeId": "financeId",
    "clientfileId": "clientfileId",
    "note": "note",
    "closedAt": new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const csvData = data.length > 0 ? data : [testData];


  const rows = csvData.map(entry => [
    entry.workOrderId,
    entry.unit,
    entry.mileage,
    entry.vin,
    entry.tag,
    entry.motor,
    entry.color,
    entry.budget,
    entry.waiter,
    entry.totalLabour,
    entry.totalParts,
    entry.subTotal,
    entry.total,
    entry.writer,
    entry.userEmail,
    entry.tech,
    entry.techEmail,
    entry.notes,
    entry.customerSig,
    entry.status,
    entry.location,
    entry.quoted,
    entry.paid,
    entry.remaining,
    entry.FinanceUnitId,
    entry.ServiceUnitId,
    entry.financeId,
    entry.clientfileId,
    entry.note,
    entry.closedAt,
    entry.createdAt,
    entry.updatedAt,
  ].map(value => (value === null ? '' : value)).join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');

  const file = createReadableStreamFromReadable(
    Readable.from([csvContent]),
  );

  return new Response(file, {
    headers: {
      'Content-Disposition': 'attachment; filename="Customers.csv"',
      'Content-Type': 'text/csv',
    },
  });
};
