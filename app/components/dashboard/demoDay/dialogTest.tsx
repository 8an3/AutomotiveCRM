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
import { FilePlus, Trash2, Menu, Save } from "lucide-react"
import { CheckIcon, PaperPlaneIcon, PlusIcon, UploadIcon } from "@radix-ui/react-icons"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "~/components/ui/dialog"
import { Input } from "~/components";


export default function DialogTest(user, data, firstName, lastName, email, phone, leadNote, notified) {
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
                  <Form method='post'>
                    <input type='hidden' name='id' defaultValue={data.id} />
                    <input type='hidden' name='firstName' defaultValue={firstName} />
                    <input type='hidden' name='lastName' defaultValue={lastName} />
                    <input type='hidden' name='phone' defaultValue={phone} />
                    <input type='hidden' name='notified' defaultValue={notified} />
                    <input type='hidden' name='email' defaultValue={email} />
                    <input type='hidden' name='leadNote' defaultValue={leadNote} />
                    <input type='hidden' name='name' defaultValue={firstName + ' ' + lastName} />
                    <input type='hidden' name='intent' defaultValue='demoDayEdit' />
                    <CommandItem onClick={() => submit} className='hover:bg-[#232324] w-[90%] cursor-pointer rounded-md' >
                      <Save color="#ededed" className="mr-2" />
                      Save
                    </CommandItem>
                  </Form>

                  <Form method='post'>
                    <input type='hidden' name='userEmail' defaultValue={user.email} />
                    <input type='hidden' name='id' defaultValue={data.id} />
                    <input type='hidden' name='firstName' defaultValue={data.firstName} />
                    <input type='hidden' name='lastName' defaultValue={data.lastName} />
                    <input type='hidden' name='phone' defaultValue={data.phone} />
                    <input type='hidden' name='name' defaultValue={data.firstName + ' ' + data.lastName} />
                    <input type='hidden' name='brand' defaultValue={data.brand} />
                    <input type='hidden' name='model' defaultValue={data.model} />
                    <input type='hidden' name='intent' defaultValue='demoDayConvert' />
                    <CommandItem onClick={() => submit} className='hover:bg-[#232324] w-[90%] cursor-pointer  rounded-md' >
                      <FilePlus color="#ededed" className="mr-2" />
                      Convert To Customer
                    </CommandItem>
                  </Form>

                  <Form method='post'>
                    <input type='hidden' name='userEmail' defaultValue={user.email} />
                    <input type='hidden' name='id' defaultValue={data.id} />
                    <input type='hidden' name='intent' defaultValue='demoDayDelete' />
                    <CommandItem onClick={() => submit} className='hover:bg-[#232324] w-[90%] cursor-pointer rounded-md' >
                      <Trash2 color="#ededed" className="mr-2" /> Delete
                    </CommandItem>
                  </Form>
                </CommandGroup>
              </Command>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

    </>
  )
}
