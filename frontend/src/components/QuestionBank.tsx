import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, BookOpen, Tag, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';

const QuestionBank: React.FC = () => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [questionTypes, setQuestionTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [formData, setFormData] = useState<any>({
        content: '',
        subjectId: '',
        questionTypeId: '',
        difficultyLevel: 3,
        options: []
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [qRes, sRes, tRes] = await Promise.all([
                api.get('/questions'),
                api.get('/subjects'),
                api.get('/questions/types')
            ]);
            setQuestions(qRes.data);
            setSubjects(sRes.data);
            setQuestionTypes(tRes.data);
        } catch (error) {
            console.error("Failed to fetch questionnaire data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (question: any = null) => {
        if (question) {
            setCurrentQuestion(question);
            setFormData({
                content: question.content,
                subjectId: question.subjectId.toString(),
                questionTypeId: question.questionTypeId.toString(),
                difficultyLevel: question.difficultyLevel,
                options: question.options ? question.options.map((o: any) => ({ ...o })) : []
            });
        } else {
            setCurrentQuestion(null);
            setFormData({
                content: '',
                subjectId: subjects[0]?.id.toString() || '',
                questionTypeId: questionTypes[0]?.id.toString() || '',
                difficultyLevel: 3,
                options: []
            });
        }
        setIsModalOpen(true);
    };

    const handleAddOption = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { content: '', isCorrect: false }]
        });
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = [...formData.options];
        newOptions.splice(index, 1);
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                subjectId: parseInt(formData.subjectId),
                questionTypeId: parseInt(formData.questionTypeId)
            };

            if (currentQuestion) {
                await api.put(`/questions/${currentQuestion.id}`, payload);
            } else {
                await api.post('/questions', payload);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert("Có lỗi xảy ra khi lưu câu hỏi.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
            try {
                await api.delete(`/questions/${id}`);
                fetchData();
            } catch (error) {
                alert("Có lỗi xảy ra khi xóa câu hỏi.");
            }
        }
    };

    const filteredQuestions = questions.filter(q => {
        const content = q.content || '';
        const matchesSearch = content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === 'all' || q.subjectId.toString() === selectedSubject;
        return matchesSearch && matchesSubject;
    });

    const getDifficultyColor = (level: number) => {
        switch (level) {
            case 1: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 2: return 'bg-blue-50 text-blue-600 border-blue-100';
            case 3: return 'bg-amber-50 text-amber-600 border-amber-100';
            case 4: return 'bg-orange-50 text-orange-600 border-orange-100';
            case 5: return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getDifficultyLabel = (level: number) => {
        switch (level) {
            case 1: return 'Rất dễ';
            case 2: return 'Dễ';
            case 3: return 'Trung bình';
            case 4: return 'Khó';
            case 5: return 'Rất khó';
            default: return 'Không xác định';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Ngân hàng câu hỏi</h2>
                    <p className="text-slate-500 mt-1">Quản lý và tổ chức kho câu hỏi cho các kỳ thi.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-100 self-start sm:self-auto"
                >
                    <Plus size={20} />
                    Tạo câu hỏi mới
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm nội dung câu hỏi..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <select
                            className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer min-w-[160px]"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            <option value="all">Tất cả môn học</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => alert("Tính năng lọc nâng cao đang được phát triển.")}
                            className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all"
                        >
                            <Filter size={18} />
                            Bộ lọc nâng cao
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {loading ? (
                        <div className="py-10 text-center text-slate-400">Đang tải dữ liệu...</div>
                    ) : filteredQuestions.length === 0 ? (
                        <div className="py-10 text-center text-slate-400">Không tìm thấy câu hỏi nào.</div>
                    ) : (
                        filteredQuestions.map((q) => (
                            <div key={q.id} className="p-5 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all group relative">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                                                {q.questionTypeName}
                                            </span>
                                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                                                {q.subjectName}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(q.difficultyLevel)}`}>
                                                {getDifficultyLabel(q.difficultyLevel)}
                                            </span>
                                        </div>
                                        <div className="text-slate-800 font-medium line-clamp-2 leading-relaxed mt-3" dangerouslySetInnerHTML={{ __html: q.content }} />
                                        <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
                                            <div className="flex items-center gap-1">
                                                <Tag size={14} />
                                                <span>{q.options?.length || 0} lựa chọn</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen size={14} />
                                                <span>Câu ID: #{q.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => handleOpenModal(q)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(q.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 border-l-4 border-blue-600 pl-4">
                                {currentQuestion ? 'Sửa câu hỏi' : 'Tạo câu hỏi mới'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Môn học</label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            value={formData.subjectId}
                                            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                        >
                                            <option value="">Chọn môn học...</option>
                                            {subjects.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Loại câu hỏi</label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            value={formData.questionTypeId}
                                            onChange={(e) => setFormData({ ...formData, questionTypeId: e.target.value })}
                                        >
                                            <option value="">Chọn loại câu...</option>
                                            {questionTypes.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Độ khó</label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            value={formData.difficultyLevel}
                                            onChange={(e) => setFormData({ ...formData, difficultyLevel: parseInt(e.target.value) })}
                                        >
                                            <option value="1">Rất dễ</option>
                                            <option value="2">Dễ</option>
                                            <option value="3">Trung bình</option>
                                            <option value="4">Khó</option>
                                            <option value="5">Rất khó</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nội dung câu hỏi</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                                        placeholder="Nhập nội dung câu hỏi..."
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    />
                                </div>

                                {/* Options for MCQ */}
                                {(formData.questionTypeId === '1' || formData.questionTypeId === '2' || formData.questionTypeId === 'MCQ') && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-semibold text-slate-700">Các phương án trả lời</label>
                                            <button
                                                type="button"
                                                onClick={handleAddOption}
                                                className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 text-sm bg-blue-50 px-3 py-1.5 rounded-xl transition-all"
                                            >
                                                <Plus size={16} /> Thêm phương án
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {formData.options.map((opt: any, index: number) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-100 transition-all cursor-pointer"
                                                        checked={opt.isCorrect}
                                                        onChange={(e) => {
                                                            const newOpt = [...formData.options];
                                                            newOpt[index].isCorrect = e.target.checked;
                                                            setFormData({ ...formData, options: newOpt });
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        required
                                                        className="flex-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                        placeholder={`Phương án ${index + 1}...`}
                                                        value={opt.content}
                                                        onChange={(e) => {
                                                            const newOpt = [...formData.options];
                                                            newOpt[index].content = e.target.value;
                                                            setFormData({ ...formData, options: newOpt });
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveOption(index)}
                                                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-6 mt-6 border-t border-slate-50">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-[20px] transition-all"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-[20px] hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all disabled:opacity-50"
                                    >
                                        {submitting ? 'Đang xử lý...' : (currentQuestion ? 'Cập nhật câu hỏi' : 'Lưu câu hỏi')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionBank;
