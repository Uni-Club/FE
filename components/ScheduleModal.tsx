'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
}

export default function ScheduleModal({ isOpen, onClose, onSubmit, initialData }: ScheduleModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startAt: '',
        endAt: '',
        location: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description,
                startAt: initialData.startAt,
                endAt: initialData.endAt,
                location: initialData.location,
            });
        } else {
            setFormData({
                title: '',
                description: '',
                startAt: '',
                endAt: '',
                location: '',
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-xl z-50 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-neutral-900">
                                {initialData ? '일정 수정' : '일정 추가'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    일정 제목
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                                    placeholder="일정 제목을 입력하세요"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    설명
                                </label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all h-24 resize-none"
                                    placeholder="일정 설명을 입력하세요"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        시작 시간
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.startAt}
                                        onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        종료 시간
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.endAt}
                                        onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    장소
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                                    placeholder="장소를 입력하세요"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-200 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 shadow-lg shadow-sky-200 transition-all"
                                >
                                    {initialData ? '수정하기' : '추가하기'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
