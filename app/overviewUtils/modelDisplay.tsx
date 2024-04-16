import { Input } from "~/components/ui"


export default function DisplayModel({ finance, formData, handleChange }) {
  const color = formData.color
  const modelCode = formData.modelCode
  const year = finance.year
  const model = finance.model
  const stockNum = formData.stockNum
  const brand = finance.brand
  return (
    <>
      <div>
        <h3 className="text-2xl ">Model</h3>

      </div>
      <hr className="solid" />
      <div className="flex flex-wrap justify-between">
        <p className="basis-2/4  mt-2 ">Brand</p>
        <p className="mb-0 flex basis-2/4 items-end justify-end pb-0  ">
          {brand}
        </p>
        <p className="basis-2/4  mt-2 ">Model</p>
        <p className="mb-0 flex basis-2/4 items-end justify-end pb-0   text-right ml-auto">
          {model}
        </p>
        {brand !== 'BMW-Motorrad' && (
          <>
            <p className="mb-0 basis-2/4 pb-0  mt-2">Color</p>

            <Input
              className="w-40 h-8 items-end justify-end text-right  mt-2"
              defaultValue={color}
              placeholder="color"
              type="text"
              name="color"
              onChange={handleChange}
            />
          </>
        )}
        {modelCode !== null && (
          <>
            <p className="basis-2/4  mt-2">Model Code</p>
            <p className="flex basis-2/4 items-end justify-end  ">
              {modelCode}
            </p>
          </>
        )}
        {modelCode !== null && (
          <>
            <p className="basis-2/4  mt-2">Year</p>
            <p className="flex basis-2/4 items-end justify-end  ">
              {year}
            </p>
          </>
        )}
        {stockNum !== null && (
          <>
            <p className="basis-2/4  mt-2">Stock Number</p>
            <p className="flex basis-2/4 items-end justify-end  ">
              {stockNum}
            </p>
          </>
        )}
      </div>
    </>
  )

}
