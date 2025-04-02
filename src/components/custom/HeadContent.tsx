"use client";
import HeadMetas from "./root/HeadMeta";
import { metasTags } from "@/lib/meta/metaTags";
import SchemaContent from "./root/SchemaComponent";
import AdSense from "./AdSense";




const HeadContent = () => {
  const adSenseID: string = "ca-pub-8527210526030632"
  return (
    <head>
      {/* Adicionando o Schema Markup */}            
      <SchemaContent />      
      <HeadMetas metas={metasTags} />
      <title>Telegram Promotes</title>
      <AdSense 
        adId={adSenseID}
      />
    </head>
  );
};

export default HeadContent;
