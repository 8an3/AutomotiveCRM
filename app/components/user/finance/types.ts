export interface RenderedItem {
  id: string;
  packageName: string;
  order: number;
  packagePrice: number | null;
  providorId: string;
}

export const CONTENT_TYPES = {
  price: "application/remix-price",
  providor: "application/remix-providor",
};

export const INTENTS = {
  createProvidor: "createProvidor" as const,
  updateProvidor: "updateProvidor" as const,
  createPrice: "createPrice" as const,
  movePrice: "movePrice" as const,
  moveProvidor: "moveProvidor" as const,
  updateProductName: "updateProductName" as const,
  deleteProduct: "deleteProduct" as const,
  createProduct: "createProduct" as const,
  updatePackageName: "updatePackageName" as const,
  updatePackagePrice: "updatePackagePrice" as const,
  deletePrice: "deletePrice" as const,
};

export const ItemMutationFields = {
  id: { type: String, name: "id" },
  providorId: { type: String, name: "providorId" },
  order: { type: Number, name: "order" },
  packagePrice: { type: Number, name: "packagePrice" },
  packageName: { type: String, name: "packageName" },
  name: { type: String, name: "name" },
} as const;

export type ItemMutation = MutationFromFields<typeof ItemMutationFields>;

////////////////////////////////////////////////////////////////////////////////
// Bonkers TypeScript
type ConstructorToType<T> = T extends typeof String
  ? string
  : T extends typeof Number
  ? number
  : never;

export type MutationFromFields<T extends Record<string, any>> = {
  [K in keyof T]: ConstructorToType<T[K]["type"]>;
};
