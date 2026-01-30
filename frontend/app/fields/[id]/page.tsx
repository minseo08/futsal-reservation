import FieldDetailClient from './FieldDetailClient';

// generateStaticParams를 삭제하거나 아래와 같이 비워둡니다.
export const dynamicParams = true;

export default async function FieldPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  return <FieldDetailClient id={id} />;
}