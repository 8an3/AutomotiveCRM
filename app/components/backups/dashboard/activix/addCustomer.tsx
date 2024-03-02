import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog"
import {
  Input,
  Button,
  Separator,
  Checkbox,
  PopoverTrigger,
  PopoverContent,
  Popover,
  TextArea,
} from "~/components/ui/index";
import { useLoaderData, Form, useFetcher } from "@remix-run/react";
import {
  PhoneOutcome,
  MenuScale,
  Mail,
  MessageText,
  User,
  ArrowDown,
  Calendar as CalendarIcon,
  WebWindowClose,
  AddUser,
} from "iconoir-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/other/dropdown-menu";
import { ScrollArea } from "~/other/scrollarea";
import { ItemText } from "@radix-ui/react-select";
import { useState } from "react";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";

export default function AddCustomer() {
  const { user } = useRootLoaderData();
  const userEmail = user?.email;

  const initial = {
    firstName: "",
    lastName: "",
  };
  const [formData, setFormData] = useState(initial);
  const firstName = formData.firstName;
  const lastName = formData.lastName;
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  // <Input type="hidden" name="financeId" defaultValue={user.id} />

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="cursor-pointer ml-4 mr-4 my-auto  hover:text-[#02a9ff]" >
          <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" fill="none" strokeWidth="1.2" viewBox="0 0 24 24" color="#ffffff"><path stroke="#d1d5db" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M17 10h3m3 0h-3m0 0V7m0 3v3M1 20v-1a7 7 0 0 1 7-7v0a7 7 0 0 1 7 7v1M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path></svg>
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border border-black">
        <DialogHeader>
          <DialogTitle>
            Add Customer
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>      <Form method="post">
          <div className="flex flex-col ">
            <Input
              placeholder="First Name (required)"
              type="text"
              name="firstName"
              onChange={handleChange}
            />
            <Input
              className=" mt-1 "
              placeholder="Last Name (required)"
              type="text"
              name="lastName"
              onChange={handleChange}
            />
            <Input
              className=" mt-1 "
              placeholder="Phone"
              type="number"
              name="phone"
            />
            <Input
              className=" mt-1 "
              placeholder="Email (required)"
              type="email"
              name="email"
            />
            <Input
              className=" mt-1 "
              placeholder="Address"
              type="text"
              name="address"
            />
            <Input
              className=" mt-1 "
              placeholder="Brand (required)"
              type="text"
              list="ListOptions"
              name="brand"
            />
            <datalist id="ListOptions">
              <option value="BMW-Motorrad" />
              <option value="Can-Am" />
              <option value="Can-Am-SXS" />
              <option value="Harley-Davidson" />
              <option value="Indian" />
              <option value="Kawasaki" />
              <option value="KTM" />
              <option value="Manitou" />
              <option value="Sea-Doo" />
              <option value="Switch" />
              <option value="Ski-Doo" />
              <option value="Suzuki" />
              <option value="Triumph" />
              <option value="Spyder" />
              <option value="Yamaha" />
            </datalist>
          </div>
          <Input type="hidden" name="iRate" defaultValue={10.99} />
          <Input type="hidden" name="tradeValue" defaultValue={0} />
          <Input type="hidden" name="discount" defaultValue={0} />
          <Input type="hidden" name="deposit" defaultValue={0} />
          <Input type="hidden" name="months" defaultValue={60} />
          <Input type="hidden" name="userEmail" defaultValue={userEmail} />


          <Input
            type="hidden"
            name="name"
            defaultValue={`${firstName}` + " " + `${lastName}`}
          />
          <div className="mt-[25px] flex justify-end">
            <Button
              name="intent"
              value="AddCustomer"
              type="submit"

            >
              Add
            </Button>
          </div>
          <DialogClose asChild>
            <button
              className=" absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              <WebWindowClose />
            </button>
          </DialogClose>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
