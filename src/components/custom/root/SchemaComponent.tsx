"use client";
import React, { useEffect, useState } from 'react';

interface SchemaProps {
  type: string;
  name: string;
  description: string;
  url: string;
  image?: string;
  additionalProps?: Record<string, any>;
}

const SchemaMarkup: React.FC<SchemaProps> = ({
  type,
  name,
  description,
  url,
  image,
  additionalProps,
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url,
    image: image || null,
    ...additionalProps,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
    />
  );
};

const SchemaContent: React.FC = () => {
  const [siteUri, setSiteUri] = useState<string | null>(null);

  // Atualiza a variável de siteUri após a montagem no cliente
  useEffect(() => {
    setSiteUri(process.env.APP_URI ?? "localhost");
  }, []);

  // Evita renderizar o conteúdo até que siteUri seja carregado
  if (!siteUri) return null;

  const siteImg = `${siteUri}/favicon.ico`;

  return (
    <SchemaMarkup
      type="WebPage"
      name="Telegram Promote"
      description="Plataforma para promover grupos de Telegram, conectando usuários a comunidades de interesse."
      url={siteUri}
      image={siteImg}
      additionalProps={{
        publisher: {
          "@type": "Person",
          name: "Pedro Henrique Goffi de Paulo",
          url: siteUri,
        },
      }}
    />
  );
};

export default SchemaContent;
