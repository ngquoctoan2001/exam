import { Plus, Calendar, Clock, Users, ChevronRight, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        'Sắp diễn ra': 'bg-blue-50 text-blue-600 border-blue-100',
        'Đang diễn ra': 'bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse',
        'Đã kết thúc': 'bg-slate-50 text-slate-500 border-slate-100',
        'Bản nháp': 'bg-slate-50 text-slate-500 border-slate-100',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
            {status === 'Đang diễn ra' && <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-1.5"></span>}
            {status}
        </span>
    );
};

const ExamCard = ({ exam }: any) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Clock size={24} />
            </div>
            <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical size={20} />
            </button>
        </div>

        <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={exam.status} />
                <span className="text-xs text-slate-400 font-medium">#{exam.id}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{exam.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{exam.subject} • {exam.duration} phút</p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-50 space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
                <Calendar size={16} className="text-slate-400" />
                {exam.date}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
                <Users size={16} className="text-slate-400" />
                Lớp: {exam.classes.join(', ')}
            </div>
        </div>

        <div className="mt-6">
            <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                Xem chi tiết
                <ChevronRight size={16} />
            </button>
        </div>
    </motion.div>
);

const ExamManagement: React.FC = () => {
    const exams = [
        {
            id: "EX001",
            title: "Kiểm tra Giữa kỳ I - Toán học 10",
            subject: "Toán học",
            duration: 60,
            date: "15 Th03, 2026 • 08:30 AM",
            status: "Sắp diễn ra",
            classes: ["10A1", "10A2"]
        },
        {
            id: "EX002",
            title: "Kiểm tra 15 phút - Bài số 2 - Ngữ văn 11",
            subject: "Ngữ văn",
            duration: 15,
            date: "07 Th03, 2026 • 02:00 PM",
            status: "Đang diễn ra",
            classes: ["11A1"]
        },
        {
            id: "EX003",
            title: "Thi thử THPT Quốc gia - Tiếng Anh",
            subject: "Tiếng Anh",
            duration: 90,
            date: "01 Th03, 2026 • 08:00 AM",
            status: "Đã kết thúc",
            classes: ["12C3"]
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Quản lý kỳ thi</h2>
                    <p className="text-slate-500 mt-1">Tạo, lên lịch và quản lý các bài kiểm tra.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-100">
                    <Plus size={20} />
                    Tạo kỳ thi mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} />
                ))}
            </div>
        </div>
    );
};

export default ExamManagement;
