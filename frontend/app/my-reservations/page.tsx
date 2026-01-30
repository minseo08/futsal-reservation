'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const formatTimeRange = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const startH = String(start.getUTCHours()).padStart(2, '0');
    const startM = String(start.getUTCMinutes()).padStart(2, '0');
    const endH = String(end.getUTCHours()).padStart(2, '0');
    const endM = String(end.getUTCMinutes()).padStart(2, '0');
    
    return `${startH}:${startM} - ${endH}:${endM}`;
  };

  const fetchReservations = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/fields/reservations/mine`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error('조회 중 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (reservationId: string) => {
    if (!confirm('정말로 예약을 취소하시겠습니까?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/fields/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert('예약이 취소되었습니다.');
        fetchReservations();
      } else {
        alert('취소에 실패했습니다. 본인의 예약만 취소할 수 있습니다.');
      }
    } catch (err) {
      alert('오류가 발생했습니다.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
      <p className="text-gray-500">예약 내역을 확인하고 있습니다...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#343a40] mb-8">내 예약 확인</h1>
        
        {/* 결과 목록 */}
        <div className="grid gap-4">
          {reservations.map((res: any) => (
            <div key={res.id} className="bg-white p-6 rounded-2xl border border-[#e9ecef] shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#495057]">{res.timeSlot?.field?.name || '정보 없음'}</h2>
                  <p className="text-sm text-[#868e96]">{res.timeSlot?.field?.address}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="bg-[#e7f5ff] text-[#1971c2] text-xs font-bold px-3 py-1 rounded-full">
                    예약 완료
                    </span>
                    <button 
                        onClick={() => handleCancel(res.id)}
                        className="text-xs font-bold text-red-400 hover:text-red-600 border border-red-100 px-3 py-1 rounded-full transition"
                    >
                        취소하기
                    </button>
                </div>
              </div>
              <div className="border-t border-[#f1f3f5] pt-4 mt-4">
                <p className="text-[#495057]">
                  <span className="text-gray-400 mr-2">일시:</span>
                  {res.timeSlot ? new Date(res.timeSlot.startTime).toLocaleDateString() : '-'} 
                  <span className="ml-2 font-semibold">
                    {res.timeSlot ? formatTimeRange(res.timeSlot.startTime, res.timeSlot.endTime) : ''}
                  </span>
                </p>
                <p className="text-xs text-gray-300 mt-2">예약번호: {res.id}</p>
              </div>
            </div>
          ))}

          {reservations.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400">아직 예약된 내역이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}