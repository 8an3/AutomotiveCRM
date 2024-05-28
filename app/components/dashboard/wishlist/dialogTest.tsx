import * as React from "react"
import { toast } from "sonner"
import { ButtonLoading } from "~/components/ui/button-loading";

import { cn } from "~/components/ui/utils"
import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Form, useSubmit, useNavigation } from "@remix-run/react"
import { useState } from "react"
import { FilePlus, Trash2, Menu, Pencil } from "lucide-react"
import { CheckIcon, PaperPlaneIcon, PlusIcon, UploadIcon } from "@radix-ui/react-icons"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "~/components/ui/dialog"
import { Input } from "~/components";


export default function DialogTest(user, data) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const submit = useSubmit()
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size='icon'
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="  justify-between"
          >
            <Menu color="#ededed" className='mx-auto' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0 border-[#262626] bg-[#09090b] text-[#fafafa]">
          <Command>
            <CommandEmpty>Edit Demo Day Customer.</CommandEmpty>
            <CommandGroup>
              <Command>
                <CommandEmpty>Edit Customer</CommandEmpty>
                <CommandGroup>
                  <CommandItem onClick={() => setOpenDialog(true)} className='hover:bg-[#232324] w-[90%] cursor-pointer' >
                    <Pencil color="#ededed" className="mr-2" />

                    Edit
                  </CommandItem>
                  <Form method='post'>
                    <input type='hidden' name='userEmail' defaultValue={user.email} />
                    <input type='hidden' name='id' defaultValue={data.id} />
                    <input type='hidden' name='firstName' defaultValue={data.firstName} />
                    <input type='hidden' name='lastName' defaultValue={data.lastName} />
                    <input type='hidden' name='phone' defaultValue={data.phone} />
                    <input type='hidden' name='name' defaultValue={data.firstName + ' ' + data.lastName} />
                    <input type='hidden' name='brand' defaultValue={data.brand} />
                    <input type='hidden' name='model' defaultValue={data.model} />
                    <input type='hidden' name='intent' defaultValue='wishListConvert' />
                    <CommandItem onClick={() => submit} className='hover:bg-[#232324] w-[90%] cursor-pointer' >
                      <FilePlus color="#ededed" className="mr-2" />
                      Convert To Customer
                    </CommandItem>
                  </Form>

                  <Form method='post'>
                    <input type='hidden' name='userEmail' defaultValue={user.email} />
                    <input type='hidden' name='id' defaultValue={data.id} />
                    <input type='hidden' name='intent' defaultValue='deleteWishList' />
                    <CommandItem onClick={() => submit} className='hover:bg-[#232324] w-[90%] cursor-pointer' >
                      <Trash2 color="#ededed" className="mr-2" /> Delete
                    </CommandItem>
                  </Form>
                </CommandGroup>
              </Command>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="gap-0 p-0 outline-none border-[#27272a] text-[#fafafa]">
          <Form method='post'>
            <DialogHeader className="px-4 pb-4 pt-5">
              <DialogTitle>Edit Customer Profile Info</DialogTitle>
            </DialogHeader>
            <hr className="my-3 text-[#27272a] w-[98%] mx-auto" />
            <div className="grid gap-3 mx-3 mb-3">
              <div className="relative mt-3">
                <Input
                  defaultValue={data.firstName} name='firstName'
                  type="text"
                  className="w-full bg-[#09090b] border-[#27272a] "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">First Name</label>
              </div>
              <div className="relative mt-3">
                <Input
                  defaultValue={data.lastName} name='lastName'
                  type="text"
                  className="w-full bg-[#09090b] border-[#27272a] "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Last Name</label>
              </div>
              <div className="relative mt-3">
                <Input
                  defaultValue={data.phone} name='phone'
                  type="text"
                  className="w-full bg-[#09090b] border-[#27272a] "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Phone</label>
              </div>
              <div className="relative mt-3">
                <Input
                  defaultValue={data.email} name='email'
                  type="text"
                  className="w-full bg-[#09090b] border-[#27272a] "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Email</label>
              </div>
              <div className="relative mt-3">
                <Input
                  defaultValue={data.model} name='address'
                  type="text"
                  className="w-full bg-[#09090b] border-[#27272a] "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Model</label>
              </div>
              <div className="relative mt-3">
                <Input
                  defaultValue={data.model2} name='city'
                  type="text"
                  className="w-full bg-[#09090b] border-[#27272a] "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Model 2</label>
              </div>
              <div className="relative mt-3">
                <Input
                  defaultValue={data.leadNote} name='postal'
                  type="text"
                  className="w-full bg-[#09090b] border-[#27272a] "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Note</label>
              </div>
              <input type='hidden' name='userId' defaultValue={user.id} />
              <input type='hidden' name='userEmail' defaultValue={user.email} />
              <input type='hidden' name='apptType' defaultValue='sales' />
              <ButtonLoading
                size="sm"
                value="editWishList"
                className="w-auto cursor-pointer ml-auto mt-5 bg-[#dc2626]"
                name="intent"
                type="submit"
                isSubmitting={isSubmitting}
                onClick={() => toast.success(`${data.firstName}'s customer file is being...`)}
                loadingText={`${data.firstName}'s customer file is updated...`}
              >
                Continue
                <PaperPlaneIcon className="h-4 w-4 ml-2" />
              </ButtonLoading>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
