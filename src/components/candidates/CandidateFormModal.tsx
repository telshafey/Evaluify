import React, { useState } from 'react';
// FIX: Update import path for types to remove .ts extension.
import { Candidate } from '../../types';

interface CandidateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (candidate: Omit<Candidate, 'id' | 'stage' | 'lastActivity' | 'matchScore'>) => void;
}

const CandidateFormModal: React.FC<CandidateFormModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !role.trim()) {
            alert("Please fill all fields.");
            return;
        }
        onSave({ name, role });
        // Reset form
        setName('');
        setRole('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div role="dialog" aria-modal="true" aria-labelledby="candidate-modal-title" className="modal-content-container bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 id="candidate-modal-title" className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Add New Candidate</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="candidateName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Candidate Name</label>
                        <input type="text" id="candidateName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600" required />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                        <input type="text" id="role" value={role} onChange={e => setRole(e.target.value)} className="mt-1 block w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600" required />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Save Candidate</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CandidateFormModal;