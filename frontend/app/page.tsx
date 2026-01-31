'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Field {
  id: string;
  name: string;
  address: string;
  pricePerHour: number;
  thumbnailUrl?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/fields', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('인증 실패 혹은 서버 에러');
        return res.json();
      })
      .then((data) => {
        setFields(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
        localStorage.removeItem('token');
        router.push('/login');
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <div className="inline-block animate-bounce text-4xl mb-4">⚽️</div>
          <p className="text-gray-500 font-medium">경기장 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm">
          <p className="text-red-500 font-bold mb-4">데이터를 가져오지 못했습니다.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#4dabf7] text-white px-6 py-2 rounded-xl text-sm font-bold"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-[#343a40] mb-2">전체 구장 목록</h1>
          <p className="text-[#868e96]">지금 바로 비어있는 구장을 예약해 보세요!</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fields.map((field) => (
            <div 
                key={field.id} 
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex justify-between gap-4 mb-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold text-[#495057]">{field.name}</h2>
                      <span className="bg-[#e7f5ff] text-[#1971c2] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        운영 중
                      </span>
                    </div>
                    <p className="text-[#868e96] text-sm leading-relaxed max-w-[180px]">
                      {field.address}
                    </p>
                  </div>
                  
                  {field.thumbnailUrl && (
                    <img 
                      src={field.thumbnailUrl} 
                      alt={field.name} 
                      className="w-24 h-24 rounded-3xl object-cover border border-gray-50 shadow-sm flex-shrink-0"
                    />
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-[#f1f3f5]">
                  <div>
                    <span className="text-xs text-gray-400 block mb-1 font-medium">시간당 이용료</span>
                    <span className="text-lg font-bold text-[#4dabf7]">
                      {field.pricePerHour.toLocaleString()}원
                    </span>
                  </div>
                
                <Link href={`/fields?id=${field.id}`}>
                  <button className="bg-[#4dabf7] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#339af0] transition-all transform active:scale-95">
                    예약하기
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
            <p className="text-gray-400">현재 등록된 구장이 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
}