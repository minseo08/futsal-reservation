'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { API_BASE_URL } from '../utils/api';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/users/signup`, {
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
    <main className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      <div className="md:w-1/2 flex flex-col justify-center px-12 lg:px-24 bg-gradient-to-br from-[#f1f8ff] to-[#e7f3ff] text-[#343a40] py-20 md:py-0 border-r border-gray-100">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 flex items-center gap-4">
            <Image 
              src="/postbar.png"
              alt="Futsal Logo"
              width={48}
              height={48}
              className="rounded-xl object-cover"
            />
            <span>FutsalHub</span>
          </h1>
          <p className="text-xl text-[#868e96] font-medium leading-relaxed max-w-md">
            당신의 다음 경기를 위한 가장 완벽한 예약 파트너. <br />
            지금 바로 필드를 확인하세요.
          </p>
        </div>
        <div className="mt-12 flex gap-4">
          <div className="w-12 h-1 bg-[#4dabf7]/20 rounded-full" />
          <div className="w-6 h-1 bg-[#4dabf7]/20 rounded-full" />
        </div>
      </div>

      <div className="md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">회원가입</h2>
            <p className="text-gray-400 text-sm">본인의 메일로 가입하여 예약 시에 메일로 확인받으세요</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 ml-1 uppercase tracking-wider">Name</label>
              <input 
                type="text" 
                placeholder="이름 또는 닉네임" 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4dabf7] transition-all outline-none text-gray-600" 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

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
              가입하기
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm">
              이미 계정이 있으신가요? 
              <Link href="/login" className="ml-2 text-[#4dabf7] font-bold hover:underline">
                로그인으로 이동
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}