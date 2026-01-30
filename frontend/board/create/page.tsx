'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('FREE');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      alert('로그인이 필요합니다.');
      router.push('/login');
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const res = await fetch('http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content, category }),
    });

    if (res.ok) {
      alert('게시글이 성공적으로 등록되었습니다.');
      router.push('/board');
    } else {
      alert('글 등록에 실패했습니다.');
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-xl">
        <h1 className="text-2xl font-bold mb-8 text-[#343a40]">새로운 글 쓰기</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-[#adb5bd] mb-2">카테고리</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-[#e9ecef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4dabf7]"
            >
              <option value="FREE">자유게시판</option>
              {user?.role === 'ADMIN' && <option value="NOTICE">공지사항</option>}
            </select>
          </div>

          <input 
            type="text" 
            placeholder="제목을 입력하세요" 
            className="text-xl font-bold w-full p-4 border-b border-[#f1f3f5] focus:outline-none focus:border-[#4dabf7]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea 
            placeholder="풋살에 대한 이야기를 들려주세요!"
            className="w-full min-h-[300px] p-4 bg-[#fbfcfe] rounded-2xl border border-[#f1f3f5] focus:outline-none focus:ring-1 focus:ring-[#4dabf7]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex gap-4 mt-4">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="flex-1 py-4 rounded-2xl font-bold text-[#adb5bd] hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button 
              type="submit"
              className="flex-[2] py-4 rounded-2xl font-bold bg-[#4dabf7] text-white hover:bg-[#339af0] transition shadow-lg"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}