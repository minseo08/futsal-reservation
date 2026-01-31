'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Field {
  id: string;
  name: string;
  address: string;
  pricePerHour: number;
  region: string;
  version: number;
}

export default function AdminPage() {
  const [fields, setFields] = useState<Field[]>([]);
  
  const [newField, setNewField] = useState({
    name: '',
    address: '',
    pricePerHour: '',
    startHour: 9,
    endHour: 22,
    region: '서울',
    thumbnailUrl: '',
    imageUrlsInput: ''
  });

  const API_URL = 'http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/fields';

  const getAuthHeaders = (contentType = 'application/json') => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': contentType,
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchFields = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setFields(data);
    } catch (error) {
      console.error("데이터를 불러오지 못했습니다:", error);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrls = newField.imageUrlsInput
      .split(',')
      .map(url => url.trim())
      .filter(url => url !== '');
    
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...newField,
          pricePerHour: Number(newField.pricePerHour),
          imageUrls: imageUrls
        }),
      });

      if (res.ok) {
        alert('구장이 성공적으로 등록되었습니다!');
        setNewField({ name: '', address: '', pricePerHour: '', startHour: 9, endHour: 22, region: '서울', thumbnailUrl: '', imageUrlsInput: '' });
        fetchFields();
      } else {
        const errorData = await res.json();
        alert(`등록 실패: ${errorData.message || '권한이 없습니다.'}`);
      }
    } catch (error) {
      console.error("등록 중 오류 발생:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 구장을 삭제할까요?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (res.ok) {
        alert('삭제되었습니다.');
        fetchFields();
      } else {
        const errorData = await res.json();
        alert(`삭제 실패: ${errorData.message || '서버 에러가 발생했습니다.'}`);
      }
    } catch (error) {
      console.error("삭제 요청 중 네트워크 오류:", error);
      alert('서버와 통신할 수 없습니다.');
    }
  };

  // const handleUpdate = async (id: string, currentName: string) => {
  //   const newName = prompt('새로운 구장 이름을 입력하세요:', currentName);
  //   if (!newName) return;
  //   const res = await fetch(`${API_URL}/${id}`, {
  //     method: 'PATCH',
  //     headers: getAuthHeaders(),
  //     body: JSON.stringify({ name: newName }),
  //   });

  //   if (res.ok) {
  //     alert('수정되었습니다.');
  //     fetchFields();
  //   } else {
  //     alert('수정에 실패했습니다. 권한을 확인하세요.');
  //   }
  // };

  return (
    <main className="min-h-screen bg-[#f8f9fa] p-8 md:p-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        <section className="lg:w-1/3">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 sticky top-24">
            <div className="mb-8 flex items-center gap-3">
              <Image src="/postbar.png" width={32} height={32} alt="logo" />
              <h2 className="text-2xl font-bold text-gray-800">새 구장 등록</h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <input 
                type="text" placeholder="구장 이름" required
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4dabf7] outline-none text-sm"
                value={newField.name} onChange={e => setNewField({...newField, name: e.target.value})}
              />
              <input 
                type="text" placeholder="상세 주소" required
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4dabf7] outline-none text-sm"
                value={newField.address} onChange={e => setNewField({...newField, address: e.target.value})}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" placeholder="시간당 가격" required
                  className="p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4dabf7] outline-none text-sm"
                  value={newField.pricePerHour} 
                  onChange={e => setNewField({...newField, pricePerHour: e.target.value.replace(/[^0-9]/g, '')})}
                />
                <select 
                  value={newField.region}
                  onChange={e => setNewField({...newField, region: e.target.value})}
                  className="p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4dabf7] outline-none text-sm text-gray-500 font-bold"
                >
                  {['서울', '경기/인천', '충청', '전라', '경상', '강원'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl text-xs text-gray-400 font-bold">
                <span>운영:</span>
                <input type="number" className="bg-transparent w-10 text-center text-[#4dabf7]" value={newField.startHour} onChange={e => setNewField({...newField, startHour: Number(e.target.value)})} />시 ~ 
                <input type="number" className="bg-transparent w-10 text-center text-[#4dabf7]" value={newField.endHour} onChange={e => setNewField({...newField, endHour: Number(e.target.value)})} />시
              </div>

              <input 
                type="text" placeholder="대표 이미지 URL" 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4dabf7] outline-none text-sm"
                value={newField.thumbnailUrl} onChange={e => setNewField({...newField, thumbnailUrl: e.target.value})}
              />

              <textarea 
                placeholder="추가 이미지 URL (쉼표로 구분)" 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4dabf7] outline-none text-sm min-h-[100px]"
                value={newField.imageUrlsInput} onChange={e => setNewField({...newField, imageUrlsInput: e.target.value})}
              />

              <button type="submit" className="w-full bg-[#4dabf7] text-white p-4 rounded-2xl font-bold hover:bg-[#339af0] transition-all shadow-lg shadow-blue-50 mt-2">
                구장 등록하기
              </button>
            </form>
          </div>
        </section>

        <section className="lg:w-2/3">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-[#4dabf7] rounded-full"></span>
            등록된 구장 목록
          </h2>
          
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-wider">지역/구장명</th>
                  <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-wider">가격</th>
                  <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-wider">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {fields.map((field) => (
                  <tr key={field.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-6">
                      <span className="text-[10px] font-bold text-[#4dabf7] bg-blue-50 px-2 py-0.5 rounded-full mb-1 inline-block">{field.region}</span>
                      <p className="font-bold text-gray-700">{field.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{field.address}</p>
                    </td>
                    <td className="p-6 font-bold text-gray-600">{field.pricePerHour.toLocaleString()}원</td>
                    <td className="p-6">
                      <div className="flex gap-3">
                        <button onClick={() => handleDelete(field.id)} className="text-xs font-bold text-red-400 hover:text-red-600 underline">삭제</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}