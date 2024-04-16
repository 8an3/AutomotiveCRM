/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useFetcher, useLoaderData, useParams, } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Overview } from './_authorized.overview.$brandId'
import AccordionDemo from '~/other/AccordionDemo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "../other/accordion"
import NotificationSystem from "~/routes/__authorized/dealer/notifications";

export function OverviewFinanceId({ outletSize }) {
  return (
    <>
      <Overview outletSize={outletSize} />
    </>
  )
}


export default function Quote() {

  const { sliderWidth } = useLoaderData()

  const [outletSize, setOutletSize] = useState(sliderWidth);

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
          min="35"
          max="100"
          value={parseInt(outletSize)}
          onChange={handleSliderChange}
          className="w-1/2 appearance-none h-3 rounded-full bg-gray-300 outline-none shadow-sm "
          style={{
            background: `linear-gradient(to right, slate10 ${parseInt(outletSize)}%, black ${parseInt(outletSize)}%)`,
          }}
        />
        <style>
          {`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            display: block;
            width: 20px;
            height: 20px;
            background-color: black;

            cursor: pointer;
            transform: rotate(45deg);
            border: none;
            box-shadow: 0 2px 10px var(--black-a7);
            border-radius: 10px;
            transition-colors: 0.2s;
            focus-visible: outline-none;
            focus-visible: ring-1;
            border: bg-gray-300;
          }

          input[type="range"]::-moz-range-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            background-color: #0284c7;
            border-radius: 50%;
            cursor: pointer;
            transform: rotate(45deg);
            border: none;
          }

          input[type="range"]::-ms-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            background-color: #e31746;
            border-radius: 50%;
            cursor: pointer;
            transform: rotate(45deg);
            border: none;
          }
        `}
        </style>

      </div>
      <div className="flex min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full overflow-hidden rounded-lg">
          <div className="md:flex my-auto mx-auto">
            <div
              className="my-auto mx-auto"
              style={{ width: outletSize }}
            >
              <div className="my-auto mx-auto ">
                <OverviewFinanceId outletSize={outletSize} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
