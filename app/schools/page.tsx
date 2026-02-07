'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Users, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { schoolApi } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

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
        const data = response.data as { content?: unknown[] };
        setSchools(data.content || []);
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
    <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-bold text-3xl sm:text-4xl mb-2 text-gray-900">
            학교 <span className="text-blue-500">검색</span>
          </h1>
          <p className="text-gray-600">
            원하는 학교의 동아리를 찾아보세요
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="학교명으로 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-20 py-4 bg-white rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-900 placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600"
            >
              검색
            </button>
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
                <div className="group bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>

                  <h3 className="font-bold text-2xl text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
                    {school.schoolName}
                  </h3>

                  {school.campusName && (
                    <p className="text-sm text-gray-600 mb-4">
                      {school.campusName}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-200">
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
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-bold text-2xl text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600">
              다른 검색어를 시도해보세요
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
