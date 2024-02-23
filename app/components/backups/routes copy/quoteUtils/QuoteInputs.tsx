import { Input, Label, Separator, TextArea } from "@/components/ui/index"

export function QuoteTop() {
    return (
        <>
            <div className="mt-3"><h3 className="text-2xl font-thin">CLIENT INFORMATION</h3></div><Separator />
            <div className="grid grid-cols-2 gap-2 mt-1 " >
                <div className="grid gap-1 mr-2 font-thin">
                    <Label className="flex font-thin mt-1 " htmlFor="area">Name</Label>
                    <Input className="  mt-1 " placeholder="Name" type="text" name="name" />
                </div>
                <div className="grid gap-1  font-thin">
                    <Label className="flex font-thin justify-end items-end mt-1 " htmlFor="area">Phone</Label>
                    <Input className="text-right mt-1 " placeholder="Phone" name="phone" type="number" />
                </div>
                <div className="grid gap-1 mr-2 font-thin">
                    <Label className="flex font-thin mt-1 " htmlFor="area">Email</Label>
                    <Input className="grid" placeholder="Email" type="email" name="email" />
                </div>
                <div className="grid gap-1  font-thin">
                    <Label className="flex font-thin justify-end items-end mt-1 " htmlFor="area">Address</Label>
                    <Input className="text-right mt-1 " placeholder="Address" name="address" />
                </div>
            </div>
        </>
    )
}

export function QuoteBot() {
    return (
        <>

            <div className="grid grid-cols-2 gap-2 mt-1 " >
                <div className="grid gap-1 mr-2 font-thin">
                    <Label className="flex font-thin mt-1 " htmlFor="area">Year</Label>
                    <Input className="grid" placeholder="Year" name="year" type="number" />
                </div>
                <div className="grid gap-1  font-thin">
                    <Label className="flex font-thin justify-end items-end mt-1 " htmlFor="area">Stock Number</Label>
                    <Input className="text-right mt-1 " placeholder="Stock Number" name="stockNum" />
                </div>

            </div>
            <div className="grid gap-2 mt-1">
                <Label className="font-thin " htmlFor="area">Options</Label>
                <TextArea placeholder="Options" name="options" className="mt-1" />
            </div>
        </>
    )
}

/**  
 * <div className="grid mt-1 mr-2 font-thin">
                    <Label className="flex font-thin mt-1" htmlFor="area">Labour (hours)</Label>
                    <Input className="grid mt-1" placeholder="Labour" name="labour" type="number" />
                </div>
                <div className="grid font-thin mt-1 ">
                    <Label className="flex font-thin justify-end items-end  " htmlFor="area">Accessories (total $)</Label>
                    <Input className="text-right mt-1 " placeholder="Accessories" name="accessories" type="number" />
                </div>
                 */