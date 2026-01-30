'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import FieldDetailClient from './FieldDetailClient';

function FieldDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return <div className="p-8 text-center">잘못된 접근입니다. 구장을 선택해 주세요.</div>;
  }

  return <FieldDetailClient id={id} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">페이지를 구성 중입니다...</div>}>
      <FieldDetailContent />
    </Suspense>
  );
}