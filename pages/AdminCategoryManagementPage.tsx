import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import useNavLinks from '../hooks/useNavLinks';
import { getCategories, addCategory, deleteCategory, addSubCategory, deleteSubCategory } from '../services/mockApi';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusCircleIcon, TrashIcon } from '../components/icons';

const AdminCategoryManagementPage: React.FC = () => {
    const navLinks = useNavLinks();
    const { addNotification } = useNotification();
    const [categories, setCategories] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            addNotification("Could not load categories.", "error");
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleAddCategory = async () => {
        const name = prompt("Enter new category name:");
        if (name && name.trim()) {
            await addCategory(name.trim());
            addNotification(`Category "${name}" added.`, "success");
            fetchCategories();
        }
    };

    const handleDeleteCategory = async (name: string) => {
        if (window.confirm(`Are you sure you want to delete the category "${name}" and all its sub-categories?`)) {
            await deleteCategory(name);
            addNotification(`Category "${name}" deleted.`, "success");
            fetchCategories();
        }
    };
    
    const handleAddSubCategory = async (categoryName: string) => {
        const subName = prompt(`Enter new sub-category for "${categoryName}":`);
        if (subName && subName.trim()) {
            await addSubCategory(categoryName, subName.trim());
            addNotification(`Sub-category "${subName}" added.`, "success");
            fetchCategories();
        }
    };

    const handleDeleteSubCategory = async (categoryName: string, subName: string) => {
        if (window.confirm(`Are you sure you want to delete the sub-category "${subName}"?`)) {
            await deleteSubCategory(categoryName, subName);
            addNotification(`Sub-category "${subName}" deleted.`, "success");
            fetchCategories();
        }
    };

    const headerActions = (
        <button onClick={handleAddCategory} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add New Category
        </button>
    );

    return (
        <DashboardLayout navLinks={navLinks} pageTitle="Category Management" headerActions={headerActions}>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Add, edit, or delete categories and sub-categories for organizing questions and exams.
                </p>
                {loading ? <LoadingSpinner /> : (
                    <div className="space-y-4">
                        {Object.entries(categories).map(([category, subCategories]) => (
                            <div key={category} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-lg font-bold">{category}</h4>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleAddSubCategory(category)} className="text-sm text-primary-500 hover:text-primary-700 font-semibold">Add Sub-category</button>
                                        <button onClick={() => handleDeleteCategory(category)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                </div>
                                <div className="pl-4 space-y-1">
                                    {subCategories.map(sub => (
                                        <div key={sub} className="flex justify-between items-center p-2 bg-white dark:bg-slate-600 rounded">
                                            <span>{sub}</span>
                                            <button onClick={() => handleDeleteSubCategory(category, sub)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                    {subCategories.length === 0 && <p className="text-sm text-slate-500 italic">No sub-categories yet.</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminCategoryManagementPage;