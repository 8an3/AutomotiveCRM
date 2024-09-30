import {
  json,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node";
import { getSession, commitSession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import {
  Form,
  Link,
  useLoaderData,
  useLocation,
  Await,
  useFetcher,
  useSubmit,
  useNavigate,
  useActionData,
} from "@remix-run/react";
import { prisma } from "~/libs";
import { useEffect, useRef, useState } from "react";
import { Button, DropdownMenuItem, DropdownMenuShortcut } from "~/components";
import { Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
export async function loader({ request, params }: LoaderFunction) {
  let q = new URL(request.url).searchParams.get("q");
  if (!q) return [];
  q = q.toLowerCase();
  let result;
  // console.log(q, 'q')
  const getit = await prisma.clientfile.findMany({});
  //console.log(getit, 'getit')
  // const searchResults = await getit//searchCases(q)
  result = getit.filter(
    (result) =>
      result.email?.toLowerCase().includes(q) ||
      result.phone?.includes(q) ||
      result.firstName?.toLowerCase().includes(q) ||
      result.lastName?.toLowerCase().includes(q)
  );
  //console.log(getit, 'getit', result, 'results',)
  return result;
}

export default function SearchFunction() {
  const location = useLocation();
  let [show, setShow] = useState(false);
  let ref = useRef();
  const fetcher = useFetcher();
  let search = useFetcher();
  const submit = useSubmit();
  const data = useActionData<typeof action>();
  useEffect(() => {
    if (show) {
      ref.current.select();
    }
  }, [show]);

  useEffect(() => {
    setShow(false);
  }, [location]);

  // bind command + k
  useEffect(() => {
    let listener = (event) => {
      // if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      if (event.key === 'F3') {
        event.preventDefault();
        setShow(true);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const [dropTable, setDropTable] = useState(false);
  const [finances, setFinances] = useState([]);

  const selectedCustomer = async (email) => {
    console.log("selected search", email);
    try {
      const response = await fetch(`/dealer/api/searchFinance/${email}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const finance = await response.json();
      console.log("finance", finance);
      setFinances(finance);
    } catch (error) {
      console.error("Error fetching finance data:", error);
    }
  };

  const handleMouseEnter = (email) => () => {
    selectedCustomer(email);
  };

  const [open, setOpen] = useState(false);
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <>
              <Button
                variant="ghost"
                size="icon"
                className=" fixed right-[25px] top-[15px]  z-50 "
                onClick={(e) => {
                  e.preventDefault();
                  setShow(true);
                }}
              >
                <Search className="text-foreground" />
              </Button>
            </>
          </TooltipTrigger>
          <TooltipContent>
            <p>Customer Search</p>
            <p>F3 - Open search</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div
        onClick={() => {
          setShow(false);
        }}
        hidden={!show}
        className="bg-background/80"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vw",
          margin: "auto",
          //   background: 'hsla(0, 100%, 100%, 0.9)',
          zIndex: 95,
          overflow: "hidden",
        }}
      >
        <div
          className="fixed left-[50%] top-[50%] translate-x-[-50%]  translate-y-[-50%] border border-border bg-background text-foreground"
          style={{
            //   background: 'white',
            width: 600,
            maxHeight: "500px",
            height: "500px",
            // overflow: 'auto',
            // margin: '20px auto',
            // border: 'solid 1px #ccc',
            borderRadius: 10,
            // boxShadow: '0 0 10px #ccc',
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setShow(false);
            }
          }}
        >
          <search.Form method="get" action="/dealer/search">
            <input
              ref={ref}
              placeholder="Search"
              type="search"
              name="q"
              autoFocus
              onKeyDown={(event) => {
                if (
                  event.key === "Escape" &&
                  event.currentTarget.value === ""
                ) {
                  setShow(false);
                } else {
                  event.stopPropagation();
                }
              }}
              onChange={(event) => {
                search.submit(event.currentTarget.form);
              }}
              className="rounded-t-[10px] border border-border bg-background text-foreground"
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                // fontSize: '1.5em',
                position: "sticky",
                top: 0,
                //    border: 'none',
                borderBottom: "solid 1px #262626",
                outline: "none",
              }}
            />
          </search.Form>
          {search.data &&
            search.data.map((result, index) => (
              <>
                <Table className="mx-auto w-[95%]">
                  <TableBody className="mx-auto mt-3">
                    <TableRow
                      key={index}
                      className="mx-auto my-3 rounded-[6px] border-b  border-border"
                    >
                      <TableCell className="rounded-l-[8px] text-center text-lg text-foreground">
                        {capitalizeFirstLetter(result.firstName)}{" "}
                        {capitalizeFirstLetter(result.lastName)}
                      </TableCell>
                      <TableCell className="text-center text-lg text-muted-foreground">
                        {result.phone}
                      </TableCell>
                      <TableCell className="text-center text-lg text-muted-foreground">
                        {result.email}
                      </TableCell>
                      <TableCell className="text-center text-lg text-muted-foreground">
                        <Link
                          to={`/dealer/sales/customer/${result.id}/profile`}
                          className=" "
                          key={index}
                        >
                          <Button
                            variant="outline"
                            className="hover:foreground/40 bg-primary  text-foreground hover:bg-background/40"
                          >
                            Profile
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell className="rounded-r-[8px] text-center text-lg text-muted-foreground">
                        <Button
                          onClick={() => {
                            selectedCustomer(result.email);
                            setOpen(true);
                          }}
                          variant="outline"
                        >
                          Deals
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Table className="mx-auto w-[95%]">
                  <TableBody className="mx-auto mt-3  border-b border-border">
                    {open === true && (
                      <>
                        {finances &&
                          finances.map((finance) => (
                            <>
                              <TableRow
                                key={finance.id}
                                className="mx-auto w-full rounded-[8px] hover:rounded-[6px] border-border"
                              >
                                <Link
                                  to={`/dealer/sales/customer/${result.id}/${finance.id}`}
                                  className="w-full "
                                >
                                  {finance.year && (
                                    <TableCell className="text-center text-lg text-muted-foreground rounded-l-[8px]">
                                      {finance.year}
                                    </TableCell>
                                  )}
                                  <TableCell className="w-[150px] text-center text-lg text-muted-foreground">
                                    {finance.brand}
                                  </TableCell>
                                  <TableCell className="w-[350px] text-center text-lg text-foreground rounded-r-[8px]">
                                    {finance.model}
                                  </TableCell>
                                  {finance.stockNum && (
                                    <TableCell className="text-center text-lg text-muted-foreground">
                                      {finance.stockNum}
                                    </TableCell>
                                  )}
                                </Link>
                              </TableRow>
                            </>
                          ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </>
            ))}
        </div>
      </div>
    </div>
  );
}

export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData());
  let formData = financeFormSchema.parse(formPayload);
  const intent = formData.intent;
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email");

  if (intent === "getFinances") {
    const finances = await prisma.finance.findMany({
      where: { email: formData.email },
    });
    console.log(finances, "finances");
    return json({ finances });
  }
  return null;
}

/**                 <Link
                    to={`/dealer/customer/${result.id}/check`}
                    className='mb-5 justify-start'
                    key={index}
                  >
                    <Button
                      variant='ghost'
                      className='w-[99%] hover:bg-background/40 rounded-[6px] my-2 h-[75px] hover:text-black'
                    >
                      <div>
                        <p className="text-2xl text-left text-foreground"> {capitalizeFirstLetter(result.firstName)} {capitalizeFirstLetter(result.lastName)}</p>
                        <p className='text-muted-foreground text-left '>{result.phone}</p>
                        <p className='text-muted-foreground text-left '>{result.email}</p>
                      </div>
                    </Button>
                  </Link> */
