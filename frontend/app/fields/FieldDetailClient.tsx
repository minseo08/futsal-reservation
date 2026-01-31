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
    const token = localStorage.getItem('token');

    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
      return;
    }
    try {
      const res = await fetch('http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/fields/reserve', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ timeSlotId }),
      });

      if (res.ok) {
        alert('예약이 완료되었습니다! 이메일을 확인해 주세요.');
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(`예약 실패: ${errorData.message || '이미 예약된 시간대입니다.'}`);
      }
    } catch (error) {
      console.error(error);
      alert('서버와 통신 중 오류가 발생했습니다.');
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-50 mb-8">
          
          {(field.thumbnailUrl || (field.imageUrls && field.imageUrls.length > 0)) && (
            <div className="grid grid-cols-4 gap-4 mb-10">
              <div className="col-span-4 md:col-span-3">
                <img 
                  src={field.thumbnailUrl || field.imageUrls?.[0]} 
                  className="w-full h-64 md:h-80 object-cover rounded-[2rem] border border-gray-100 shadow-sm"
                  alt="구장 대표 이미지"
                />
              </div>
              <div className="hidden md:flex flex-col gap-4 overflow-y-auto max-h-80 pr-2">
                {field.imageUrls?.map((url: string, index: number) => (
                  <img 
                    key={index}
                    src={url}
                    className="w-full h-24 object-cover rounded-2xl border border-gray-50 hover:border-[#4dabf7] transition-all cursor-pointer"
                    alt={`상세 이미지 ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          <h1 className="text-3xl font-bold text-[#343a40] mb-2">{field.name}</h1>
          <p className="text-[#868e96] mb-10">{field.address}</p>
          
          <section>
            <h3 className="text-lg font-semibold text-[#495057] mb-5">예약 시간 선택</h3>
            <div className="grid gap-4">
              {field.timeSlots?.map((slot: any) => (
                <div key={slot.id} className="flex justify-between items-center p-5 bg-white border border-[#f1f3f5] rounded-2xl hover:border-[#4dabf7] transition-colors shadow-sm">
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
      </div>
    </main>
  );
}