import PrintersMap, { load } from "./components/Map/PrintersMap";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import OrderCreationScreen, {
  createOrderAction,
  load as orderCreateLoad
} from "./components/OrderCreationScreen";
import CodeEnterScreen from "./components/CodeEnterScreen";
import OrderConfirmation from "./components/OrderConfirmation";
import { YMaps } from "@pbe/react-yandex-maps";
import React, { useEffect } from "react";
import OrderScreen, { load as orderScreenLoad } from "./components/OrderScreen";
import { useLocationStore } from "./stores/location_ctx";

const router = createBrowserRouter([
  {
    path: "/",
    loader: load,
    element: <PrintersMap />
  },
  {
    path: "/printer/:printerCode/new_order",
    element: <OrderCreationScreen />,
    action: createOrderAction,
    loader: orderCreateLoad
  },
  {
    path: "/code_enter",
    element: <CodeEnterScreen />
  },
  {
    path: "/confirm_order/:confirmationToken",
    element: <OrderConfirmation />
  },
  {
    path: "/order/:orderId",
    element: <OrderScreen />,
    loader: orderScreenLoad
  }
]);

function App() {

  const geoLocationStoreInit = useLocationStore((state) => state.init);
  useEffect(() => {
    ;(async () => {
      await geoLocationStoreInit();
    })()
  }, []);

  return (
    <YMaps>
      <div className="h-screen w-screen bg-blue-100">
        <RouterProvider router={router} />
      </div>
    </YMaps>
  );
}

export default App;
