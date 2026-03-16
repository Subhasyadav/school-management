import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../../api/users';
import toast from 'react-hot-toast';
import type { AnyUser, UserCreateRequest, UserUpdateRequest } from '../../types/user';
import Layout from '../../component/layout';
import UserForm from '../../component/users/UserForm';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<AnyUser | undefined>(undefined);
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      userApi.getById(parseInt(id))
        .then((res) => setInitialData(res.data))
        .catch(() => toast.error('Failed to load user'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (data: UserCreateRequest | UserUpdateRequest) => {
    setSubmitting(true);
    try {
      if (id) {
        await userApi.update(parseInt(id), data as UserUpdateRequest);
        toast.success('User updated successfully');
      } else {
        await userApi.create(data as UserCreateRequest);
        toast.success('User created successfully');
      }
      navigate('/admin/users');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Skeleton loader
  if (loading) {
    return (
      <Layout>
        <div className="p-6 max-w-3xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <PencilSquareIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Edit User' : 'Create New User'}
          </h1>
        </div>

        <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">
              {id ? 'Update user information' : 'Fill in the details for the new user'}
            </h2>
          </div>
          <div className="p-6">
            <UserForm
              initialData={initialData}
              onSubmit={handleSubmit}
              isSubmitting={submitting}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserEdit;