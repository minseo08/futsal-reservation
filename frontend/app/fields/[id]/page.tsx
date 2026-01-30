import FieldDetailClient from './FieldDetailClient';

export async function generateStaticParams() {
  return [];
}

export default async function FieldPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  return <FieldDetailClient id={id} />;
}