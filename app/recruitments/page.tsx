'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Users, Eye } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { recruitmentApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

export default function RecruitmentsPage() {
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadRecruitments();
  }, [selectedCategory]);

  const loadRecruitments = async () => {
    try {
      setLoading(true);
      const response = await recruitmentApi.search({
        keyword: searchQuery,
        category: selectedCategory || undefined,
        status: 'PUBLISHED',
      });
      if (response.success && response.data) {
        setRecruitments(response.data.content || []);
      }
    } catch (err) {
      setError('모집공고를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadRecruitments();
  };

  if (loading) return <Loading />;

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="font-display font-bold text-5xl sm:text-6xl mb-4">
            모집공고 <span className="text-gradient">둘러보기</span>
          </h1>
          <p className="text-xl text-navy/70">
            지금 모집 중인 동아리를 찾아보세요
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy/40" />
            <input
              type="text"
              placeholder="모집공고 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-navy/10 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all"
            />
          </div>
        </form>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recruitments.map((recruitment, index) => (
            <motion.div
              key={recruitment.recruitmentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/recruitments/${recruitment.recruitmentId}`}>
                <div className="group bg-white rounded-2xl p-6 hover:shadow-medium transition-all duration-300 border border-navy/5">
                  <h3 className="font-display font-bold text-xl text-navy mb-2 group-hover:text-coral transition-colors line-clamp-2">
                    {recruitment.title}
                  </h3>
                  <p className="text-sm text-navy/60 mb-4">
                    {recruitment.group?.groupName} • {recruitment.group?.school?.schoolName}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-navy/60 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{recruitment.applicantCount || 0}/{recruitment.capacity || '∞'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{recruitment.views || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-navy/60">
                    <Calendar className="w-4 h-4" />
                    <span>~{new Date(recruitment.applyEnd).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {recruitments.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-navy/60">모집 중인 공고가 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
}
