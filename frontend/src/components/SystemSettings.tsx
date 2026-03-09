import React, { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Database, Globe, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const SystemSettings: React.FC = () => {
    const [settings, setSettings] = useState<any>({
        appName: 'Antigravity Exam',
        apiUrl: 'http://localhost:5014/api',
        maintenanceMode: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [nameRes, urlRes, maintRes] = await Promise.all([
                    api.get('/systemsettings/AppName'),
                    api.get('/systemsettings/ApiUrl'),
                    api.get('/systemsettings/MaintenanceMode')
                ]);
                setSettings({
                    appName: nameRes.data.value,
                    apiUrl: urlRes.data.value,
                    maintenanceMode: maintRes.data.value === 'true'
                });
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await Promise.all([
                api.post('/systemsettings/update', { key: 'AppName', value: settings.appName }),
                api.post('/systemsettings/update', { key: 'ApiUrl', value: settings.apiUrl }),
                api.post('/systemsettings/update', { key: 'MaintenanceMode', value: settings.maintenanceMode.toString() })
            ]);
            alert("Cập nhật cài đặt thành công!");
        } catch (error) {
            console.error("Failed to save settings", error);
            alert("Cập nhật thất bại.");
        } finally {
            setSaving(false);
        }
    };

    const sections = [
        { id: 'general', icon: Globe, title: 'Cài đặt chung', description: 'Tên hệ thống, ngôn ngữ, múi giờ.' },
        { id: 'security', icon: Shield, title: 'Bảo mật', description: 'Chính sách mật khẩu, phiên đăng nhập.' },
        { id: 'notifications', icon: Bell, title: 'Thông báo', description: 'Cấu hình Email, Firebase Cloud Messaging.' },
        { id: 'database', icon: Database, title: 'Dữ liệu', description: 'Sao lưu, khôi phục, dọn dẹp logs.' },
    ];

    if (loading) return <div className="p-12 text-center text-slate-400">Đang tải cấu hình...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">Cài đặt hệ thống</h2>
                    <p className="text-slate-500 mt-2 font-medium">Quản lý cấu hình vận hành của toàn bộ nền tảng.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-4 bg-blue-600 text-white rounded-3xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                >
                    <Save size={20} />
                    {saving ? 'Đang lưu...' : 'Lưu tất cả'}
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
                            <input
                                type="text"
                                value={settings.appName}
                                onChange={e => setSettings({ ...settings, appName: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-700"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Cổng API</label>
                            <input
                                type="text"
                                value={settings.apiUrl}
                                onChange={e => setSettings({ ...settings, apiUrl: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl cursor-pointer" onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}>
                        <div>
                            <h4 className="font-bold text-slate-800">Chế độ bảo trì</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1">Khóa toàn bộ hệ thống để bảo trì định kỳ.</p>
                        </div>
                        <div className={`w-14 h-8 rounded-full relative transition-all ${settings.maintenanceMode ? 'bg-blue-600' : 'bg-slate-200'}`}>
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${settings.maintenanceMode ? 'right-1' : 'left-1'}`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
