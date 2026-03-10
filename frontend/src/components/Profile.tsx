import React, { useState } from 'react';
import { User, Mail, Shield, Save, Key, Camera, Settings } from 'lucide-react';
import authService from '../services/auth.service';
import api from '../services/api';

const Profile: React.FC = () => {
    const user = authService.getCurrentUser();
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || ''
    });

    const handleSave = async () => {
        setSubmitting(true);
        try {
            // Update profile API call
            await api.put('/users/profile', formData);

            // Update local storage
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setIsEditing(false);
            alert("Cập nhật thông tin cá nhân thành công!");
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Có lỗi xảy ra khi cập nhật hồ sơ.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h1 className="text-3xl font-black text-slate-900 leading-tight">Hồ sơ cá nhân</h1>
                <p className="text-slate-500 font-medium">Quản lý thông tin tài khoản và bảo mật của bạn.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1 space-y-8">
                    <div className="bg-white p-8 rounded-[40px] shadow-xl border border-white text-center space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600 to-indigo-700" />

                        <div className="relative pt-8">
                            <div className="w-32 h-32 bg-slate-100 rounded-[32px] mx-auto border-4 border-white shadow-lg flex items-center justify-center text-4xl font-black text-blue-600 relative group overflow-hidden">
                                {user?.fullName?.charAt(0)}
                                <button className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    <Camera size={24} />
                                </button>
                            </div>
                            <h2 className="mt-6 text-2xl font-black text-slate-900">{user?.fullName}</h2>
                            <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px] bg-blue-50 px-4 py-1.5 rounded-full inline-block mt-2">
                                {user?.role}
                            </p>
                        </div>

                        <div className="pt-6 border-t border-slate-50 space-y-4">
                            <div className="flex items-center gap-4 text-slate-600">
                                <Mail size={18} className="text-slate-400" />
                                <span className="text-sm font-medium">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-600">
                                <Shield size={18} className="text-slate-400" />
                                <span className="text-sm font-medium">ID: {user?.id}</span>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                            <Key size={18} />
                            Đổi mật khẩu
                        </button>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white p-8 md:p-12 rounded-[48px] shadow-xl border border-white space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <User size={20} />
                                </div>
                                <h3 className="text-lg font-black text-slate-900">Thông tin cơ bản</h3>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${isEditing ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}
                            >
                                {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-400 ml-1">Họ và tên</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold disabled:opacity-60"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-400 ml-1">Email</label>
                                <input
                                    type="email"
                                    disabled={!isEditing}
                                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold disabled:opacity-60"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-400 ml-1">Số điện thoại</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold disabled:opacity-60"
                                    placeholder="Chưa cập nhật"
                                    value={formData.phoneNumber}
                                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-400 ml-1">Địa chỉ</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold disabled:opacity-60"
                                    placeholder="Chưa cập nhật"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="pt-8 border-t border-slate-50 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={submitting}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-[28px] font-black flex items-center gap-3 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50"
                                >
                                    <Save size={20} />
                                    {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Account Settings */}
                    <div className="bg-slate-900 p-8 md:p-12 rounded-[48px] shadow-xl text-white space-y-6">
                        <div className="flex items-center gap-3">
                            <Settings size={22} className="text-blue-400" />
                            <h3 className="text-lg font-black">Cài đặt bảo mật</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Bảo vệ tài khoản của bạn bằng cách định kỳ thay đổi mật khẩu và cập nhật phương thức khôi phục tài khoản.
                            Nếu bạn nghi ngờ tài khoản bị xâm nhập, hãy báo cho Ban giám hiệu ngay lập tức.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
