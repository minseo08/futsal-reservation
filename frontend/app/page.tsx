'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Field {
  id: string;
  name: string;
  address: string;
  pricePerHour: number;
}

export default function Home() {
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    fetch('http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/fields')
      .then((res) => res.json())
      .then((data) => setFields(data))
      .catch((err) => console.error("데이터 로드 실패:", err));
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#343a40] mb-8">풋살장 예약 현황</h1>
          <div className="flex justify-end mb-6">
            <Link href="/my-reservations">
              <button className="text-[#4dabf7] font-semibold hover:underline">
                내 예약 확인하기 →
              </button>
            </Link>
          </div>        
        <div className="grid gap-6 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.id} className="bg-white border border-[#e9ecef] p-6 rounded-2xl shadow-sm hover:translate-y-[-4px] transition-all">
              <h2 className="text-xl font-bold text-[#495057]">{field.name}</h2>
              <p className="text-[#868e96] text-sm mt-1">{field.address}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-[#2b8a3e]">
                  {field.pricePerHour.toLocaleString()}원 <span className="text-sm font-normal text-gray-400">/ 시간</span>
                </span>
                  <Link href={`/fields/${field.id}`} className="block">
                    <button className="w-full bg-[#4dabf7] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#339af0] transition-all">
                      상세 예약하기
                    </button>
                  </Link>
              </div>
            </div>
          ))}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400">등록된 구장이 없습니다. 백엔드에서 등록해 주세요!</p>
          </div>
        )}
      </div>
    </main>
  );
}