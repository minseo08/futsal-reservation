'use client';

import { useEffect, useState } from 'react';

interface Field {
  id: string;
  name: string;
  address: string;
  pricePerHour: number;
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
        setNewField({ name: '', address: '', pricePerHour: '', startHour: 9, endHour: 22, thumbnailUrl: '', imageUrlsInput: '' });
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

  const handleUpdate = async (id: string, currentName: string) => {
    const newName = prompt('새로운 구장 이름을 입력하세요:', currentName);
    if (!newName) return;
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name: newName }),
    });

    if (res.ok) {
      alert('수정되었습니다.');
      fetchFields();
    } else {
      alert('수정에 실패했습니다. 권한을 확인하세요.');
    }
  };

return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>풋살장 관리자 모드</h1>

      <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h2>➕ 새 구장 추가</h2>
        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '10px', maxWidth: '500px' }}>
          <input 
            type="text" placeholder="구장 이름" required
            value={newField.name} onChange={e => setNewField({...newField, name: e.target.value})}
            style={{ padding: '8px' }}
          />
          <input 
            type="text" placeholder="주소" required
            value={newField.address} onChange={e => setNewField({...newField, address: e.target.value})}
            style={{ padding: '8px' }}
          />
          <input 
            type="text" placeholder="시간당 가격" required
            value={newField.pricePerHour} 
            onChange={e => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setNewField({...newField, pricePerHour: value});
            }}
            style={{ padding: '8px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>운영 시간:</span>
            <input 
              type="number" min="0" max="24"
              value={newField.startHour} onChange={e => setNewField({...newField, startHour: Number(e.target.value)})}
              style={{ width: '60px', padding: '5px' }}
            />시 ~ 
            <input 
              type="number" min="0" max="24"
              value={newField.endHour} onChange={e => setNewField({...newField, endHour: Number(e.target.value)})}
              style={{ width: '60px', padding: '5px' }}
            />시
          </div>
          <input 
            type="text" placeholder="대표 이미지 URL (http://...)" 
            value={newField.thumbnailUrl} 
            onChange={e => setNewField({...newField, thumbnailUrl: e.target.value})}
            style={{ padding: '8px' }}
          />

          <textarea 
            placeholder="나머지 이미지 URL들 (여러 개일 경우 쉼표로 구분)" 
            value={newField.imageUrlsInput} 
            onChange={e => setNewField({...newField, imageUrlsInput: e.target.value})}
            style={{ padding: '8px', minHeight: '80px' }}
          />
          <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            구장 등록하기
          </button>
        </form>
      </section>

      <hr />

      <h2 style={{ marginTop: '30px' }}>등록된 구장 목록</h2>
      <table border={1} style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th style={{ padding: '10px' }}>구장명</th>
            <th style={{ padding: '10px' }}>주소</th>
            <th style={{ padding: '10px' }}>가격</th>
            <th style={{ padding: '10px' }}>버전(락 확인용)</th>
            <th style={{ padding: '10px' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.id}>
              <td style={{ padding: '10px' }}>{field.name}</td>
              <td style={{ padding: '10px' }}>{field.address}</td>
              <td style={{ padding: '10px' }}>{field.pricePerHour.toLocaleString()}원</td>
              <td style={{ padding: '10px' }}>{field.version}</td>
              <td style={{ padding: '10px' }}>
                <button onClick={() => handleUpdate(field.id, field.name)}>수정</button>
                <button onClick={() => handleDelete(field.id)} style={{ color: 'red', marginLeft: '10px' }}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}