// components/BarcodeScanner.jsx
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useState } from "react";

export default function BarcodeScanner({ onDetected }) {
  const [barcode, setBarcode] = useState("");

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Scan Barcode</h2>
      <BarcodeScannerComponent
        width={300}
        height={200}
        onUpdate={(err, result) => {
          if (result) {
            setBarcode(result.text);
            onDetected(result.text); // pass to parent
          }
        }}
      />
      <p className="mt-2 text-gray-700">Scanned: {barcode}</p>
    </div>
  );
}
