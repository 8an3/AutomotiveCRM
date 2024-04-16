import { useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/index";
import { utilsLoader } from "./actions";
import jsPDF from "jspdf";

export let loader = utilsLoader;

// -- CanAm ATV
export const ModelPageBMWMoto = (modelName) => {
  const { modelData } = useLoaderData();

  const Click = () => {
    //console.log("Button clicked!");
    // Perform additional actions or logic here
    var selectedModelName = "";

    if (modelData.model.includes("M 1000 R")) {
      selectedModelName = "M/m1000r.html";
    } else if (modelData.model.includes("M 1000 RR")) {
      selectedModelName = "M/m1000rr.html";
    } else if (modelData.model.includes("S 1000 R")) {
      selectedModelName = "roadster/s1000r.html";
    } else if (modelData.model.includes("S 1000 RR")) {
      selectedModelName = "sport/s1000rr.html";
    } else if (modelData.model.includes("r 1250 RS")) {
      selectedModelName = "sport/r1250rs.html";
    } else if (modelData.model.includes("S 1000 XR")) {
      selectedModelName = "sport/s1000xr.html";
    } else if (modelData.model.includes("F 900 XR")) {
      selectedModelName = "M/f900xr.html";
    } else if (modelData.model.includes("R 1250 R")) {
      selectedModelName = "roadster/r1250r.html";
    } else if (modelData.model.includes("R 1250 RT")) {
      selectedModelName = "tour/r1250rt.html";
    } else if (modelData.model.includes("K 1600 B")) {
      selectedModelName = "tour/k1600b.html";
    } else if (modelData.model.includes("K 1600 GA")) {
      selectedModelName = "tour/k1600-grand-america.html";
    } else if (modelData.model.includes("K 1600 GT")) {
      selectedModelName = "tour/k1600gt.html";
    } else if (modelData.model.includes("K 1600 GTL")) {
      selectedModelName = "tour/k1600gtl.html";
    } else if (modelData.model.includes("F 900 R")) {
      selectedModelName = "roadster/f900r.html";
    } else if (modelData.model.includes("G 310 R")) {
      selectedModelName = "roadster/g310r.html";
    } else if (modelData.model.includes("R 18")) {
      selectedModelName = "heritage/r18.html";
    } else if (modelData.model.includes("R 18 Classic")) {
      selectedModelName = "heritage/r18-classic.html";
    } else if (modelData.model.includes("R 18 B")) {
      selectedModelName = "heritage/r18-b.html";
    } else if (modelData.model.includes("R 18 Transcontinental")) {
      selectedModelName = "heritage/r18-transcontinental.html";
    } else if (modelData.model.includes("R 18 Roctane")) {
      selectedModelName = "heritage/r18-roctane.html";
    } else if (modelData.model.includes("R nine T")) {
      selectedModelName = "heritage/r12-ninet.html";
    } else if (modelData.model.includes("F 750 GS")) {
      selectedModelName = "adventure/f750gs.html";
    } else if (modelData.model.includes("F 850 GS")) {
      selectedModelName = "adventure/f850gs.html";
    } else if (modelData.model.includes("F 850 GSA")) {
      selectedModelName = "adventure/f850gsa.html";
    } else if (modelData.model.includes("R 1250 GS")) {
      selectedModelName = "adventure/r1250gs.html";
    } else if (modelData.model.includes("R 1250 GSA")) {
      selectedModelName = "adventure/r1250gsa.html";
    } else if (modelData.model.includes("R 1250 GS")) {
      selectedModelName = "adventure/r1250gs.html";
    } else if (modelData.model.includes("G 310 GS")) {
      selectedModelName = "adventure/g310gs.html";
    } else if (modelData.model.includes("CE 02")) {
      selectedModelName = "urban_mobility/ce02.html";
    } else if (modelData.model.includes("C 400 GT")) {
      selectedModelName = "urban_mobility/c400gt.html";
    } else if (modelData.model.includes("CE 04")) {
      selectedModelName = "urban_mobility/ce04.html";
      selectedModelName = "sport/s1000rr.html";
    } else {
      selectedModelName = "modeloverview.html";
    }
    var baseUrl = "https://www.bmw-motorrad.ca/en/models/";
    var modelUrl = baseUrl + selectedModelName;
    window.open(modelUrl, "_blank");
  };
  return (
    <Button
      onClick={Click}
      className="h-5 w-2/3"
      type="submit"
      content="update"
    >
      Model Page
    </Button>
  );
};

export const PrintSpecBMWMoto = () => {
  const Click1 = () => {
    let url = "https://www.bmw-motorrad.ca/en/experience/2023-spec-sheets.html";
    console.log("button");
    window.open(url, "_blank");
  };
  return (
    <Button
      onClick={Click1}
      className=" w-2/3  border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border"
      type="submit"
      content="update"
    >
      Print Spec
    </Button>
  );
};
