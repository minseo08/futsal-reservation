import FieldDetailClient from './FieldDetailClient';

export async function generateStaticParams() {
  try {
    const res = await fetch('http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/fields');
    const fields = await res.json();

    return fields.map((field: any) => ({
      id: field.id,
    }));
  } catch (error) {
    console.error("ID 목록을 가져오지 못했습니다. 기본값 사용:", error);
    return [];
  }
}

export default async function FieldPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  return <FieldDetailClient id={id} />;
}