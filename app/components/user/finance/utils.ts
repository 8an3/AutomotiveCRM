import invariant from "tiny-invariant";
import { ItemMutation, ItemMutationFields } from "./types";

export function parseItemMutation(formData: FormData): ItemMutation {
  let id = ItemMutationFields.id.type(formData.get("id"));
  invariant(id, "Missing item id");

  let providorId = ItemMutationFields.providorId.type(formData.get("providorId"));
  invariant(providorId, "Missing providorId");

  let order = ItemMutationFields.order.type(formData.get("order"));
  invariant(typeof order === "number", "Missing order");

  let name = ItemMutationFields.name.type(formData.get("name"));
  invariant(name, "Missing name");

  let packageName = ItemMutationFields.packageName.type(formData.get("packageName"));
  invariant(packageName, "Missing packageName");
  let packagePrice = ItemMutationFields.packagePrice.type(formData.get("packageName"));
  invariant(packagePrice, "Missing packagePrice");
  return { id, providorId, order, name, packageName, packagePrice };
}
