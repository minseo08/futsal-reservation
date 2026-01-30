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
  const API_URL = 'http://43.203.187.236:3000/fields';

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

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 구장을 삭제할까요?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    alert('삭제되었습니다.');
    fetchFields();
  };

  const handleUpdate = async (id: string, currentName: string) => {
    const newName = prompt('새로운 구장 이름을 입력하세요:', currentName);
    if (!newName) return;

    await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    alert('수정되었습니다.');
    fetchFields();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>풋살장 관리자 모드</h1>
      <table border={1} style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>구장명</th>
            <th>주소</th>
            <th>가격</th>
            <th>버전(락 확인용)</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.id}>
              <td>{field.name}</td>
              <td>{field.address}</td>
              <td>{field.pricePerHour}원</td>
              <td>{field.version}</td>
              <td>
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