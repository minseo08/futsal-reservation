import FieldDetailClient from './FieldDetailClient';

export function generateStaticParams() {
  return [{ id: '1' }];
}

export default async function FieldPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  return <FieldDetailClient id={id} />;
}