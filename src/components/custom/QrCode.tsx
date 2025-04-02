import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
  data: string; // Dados que você deseja colocar no QR Code (pode ser uma URL ou texto)
}

const QRCodeComponent: React.FC<QRCodeProps> = ({ data }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      QRCode.toDataURL(data, { errorCorrectionLevel: 'L', width: 300 })
        .then((url) => {
          setQrCodeUrl(url); // Armazenando o URL base64 gerado do QR Code
        })
        .catch((err) => {
          console.error('Erro ao gerar QR Code', err);
        });
    }
  }, [data]);

  return (
    <div>
      {qrCodeUrl ? (
        <img 
          src={qrCodeUrl} 
          alt="QR Code" />
      ) : (
        <p>Gerando QR Code...</p>
      )}
    </div>
  );
};

export default QRCodeComponent;
