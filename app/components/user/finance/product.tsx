import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Form, useFetcher, useFetchers, useLoaderData, useSubmit } from "@remix-run/react";
import { flushSync } from "react-dom";
import { Plus } from "lucide-react";
import { prisma } from "~/libs/prisma.server";
import { INTENTS, type RenderedItem, ItemMutationFields, ItemMutation, CONTENT_TYPES } from "./types";
import { EditableText } from "./components";
import { Button } from "~/components/ui";
import { SaveButton, CancelButton } from "./components";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"
import { Trash } from "lucide-react";


export function Board({ name, id, onUpdate, product, }) {
  let { financeProducts } = useLoaderData();
  const [productSec, setProductSec] = useState(product);
  const [providors, setProvidors] = useState([]);

  useEffect(() => {
    async function GetProduct() {
      const theProduct = getProductData(id)
      setProductSec(theProduct)
    }
    GetProduct()
  }, [id]);


  const addProvidor = () => {
    setProvidors([
      ...providors,
      { id: Date.now(), name: "", financePrices: [] },
    ]);
  };

  if (product) {
    setProvidors(product.financeProvidors)
  }

  const updateProvidor = (index, newProvidor) => {
    const updatedProvidors = [...providors];
    updatedProvidors[index] = newProvidor;
    setProvidors(updatedProvidors);
    onUpdate({ ...product, financeProvidors: updatedProvidors });
  };

  // scroll right when new columns are added
  let scrollContainerRef = useRef<HTMLDivElement>(null);
  function scrollRight() {
    invariant(scrollContainerRef.current, "no scroll container");
    scrollContainerRef.current.scrollLeft =
      scrollContainerRef.current.scrollWidth;
  }
  return (
    <div
      className=" grid grid-cols-1 min-h-0 mt-[50px] mx-auto rounded-[6px] border-border bg-muted-background"
      ref={scrollContainerRef}
    >
      <h1>
        <EditableText
          value={name}
          fieldName="name"
          inputClassName="mx-2 my-4   border border-border rounded-lg py-1 px-2 text-foreground"
          buttonClassName="mx-2 my-4   block rounded-lg text-left border border-transparent py-1 px-2 text-slate-800"
          buttonLabel={`Edit product "${name}" name`}
          inputLabel="Edit product name"
        >
          <input type="hidden" name="intent" value={INTENTS.updateProductName} />
          <input type="hidden" name="id" value={id} />
        </EditableText>
      </h1>

      <div className="flex flex-grow min-h-0  items-start gap-4 px-8 ">
        {providors.map((prov, index) => {
          return (
            <Providor
              key={prov.id}
              name={prov.name}
              providorId={prov.id}
              prices={prov.financePrices}
              onUpdate={(newProvidor) => updateProvidor(index, newProvidor)}
              providor={providor}

            />
          );
        })}

        <NewProvidor
          productId={id}
          onAdd={scrollRight}
          editInitially={false}
        />

        {/* trolling you to add some extra margin to the right of the container with a whole dang div */}
        <div data-lol className="w-8 h-1 flex-shrink-0" />
      </div>
    </div>
  );
}



function Providor({ providor, name, providorId, prices, onUpdate }) {
  let submit = useSubmit();
  const [pricesList, setPricesList] = useState(providor.financePrices);

  const addPrice = () => {
    setPricesList([...prices, { id: Date.now(), packageName: "", packagePrice: 0 }]);
  };

  const updatePrice = (index, newPrice) => {
    const updatedPrices = [...prices];
    updatedPrices[index] = newPrice;
    setPricesList(updatedPrices);
    onUpdate({ ...providor, financePrices: updatedPrices });
  };

  let listRef = useRef<HTMLUListElement>(null);
  let [edit, setEdit] = useState(false);

  function scrollList() {
    invariant(listRef.current);
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }
  return (
    <div className='flex'>
      <div className="p-2">
        <EditableText
          fieldName="name"
          value={name}
          inputLabel="Edit providor name"
          buttonLabel={`Edit providor "${name}" name`}
          inputClassName="border border-slate-400 rounded-lg  text-foreground"
          buttonClassName="block rounded-lg text-left w-full border border-transparent py-1 px-2 text-foreground"
        >
          <input type="hidden" name="intent" value={INTENTS.updateProvidor} />
          <input type="hidden" name="providorId" value={providorId} />
        </EditableText>
      </div>
      <ul ref={listRef} className="flex-grow overflow-auto min-h-[2px]">
        {pricesList.map((item, index) => (
          <Price
            key={item.id}
            packageName={item.packageName}
            packagePrice={item.packagePrice}
            id={item.id}
            order={item.order}
            FinanceProvidorId={providorId}
            previousOrder={prices[index - 1] ? prices[index - 1].order : 0}
            nextOrder={
              prices[index + 1] ? prices[index + 1].order : item.order + 1
            }
            onUpdate={(newPrice) => updatePrice(index, newPrice)}
            price={price}

          />
        ))}
      </ul>
      {edit ? (
        <NewPrice
          providorId={providorId}
          nextOrder={prices.length === 0 ? 1 : prices[prices.length - 1].order + 1}
          onAddPrice={() => scrollList()}
          onComplete={() => setEdit(false)}
        />
      ) : (
        <div className="p-2 pt-1">
          <Button
            variant='outline'
            type="button"
            onClick={() => {
              flushSync(() => {
                setEdit(true);
              });
              scrollList();
            }}
            className="flex items-center gap-2 rounded-lg text-center p-2 text-foreground hover:bg-slate-200 focus:bg-slate-200"
          >
            <Plus color="#fcfcfc" /> Add a price
          </Button>
        </div>
      )}
    </div>
  )
}



interface CardProps {
  packageName: string;
  packagePrice: number | null;
  id: string;
  FinanceProvidorId: string;
  order: number;
  nextOrder: number;
  previousOrder: number;
}

export function Price({
  packageName,
  packagePrice,
  id,
  FinanceProvidorId,
  order,
  nextOrder,
  previousOrder,
  price,
}: CardProps) {
  let submit = useSubmit();
  let deleteFetcher = useFetcher();

  let [acceptDrop, setAcceptDrop] = useState<"none" | "top" | "bottom">("none");

  return deleteFetcher.state !== "idle" ? null : (
    <li >
      <HoverCard>
        <HoverCardTrigger asChild>
          <div
            draggable
            className="text-left bg-background text-foreground shadow shadow-muted-background border border-border text-sm rounded-[6px] w-full py-1 px-2 relative"
          >
            <div>
              <h3 className='text-left'>{packageName}</h3>
              <div className="mt-2 text-left">{packagePrice || <>&nbsp;</>}</div>
            </div>

          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-[100px] h-[100px] bg-background border border-border">
          <deleteFetcher.Form method="post">
            <input type="hidden" name="intent" value={INTENTS.deletePrice} />
            <input type="hidden" name="priceId" value={id} />
            <Button
              size='icon'
              variant='ghost'
              aria-label="Delete card"
              className="absolute mx-auto my-auto bg-background hover:text-brand-red"
              type="submit"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <Trash color="#fcfcfc" />
            </Button>
          </deleteFetcher.Form>
        </HoverCardContent>
      </HoverCard>
    </li>
  );
}

function NewPrice({ providorId, onAddPrice, onComplete, nextOrder }) {
  let textAreaRef = useRef<HTMLTextAreaElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);
  let submit = useSubmit();
  let fetcher = useFetcher();

  return (
    <Form
      method="post"
      className="flex flex-col gap-2.5 p-2 pt-1"
      onSubmit={(event) => {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let id = crypto.randomUUID();
        formData.set(ItemMutationFields.id.name, id);

        submit(formData, {
          method: "post",
          fetcherKey: `price:${id}`,
          navigate: false,
          unstable_flushSync: true,
        });

        invariant(textAreaRef.current);
        textAreaRef.current.value = "";
        onAddPrice();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onComplete();
        }
      }}
    >
      <input type="hidden" name="intent" value={INTENTS.createItem} />
      <input
        type="hidden"
        name={ItemMutationFields.providorId.name}
        value={providorId}
      />
      <input
        type="hidden"
        name={ItemMutationFields.order.name}
        value={nextOrder}
      />
      <input
        autoFocus
        required
        ref={textAreaRef}
        name={ItemMutationFields.packageName.name}
        placeholder="Enter a title for this card"
        className="outline-none shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 resize-none placeholder:text-sm placeholder:text-slate-500 h-14"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            invariant(buttonRef.current, "expected button ref");
            buttonRef.current.click();
          }
          if (event.key === "Escape") {
            onComplete();
          }
        }}
        onChange={(event) => {
          let el = event.currentTarget;
          el.style.height = el.scrollHeight + "px";
        }}
      />
      <input
        autoFocus
        required
        ref={textAreaRef}
        name={ItemMutationFields.packagePrice.name}
        placeholder="Enter a title for this card"
        className="outline-none shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 resize-none placeholder:text-sm placeholder:text-slate-500 h-14"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            invariant(buttonRef.current, "expected button ref");
            buttonRef.current.click();
          }
          if (event.key === "Escape") {
            onComplete();
          }
        }}
        onChange={(event) => {
          let el = event.currentTarget;
          el.style.height = el.scrollHeight + "px";
        }}
      />
      <div className="flex justify-between">
        <SaveButton ref={buttonRef}>Save Card</SaveButton>
        <CancelButton onClick={onComplete}>Cancel</CancelButton>
      </div>
    </Form>
  )
}

function NewProvidor({ productId, onAdd, editInitially }) {
  let [editing, setEditing] = useState(editInitially);
  let inputRef = useRef<HTMLInputElement>(null);
  let submit = useSubmit();

  return (
    <div className='grid grid-cols-1'>
      {editing ? (
        <Form
          method="post"
          navigate={false}
          className="p-2 flex-shrink-0 flex flex-col gap-3 overflow-hidden max-h-full w-[250px] border rounded-[6px] shadow bg-background"
          onSubmit={(event) => {
            event.preventDefault();
            let formData = new FormData(event.currentTarget);
            formData.set("id", crypto.randomUUID());
            submit(formData, {
              navigate: false,
              method: "post",
              unstable_flushSync: true,
            });
            onAdd();
            invariant(inputRef.current, "missing input ref");
            inputRef.current.value = "";
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setEditing(false);
            }
          }}
        >
          <input type="hidden" name="intent" value={INTENTS.createProvidor} />
          <input type="hidden" name="productId" value={productId} />
          <input
            autoFocus
            required
            ref={inputRef}
            type="text"
            name="name"
            className="border border-border bg-background w-full rounded-lg py-1 px-2 text-foreground"
          />
          <div className="flex justify-between">
            <SaveButton>Save Providor</SaveButton>
            <CancelButton onClick={() => setEditing(false)}>Cancel</CancelButton>
          </div>
        </Form>
      ) : (
        <Button
          onClick={() => {
            flushSync(() => {
              setEditing(true);
            });
            onAdd();
          }}
          size='icon'
          variant='outline'
          aria-label="Add new column"
          className="flex-shrink-0 flex justify-center  bg-primary hover:bg-white bg-opacity-10 hover:bg-opacity-5 rounded-[6px]"
        >
          <Plus color="#fcfcfc" />
        </Button>
      )}
    </div>
  )
}
//FinanceProduct
//FinanceProvidor
//FinancePrice
export function deletePrice(id) {
  return prisma.financePrice.delete({ where: { id } })
}

export async function getProductData(productId) {
  const product = await prisma.financeProduct.findUnique({
    where: { id: productId },
    include: {
      financeProvidor: true,
      financePrice: true,
    }
  })
  return product
}

export async function updateProductName(productId, name) {
  return prisma.financeProduct.update({
    where: { id: productId },
    data: { name }
  })
}

export function upsertItem(
  mutation: ItemMutation & { financeProductId: string }

) {
  return prisma.item.upsert({
    where: {
      id: mutation.id,
    },
    create: {
      ...mutation,
      financeProductId: mutation.financeProductId,
    },
    update: {
      ...mutation,
      financeProductId: mutation.financeProductId,
    },
  });
}

export async function updateProvidorName(id, name) {
  return prisma.financeProvidor.update({
    where: { id },
    data: { name }
  })
}
export async function createProvidor(financeProductId, name) {
  let providorCount = await prisma.financeProvidor.count({
    where: { financeProductId },
  });
  return prisma.financeProvidor.create({
    data: {
      financeProductId,
      name,
      order: providorCount + 1
    }
  })
}

export async function deleteProduct(productId) {
  return prisma.financeProduct.delete({
    where: { id: productId }
  })
}

export async function createProduct(name) {
  const product = await prisma.financeProduct.create({
    data: {
      name,
      financeProvidor: { create: { name: 'Providor' } },
      financePrice: { create: { packageName: 'Package Name', packagePrice: 1, } }
    }
  })
  return product
}

export async function getHomeData() {
  const product = await prisma.financeProduct.findMany({
    include: {
      financeProvidor: true,
      financePrice: true,
    }
  })
  return product
}
