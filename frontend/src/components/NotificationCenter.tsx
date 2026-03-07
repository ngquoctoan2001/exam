import React, { useState } from 'react';
import { Bell, Check, Clock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationCenter: React.FC = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Bài thi mới', message: 'Bạn có bài thi Toán học mới được giao.', createdAt: '10 phút trước', isRead: false },
        { id: 2, title: 'Kết quả chấm bài', message: 'Bài thi Ngữ văn của bạn đã được chấm điểm.', createdAt: '1 giờ trước', isRead: true },
        { id: 3, title: 'Nhắc nhở', message: 'Kỳ thi Tiếng Anh sẽ bắt đầu sau 30 phút.', createdAt: '2 giờ trước', isRead: false },
    ]);

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="w-[400px] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Bell size={20} className="text-blue-600" />
                    Thông báo
                </h3>
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {notifications.filter(n => !n.isRead).length} MỚI
                </span>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
                <AnimatePresence>
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <motion.div
                                key={n.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`p-5 border-b border-slate-50 hover:bg-slate-50 transition-all group relative ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                            >
                                <div className="flex gap-4">
                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`text-sm font-bold ${!n.isRead ? 'text-slate-900' : 'text-slate-500'}`}>{n.title}</h4>
                                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                                <Clock size={10} />
                                                {n.createdAt}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{n.message}</p>
                                    </div>
                                </div>

                                <div className="absolute right-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!n.isRead && (
                                        <button onClick={() => markAsRead(n.id)} className="p-1.5 bg-white shadow-sm border border-slate-100 rounded-lg text-green-600 hover:bg-green-50 transition-all">
                                            <Check size={14} />
                                        </button>
                                    )}
                                    <button onClick={() => deleteNotification(n.id)} className="p-1.5 bg-white shadow-sm border border-slate-100 rounded-lg text-red-500 hover:bg-red-50 transition-all">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="p-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto">
                                <Bell size={32} />
                            </div>
                            <p className="text-slate-400 font-medium text-sm">Không có thông báo nào</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-4 bg-slate-50 text-center">
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest">Xem tất cả</button>
            </div>
        </div>
    );
};

export default NotificationCenter;
