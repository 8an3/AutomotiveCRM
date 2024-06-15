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
import { useLoaderData, Form, useFetcher, useActionData, } from "@remix-run/react";
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
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ItemText } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import { UserPlus } from "lucide-react";
import { ListSelection2 } from '~/quoteUtils/listSelection'

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
  const [brandId, setBrandId] = useState('');
  const [modelList, setModelList] = useState();

  const handleBrand = (e) => {
    setBrandId(e.target.value);
    console.log(brandId, modelList)
  };

  useEffect(() => {
    async function getData() {
      const res = await fetch(`/api/modelList/${brandId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    }

    if (brandId.length > 3) {
      const fetchData = async () => {
        const result = await getData();
        setModelList(result);
        console.log(brandId, result); // Log the updated result
      };
      fetchData();
    }
  }, [brandId]);
  const errors = useActionData() as Record<string, string | null>;
  const fetcher = useFetcher()
  const data = useActionData()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className=' p-2 cursor-pointer hover:text-blue-8 justify-center items-center mr-3 border-[#fff]' >
          <UserPlus size={20} strokeWidth={1.5} color="#cbd0d4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-border bg-background text-foreground ">
        <DialogHeader>
          <DialogTitle>
            Add Client
          </DialogTitle>

        </DialogHeader>
        <p>{brandId}</p>
        <fetcher.Form method="post">
          <div className="flex flex-col ">
            <div className="relative mt-3">
              <Input
                type="text"
                name="firstName"
                onChange={handleChange}
                className='border-border bg-background'
              />
              <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">First Name</label>
            </div>
            <div className="relative mt-3">
              <Input
                type="text"
                name="lastName"
                onChange={handleChange}
                className='border-border bg-background '
              />
              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Last Name</label>
            </div>
            <div className="relative mt-3">
              <Input
                className="border-border bg-background   "
                type="number"
                name="phone"
              />
              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Phone</label>
            </div>
            <div className="relative mt-3">
              <Input
                className="border-border bg-background  "
                type="email"
                name="email"
              />
              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Email</label>
            </div>
            <div className="relative mt-3">
              <Input
                className="border-border bg-background   "
                type="text"
                name="address"
              />
              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Address</label>
            </div>
            <div className="relative mt-3">
              <Input
                className="border-border bg-background   "
                type="text"
                list="ListOptions2"
                name="brand"
                onChange={handleBrand}
              />
              <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Brand</label>
            </div>
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
            {modelList && (
              <>
                <div className="relative mt-3">
                  <Input
                    className="  "
                    type="text" list="ListOptions2" name="model"
                  />
                  <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Model</label>
                </div>
                <datalist id="ListOptions2">
                  {modelList.models.map((item, index) => (
                    <option key={index} value={item.model} />
                  ))}
                </datalist>
              </>
            )}
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
              size='sm'
              className='bg-primary'
            >
              Add
            </Button>
          </div>
        </fetcher.Form>
      </DialogContent>
    </Dialog >
  );
}
