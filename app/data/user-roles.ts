import type { UserRole } from "@prisma/client";

export type DataUserRole = Pick<
  UserRole,
  "sequence" | "symbol" | "name" | "description"
>;

export const dataUserRoles: DataUserRole[] = [
  {
    sequence: 1,
    symbol: "ADMIN",
    name: "Administrator",
    description: "Users who can manage the entire system and data.",
  },
  {
    sequence: 2,
    symbol: "MANAGER",
    name: "Manager",
    description: "Users who can manage systems and data.",
  },
  {
    sequence: 3,
    symbol: "EDITOR",
    name: "Editor",
    description: "Users who can manage some data.",
  },
  {
    sequence: 4,
    symbol: "NORMAL",
    name: "Normal",
    description: "Ordinary users who can only do the rest.",
  },
  {
    sequence: 5,
    symbol: "SALES",
    name: "Sales",
    description: "Sales staff.",
  },
  {
    sequence: 6,
    symbol: "ACCESSORIES",
    name: "Accessories",
    description: "Accessories staff",
  },
  {
    sequence: 7,
    symbol: "PARTS",
    name: "Parts",
    description: "Parts staff",
  },
  {
    sequence: 8,
    symbol: "SERVICE",
    name: "Service",
    description: "Service writers",
  },
  {
    sequence: 9,
    symbol: "TECHNICIAN",
    name: "Technician",
    description: "",
  },
  {
    sequence: 10,
    symbol: "RECIEVING",
    name: "Recieving",
    description: "",
  },
  {
    sequence: 11,
    symbol: "ADMINISTRATION",
    name: "Administration",
    description: "Administration Staff",
  },
];
