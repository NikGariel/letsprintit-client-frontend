import { useLocationStore } from "../stores/location_ctx";
import { BottomSheet } from "react-spring-bottom-sheet";
import React, { useState } from "react";

const GeoLocationRequestSheet = () => {
  const [open, setOpen] = useState(true);
  const [result, setResult] = useState<null| boolean>(null)
  const getGeoLocation = useLocationStore((state) => state.getGeoLocation)

  const buttonClick = async () => {
    const result = await getGeoLocation()
    setResult(result)
    if(result){
      setOpen(false)
    }
  }

  return(
    <BottomSheet open={open} onDismiss={()=>setOpen(false)}>
      <div className={"p-3 items-center mx-auto"}>
        {result === false && <>
          <h2 className="mt-3 text-2xl font-bold text-center">Мы не смогли получить доступ, попробуйте ещё раз</h2>
        </>}
        <h1 className="mt-3 text-2xl font-bold pb-2">Для вашего удобства, нам необходим доступ к геолокации</h1>
        <button
          onClick={buttonClick}
          className="mx-auto mb-10 h-12 w-52 rounded-full bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Предоставить доступ
        </button>
      </div>
    </BottomSheet>
  )
}
export default GeoLocationRequestSheet