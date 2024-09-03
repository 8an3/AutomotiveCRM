import { createReadableStreamFromReadable } from '@remix-run/node';
import { Readable } from 'node:stream';
import { prisma } from '~/libs';

export const loader = async () => {
  const custData = await prisma.clientfile.findMany();

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

  const rows = custData.map(entry => [
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
