'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { School, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { schoolApi } from '@/lib/api';
import ClubCard from '@/components/ClubCard';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

export default function SchoolDetailPage() {
  const params = useParams();
  const [school, setSchool] = useState<any>(null);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSchoolData();
  }, [params.id]);

  const loadSchoolData = async () => {
    try {
      setLoading(true);
      const [schoolResponse, clubsResponse] = await Promise.all([
        schoolApi.getById(Number(params.id)),
        schoolApi.getGroups(Number(params.id)),
      ]);

      if (schoolResponse.success) setSchool(schoolResponse.data);
      if (clubsResponse.success && clubsResponse.data) {
        setClubs(clubsResponse.data.content || []);
      }
    } catch (err) {
      setError('학교 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="pt-28 px-4"><ErrorMessage message={error} /></div>;
  if (!school) return null;

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-medium mb-12"
        >
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-coral rounded-2xl flex items-center justify-center flex-shrink-0">
              <School className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="font-display font-bold text-4xl text-navy mb-2">
                {school.schoolName}
              </h1>
              <div className="flex flex-wrap gap-4 text-navy/60 mb-4">
                {school.campusName && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{school.campusName}</span>
                  </div>
                )}
                {school.region && (
                  <span>{school.region}</span>
                )}
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-navy/60">동아리</p>
                  <p className="font-bold text-2xl text-coral">{school.groupCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-navy/60">사용자</p>
                  <p className="font-bold text-2xl text-coral">{school.userCount || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Clubs */}
        <div className="mb-8">
          <h2 className="font-display font-bold text-3xl text-navy mb-6">
            동아리 목록
          </h2>
        </div>

        {clubs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club, index) => (
              <ClubCard key={club.groupId} club={club} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-navy/60">
            등록된 동아리가 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}
