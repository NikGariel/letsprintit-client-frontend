import React from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import Sheet from "./Sheet/Sheet";
import { getPrinter } from "../api/printit";

function CodeEnterScreen() {
  const navigate = useNavigate();
  const [input, setInput] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  async function handleQrResult(result: any, error: any) {
    if (!!result) {
      let text = result.text;
      let code = text.split("/").pop();
      await checkAndRedirectToPrinter(code);
    }
  }

  async function checkAndRedirectToPrinter(printerCode: string): Promise<void> {
    if ((await getPrinter(printerCode)) !== null) {
      navigate(`/printer/${printerCode}/new_order`, { replace: false });
    } else {
      setErrorMessage("Принтер не найден");
    }
  }

  return (
    <Sheet>
      <div className="flex w-72 flex-col items-center rounded-lg bg-white p-5">
        <h2 className="mb-5 text-xl font-bold">Отсканируйте QR-код</h2>
        <QrReader
          containerStyle={{ width: "100%", height: "200px" }}
          videoContainerStyle={{
            width: "100%",
            height: "200px",
            paddingTop: "0",
          }}
          videoStyle={{ width: "100%", height: "200px", display: "block" }}
          onResult={handleQrResult}
          constraints={{ facingMode: "environment" }}
        />

        <p className="mb-1 pt-7 text-xs text-gray-500">
          или введите код принтера вручную
        </p>
        <input
          value={input}
          onChange={handleInput}
          type="text"
          id="first_name"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="AB07"
          required
        />
        {errorMessage && (
          <div className="mt-4 w-full rounded-lg bg-red-100 p-2 text-center text-sm text-red-500">
            {errorMessage}
          </div>
        )}
        <button
          onClick={() => {
            if (input.length === 0) {
              setErrorMessage("Введите код принтера");
              return;
            }
            checkAndRedirectToPrinter(input);
          }}
          className="group relative mb-2 me-2 mt-10 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-cyan-200 group-hover:from-cyan-500 group-hover:to-blue-500"
        >
          <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
            Выбрать принтер
          </span>
        </button>
      </div>
    </Sheet>
  );
}

export default CodeEnterScreen;
