import React, { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Tag } from 'lucide-react';
import api from '../services/api';

const TeacherManagement: React.FC = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState<any>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        userName: '',
        email: '',
        teacherCode: '',
        password: 'Teacher123!'
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error("Failed to fetch teachers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleOpenModal = (teacher: any = null) => {
        setCurrentTeacher(teacher);
        if (teacher) {
            setFormData({
                fullName: teacher.fullName,
                userName: teacher.userName || '',
                email: teacher.email || '',
                teacherCode: teacher.teacherCode,
                password: ''
            });
        } else {
            setFormData({
                fullName: '',
                userName: '',
                email: '',
                teacherCode: '',
                password: 'Teacher123!'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (currentTeacher) {
                await api.put(`/teachers/${currentTeacher.id}`, formData);
            } else {
                await api.post('/teachers', formData);
            }
            setIsModalOpen(false);
            fetchTeachers();
        } catch (error) {
            alert("Có lỗi xảy ra khi lưu giáo viên.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa giáo viên này?")) {
            try {
                await api.delete(`/teachers/${id}`);
                fetchTeachers();
            } catch (error) {
                alert("Có lỗi xảy ra khi xóa giáo viên.");
            }
        }
    };

    const filteredTeachers = teachers.filter(t =>
        t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.teacherCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Quản lý Giáo viên</h2>
                    <p className="text-slate-500 mt-1">Quản lý danh sách và phân công giáo viên bộ môn.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-100 self-start sm:self-auto"
                >
                    <Plus size={20} />
                    Thêm giáo viên
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tên hoặc mã giáo viên..."
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
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã GV</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Họ và tên</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bộ môn</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400">Đang tải dữ liệu...</td>
                                </tr>
                            ) : filteredTeachers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400">Không tìm thấy giáo viên nào.</td>
                                </tr>
                            ) : filteredTeachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                            {teacher.teacherCode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-bold">
                                                {teacher.fullName.charAt(0)}
                                            </div>
                                            <span className="text-slate-900 font-bold">{teacher.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Tag size={16} className="text-emerald-500" />
                                            <span className="text-sm font-medium text-slate-600">{teacher.subjectNames?.join(', ') || 'Chưa phân công'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(teacher)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(teacher.id)}
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
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 underline decoration-blue-500 decoration-4 underline-offset-8">
                                {currentTeacher ? 'Cập nhật giáo viên' : 'Thêm giáo viên mới'}
                            </h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="Nguyễn Văn A"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Mã giáo viên</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
                                            placeholder="GV001"
                                            value={formData.teacherCode}
                                            onChange={(e) => setFormData({ ...formData, teacherCode: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Tên đăng nhập</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="teacher01"
                                            value={formData.userName}
                                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email công vụ</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="teacher@school.edu.vn"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    {!currentTeacher && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Mật khẩu khởi tạo</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="md:col-span-2 flex gap-3 pt-4 border-t border-slate-50">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-all"
                                    >
                                        Đóng
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
                                    >
                                        {submitting ? 'Đang lưu...' : (currentTeacher ? 'Cập nhật giáo viên' : 'Thêm giáo viên')}
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

export default TeacherManagement;
