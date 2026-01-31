'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const checkUser = () => {
    const savedUser = localStorage.getItem('user');
    setUser(savedUser ? JSON.parse(savedUser) : null);
  };

  useEffect(() => {
    checkUser();
    
    window.addEventListener('auth-change', checkUser);
    return () => window.removeEventListener('auth-change', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('로그아웃 되었습니다.');
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#4dabf7]">
          FutsalHub
        </Link>
        <div className="mb-4"><Image 
          src="/postbar.png"
          alt="Futsal Logo"
          width={64} 
          height={64}
          className="mx-auto rounded-2xl"
        /></div>
        <div className="flex items-center gap-6">
          <Link href="/board" className="text-gray-600 hover:text-[#4dabf7] font-medium">게시판</Link>
          <Link href="/my-reservations" className="text-gray-600 hover:text-[#4dabf7] font-medium">내 예약</Link>

          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-red-400 hover:text-red-600 font-bold">관리자</Link>
          )}

          {user ? (
            <div className="flex items-center gap-4 border-l pl-6 ml-2">
              <span className="text-sm font-semibold text-gray-700">{user.name}님</span>
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-[#4dabf7] text-white px-5 py-2 rounded-xl text-sm font-bold">
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}