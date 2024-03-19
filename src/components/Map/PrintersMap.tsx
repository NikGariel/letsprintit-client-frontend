import React, { useEffect, useRef, useState } from "react";
import { Map, Placemark } from "@pbe/react-yandex-maps";
import { BottomSheet } from "react-spring-bottom-sheet";
import PrinterBottomSheet from "./PrinterBottomSheet";
import "react-spring-bottom-sheet/dist/style.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import { getLocations } from "../../api/printit";
import { getUserLocation } from "../../api/location";
import { Location, Printer } from "../../models/printit";

export async function load(): Promise<Location[]> {
  return await getLocations();
}

function PrintersMap() {
  const [selection, setSelection] = useState<{
    printer: Printer;
    location: Location;
  } | null>(null);
  const [bottomSheet, setBottomSheet] = useState(false);
  const [userLocation, setUserLocation] = useState([55.75, 37.57]);
  const [zoom, setZoom] = useState(9);

  const mapRef = useRef<any>(null);

  const locations = useLoaderData() as Location[];
  const navigate = useNavigate();

  function onPrintButtonClick() {
    navigate("/code_enter");
  }

  async function getAndSetUserLocation() {
    try {
      let loc = await getUserLocation();
      setUserLocation(loc);
      setZoom(16);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getAndSetUserLocation().catch((e) => console.error(e));
  }, []);

  return (
    <>
      <Map
        instanceRef={mapRef}
        width="100%"
        height="100%"
        defaultState={{
          controls: ["zoomControl"],
          center: userLocation,
          zoom: zoom,
        }}
        current={{ center: userLocation, zoom: zoom }}
        modules={["control.ZoomControl"]}
      >
        {locations.map((location) => (
          <Placemark
            key={location.id}
            geometry={[location.latitude, location.longitude]}
            options={{
              preset: "islands#lightBlueIcon",
              iconColor: "#3b82f6",
            }}
            onClick={() => {
              setSelection({
                printer: location.printers[0],
                location: location,
              });
              setBottomSheet(true);
            }}
          />
        ))}
      </Map>
      <div className="fixed bottom-0 left-1/2 mb-14 -translate-x-1/2">
        <button
          className="h-12 w-32 rounded-full bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          onClick={onPrintButtonClick}
        >
          Print It!
        </button>
      </div>
      <div className="max-w-lg">
        <BottomSheet open={bottomSheet} onDismiss={() => setBottomSheet(false)}>
          {selection && (
            <PrinterBottomSheet
              printer={selection.printer}
              location={selection.location}
              onPrintButtonClick={onPrintButtonClick}
            />
          )}
        </BottomSheet>
      </div>
    </>
  );
}

export default PrintersMap;
