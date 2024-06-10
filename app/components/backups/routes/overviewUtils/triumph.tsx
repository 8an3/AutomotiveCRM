import { useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/index";
import { utilsLoader } from "./actions";
import jsPDF from "jspdf";

export let loader = utilsLoader;

export const ModelPageTriumph = () => {
  const { modelData } = useLoaderData()
  const Click = () => {

    var selectedModelName = ''
    if (modelData.model.toUpperCase().includes('Scrambler 1200')) {
      selectedModelName = 'classic/bonneville-scrambler-1200'
    }
    else if (modelData.model.toUpperCase().includes('Speed 400')) {
      selectedModelName = 'classic/speed-400'
    }
    else if (modelData.model.toUpperCase().includes('Street Triple 765')) {
      selectedModelName = 'roadsters/street-triple-765'
    }
    else if (modelData.model.toUpperCase().includes('Trident')) {
      selectedModelName = 'roadsters/trident'
    }
    else if (modelData.model.toUpperCase().includes('Speed Triple RR')) {
      selectedModelName = 'roadsters/speed-triple-1200-rr'
    }
    else if (modelData.model.toUpperCase().includes('Speed Triple')) {
      selectedModelName = 'roadsters/speed-triple-1200'
    }
    else if (modelData.model.toUpperCase().includes('Street Triple')) {
      selectedModelName = 'roadsters/street-triple'
    }
    else if (modelData.model.toUpperCase().includes('Rocket')) {
      selectedModelName = 'rocket-3/rocket-3'
    }
    else if (modelData.model.toUpperCase().includes('Tiger Sport 660')) {
      selectedModelName = 'adventure/tiger-sport-660'
    }
    else if (modelData.model.toUpperCase().includes('Tiger 850 Sport')) {
      selectedModelName = 'adventure/tiger-850-sport'
    }
    else if (modelData.model.toUpperCase().includes('Tiger 900 GT')) {
      selectedModelName = 'adventure/tiger-900-gt'
    }
    else if (modelData.model.toUpperCase().includes('Tiger 900 Rally')) {
      selectedModelName = 'adventure/tiger-900-rally'
    }
    else if (modelData.model.toUpperCase().includes('Tiger 1200 GT')) {
      selectedModelName = 'adventure/tiger-1200-gt'
    }
    else if (modelData.model.toUpperCase().includes('Tiger 1200 Rally')) {
      selectedModelName = 'adventure/tiger-1200-rally'
    }
    else if (modelData.model.toUpperCase().includes('Thruxton RS')) {
      selectedModelName = 'classic/thruxton-rs'
    }
    else if (modelData.model.toUpperCase().includes('Bonneville Bobber')) {
      selectedModelName = 'classic/bonneville-bobber'
    }
    else if (modelData.model.toUpperCase().includes('Bonneville Speedmaster')) {
      selectedModelName = 'classic/bonneville-speedmaster'
    }
    else if (modelData.model.toUpperCase().includes('Bonneville Speed Twin 1200')) {
      selectedModelName = 'classic/bonneville-speed-twin-1200'
    }
    else if (modelData.model.toUpperCase().includes('Bonneville T120')) {
      selectedModelName = 'classic/bonneville-t120'
    }
    else if (modelData.model.toUpperCase().includes('Bonneville Scrambler 900')) {
      selectedModelName = 'classic/bonneville-scrambler-900'
    }
    else if (modelData.model.toUpperCase().includes('Bonneville T100')) {
      selectedModelName = 'classic/bonneville-t100'
    }
    else if (modelData.model.toUpperCase().includes('Bonneville Speed Twin 900')) {
      selectedModelName = 'classic/bonneville-speed-twin-900'
    }
    else if (modelData.model.toUpperCase().includes('Bonneville Scrambler 400 X')) {
      selectedModelName = 'motorcycles/classic/scrambler-400-x'
    }

    else {
      selectedModelName = ''
    }
    var baseUrl =
      'https://www.triumph-motorcycles.ca/motorcycles/'
    var modelUrl = baseUrl + selectedModelName
    window.open(modelUrl, '_blank')
  }
  return (
    <Button onClick={Click} className="h-5 border border-slate12  cursor-pointer hover:text-primary p-5 hover:border-primary hover:border" type="submit" content="update">
      Model Page
    </Button>
  )
}
