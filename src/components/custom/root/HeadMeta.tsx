"use client"

export interface MetaTag {
  name?:          string;  
  property?:      string;
  content?:       string;
  // Permite adicionar atributos extras que podem ser usados nas tags 'meta'
  [key: string]:  any;
}

interface HeadMetasProps {
  metas: MetaTag[];
}

const HeadMetas: React.FC<HeadMetasProps> = ({ metas }) => (
  metas.map((meta: MetaTag, index: number) => <meta key={index} {...meta} /> )
)

export default HeadMetas;
