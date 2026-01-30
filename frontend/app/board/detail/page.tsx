'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function PostDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  
  const [post, setPost] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    if (id) {
      fetch(`http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/posts/${id}`)
        .then((res) => res.json())
        .then((data) => setPost(data))
        .catch((err) => console.error('데이터 로딩 실패:', err));
    }
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('로그인이 필요합니다.');

    const res = await fetch(`http://futsal-backend-alb-2038761267.ap-northeast-2.elb.amazonaws.com/posts/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: comment }),
    });

    if (res.ok) {
      setComment('');
      window.location.reload();
    } else {
      alert('댓글 등록에 실패했습니다.');
    }
  };

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
      <p className="text-gray-400">게시글을 불러오는 중...</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8">
      <article className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#4dabf7] font-bold text-sm">
            {post.category === 'NOTICE' ? '공지사항' : '자유게시판'}
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 text-sm">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-[#343a40] mb-6">{post.title}</h1>
        
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-50">
          <div className="w-10 h-10 bg-[#e7f5ff] rounded-full flex items-center justify-center text-[#1971c2] font-bold">
            {post.author?.name ? post.author.name[0] : '?'}
          </div>
          <span className="font-medium text-[#495057]">{post.author?.name}</span>
        </div>
        
        <p className="text-[#495057] leading-relaxed whitespace-pre-wrap min-h-[200px]">
          {post.content}
        </p>
      </article>

      <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50">
        <h3 className="text-xl font-bold mb-6 text-[#343a40]">
          댓글 {post.comments?.length || 0}
        </h3>
        
        {user && (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea 
              className="w-full p-4 bg-[#fbfcfe] rounded-2xl border border-[#f1f3f5] focus:outline-none focus:ring-2 focus:ring-[#4dabf7] resize-none"
              placeholder="따뜻한 댓글을 남겨주세요."
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <div className="flex justify-end mt-2">
              <button className="bg-[#4dabf7] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#339af0] transition">
                댓글 등록
              </button>
            </div>
          </form>
        )}

        {/* 댓글 목록 */}
        <div className="space-y-6">
          {post.comments?.map((c: any) => (
            <div key={c.id} className="pb-6 border-b border-gray-50 last:border-0">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-sm text-[#495057]">{c.author?.name}</span>
                <span className="text-xs text-gray-300">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-[#868e96]">{c.content}</p>
            </div>
          ))}
          {(!post.comments || post.comments.length === 0) && (
            <p className="text-center text-gray-400 py-4 text-sm">첫 번째 댓글을 남겨보세요!</p>
          )}
        </div>
      </section>

      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => router.push('/board')}
          className="text-gray-400 hover:text-[#4dabf7] font-medium text-sm transition"
        >
          ← 목록으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] p-8">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-400">페이지를 준비하고 있습니다...</p>
        </div>
      }>
        <PostDetailContent />
      </Suspense>
    </main>
  );
}