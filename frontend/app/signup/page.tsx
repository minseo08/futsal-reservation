'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (res.ok) {
      alert('회원가입 성공! 로그인 해주세요.');
      router.push('/login');
    } else {
      alert('회원가입 실패: 이미 존재하는 이메일일 수 있습니다.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSignup} className="p-10 bg-white rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">회원가입 ⚽️</h1>
        <input type="text" placeholder="이름" className="w-full p-3 mb-4 border rounded-xl" 
               onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="이메일" className="w-full p-3 mb-4 border rounded-xl" 
               onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="비밀번호" className="w-full p-3 mb-6 border rounded-xl" 
               onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full bg-[#4dabf7] text-white p-3 rounded-xl font-bold hover:bg-[#339af0]">
          가입하기
        </button>
      </form>
    </main>
  );
}