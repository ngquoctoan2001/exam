import React, { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Tag, LogOut, Settings } from 'lucide-react';
import api from '../services/api';

const TeacherManagement: React.FC = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState<any>(null);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [filterSubject, setFilterSubject] = useState<string>('all');
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        userName: '',
        email: '',
        teacherCode: '',
        subjectId: '',
        position: 'Giáo viên bộ môn',
        password: 'Teacher123!'
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [teachersRes, subjectsRes] = await Promise.all([
                api.get('/teachers'),
                api.get('/subjects')
            ]);
            setTeachers(teachersRes.data);
            setSubjects(subjectsRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleOpenModal = (teacher: any = null) => {
        setCurrentTeacher(teacher);
        if (teacher) {
            setFormData({
                fullName: teacher.fullName,
                userName: teacher.userName || '',
                email: teacher.email || '',
                teacherCode: teacher.teacherCode,
                subjectId: teacher.subjectId || '',
                position: teacher.position || 'Giáo viên bộ môn',
                password: ''
            });
        } else {
            setFormData({
                fullName: '',
                userName: '',
                email: '',
                teacherCode: '',
                subjectId: '',
                position: 'Giáo viên bộ môn',
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
            fetchInitialData();
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
                fetchInitialData();
            } catch (error) {
                alert("Có lỗi xảy ra khi xóa giáo viên.");
            }
        }
    };

    const filteredTeachers = teachers.filter(t => {
        const matchesSearch = t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.teacherCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = filterSubject === 'all' || t.subjectId?.toString() === filterSubject;
        return matchesSearch && matchesSubject;
    });

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
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tên hoặc mã giáo viên..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">Bộ môn:</span>
                        <select
                            className="w-full md:w-48 px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium text-slate-700"
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
                        >
                            <option value="all">Tất cả bộ môn</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
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
                            ) : filteredTeachers.map((teacher) => {
                                return (
                                    <tr
                                        key={teacher.id}
                                        className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                                        onClick={() => setSelectedTeacher(teacher)}
                                    >
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
                                                <span className="text-sm font-medium text-slate-600">
                                                    {subjects.find(s => s.id === teacher.subjectId)?.name || 'Chưa phân công'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleOpenModal(teacher); }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(teacher.id); }}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-10">
                            <h3 className="text-3xl font-black text-slate-900 mb-8 font-display">
                                {currentTeacher ? 'Cập nhật giáo viên' : 'Thêm giáo viên mới'}
                            </h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="Nguyễn Thị B"
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
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Bộ môn giảng dạy</label>
                                        <select
                                            disabled={!!currentTeacher}
                                            className={`w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer font-medium ${currentTeacher ? 'opacity-60 cursor-not-allowed' : ''}`}
                                            value={formData.subjectId}
                                            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                        >
                                            <option value="">Chọn bộ môn...</option>
                                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                        {currentTeacher && <p className="text-[10px] text-slate-400 mt-1 ml-1">* Bộ môn là cố định cho mỗi giáo viên.</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Chức vụ / Vị trí</label>
                                        <select
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                                            value={formData.position}
                                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        >
                                            <option value="Giáo viên bộ môn">Giáo viên bộ môn</option>
                                            <option value="Tổ trưởng chuyên môn">Tổ trưởng chuyên môn</option>
                                            <option value="Ban giám hiệu">Ban giám hiệu</option>
                                            <option value="Giáo viên chủ nhiệm">Giáo viên chủ nhiệm</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Tên đăng nhập</label>
                                        <input
                                            type="text"
                                            required
                                            readOnly={!!currentTeacher}
                                            className={`w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all ${currentTeacher ? 'opacity-60 cursor-not-allowed' : ''}`}
                                            placeholder="teacher01"
                                            value={formData.userName}
                                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                        />
                                        {currentTeacher && <p className="text-[10px] text-slate-400 mt-1 ml-1">* Tên đăng nhập không thể thay đổi.</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email công vụ</label>
                                        <input
                                            type="email"
                                            required
                                            readOnly={!!currentTeacher}
                                            className={`w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all ${currentTeacher ? 'opacity-60 cursor-not-allowed' : ''}`}
                                            placeholder="teacher@school.edu.vn"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        {currentTeacher && <p className="text-[10px] text-slate-400 mt-1 ml-1">* Email không thể thay đổi.</p>}
                                    </div>
                                    {!currentTeacher && (
                                        <div>
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

                                <div className="md:col-span-2 flex gap-3 pt-6 border-t border-slate-50">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all disabled:opacity-50"
                                    >
                                        {submitting ? 'Đang lưu dữ liệu...' : (currentTeacher ? 'Cập nhật giáo viên' : 'Lưu thông tin')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedTeacher && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white relative">
                            <button
                                onClick={() => setSelectedTeacher(null)}
                                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            >
                                <Plus size={24} className="rotate-45" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-bold">
                                    {selectedTeacher.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{selectedTeacher.fullName}</h3>
                                    <p className="text-blue-100 opacity-80">{selectedTeacher.teacherCode}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bộ môn chính</p>
                                    <p className="text-slate-900 font-bold flex items-center gap-2">
                                        <Tag size={16} className="text-blue-500" />
                                        {subjects.find(s => s.id === selectedTeacher.subjectId)?.name || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Chức vụ</p>
                                    <p className="text-slate-900 font-bold">{selectedTeacher.position || 'Giáo viên bộ môn'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email liên hệ</p>
                                    <p className="text-slate-900 font-medium">{selectedTeacher.email || 'Chưa cập nhật'}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex gap-3">
                                <button
                                    onClick={() => { setSelectedTeacher(null); handleOpenModal(selectedTeacher); }}
                                    className="flex-1 py-3 bg-blue-50 text-blue-600 font-bold rounded-2xl hover:bg-blue-100 transition-all"
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => setSelectedTeacher(null)}
                                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherManagement;
