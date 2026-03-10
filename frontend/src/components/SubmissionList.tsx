import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search, Filter, ChevronRight, Clock, CheckCircle2,
    AlertCircle, FileText, LayoutGrid
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const SubmissionList: React.FC = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [exam, setExam] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [examRes, submissionsRes] = await Promise.all([
                    api.get(`/exams/${examId}`),
                    api.get(`/grading/exam/${examId}/search`)
                ]);
                setExam(examRes.data);
                setSubmissions(submissionsRes.data);
            } catch (error) {
                console.error("Failed to fetch submissions", error);
            } finally {
                setLoading(false);
            }
        };
        if (examId) fetchData();
    }, [examId]);

    const filteredSubmissions = submissions.filter(s => {
        const matchesSearch = s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'graded' && s.isGraded) ||
            (statusFilter === 'pending' && !s.isGraded);
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="p-12 text-center text-slate-400 font-bold">Đang tải danh sách bài nộp...</div>;

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <LayoutGrid size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Quản lý chấm bài</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 leading-tight">
                        Bài nộp: {exam?.title}
                    </h2>
                    <p className="text-slate-500 font-medium">Tổng số: {submissions.length} bài nộp từ học sinh.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/exams')}
                    className="self-start md:self-auto px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                    Quay lại
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase">Đã nộp</p>
                        <h4 className="text-xl font-black text-slate-900">{submissions.length}</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase">Đã chấm</p>
                        <h4 className="text-xl font-black text-slate-900">
                            {submissions.filter(s => s.isGraded).length}
                        </h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase">Chờ chấm</p>
                        <h4 className="text-xl font-black text-slate-900">
                            {submissions.filter(s => !s.isGraded).length}
                        </h4>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm tên hoặc mã học sinh..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Filter size={18} className="text-slate-400" />
                        <select
                            className="px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700 cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="pending">Chờ chấm điểm</option>
                            <option value="graded">Đã hoàn thành</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Học sinh</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Thời gian nộp</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Điểm số</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredSubmissions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic font-medium">
                                        Không tìm thấy bài nộp nào phù hợp.
                                    </td>
                                </tr>
                            ) : filteredSubmissions.map((sub) => (
                                <tr
                                    key={sub.attemptId}
                                    className="hover:bg-blue-50/20 transition-all group pointer-events-auto cursor-default"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                                                {sub.studentName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{sub.studentName}</p>
                                                <p className="text-xs font-bold text-slate-400 font-mono uppercase">{sub.studentCode}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-slate-500">
                                        {new Date(sub.submissionTime).toLocaleString('vi-VN')}
                                    </td>
                                    <td className="px-8 py-5">
                                        {sub.isGraded ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-600">
                                                <CheckCircle2 size={14} />
                                                Đã chấm
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-600">
                                                <AlertCircle size={14} />
                                                Chờ chấm điểm
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className={`text-xl font-black ${sub.score >= 5 ? 'text-blue-600' : 'text-slate-400'}`}>
                                            {sub.isGraded ? sub.finalScore.toFixed(1) : '--'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => navigate(`/admin/grading/${sub.attemptId}`)}
                                            className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubmissionList;
