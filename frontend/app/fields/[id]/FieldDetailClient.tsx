'use client';

import { useEffect, useState } from 'react';

export default function FieldDetailClient({ id }: { id: string }) {
  const [field, setField] = useState<any>(null);

  useEffect(() => {
    fetch(`http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/fields/${id}`)
      .then((res) => res.json())
      .then((data) => setField(data));
  }, [id]);

  const handleBook = async (timeSlotId: string) => {
    const userName = prompt('예약자 성함을 입력해주세요:');
    if (!userName) return;

    const res = await fetch('http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/fields/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timeSlotId, userName }),
    });

    if (res.ok) {
      alert('예약이 완료되었습니다!');
      window.location.reload();
    } else {
      alert('예약에 실패했습니다.');
    }
  };

  if (!field) return <div className="p-8 text-center text-gray-500">정보를 불러오는 중...</div>;

  return (
    <main className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2rem] shadow-sm border border-gray-50">
        <h1 className="text-3xl font-bold text-[#343a40] mb-2">{field.name}</h1>
        <p className="text-[#868e96] mb-10">{field.address}</p>
        <section>
          <h3 className="text-lg font-semibold text-[#495057] mb-5">예약 시간 선택</h3>
          <div className="grid gap-4">
            {field.timeSlots?.map((slot: any) => (
              <div key={slot.id} className="flex justify-between items-center p-5 bg-white border border-[#f1f3f5] rounded-2xl">
                <span className="text-[#495057] font-medium">
                  {new Date(slot.startTime).getHours()}:00 - {new Date(slot.endTime).getHours()}:00
                </span>
                {slot.status === 'AVAILABLE' ? (
                  <button onClick={() => handleBook(slot.id)} className="bg-[#4dabf7] text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                    예약 가능
                  </button>
                ) : (
                  <span className="text-[#adb5bd] bg-[#f1f3f5] px-4 py-2 rounded-xl text-sm font-medium">예약 마감</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}