import React from 'react';
import { Printer, Download, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExamA4View: React.FC<{ exam: any }> = ({ exam }) => {
    const navigate = useNavigate();

    if (!exam) return <div className="p-10 text-center text-slate-400 font-bold">Không tìm thấy dữ liệu đề thi.</div>;

    return (
        <div className="min-h-screen bg-slate-100 py-12 px-4 pb-32">
            <div className="max-w-[210mm] mx-auto space-y-8">
                {/* Action Bar */}
                <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white shadow-xl sticky top-4 z-50 no-print">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all">
                        <ChevronLeft size={20} /> Quay lại
                    </button>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg">
                            <Download size={18} /> Tải PDF
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                        >
                            <Printer size={18} /> In đề thi
                        </button>
                    </div>
                </div>

                {/* A4 Paper Content */}
                <div className="bg-white p-[20mm] shadow-2xl rounded-sm min-h-[297mm] print:shadow-none print:p-0 print:m-0">
                    {/* Header Section */}
                    <div className="grid grid-cols-2 gap-8 border-b-2 border-slate-900 pb-8 mb-10">
                        <div className="space-y-1">
                            <h2 className="font-black text-lg uppercase leading-tight">{exam.schoolName || 'TRƯỜNG ĐẠI HỌC KỸ THUẬT'}</h2>
                            <p className="font-bold text-sm uppercase">KHOA CÔNG NGHỆ THÔNG TIN</p>
                            <div className="w-16 h-1 bg-slate-900 mt-2" />
                        </div>
                        <div className="text-right space-y-1">
                            <h2 className="font-black text-lg uppercase leading-tight">ĐỀ THI KẾT THÚC HỌC PHẦN</h2>
                            <p className="font-bold text-sm">Học kỳ: {exam.semester || 'I'} - Năm học: {exam.academicYear || '2025-2026'}</p>
                            <p className="font-bold text-sm">Môn thi: <span className="uppercase text-blue-600">{exam.subjectName}</span></p>
                        </div>
                    </div>

                    <div className="text-center space-y-2 mb-12">
                        <h1 className="text-3xl font-black uppercase tracking-tight">{exam.title}</h1>
                        <div className="flex justify-center gap-8 text-sm font-bold text-slate-600 italic">
                            <span>Thời gian: {exam.durationMinutes} phút</span>
                            <span>Mã đề: {exam.examCode || '102'}</span>
                            <span>(Thí sinh không được sử dụng tài liệu)</span>
                        </div>
                    </div>

                    <div className="border border-slate-200 p-4 rounded-xl mb-12 grid grid-cols-2 gap-4 text-sm font-bold">
                        <p>Họ và tên: .....................................................................</p>
                        <p>Số báo danh: ..............................................................</p>
                        <p>Phòng thi: .....................................................................</p>
                        <p>Chữ ký giám thị: ........................................................</p>
                    </div>

                    {/* Questions Section */}
                    <div className="space-y-10">
                        {exam.questions?.map((q: any, index: number) => (
                            <div key={index} className="space-y-4 break-inside-avoid">
                                <div className="flex gap-3">
                                    <span className="font-black text-slate-900 min-w-[60px]">Câu {index + 1}:</span>
                                    <div className="flex-1 font-medium text-slate-800 text-justify leading-relaxed" dangerouslySetInnerHTML={{ __html: q.content }} />
                                </div>

                                {q.questionTypeId === 1 && (
                                    <div className="grid grid-cols-2 gap-x-12 gap-y-3 ml-16">
                                        {q.options?.map((opt: any, optIdx: number) => (
                                            <div key={optIdx} className="flex gap-2">
                                                <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                                                <span className="text-slate-700">{opt.content}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {q.questionTypeId === 3 && (
                                    <div className="flex gap-12 ml-16 font-bold text-slate-700">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full border-2 border-slate-400" /> Đúng
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full border-2 border-slate-400" /> Sai
                                        </div>
                                    </div>
                                )}

                                {(q.questionTypeId === 2 || q.questionTypeId === 5) && (
                                    <div className="ml-16 h-32 border border-slate-100 rounded-xl bg-slate-50/50" />
                                )}

                                {q.questionTypeId === 4 && (
                                    <div className="ml-16">
                                        <p className="text-slate-400 italic text-sm">Trả lời: ...............................................................................................................................................</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-20 border-t-2 border-slate-900 pt-8 text-center font-black text-slate-900 uppercase tracking-widest">
                        --- HẾT ---
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    body { background: white !important; margin: 0 !important; }
                    .no-print { display: none !important; }
                    .print-m-0 { margin: 0 !important; }
                    @page { margin: 15mm; }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default ExamA4View;
