'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Users, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { schoolApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const response = await schoolApi.search({ keyword: searchQuery || undefined });
      if (response.success && response.data) {
        const data = response.data;
        setSchools(Array.isArray(data) ? data : (data as any).content || []);
      } else {
        setSchools([]);
      }
    } catch (err) {
      console.error('Failed to load schools:', err);
      setError('학교 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadSchools();
  };

  if (loading) return <Loading />;

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-bold text-3xl sm:text-4xl mb-2 text-slate-900">
            학교 <span className="text-indigo-600">검색</span>
          </h1>
          <p className="text-slate-600">
            원하는 학교의 동아리를 찾아보세요
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="학교명으로 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-20 py-4 bg-white rounded-2xl border border-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-900 placeholder:text-slate-400"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              검색
            </Button>
          </div>
        </form>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school, index) => (
            <motion.div
              key={school.schoolId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link href={`/schools/${school.schoolId}`}>
                <div className="group bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-indigo-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>

                  <h3 className="font-bold text-2xl text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {school.schoolName}
                  </h3>

                  {school.campusName && (
                    <p className="text-sm text-slate-600 mb-4">
                      {school.campusName}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-slate-500 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{school.region || '서울'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{school.groupCount || 0}개 동아리</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {schools.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-lg border border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="font-bold text-2xl text-slate-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-slate-600">
              다른 검색어를 시도해보세요
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
