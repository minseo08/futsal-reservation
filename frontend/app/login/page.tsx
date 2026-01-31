'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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
    <main className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      <div className="md:w-1/2 flex flex-col justify-center px-12 lg:px-24 bg-gradient-to-br from-[#f1f8ff] to-[#e7f3ff] text-[#343a40] py-20 md:py-0 border-r border-gray-100">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 flex items-center gap-4">
            <Image src="/postbar.png"
              alt="Futsal Logo"
              width={48}
              height={48}
              className="rounded-xl object-cover"
            />
            <span>Futsal Hub</span>
          </h1>
          <p className="text-xl text-[#868e96] font-medium leading-relaxed max-w-md">
            당신의 다음 경기를 위한 가장 완벽한 예약 파트너. <br />
            지금 바로 필드를 확인하세요.
          </p>
        </div>
        
        <div className="mt-12 flex gap-4">
          <div className="w-12 h-1 bg-white/30 rounded-full" />
          <div className="w-6 h-1 bg-white/30 rounded-full" />
        </div>
      </div>

      <div className="md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">로그인</h2>
            <p className="text-gray-400 text-sm">계정 정보를 입력해 주세요</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 ml-1 uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                placeholder="이메일" 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4dabf7] transition-all outline-none text-gray-600" 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 ml-1 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                placeholder="비밀번호" 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4dabf7] transition-all outline-none text-gray-600" 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <button className="w-full bg-[#4dabf7] text-white p-4 rounded-2xl font-bold text-lg hover:bg-[#339af0] transition-all shadow-lg shadow-blue-100 mt-4 active:scale-[0.98]">
              로그인
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm">
              처음이신가요? 
              <Link href="/signup" className="ml-2 text-[#4dabf7] font-bold hover:underline">
                간편 회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}