'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('auth-change'));
      alert(`${data.user.name}님, 환영합니다!`);
      router.push('/');
    } else {
      alert('이메일 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="mb-8 text-center">
        <div className="mb-4"><Image 
          src="/postbar.png"
          alt="Futsal Logo"
          width={64} 
          height={64}
          className="mx-auto rounded-2xl"
        /></div>
        <h1 className="text-3xl font-bold text-[#343a40]">FutsalHub</h1>
        <p className="text-gray-500 mt-2">당신의 다음 경기를 예약하세요</p>
      </div>
      <form onSubmit={handleLogin} className="p-10 bg-white rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
        <input type="email" placeholder="이메일" className="w-full p-3 mb-4 border rounded-xl" 
               onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="비밀번호" className="w-full p-3 mb-6 border rounded-xl" 
               onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full bg-[#4dabf7] text-white p-3 rounded-xl font-bold hover:bg-[#339af0]">
          로그인
        </button>
        <p className="mt-4 text-center text-sm text-gray-500">
          계정이 없으신가요? <a href="/signup" className="text-[#4dabf7] underline">간편 회원가입</a>
        </p>
      </form>
    </main>
  );
}