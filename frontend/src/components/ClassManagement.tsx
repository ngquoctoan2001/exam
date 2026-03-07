import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Users as UsersIcon } from 'lucide-react';

const ClassManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const classes = [
        { id: 1, name: '10A1', grade: 10, teacher: 'Nguyễn Văn A', students: 42 },
        { id: 2, name: '10A2', grade: 10, teacher: 'Trần Thị B', students: 40 },
        { id: 3, name: '11A1', grade: 11, teacher: 'Lê Văn C', students: 38 },
        { id: 4, name: '12C3', grade: 12, teacher: 'Phạm Minh D', students: 45 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Quản lý lớp học</h2>
                    <p className="text-slate-500 mt-1">Danh sách tất cả các lớp học trong hệ thống.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-100 shrink-0 self-start sm:self-auto">
                    <Plus size={20} />
                    Thêm lớp mới
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm lớp, giáo viên..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all w-full sm:w-auto justify-center">
                        <Filter size={18} />
                        Bộ lọc
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên lớp</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Khối</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Giáo viên chủ nhiệm</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Sĩ số</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {classes.map((cls) => (
                                <tr key={cls.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <UsersIcon size={20} />
                                            </div>
                                            <span className="font-bold text-slate-900">{cls.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                            Khối {cls.grade}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        {cls.teacher}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-slate-900 font-bold">{cls.students}</span>
                                        <span className="text-slate-400 text-xs ml-1">h/s</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Hiển thị 1 - 4 trên 4 kết quả</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm disabled:opacity-50">Trước</button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm shadow-sm">1</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm disabled:opacity-50">Sau</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassManagement;
