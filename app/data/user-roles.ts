import type { UserRole } from "@prisma/client";

export type DataUserRole = Pick<
  UserRole,
  "sequence" | "symbol" | "name" | "description"
>;

export const dataUserRoles: DataUserRole[] = [
  {
    sequence: 1,
    symbol: "Administrator",
    name: "Administrator",
    description: "Users who can manage the entire system and data.",
  },
  {
    sequence: 2,
    symbol: "Manager",
    name: "Manager",
    description: "Users who can manage systems and data.",
  },
  {
    sequence: 3,
    symbol: "Editor",
    name: "Editor",
    description: "Users who can manage some data.",
  },
  {
    sequence: 4,
    symbol: "Normal",
    name: "Normal",
    description: "Ordinary users who can only do the rest.",
  },
  {
    sequence: 5,
    symbol: "Sales",
    name: "Sales",
    description: "Sales associate selling vehicles.",
  },

  {
    sequence: 6,
    symbol: "Accessories",
    name: "Accessories",
    description: "Accessorizing the world one client at a time.",
  },
  {
    sequence: 7,
    symbol: "Parts",
    name: "Parts",
    description: "Parts advisor helping customer while upselling popular products.",
  },
  {
    sequence: 8,
    symbol: "Service",
    name: "Service",
    description: "Service writers, booking in clients for service.",
  },
  {
    sequence: 9,
    symbol: "Technician",
    name: "Technician",
    description: "Fixing clients vehicles as they are brought in.",
  },
  {
    sequence: 10,
    symbol: "Recieving",
    name: "Recieving",
    description: "Manages the incoming products and organizes them for store.",
  },

  {
    sequence: 11,
    symbol: "DEV",
    name: "DEV",
    description: "DEV Staff",
  },
  {
    sequence: 12,
    symbol: "Finance Manager",
    name: "Finance Manager",
    description: "Upsells back end productss.",
  },
  {
    sequence: 13,
    symbol: "Delivery Driver",
    name: "Delivery Driver",
    description: "Delivery Driver.",
  },
  {
    sequence: 14,
    symbol: "Owner",
    name: "Owner",
    description: "Owner",
  },
];
