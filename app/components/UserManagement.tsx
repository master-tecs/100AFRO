'use client';

import React, { useState, useEffect } from 'react';
import UserAvatar from './UserAvatar';
import { Search, Plus, Edit3, Trash2, Shield, User as UserIcon, FileText } from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: 'USER' | 'AUTHOR' | 'ADMIN';
  createdAt: string;
  _count: {
    blogPosts: number;
  };
}

interface UserManagementProps {
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
  refreshTrigger?: number;
}

export default function UserManagement({ onCreateUser, onEditUser, refreshTrigger }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'AUTHOR' | 'ADMIN'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery, roleFilter, refreshTrigger]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '25');
      if (searchQuery) params.set('search', searchQuery);
      if (roleFilter !== 'ALL') params.set('role', roleFilter);

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        showToast('error', 'Failed to load users');
      }
    } catch (error) {
      showToast('error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('success', 'User deleted successfully');
        fetchUsers();
      } else {
        const err = await response.json().catch(() => ({}));
        showToast('error', err.error || 'Failed to delete user');
      }
    } catch (error) {
      showToast('error', 'Failed to delete user');
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      ADMIN: 'bg-red-500/20 text-red-400 border-red-500/30',
      AUTHOR: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      USER: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return badges[role as keyof typeof badges] || badges.USER;
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
          <p className="text-gray-400 text-sm">Manage all users, roles, and permissions</p>
        </div>
        <button
          onClick={onCreateUser}
          className="flex items-center gap-2 bg-afro-primary hover:bg-white text-black font-bold px-6 py-3 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Create User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-afro-primary"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as any);
              setPage(1);
            }}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-afro-primary"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="AUTHOR">Author</option>
            <option value="USER">User</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-afro-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : users.length > 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-400">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-400">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-400">Posts</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-400">Joined</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user.name} image={user.image} size="sm" />
                        <div>
                          <div className="text-white font-semibold">{user.name || 'No name'}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-semibold ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role === 'ADMIN' && <Shield size={12} />}
                        {user.role === 'AUTHOR' && <FileText size={12} />}
                        {user.role === 'USER' && <UserIcon size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{user._count.blogPosts}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditUser(user)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name || user.email)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
              <div className="text-gray-400 text-sm">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <UserIcon className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-white font-bold text-lg mb-2">No users found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white font-semibold`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
