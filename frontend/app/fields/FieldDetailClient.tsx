'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FieldDetailClient({ id }: { id: string }) {
  const [field, setField] = useState<any>(null);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/fields/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data.timeSlots) {
          data.timeSlots.sort((a: any, b: any) => 
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
        }
        setField(data);
      })
      .catch(() => setError(true));
  }, [id]);

  const handleBook = async (timeSlotId: string) => {
    const token = localStorage.getItem('token'); // 주머니에서 티켓 꺼내기

    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
      return;
    }

    const res = await fetch('http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/fields/reserve', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify({ timeSlotId }),
    });

    if (res.ok) {
      alert('예약이 완료되었습니다!');
      window.location.reload();
    } else {
      alert('예약에 실패했습니다. 이미 예약된 시간대인지 확인해주세요.');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
  };
  
  if (error) return <div className="p-8 text-center text-red-500">정보를 불러오는 데 실패했습니다.</div>;
  if (!field) return <div className="p-8 text-center text-gray-500">경기장 정보를 가져오는 중...</div>;

  return (
    <main className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2rem] shadow-sm border border-gray-50">
        <h1 className="text-3xl font-bold text-[#343a40] mb-2">{field.name}</h1>
        <p className="text-[#868e96] mb-10">{field.address}</p>
        
        <section>
          <h3 className="text-lg font-semibold text-[#495057] mb-5">예약 시간 선택</h3>
          <div className="grid gap-4">
            {field.timeSlots?.map((slot: any) => (
              <div key={slot.id} className="flex justify-between items-center p-5 bg-white border border-[#f1f3f5] rounded-2xl hover:border-[#4dabf7] transition-colors">
                <span className="text-[#495057] font-bold">
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </span>
                
                {slot.status === 'AVAILABLE' ? (
                  <button 
                    onClick={() => handleBook(slot.id)} 
                    className="bg-[#4dabf7] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#339af0] transition-all"
                  >
                    예약 가능
                  </button>
                ) : (
                  <span className="text-[#adb5bd] bg-[#f1f3f5] px-4 py-2 rounded-xl text-sm font-medium">
                    예약 마감
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}