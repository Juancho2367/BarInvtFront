import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
// Importamos los tipos correctos desde la librería
import type { QrcodeSuccessCallback, QrcodeErrorCallback } from 'html5-qrcode';

// Definimos las propiedades que recibirá el componente
interface BarcodeScannerProps {
  onScanSuccess: QrcodeSuccessCallback;
  onScanFailure?: QrcodeErrorCallback;
  className?: string;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ 
  onScanSuccess, 
  onScanFailure,
  className = ""
}) => {
  useEffect(() => {
    // Definimos una función de error por defecto si no se proporciona una
    const defaultErrorHandler: QrcodeErrorCallback = (error: string) => {
      // Podemos ignorar los errores comunes de "QR code not found"
      // Solo logear errores importantes
      if (!error.includes('No MultiFormat Readers') && !error.includes('QR code parse error')) {
        console.warn('Scanner error:', error);
      }
    };

    // Creamos una nueva instancia del escáner
    const html5QrcodeScanner = new Html5QrcodeScanner(
      'barcode-reader', // ID del elemento div donde se renderizará
      {
        fps: 10, // Cuadros por segundo para escanear
        qrbox: { width: 250, height: 250 }, // Tamaño del cuadro de escaneo
        aspectRatio: 1.0,
        disableFlip: false,
      },
      false // `false` para no ser verboso en la consola
    );

    // Callback de éxito mejorado
    const handleSuccess: QrcodeSuccessCallback = (decodedText: string, decodedResult: any) => {
      // Limpiar el escáner después del éxito
      html5QrcodeScanner.clear().catch(console.error);
      onScanSuccess(decodedText, decodedResult);
    };

    // Renderizamos el escáner y le pasamos los callbacks
    // Usamos el `onScanFailure` proporcionado o el nuestro por defecto
    html5QrcodeScanner.render(handleSuccess, onScanFailure || defaultErrorHandler);

    // Función de limpieza que se ejecuta cuando el componente se desmonta
    return () => {
      html5QrcodeScanner.clear().catch((error: any) => {
        console.error('Fallo al limpiar el escáner.', error);
      });
    };
  }, [onScanSuccess, onScanFailure]);

  // Contenedor donde la librería inyectará la cámara y la UI
  return (
    <div className={`barcode-scanner-container ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Escanear Código de Barras
        </h3>
        <p className="text-sm text-gray-600">
          Apunta la cámara hacia el código de barras del producto
        </p>
      </div>
      <div 
        id="barcode-reader" 
        className="mx-auto max-w-lg"
        style={{
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      ></div>
    </div>
  );
};

export default BarcodeScanner;