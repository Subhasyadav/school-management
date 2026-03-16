// src/pages/profile/Profile.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileApi } from '../../api/profile';
import Layout from '../../component/layout';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  HomeIcon,
  PencilIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import ProfileForm from './ProfileForm';
// import ChangePasswordModal from './ChangePasswordModal'; // ✅ fixed import
import type { AnyUser } from '../../types/profile'; // ✅ correct path
import ChangePasswordModal from './ChangePasswordModel';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  // user is now AnyUser because of the auth.ts change; but casting is harmless
  const typedUser = user as AnyUser | null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  if (!typedUser) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const handleUpdate = async (data: { firstName: string; lastName: string; phone?: string }) => {
    setLoading(true);
    setError('');
    try {
      const res = await profileApi.updateProfile(data);
      updateUser(res.data as any);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header (same as before) */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              My Profile
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            {!isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <KeyIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                  Change Password
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Profile content */}
        {isEditing ? (
          <ProfileForm
            user={typedUser}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            loading={loading}
          />
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Your account details.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                {/* Name */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {typedUser.firstName} {typedUser.lastName}
                  </dd>
                </div>

                {/* Email */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {typedUser.email}
                  </dd>
                </div>

                {/* Phone */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Phone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {typedUser.phone || '-'}
                  </dd>
                </div>

                {/* Role */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Role
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {typedUser.role}
                  </dd>
                </div>

                {/* Teacher fields */}
                {typedUser.role === 'TEACHER' && (
                  <>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <AcademicCapIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Qualification
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {typedUser.qualification|| '-'}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Hire Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {typedUser.hireDate ? new Date(typedUser.hireDate).toLocaleDateString() : '-'}
                      </dd>
                    </div>
                  </>
                )}

                {/* Student fields */}
                {typedUser.role === 'STUDENT' && (
                  <>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Enrollment Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {typedUser.enrollmentDate ? new Date(typedUser.enrollmentDate).toLocaleDateString() : '-'}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Date of Birth
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {typedUser.dateOfBirth ? new Date(typedUser.dateOfBirth).toLocaleDateString() : '-'}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <HomeIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Address
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {typedUser.address || '-'}
                      </dd>
                    </div>
                  </>
                )}

                {/* Parent fields */}
                {typedUser.role === 'PARENT' && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />
                      Occupation
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {typedUser.occupation || '-'}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePassword && (
          <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
        )}
      </div>
    </Layout>
  );
};

export default Profile;