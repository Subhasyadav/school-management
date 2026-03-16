import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ROLES } from '../../utils/constants';
import type { AnyUser, Role, UserCreateRequest, UserUpdateRequest } from '../../types/user';
import {
  AcademicCapIcon,
  BriefcaseIcon,
  CalendarIcon,
  HomeIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface UserFormProps {
  initialData?: AnyUser;
  onSubmit: (data: UserCreateRequest | UserUpdateRequest) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<UserCreateRequest>({
    defaultValues: initialData ? {
      email: initialData.email,
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      phone: initialData.phone || '',
      role: initialData.role,
      qualification: (initialData as any).qualification || '',
      hireDate: (initialData as any).hireDate || '',
      enrollmentDate: (initialData as any).enrollmentDate || '',
      dateOfBirth: (initialData as any).dateOfBirth || '',
      address: (initialData as any).address || '',
      occupation: (initialData as any).occupation || '',
    } : {
      role: 'STUDENT',
      phone: '',
      qualification: '',
      hireDate: '',
      enrollmentDate: '',
      dateOfBirth: '',
      address: '',
      occupation: '',
    },
  });

  const selectedRole = watch('role') as Role;

  useEffect(() => {
    if (!initialData) {
      setValue('qualification', '');
      setValue('hireDate', '');
      setValue('enrollmentDate', '');
      setValue('dateOfBirth', '');
      setValue('address', '');
      setValue('occupation', '');
    }
  }, [selectedRole, setValue, initialData]);

  const inputClassName = (error?: any) => `
    mt-1 block w-full border ${error ? 'border-red-300' : 'border-gray-300'} 
    rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
  `;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Common Fields */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="firstName"
              {...register('firstName', { required: 'First name is required' })}
              className={`${inputClassName(errors.firstName)} pl-10`}
              placeholder="John"
            />
          </div>
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="lastName"
              {...register('lastName', { required: 'Last name is required' })}
              className={`${inputClassName(errors.lastName)} pl-10`}
              placeholder="Doe"
            />
          </div>
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
            })}
            className={inputClassName(errors.email)}
            placeholder="john.doe@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="phone"
              {...register('phone')}
              className={`${inputClassName()} pl-10`}
              placeholder="+1 234 567 890"
            />
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            {...register('role', { required: 'Role is required' })}
            disabled={!!initialData}
            className={inputClassName(errors.role) + ' disabled:bg-gray-100'}
          >
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
        </div>

        {!initialData && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: !initialData && 'Password is required',
                minLength: { value: 6, message: 'Must be at least 6 characters' },
              })}
              className={inputClassName(errors.password)}
              placeholder="••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
        )}
      </div>

      {/* Teacher-specific fields */}
      {selectedRole === 'TEACHER' && (
        <div className="border-t border-gray-200 pt-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Teacher Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                Qualification
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="qualification"
                  {...register('qualification')}
                  className={`${inputClassName()} pl-10`}
                  placeholder="M.Sc. Mathematics"
                />
              </div>
            </div>
            <div>
              <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700">
                Hire Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="hireDate"
                  {...register('hireDate')}
                  className={`${inputClassName()} pl-10`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student-specific fields */}
      {selectedRole === 'STUDENT' && (
        <div className="border-t border-gray-200 pt-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Student Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="enrollmentDate" className="block text-sm font-medium text-gray-700">
                Enrollment Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="enrollmentDate"
                  {...register('enrollmentDate')}
                  className={`${inputClassName()} pl-10`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="dateOfBirth"
                  {...register('dateOfBirth')}
                  className={`${inputClassName()} pl-10`}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <HomeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="address"
                  rows={3}
                  {...register('address')}
                  className={`${inputClassName()} pl-10`}
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Parent-specific fields */}
      {selectedRole === 'PARENT' && (
        <div className="border-t border-gray-200 pt-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Parent Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                Occupation
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="occupation"
                  {...register('occupation')}
                  className={`${inputClassName()} pl-10`}
                  placeholder="Engineer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel ? onCancel : () => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : (
            initialData ? 'Update User' : 'Create User'
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;