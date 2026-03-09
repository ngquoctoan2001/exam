import React, { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, BookOpen } from 'lucide-react';
import api from '../services/api';

const SubjectManagement: React.FC = () => {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSubject, setCurrentSubject] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', code: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const response = await api.get('/subjects');
            setSubjects(response.data);
        } catch (error) {
            console.error("Failed to fetch subjects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleOpenModal = (subject: any = null) => {
        setCurrentSubject(subject);
        setFormData(subject ? { name: subject.name, code: subject.code || '' } : { name: '', code: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (currentSubject) {
                await api.put(`/subjects/${currentSubject.id}`, formData);
            } else {
                await api.post('/subjects', formData);
            }
            setIsModalOpen(false);
            fetchSubjects();
        } catch (error) {
            alert("Có lỗi xảy ra khi lưu môn học.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa môn học này?")) {
            try {
                await api.delete(`/subjects/${id}`);
                fetchSubjects();
            } catch (error) {
                alert("Có lỗi xảy ra khi xóa môn học.");
            }
        }
    };

    const filteredSubjects = subjects.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Quản lý Môn học</h2>
                    <p className="text-slate-500 mt-1">Danh sách các môn học trong chương trình.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-100 self-start sm:self-auto"
                >
                    <Plus size={20} />
                    Thêm môn học
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden max-w-3xl">
                <div className="p-6 border-b border-slate-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tên môn học..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên môn học</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-10 text-center text-slate-400">Đang tải dữ liệu...</td>
                                </tr>
                            ) : filteredSubjects.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-10 text-center text-slate-400">Không tìm thấy môn học nào.</td>
                                </tr>
                            ) : filteredSubjects.map((subject) => (
                                <tr key={subject.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                                                <BookOpen size={20} />
                                            </div>
                                            <span className="text-slate-900 font-bold">{subject.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(subject)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(subject.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">
                                {currentSubject ? 'Sửa môn học' : 'Thêm môn học mới'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tên môn học</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        placeholder="Nhập tên môn học..."
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Mã môn học (Tùy chọn)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        placeholder="Ví dụ: MATH, PHYS..."
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-2xl transition-all"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
                                    >
                                        {submitting ? 'Đanh xử lý...' : 'Lưu lại'}
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

export default SubjectManagement;
