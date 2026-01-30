'use client';

import { useState } from 'react';

export default function MyReservations() {
  const [userName, setUserName] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReservations = async () => {
    if (!userName) return alert('이름을 입력해주세요.');
    setLoading(true);
    
    try {
      const res = await fetch(`http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/fields/reservations/mine?name=${userName}`);
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      alert('조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = async (reservationId: string) => {
      if (!confirm('정말로 예약을 취소하시겠습니까?')) return;

      try {
      const res = await fetch(`http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/fields/reservations/${reservationId}`, {
          method: 'DELETE',
      });

      if (res.ok) {
          alert('예약이 취소되었습니다.');
          fetchReservations(); // 목록 새로고침
      } else {
          alert('취소에 실패했습니다.');
      }
      } catch (err) {
      alert('오류가 발생했습니다.');
      }
  };
  return (
    <main className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#343a40] mb-8">내 예약 확인</h1>
        
        {/* 이름 입력창 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex gap-3">
          <input 
            type="text" 
            placeholder="예약 시 입력한 성함을 입력하세요"
            className="flex-1 border border-[#dee2e6] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4dabf7]"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button 
            onClick={fetchReservations}
            className="bg-[#4dabf7] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#339af0] transition"
          >
            {loading ? '조회 중...' : '조회'}
          </button>
        </div>

        {/* 결과 목록 */}
        <div className="grid gap-4">
          {reservations.map((res: any) => (
            <div key={res.id} className="bg-white p-6 rounded-2xl border border-[#e9ecef] shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#495057]">{res.timeSlot.field.name}</h2>
                  <p className="text-sm text-[#868e96]">{res.timeSlot.field.address}</p>
                </div>
                <button 
                    onClick={() => handleCancel(res.id)}
                    className="text-xs font-bold text-red-400 hover:text-red-600 border border-red-100 px-3 py-1 rounded-full transition"
                >
                    취소하기
                </button>                
                <span className="bg-[#e7f5ff] text-[#1971c2] text-xs font-bold px-3 py-1 rounded-full">
                  예약 완료
                </span>
              </div>
              <div className="border-t border-[#f1f3f5] pt-4 mt-4">
                <p className="text-[#495057]">
                  <span className="text-gray-400 mr-2">일시:</span>
                  {new Date(res.timeSlot.startTime).toLocaleDateString()} 
                  <span className="ml-2 font-semibold">
                    {new Date(res.timeSlot.startTime).getHours()}:00 - {new Date(res.timeSlot.endTime).getHours()}:00
                  </span>
                </p>
                <p className="text-xs text-gray-300 mt-2">예약번호: {res.id}</p>
              </div>
            </div>
          ))}

          {reservations.length === 0 && !loading && (
            <div className="text-center py-20 text-gray-400">
              조회 결과가 없습니다. 이름을 확인해 주세요.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}