import React from 'react';
import { Settings, Shield, Bell, Database, Globe, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const SystemSettings: React.FC = () => {
    const sections = [
        { id: 'general', icon: Globe, title: 'Cài đặt chung', description: 'Tên hệ thống, ngôn ngữ, múi giờ.' },
        { id: 'security', icon: Shield, title: 'Bảo mật', description: 'Chính sách mật khẩu, phiên đăng nhập.' },
        { id: 'notifications', icon: Bell, title: 'Thông báo', description: 'Cấu hình Email, Firebase Cloud Messaging.' },
        { id: 'database', icon: Database, title: 'Dữ liệu', description: 'Sao lưu, khôi phục, dọn dẹp logs.' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">Cài đặt hệ thống</h2>
                    <p className="text-slate-500 mt-2 font-medium">Quản lý cấu hình vận hành của toàn bộ nền tảng.</p>
                </div>
                <button className="px-8 py-4 bg-blue-600 text-white rounded-3xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                    <Save size={20} />
                    Lưu tất cả
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section) => (
                    <motion.div
                        key={section.id}
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 group cursor-pointer hover:border-blue-200 transition-all"
                    >
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-6">
                            <section.icon size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{section.title}</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">{section.description}</p>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                    <Settings className="text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-800">Cấu hình chi tiết</h3>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Tên ứng dụng</label>
                            <input type="text" defaultValue="Antigravity Exam" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-700" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Cổng API</label>
                            <input type="text" defaultValue="https://api.examsystem.com" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-700" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                        <div>
                            <h4 className="font-bold text-slate-800">Chế độ bảo trì</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1">Khóa toàn bộ hệ thống để bảo trì định kỳ.</p>
                        </div>
                        <div className="w-14 h-8 bg-slate-200 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
