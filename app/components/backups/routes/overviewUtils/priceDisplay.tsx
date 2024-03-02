import { Input } from "~/components/ui/input";


export default function PriceDisplay({ formData, finance, handleChange, modelData, deFees, accessories, licensing }) {

  return (
    <>
      <div className="mt-3">
        <h3 className="text-2xl font-thin">Price</h3>
      </div>

      <hr className="solid dark:text-slate1" />
      <div className="flex flex-wrap justify-between  ">
        <p className="basis-2/4 font-thin mt-2 ">MSRP</p>
        <p className="flex basis-2/4 items-end justify-end font-thin mt-2">
          ${formData.msrp}
        </p>

        {formData.freight > 0 && (
          <>
            <p className="basis-2/4 font-thin mt-3">Freight</p>
            <Input
              className="w-20 h-8 items-end justify-end text-right font-thin mt-2"
              defaultValue={formData.freight}
              placeholder="freight"
              type="text"
              name="freight"
              onChange={handleChange}
            />
          </>
        )}

        {formData.pdi > 0 && (
          <>
            <p className="basis-2/4 font-thin mt-2">PDI</p>
            <Input
              className="w-20 h-8 items-end justify-end text-right font-thin mt-2"
              defaultValue={formData.pdi}
              placeholder="pdi"
              type="text"
              name="pdi"
              onChange={handleChange}
            />
          </>
        )}
        {formData.admin > 0 && (
          <>
            <p className="basis-2/4  mt-2">Admin</p>
            <Input
              className="w-20 h-8 items-end justify-end text-right  mt-2  "
              defaultValue={formData.admin}
              placeholder="admin"
              type="text"
              name="admin"
              onChange={handleChange}
            />
          </>
        )}
        {formData.commodity > 0 && (
          <>
            <p className="basis-2/4 font-thin mt-2">Commodity</p>
            <Input
              className="w-20 h-8 items-end justify-end text-right font-thin mt-2"
              defaultValue={formData.commodity}
              placeholder="commodity"
              type="text"
              name="commodity"
              onChange={handleChange}
            />
          </>
        )}
        <p className="basis-2/4 font-thin mt-2">Accessories</p>
        <p className="flex basis-2/4 items-end justify-end font-thin mt-1">
          <Input
            className="w-20 h-8 items-end justify-end text-right font-thin mt-2"
            defaultValue={accessories}
            placeholder="accessories"
            type="text"
            name="accessories"
            onChange={handleChange}
          />
        </p>
        <p className="basis-2/4 font-thin mt-2">Labour Hours</p>
        <p className="flex basis-2/4 items-end justify-end font-thin mt-2">
          <Input
            className="w-20 h-8 items-end justify-end text-right font-thin mt-2"
            defaultValue={finance.labour}
            placeholder="labour"
            type="text"
            name="labour"
            onChange={handleChange}
          />
        </p>
        <p className="basis-2/4 font-thin mt-2">Licensing</p>
        <Input
          className="w-20 h-8 items-end justify-end text-right font-thin mt-2 "
          defaultValue={licensing}
          placeholder="licensing"
          type="text"
          name="licensing"
          onChange={handleChange}
        />
        {modelData.trailer > 0 && (
          <>
            <p className="basis-2/4 font-thin mt-2 ">Trailer</p>
            <Input
              className="w-20 h-8 items-end justify-end text-right font-thin mt-2 "
              defaultValue={modelData.trailer}
              placeholder="trailer"
              type="text"
              name="trailer"
              onChange={handleChange}
            />
          </>
        )}

        {modelData.painPrem > 0 && (
          <>
            <p className="basis-2/4 font-thin">Paint Premium</p>
            <p className="flex basis-2/4 items-end justify-end font-thin ">
              ${modelData.painPrem}
            </p>
          </>
        )}

      </div>

    </>
  )
}
