import { ScrollArea } from "~/components/ui/scroll-area"
import Calendar from 'react-calendar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "~/components/ui/select"
import { useState } from "react";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function PickUpDateClientCard({ data }) {
    let [value, onChange] = useState<Value>(new Date());

    {
        data && (
            [value, onChange] = useState<Value>(data.pickUpDats)
        )
    }
    return (
        <>
            <div>

                <Calendar onChange={onChange} value={value} calendarType="gregory" />
            </div>
            <input type="hidden" value={value} name="pickUpDate" />

            <Select name="pickUpTime" defaultValue={data.pickUpTime}>
                <SelectTrigger className="w-2/3 mx-auto mt-2 text-center" >
                    <SelectValue placeholder="Time of day" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-black dark:text-[#fafafa]">
                    <ScrollArea className="h-[300px] w-[200px] rounded-md  p-4">
                        <SelectGroup>
                            <SelectLabel>Time of day</SelectLabel>
                            <SelectItem value="9:00">9:00</SelectItem>
                            <SelectItem value="9:30">9:30</SelectItem>
                            <SelectItem value="10:00">10:00</SelectItem>
                            <SelectItem value="10:30">10:30</SelectItem>
                            <SelectItem value="11:00">11:00</SelectItem>
                            <SelectItem value="11:30">11:30</SelectItem>
                            <SelectItem value="12:00">12:00</SelectItem>
                            <SelectItem value="12:30">12:30</SelectItem>
                            <SelectItem value="1:00">1:00</SelectItem>
                            <SelectItem value="1:30">1:30</SelectItem>
                            <SelectItem value="2:00">2:00</SelectItem>
                            <SelectItem value="2:30">2:30</SelectItem>
                            <SelectItem value="3:00">3:00</SelectItem>
                            <SelectItem value="3:30">3:30</SelectItem>
                            <SelectItem value="4:00">4:00</SelectItem>
                            <SelectItem value="4:30">4:30</SelectItem>
                            <SelectItem value="5:00">5:00</SelectItem>
                            <SelectItem value="5:30">5:30</SelectItem>
                            <SelectItem value="6:00">6:00</SelectItem>
                        </SelectGroup>
                    </ScrollArea>
                </SelectContent>
            </Select>
        </>
    )
}


export function PickUpDateContactInfo() {
    let [value, onChange] = useState<Value>(new Date());


    return (
        <>
            <div>

                <Calendar onChange={onChange} value={value} calendarType="gregory" />
            </div>
            <input type="hidden" value={value} name="pickUpDate" />

            <Select name="pickUpTime" >
                <SelectTrigger className="w-2/3 mx-auto mt-2 text-center" >
                    <SelectValue placeholder="Time of day" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-black dark:text-[#fafafa]">
                    <ScrollArea className="h-[300px] w-[200px] rounded-md  p-4">
                        <SelectGroup>
                            <SelectLabel>Time of day</SelectLabel>
                            <SelectItem value="9:00">9:00</SelectItem>
                            <SelectItem value="9:30">9:30</SelectItem>
                            <SelectItem value="10:00">10:00</SelectItem>
                            <SelectItem value="10:30">10:30</SelectItem>
                            <SelectItem value="11:00">11:00</SelectItem>
                            <SelectItem value="11:30">11:30</SelectItem>
                            <SelectItem value="12:00">12:00</SelectItem>
                            <SelectItem value="12:30">12:30</SelectItem>
                            <SelectItem value="1:00">1:00</SelectItem>
                            <SelectItem value="1:30">1:30</SelectItem>
                            <SelectItem value="2:00">2:00</SelectItem>
                            <SelectItem value="2:30">2:30</SelectItem>
                            <SelectItem value="3:00">3:00</SelectItem>
                            <SelectItem value="3:30">3:30</SelectItem>
                            <SelectItem value="4:00">4:00</SelectItem>
                            <SelectItem value="4:30">4:30</SelectItem>
                            <SelectItem value="5:00">5:00</SelectItem>
                            <SelectItem value="5:30">5:30</SelectItem>
                            <SelectItem value="6:00">6:00</SelectItem>
                        </SelectGroup>
                    </ScrollArea>
                </SelectContent>
            </Select>
        </>
    )
}
