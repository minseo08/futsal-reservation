'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../utils/api';

export default function BoardPage() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    fetch(`${API_BASE_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const filteredPosts = category === 'ALL' 
    ? posts 
    : posts.filter((post: any) => post.category === category);

  return (
    <main className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#343a40] mb-2">커뮤니티</h1>
            <p className="text-[#868e96]">공지사항과 자유로운 이야기를 나누세요.</p>
          </div>
          {user && (
            <Link href="/board/create">
              <button className="bg-[#4dabf7] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#339af0] transition shadow-sm">
                글쓰기
              </button>
            </Link>
          )}
        </header>

        <div className="flex gap-4 mb-8">
          {['ALL', 'NOTICE', 'FREE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold transition ${
                category === cat 
                ? 'bg-[#4dabf7] text-white' 
                : 'bg-white text-[#adb5bd] border border-[#e9ecef]'
              }`}
            >
              {cat === 'ALL' ? '전체' : cat === 'NOTICE' ? '공지' : '자유'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post: any) => (
              <Link href={`/board/detail?id=${post.id}`} key={post.id}>
                <div className="p-6 border-b border-[#f1f3f5] hover:bg-[#fbfcfe] transition group">
                  <div className="flex items-center gap-3 mb-2">
                    {post.category === 'NOTICE' && (
                      <span className="bg-red-50 text-red-400 text-[10px] font-black px-2 py-0.5 rounded-md">공지</span>
                    )}
                    <h2 className="text-lg font-bold text-[#495057] group-hover:text-[#4dabf7] transition">
                      {post.title}
                    </h2>
                  </div>
                  <div className="flex justify-between items-center text-sm text-[#adb5bd]">
                    <div className="flex gap-3">
                      <span>{post.author?.name}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-20 text-center text-gray-400">등록된 게시글이 없습니다.</div>
          )}
        </div>
      </div>
    </main>
  );
}