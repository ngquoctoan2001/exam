import React, { useState } from 'react';
import { Plus, Search, Filter, FileCode, HelpCircle, Pencil, Trash2, Tag, FileUp } from 'lucide-react';


const QuestionBank: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const questions = [
        {
            id: 1,
            content: 'Công thức tính diện tích hình tròn là gì?',
            subject: 'Toán học',
            type: 'Trắc nghiệm',
            difficulty: 'Dễ',
            difficultyColor: 'bg-emerald-50 text-emerald-600',
            createdAt: '2026-03-05'
        },
        {
            id: 2,
            content: 'Phân tích nhân vật Huấn Cao trong tác phẩm Chữ người tử tù.',
            subject: 'Ngữ văn',
            type: 'Tự luận',
            difficulty: 'Khó',
            difficultyColor: 'bg-red-50 text-red-600',
            createdAt: '2026-03-06'
        },
        {
            id: 3,
            content: 'Who is the author of "Hamlet"?',
            subject: 'Tiếng Anh',
            type: 'Trắc nghiệm',
            difficulty: 'Trung bình',
            difficultyColor: 'bg-amber-50 text-amber-600',
            createdAt: '2026-03-07'
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Ngân hàng câu hỏi</h2>
                    <p className="text-slate-500 mt-1">Quản lý và tổ chức các câu hỏi cho kỳ thi.</p>
                </div>
                <div className="flex gap-3 self-start sm:self-auto">
                    <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all">
                        <FileUp size={18} />
                        Import (Word/PDF)
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-100">
                        <Plus size={20} />
                        Thêm câu hỏi
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm nội dung câu hỏi..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all whitespace-nowrap">
                            <Filter size={18} />
                            Lọc môn học
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all whitespace-nowrap">
                            <Tag size={18} />
                            Độ khó
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nội dung câu hỏi</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Môn học</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Loại</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Độ khó</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {questions.map((q) => (
                                <tr key={q.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4 max-w-md">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 text-blue-500 shrink-0">
                                                <HelpCircle size={18} />
                                            </div>
                                            <span className="text-slate-900 font-medium line-clamp-2">{q.content}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                        {q.subject}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <FileCode size={16} className="text-slate-400" />
                                            {q.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${q.difficultyColor}`}>
                                            {q.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {q.createdAt}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                <Pencil size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <p className="text-sm text-slate-500">Hiển thị 3 trên 3 câu hỏi</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all shadow-sm">Trước</button>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all shadow-sm">Sau</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionBank;
