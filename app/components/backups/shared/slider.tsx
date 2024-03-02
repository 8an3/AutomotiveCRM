import { DataFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getSession } from "~/utils/pref.server";

export async function loader({ request, params }: DataFunctionArgs) {
    const session = await getSession(request.headers.get("Cookie"))
    const sliderWidth = session.get('sliderWidth')
    console.log(sliderWidth, 'sliderWidth in loader')
    return json({ ok: true, sliderWidth })
}

export default function WidthSlider() {

    const { sliderWidth } = useLoaderData()

    const [outletSize, setOutletSize] = useState(sliderWidth);
    console.log(sliderWidth, outletSize, 'sliderWidth in function')


    const handleSliderChange = (event) => {
        const newSize = `${event.target.value}%`;
        setOutletSize(newSize);
    };

    return (
        <>
            <div className="flex justify-center mt-[50px]">
                <input
                    name="sliderWidth"
                    type="range"
                    min="0"
                    max="100"
                    value={parseInt(outletSize)}
                    onChange={handleSliderChange}
                    className="w-1/2 appearance-none h-3 rounded-full bg-gray-300 outline-none"
                    style={{
                        background: ``,
                    }}
                />
                <style>
                    {`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: 16px;
              height: 16px;
              background-color: black;
              border-radius: 50%;
              cursor: pointer;
              transform: rotate(45deg);
              border: none;
            }

            input[type="range"]::-moz-range-thumb {
              appearance: none;
              width: 16px;
              height: 16px;
              background-color: #4F46E5;
              border-radius: 50%;
              cursor: pointer;
              transform: rotate(45deg);
              border: none;
            }

            input[type="range"]::-ms-thumb {
              appearance: none;
              width: 16px;
              height: 16px;
              background-color: #4F46E5;
              border-radius: 50%;
              cursor: pointer;
              transform: rotate(45deg);
              border: none;
            }
          `}
                </style>


            </div>

        </>
    );
}
