'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, Plus } from 'lucide-react';
import { recruitmentApi } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

interface CustomField {
  fieldName: string;
  fieldType: 'text' | 'number' | 'textarea' | 'select';
  required: boolean;
  placeholder: string;
  options: string[];
}

function NewRecruitmentContent() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    applyStart: '',
    applyEnd: '',
    capacity: '',
  });
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [newField, setNewField] = useState<CustomField>({
    fieldName: '',
    fieldType: 'text',
    required: false,
    placeholder: '',
    options: [],
  });
  const [optionInput, setOptionInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');

      const tags = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const response = await recruitmentApi.create({
        groupId: Number(params.groupId),
        title: formData.title,
        content: formData.content,
        category: formData.category || undefined,
        tags: tags.length > 0 ? tags : undefined,
        applyStart: formData.applyStart,
        applyEnd: formData.applyEnd,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
        customFields: customFields.length > 0 ? customFields : undefined,
      });

      if (response.success) {
        toast({ title: '모집공고가 생성되었습니다!', variant: 'success' });
        const data: any = response.data;
        router.push(`/recruitments/${data.recruitmentId}`);
      } else {
        setError(response.error?.message || '생성에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '생성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const addCustomField = () => {
    if (!newField.fieldName.trim()) {
      toast({ title: '항목 이름을 입력해주세요.', variant: 'warning' });
      return;
    }
    if (newField.fieldType === 'select' && newField.options.length === 0) {
      toast({ title: '선택 항목의 옵션을 추가해주세요.', variant: 'warning' });
      return;
    }
    setCustomFields([...customFields, { ...newField }]);
    setNewField({
      fieldName: '',
      fieldType: 'text',
      required: false,
      placeholder: '',
      options: [],
    });
    setShowFieldModal(false);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const addOption = () => {
    if (optionInput.trim()) {
      setNewField({ ...newField, options: [...newField.options, optionInput.trim()] });
      setOptionInput('');
    }
  };

  const removeOption = (index: number) => {
    setNewField({ ...newField, options: newField.options.filter((_, i) => i !== index) });
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-slate-50 px-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">모집공고 작성</h1>
          <p className="text-slate-500 text-sm mt-1">동아리 모집공고를 작성합니다</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="2025 봄학기 신입 부원 모집"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                placeholder="모집공고 내용을 작성하세요..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm resize-none"
              />
            </div>

            {/* 지원 기간 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  지원 시작일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.applyStart}
                  onChange={(e) => setFormData({ ...formData, applyStart: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  지원 마감일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.applyEnd}
                  onChange={(e) => setFormData({ ...formData, applyEnd: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* 카테고리, 모집 인원 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  카테고리 <span className="text-slate-400 text-xs">(선택)</span>
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="IT/프로그래밍"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  모집 인원 <span className="text-slate-400 text-xs">(선택)</span>
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="제한 없음"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* 태그 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                태그 <span className="text-slate-400 text-xs">(선택, 쉼표로 구분)</span>
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="프로그래밍, 웹개발, 초보환영"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            {/* 지원서 추가 항목 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  지원서 추가 항목 <span className="text-slate-400 text-xs">(선택)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowFieldModal(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  항목 추가
                </button>
              </div>

              {customFields.length > 0 ? (
                <div className="space-y-2">
                  {customFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div>
                        <span className="font-medium text-slate-900 text-sm">{field.fieldName}</span>
                        <span className="ml-2 text-xs text-slate-500">
                          ({field.fieldType === 'text' ? '텍스트' :
                            field.fieldType === 'number' ? '숫자' :
                            field.fieldType === 'textarea' ? '장문' : '선택'})
                        </span>
                        {field.required && (
                          <span className="ml-1 text-xs text-red-500">필수</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCustomField(index)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">추가된 항목이 없습니다</p>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => router.back()}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? '작성 중...' : '작성완료'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* 커스텀 필드 추가 모달 */}
      {showFieldModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowFieldModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl z-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">지원서 항목 추가</h3>
              <button
                onClick={() => setShowFieldModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  항목 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newField.fieldName}
                  onChange={(e) => setNewField({ ...newField, fieldName: e.target.value })}
                  placeholder="예: 자기소개"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">입력 유형</label>
                <select
                  value={newField.fieldType}
                  onChange={(e) => setNewField({ ...newField, fieldType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="text">텍스트 (한 줄)</option>
                  <option value="textarea">장문 (여러 줄)</option>
                  <option value="number">숫자</option>
                  <option value="select">선택</option>
                </select>
              </div>

              {newField.fieldType === 'select' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">선택 옵션</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                      placeholder="옵션 입력 후 Enter"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={addOption}
                    >
                      추가
                    </Button>
                  </div>
                  {newField.options.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newField.options.map((opt, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-sm"
                        >
                          {opt}
                          <button
                            type="button"
                            onClick={() => removeOption(i)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  플레이스홀더 <span className="text-slate-400 text-xs">(선택)</span>
                </label>
                <input
                  type="text"
                  value={newField.placeholder}
                  onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                  placeholder="입력란에 표시될 안내 문구"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">필수 항목</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setShowFieldModal(false)}
              >
                취소
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={addCustomField}
              >
                추가하기
              </Button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default function NewRecruitmentPage() {
  return (
    <AuthGuard>
      <NewRecruitmentContent />
    </AuthGuard>
  );
}
