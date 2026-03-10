import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, ChevronRight, Save, Download, Filter, User, BarChart3, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';
import authService from '../services/auth.service';

const AcademicTranscript: React.FC = () => {
    const user = authService.getCurrentUser();
    const isStudent = user?.role?.toUpperCase() === 'STUDENT';
    const isTeacher = user?.role?.toUpperCase() === 'TEACHER';
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

    const [scores, setScores] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);

    // Filters
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('Học kỳ 1');
    const [selectedYear, setSelectedYear] = useState('2023-2024');

    const [editingScores, setEditingScores] = useState<any>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const [subRes, classRes] = await Promise.all([
                    api.get('/subjects'),
                    api.get('/classes')
                ]);
                setSubjects(subRes.data);
                setClasses(classRes.data);

                if (isStudent) {
                    fetchStudentScores();
                }
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            }
        };
        fetchInitial();
    }, []);

    const fetchStudentScores = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/scores/student/${user.id}`);
            setScores(res.data);
        } catch (error) {
            console.error("Failed to fetch student scores", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClassScores = async () => {
        if (!selectedClass || !selectedSubject) {
            alert("Vui lòng chọn Lớp và Môn học");
            return;
        }
        setLoading(true);
        try {
            const res = await api.get(`/scores/class-subject`, {
                params: {
                    classId: selectedClass,
                    subjectId: selectedSubject,
                    semester: selectedSemester,
                    academicYear: selectedYear
                }
            });
            setScores(res.data);

            // Initialize editing state
            const editState: any = {};
            res.data.forEach((s: any) => {
                editState[s.studentId] = {
                    score15p1: s.score15p1,
                    score15p2: s.score15p2,
                    score15p3: s.score15p3,
                    scoreMidterm1: s.scoreMidterm1,
                    scoreMidterm2: s.scoreMidterm2,
                    scoreFinal: s.scoreFinal
                };
            });
            setEditingScores(editState);
        } catch (error) {
            console.error("Failed to fetch class scores", error);
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = (studentId: number, field: string, value: string) => {
        const numValue = value === '' ? null : parseFloat(value);
        if (numValue !== null && (numValue < 0 || numValue > 10)) return;

        setEditingScores({
            ...editingScores,
            [studentId]: {
                ...editingScores[studentId],
                [field]: numValue
            }
        });
    };

    const saveScore = async (studentId: number) => {
        setSaving(true);
        try {
            const scoreData = {
                studentId,
                subjectId: selectedSubject,
                semester: selectedSemester,
                academicYear: selectedYear,
                ...editingScores[studentId]
            };
            await api.post('/scores/update', scoreData);
            // Optional: Show micro-success indicator
        } catch (error) {
            alert("Lỗi khi lưu điểm cho sinh viên ID: " + studentId);
        } finally {
            setSaving(false);
        }
    };

    const saveAll = async () => {
        setSaving(true);
        try {
            const promises = Object.keys(editingScores).map(studentId => {
                return api.post('/scores/update', {
                    studentId: parseInt(studentId),
                    subjectId: parseInt(selectedSubject),
                    semester: selectedSemester,
                    academicYear: selectedYear,
                    ...editingScores[studentId]
                });
            });
            await Promise.all(promises);
            alert("Đã lưu bảng điểm thành công!");
            fetchClassScores();
        } catch (error) {
            alert("Có lỗi xảy ra khi lưu bảng điểm.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Học bạ & Bảng điểm</h1>
                    <p className="text-slate-500 font-medium">Theo dõi và quản lý kết quả học tập chi tiết của học sinh.</p>
                </div>
                {!isStudent && (
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition-all">
                            <Download size={18} />
                            Xuất Excel
                        </button>
                    </div>
                )}
            </header>

            {/* Filter Bar */}
            {!isStudent && (
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Năm học</label>
                        <select
                            className="bg-slate-50 border-none rounded-xl px-4 py-2.5 font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option value="2023-2024">2023-2024</option>
                            <option value="2024-2025">2024-2025</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Học kỳ</label>
                        <select
                            className="bg-slate-50 border-none rounded-xl px-4 py-2.5 font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                        >
                            <option value="Học kỳ 1">Học kỳ 1</option>
                            <option value="Học kỳ 2">Học kỳ 2</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Lớp học</label>
                        <select
                            className="bg-slate-50 border-none rounded-xl px-4 py-2.5 font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option value="">Chọn lớp...</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Môn học</label>
                        <select
                            className="bg-slate-50 border-none rounded-xl px-4 py-2.5 font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            <option value="">Chọn môn...</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={fetchClassScores}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-100"
                    >
                        <Filter size={18} />
                        Lọc dữ liệu
                    </button>
                    {(isTeacher || isAdmin) && scores.length > 0 && (
                        <button
                            onClick={saveAll}
                            disabled={saving}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-100 ml-auto"
                        >
                            <Save size={18} />
                            {saving ? 'Đang lưu...' : 'Lưu tất cả'}
                        </button>
                    )}
                </div>
            )}

            {/* Score Table */}
            <div className="bg-white rounded-[40px] shadow-xl border border-slate-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    {isStudent ? 'Môn học' : 'Học sinh'}
                                </th>
                                <th className="px-3 py-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">15p (1)</th>
                                <th className="px-3 py-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">15p (2)</th>
                                <th className="px-3 py-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">15p (3)</th>
                                <th className="px-3 py-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Giữa kỳ 1</th>
                                <th className="px-3 py-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Giữa kỳ 2</th>
                                <th className="px-3 py-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Cuối kỳ</th>
                                <th className="px-6 py-5 text-center text-xs font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 bg-blue-50/30">Trung bình</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                            <p className="text-slate-500 font-bold">Đang tải dữ liệu bảng điểm...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : scores.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
                                            <div className="p-4 bg-slate-50 text-slate-300 rounded-3xl">
                                                <AlertCircle size={40} />
                                            </div>
                                            <p className="text-slate-500 font-medium">Chưa có dữ liệu điểm số. Vui lòng chọn tiêu chí lọc hoặc liên hệ giáo viên.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : scores.map((s) => (
                                <tr key={isStudent ? s.subjectId : s.studentId} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${isStudent ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {(isStudent ? s.subjectName : s.studentName).charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{isStudent ? s.subjectName : s.studentName}</p>
                                                {!isStudent && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {s.studentId}</p>}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Scores Rendering */}
                                    {['score15p1', 'score15p2', 'score15p3', 'scoreMidterm1', 'scoreMidterm2', 'scoreFinal'].map(field => (
                                        <td key={field} className="px-3 py-4 text-center">
                                            {isStudent ? (
                                                <span className={`font-bold ${s[field] < 5 ? 'text-red-500' : 'text-slate-700'}`}>
                                                    {s[field] !== null ? s[field].toFixed(1) : '-'}
                                                </span>
                                            ) : (
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="10"
                                                    className="w-16 p-2 bg-slate-50 border-none rounded-lg text-center font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none no-spinner"
                                                    value={editingScores[s.studentId]?.[field] ?? ''}
                                                    onChange={(e) => handleScoreChange(s.studentId, field, e.target.value)}
                                                />
                                            )}
                                        </td>
                                    ))}

                                    <td className="px-6 py-4 text-center bg-blue-50/10">
                                        <div className={`inline-block px-4 py-2 rounded-2xl font-black text-lg ${(s.averageScore || 0) >= 8 ? 'text-emerald-600 bg-emerald-50' :
                                                (s.averageScore || 0) >= 5 ? 'text-blue-600 bg-blue-50' :
                                                    s.averageScore === null ? 'text-slate-300' : 'text-red-600 bg-red-50'
                                            }`}>
                                            {s.averageScore !== null ? s.averageScore.toFixed(1) : '-'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Performance Insights (Student Only) */}
            {isStudent && scores.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-[40px] text-white space-y-4 shadow-xl shadow-blue-100">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="text-lg font-bold">Xếp loại học tập</h3>
                        <div className="text-4xl font-black">
                            {Math.max(...scores.map(s => s.averageScore || 0)) >= 9 ? 'Xuất sắc' :
                                Math.max(...scores.map(s => s.averageScore || 0)) >= 8 ? 'Giỏi' : 'Khá'}
                        </div>
                        <p className="text-blue-100 text-sm opacity-80">Dựa trên điểm trung bình cao nhất các môn học.</p>
                    </div>

                    <div className="col-span-1 md:col-span-2 bg-white p-8 rounded-[40px] shadow-lg border border-slate-50 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Clock size={20} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">Lịch sử cập nhật</h3>
                        </div>
                        <div className="space-y-4">
                            {scores.slice(0, 3).map((s, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="font-bold text-slate-700">Môn {s.subjectName} đã cập nhật điểm mới</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">1 giờ trước</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicTranscript;
