import { type ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { namedAction } from "~/utils/named-action";

export async function action({ request }: ActionArgs) {
  return namedAction(request, {
    async create() {
      // do create
    },
    async update() {
      // do update
    },
    async delete() {
      // do delete
    },
  });
}

export default function Component() {
  return (
    <>
      <Form method="post" action="?/create">
        ...
      </Form>

      <Form method="post" action="?/update">
        ...
      </Form>

      <Form method="post" action="?/delete">
        ...
      </Form>
    </>
  );
}
