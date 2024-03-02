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
import { useLoaderData, Form, useFetcher, useActionData } from "@remix-run/react";
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
import { UserPlus } from "lucide-react";
import { ListSelection2 } from '~/routes/quoteUtils/listSelection'

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
  const [brandId, setBrandId] = useState('');

  const handleBrand = (e) => {
    setBrandId(e.target.value);
  };
  const errors = useActionData() as Record<string, string | null>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className=' p-2 cursor-pointer hover:text-blue-8 justify-center items-center mr-3 border-[#fff]' >
          <UserPlus size={20} strokeWidth={1.5} color="#02a9ff" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border border-black">
        <DialogHeader>
          <DialogTitle>
            Add Client
          </DialogTitle>

        </DialogHeader>
        <Form method="post">
          <div className="flex flex-col ">
            <Input
              placeholder="First Name (required)"
              type="text"
              name="firstName"
              onChange={handleChange}
            />
            <Input
              className=" mt-3 "
              placeholder="Last Name (required)"
              type="text"
              name="lastName"
              onChange={handleChange}
            />
            <Input
              className=" mt-3 "
              placeholder="Phone"
              type="number"
              name="phone"
            />
            <Input
              className=" mt-3"
              placeholder="Email (required)"
              type="email"
              name="email"
            />
            <Input
              className=" mt-3 "
              placeholder="Address"
              type="text"
              name="address"
            />
            <Input
              className=" mt-3 "
              placeholder="Brand (required)"
              type="text"
              list="ListOptions"
              name="brand"
              onChange={handleBrand}

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
            <Input className=" mt-3 " placeholder="Model" type="text" list="ListOptions" name="model" />
            <ListSelection2 brandId={brandId} />
            {errors?.model ? (
              <em className="text-[#ff0202]">{errors.model}</em>
            ) : null}
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
