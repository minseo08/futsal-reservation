import FieldDetailClient from './FieldDetailClient';


export function generateStaticParams() {
  return [{ id: 'template' }]; 
}

export const dynamicParams = false;

export default async function FieldPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  return <FieldDetailClient id={id} />;
}