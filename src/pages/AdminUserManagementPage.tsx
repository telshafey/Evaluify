import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import useNavLinks from '../hooks/useNavLinks';
import { User, UserRole } from '../types';
import { getUsers, updateUserRole, deleteUser } from '../services/mockApi';
import { useNotification } from '../contexts/NotificationContext';
import { UsersIcon, TrashIcon, PencilIcon } from '../components/icons';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../App';

const translations = {
    en: {
        pageTitle: "User Management",
        description: "As an admin, you can view, edit, or delete any user on the platform.",
        searchPlaceholder: "Search by name or email...",
        tableHeaderUser: "User",
        tableHeaderRole: "Role",
        tableHeaderRegistered: "Registered",
        tableHeaderActions: "Actions",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        cancel: "Cancel",
        deleteConfirm: "Are you sure you want to delete this user?",
        emptyTitle: "No Users Found",
        emptyMessage: "There are currently no users matching your search.",
        userDeleted: "User deleted successfully.",
        userDeleteError: "Failed to delete user.",
        roleUpdated: "User role updated successfully.",
        roleUpdateError: "Failed to update user role.",
        loadError: "Could not load users.",
        roleBadges: {
            [UserRole.Admin]: "Admin",
            [UserRole.Teacher]: "Teacher",
            [UserRole.Corporate]: "Corporate",
            [UserRole.TrainingCompany]: "Training Co.",
            [UserRole.Examinee]: "Examinee",
        }
    },
    ar: {
        pageTitle: "إدارة المستخدمين",
        description: "بصفتك مسؤولاً، يمكنك عرض أو تعديل أو حذف أي مستخدم على المنصة.",
        searchPlaceholder: "ابحث بالاسم أو البريد الإلكتروني...",
        tableHeaderUser: "المستخدم",
        tableHeaderRole: "الدور",
        tableHeaderRegistered: "تاريخ التسجيل",
        tableHeaderActions: "الإجراءات",
        edit: "تعديل",
        delete: "حذف",
        save: "حفظ",
        cancel: "إلغاء",
        deleteConfirm: "هل أنت متأكد أنك تريد حذف هذا المستخدم؟",
        emptyTitle: "لم يتم العثور على مستخدمين",
        emptyMessage: "لا يوجد حاليًا مستخدمون يطابقون بحثك.",
        userDeleted: "تم حذف المستخدم بنجاح.",
        userDeleteError: "فشل حذف المستخدم.",
        roleUpdated: "تم تحديث دور المستخدم بنجاح.",
        roleUpdateError: "فشل تحديث دور المستخدم.",
        loadError: "تعذر تحميل المستخدمين.",
        roleBadges: {
            [UserRole.Admin]: "مسؤول",
            [UserRole.Teacher]: "معلم",
            [UserRole.Corporate]: "شركة",
            [UserRole.TrainingCompany]: "مركز تدريب",
            [UserRole.Examinee]: "ممتحن",
        }
    }
};

const roleColors: Record<UserRole, string> = {
    [UserRole.Admin]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    [UserRole.Teacher]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [UserRole.Corporate]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    [UserRole.TrainingCompany]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    [UserRole.Examinee]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

const AdminUserManagementPage: React.FC = () => {
    const navLinks = useNavLinks();
    const { lang } = useLanguage();
    const t = translations[lang];

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const { addNotification } = useNotification();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                addNotification(t.loadError, "error");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [addNotification, t.loadError]);

    const handleEdit = (user: User) => {
        setEditingUserId(user.id);
        setSelectedRole(user.role);
    };

    const handleCancel = () => {
        setEditingUserId(null);
        setSelectedRole(null);
    };

    const handleSaveRole = async (userId: string) => {
        if (!selectedRole) return;
        const originalUsers = [...users];
        const userToUpdate = users.find(u => u.id === userId);
        if (!userToUpdate || userToUpdate.role === selectedRole) {
            handleCancel();
            return;
        }

        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: selectedRole } : u));
        setEditingUserId(null);

        try {
            await updateUserRole(userId, selectedRole);
            addNotification(t.roleUpdated, "success");
        } catch {
            addNotification(t.roleUpdateError, "error");
            setUsers(originalUsers);
        }
    };

    const handleDelete = async (userId: string) => {
        if (window.confirm(t.deleteConfirm)) {
            try {
                await deleteUser(userId);
                setUsers(prev => prev.filter(u => u.id !== userId));
                addNotification(t.userDeleted, "success");
            } catch {
                addNotification(t.userDeleteError, "error");
            }
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    return (
        <DashboardLayout navLinks={navLinks} pageTitle={t.pageTitle}>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <p className="text-slate-600 dark:text-slate-400 mb-4">{t.description}</p>
                <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg w-full mb-4"
                />
                
                {loading ? <LoadingSpinner /> : (
                    <>
                        {filteredUsers.length === 0 ? (
                            <EmptyState icon={UsersIcon} title={t.emptyTitle} message={t.emptyMessage} />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">{t.tableHeaderUser}</th>
                                            <th scope="col" className="px-6 py-3">{t.tableHeaderRole}</th>
                                            <th scope="col" className="px-6 py-3">{t.tableHeaderRegistered}</th>
                                            <th scope="col" className="px-6 py-3">{t.tableHeaderActions}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(user => (
                                            <tr key={user.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                    {user.name}
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {editingUserId === user.id ? (
                                                        <select
                                                            value={selectedRole || ''}
                                                            onChange={e => setSelectedRole(e.target.value as UserRole)}
                                                            className="p-1 bg-slate-100 dark:bg-slate-600 rounded-md"
                                                        >
                                                            {/* FIX: Cast role to string for key/value and to UserRole for indexing translations to resolve type errors. */}
                                                            {Object.values(UserRole).map(role => (
                                                                <option key={role as string} value={role as string}>{t.roleBadges[role as UserRole]}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleColors[user.role]}`}>
                                                            {t.roleBadges[user.role]}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">{new Date(user.registeredAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 flex items-center gap-2">
                                                    {editingUserId === user.id ? (
                                                        <>
                                                            <button onClick={() => handleSaveRole(user.id)} className="text-green-500 hover:text-green-700 text-sm font-semibold">{t.save}</button>
                                                            <button onClick={handleCancel} className="text-slate-500 hover:text-slate-700 text-sm">{t.cancel}</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => handleEdit(user)} className="p-2 text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full" title={t.edit}>
                                                                <PencilIcon className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDelete(user.id)} className="p-2 text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full" title={t.delete}>
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminUserManagementPage;