import { Form } from "@remix-run/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input, Button, ScrollArea, Tabs, TabsList, TabsTrigger, TabsContent, Label } from "~/components/ui/index";
import { toast } from "sonner"

export default function EditWishList({ data }) {
  console.log(data, data.id)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className="active:bg-black mx-auto my-auto h-7  cursor-pointer rounded bg-[#09090b] px-3 py-2  text-center text-xs  font-bold uppercase text-[#fafafa] shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#fff]">
        <DialogHeader>
          <DialogTitle>Wish List</DialogTitle>
          <DialogDescription>
            Add customer to wish list. Once sold, you can transfer to clients.
          </DialogDescription>
        </DialogHeader>
        <Form method='post' className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <input type='hidden' name='rowId' value={data.id} />
            <Label htmlFor="name" className="text-right">
              First Name
            </Label>
            <Input
              name="firstName"
              placeholder="Pedro "
              className="col-span-3"
              defaultValue={data.firstName}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Last Name
            </Label>
            <Input
              name="lastName"
              placeholder="Duarte"
              className="col-span-3"
              defaultValue={data.lastName}

            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Email
            </Label>
            <Input
              name="email"
              placeholder="pedroduarte@gmail.com"
              className="col-span-3"
              defaultValue={data.email}

            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Phone
            </Label>
            <Input
              name="phone"
              placeholder="613-613-6134"
              className="col-span-3"
              defaultValue={data.phone}

            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Model
            </Label>
            <Input
              name="model"
              placeholder="2021 Road Glide"
              className="col-span-3"
              defaultValue={data.model}

            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Model 2
            </Label>
            <Input
              name="model2"
              placeholder="2021 Road King"
              className="col-span-3"
              defaultValue={data.model2}

            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Notes
            </Label>
            <Input
              name="wishListNotes"
              placeholder="wants less than 50k kms"
              className="col-span-3"
              defaultValue={data.wishListNotes}

            />
          </div>
          <Button onClick={() => toast.success(`Edited wishlist entry!`)}
            type='submit' name='intent' value='editWishList' variant='outline' className="active:bg-black w-[75px] mt-10 mx-2 my-auto h-7  cursor-pointer rounded bg-[#09090b] px-3 py-2  text-center text-xs  font-bold uppercase text-[#fafafa] shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
          >
            Save
          </Button>
        </Form>

      </DialogContent>
    </Dialog>
  )
}
