import React, { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, FileUp, Users } from 'lucide-react';
import api from '../services/api';

const StudentManagement: React.FC = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [classes, setClasses] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState<any>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        userName: '',
        email: '',
        studentCode: '',
        classId: '',
        password: 'Student123!'
    });
    const [importFile, setImportFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sRes, cRes] = await Promise.all([
                api.get('/students'),
                api.get('/classes')
            ]);
            setStudents(sRes.data);
            setClasses(cRes.data);
        } catch (error) {
            console.error("Failed to fetch students data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (student: any = null) => {
        setCurrentStudent(student);
        if (student) {
            setFormData({
                fullName: student.fullName,
                userName: student.userName || '',
                email: student.email || '',
                studentCode: student.studentCode,
                classId: student.classId?.toString() || '',
                password: '' // Don't show password on edit
            });
        } else {
            setFormData({
                fullName: '',
                userName: '',
                email: '',
                studentCode: '',
                classId: '',
                password: 'Student123!'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (currentStudent) {
                await api.put(`/students/${currentStudent.id}`, formData);
            } else {
                await api.post('/students', formData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert("Có lỗi xảy ra khi lưu học sinh.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleImportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!importFile) return;

        setSubmitting(true);
        const data = new FormData();
        data.append('file', importFile);

        try {
            await api.post('/students/import', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsImportModalOpen(false);
            fetchData();
            alert("Import học sinh thành công!");
        } catch (error) {
            alert("Có lỗi xảy ra khi import học sinh.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) {
            try {
                await api.delete(`/students/${id}`);
                fetchData();
            } catch (error) {
                alert("Có lỗi xảy ra khi xóa học sinh.");
            }
        }
    };

    const filteredStudents = students.filter(s =>
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Quản lý Học sinh</h2>
                    <p className="text-slate-500 mt-1">Danh sách học sinh toàn trường và theo lớp.</p>
                </div>
                <div className="flex gap-3 self-start sm:self-auto">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all"
                    >
                        <FileUp size={18} />
                        Import Excel
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-100"
                    >
                        <Plus size={20} />
                        Thêm học sinh
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tên hoặc mã học sinh..."
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
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã HS</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Họ và tên</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lớp</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400">Đang tải dữ liệu...</td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400">Không tìm thấy học sinh nào.</td>
                                </tr>
                            ) : filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                            {student.studentCode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-bold">
                                                {student.fullName.charAt(0)}
                                            </div>
                                            <span className="text-slate-900 font-bold">{student.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-slate-400" />
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                {student.className || 'Chưa xếp lớp'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(student)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
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

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 font-display">
                                {currentStudent ? 'Cập nhật thông tin học sinh' : 'Thêm học sinh mới'}
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
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Mã học sinh</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
                                            placeholder="HS001"
                                            value={formData.studentCode}
                                            onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Lớp học</label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer"
                                            value={formData.classId}
                                            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                        >
                                            <option value="">Chọn lớp học...</option>
                                            {classes.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Tên đăng nhập</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="student001"
                                            value={formData.userName}
                                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="student@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    {!currentStudent && (
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Mật khẩu mới</label>
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
                                        className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all font-display disabled:opacity-50"
                                    >
                                        {submitting ? 'Đang lưu dữ liệu...' : (currentStudent ? 'Cập nhật tài khoản' : 'Tạo mới học sinh')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Import học sinh từ Excel</h3>
                            <form onSubmit={handleImportSubmit} className="space-y-6">
                                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept=".xlsx, .xls"
                                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                                    />
                                    <FileUp className="mx-auto text-slate-300 mb-4" size={48} />
                                    <p className="text-slate-600 font-medium">
                                        {importFile ? importFile.name : "Kéo thả file hoặc click để chọn"}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">Định dạng hỗ trợ: .xlsx, .xls</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsImportModalOpen(false)}
                                        className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-2xl transition-all"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!importFile || submitting}
                                        className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
                                    >
                                        {submitting ? 'Đang xử lý...' : 'Bắt đầu Import'}
                                    </button>
                                </div>
                                <p className="text-xs text-center text-slate-400">
                                    Mật khẩu mặc định sẽ là <span className="font-bold">Student123!</span>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
