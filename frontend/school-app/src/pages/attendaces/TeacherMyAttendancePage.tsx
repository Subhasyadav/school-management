import React, { useState } from 'react';
import { useMyTeacherAttendance } from '../../hooks/useTeacherAttendance';
import Layout from '../../component/layout';

const TeacherMyAttendancePage: React.FC = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useMyTeacherAttendance(page, 20, true);

  if (isError) return <div>Error loading your attendance</div>;

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">My Attendance</h2>
        {isLoading && <div>Loading...</div>}
        {data && (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marked By</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.content.map((att) => (
                    <tr key={att.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{att.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          att.leaveType === 'VACATION' ? 'bg-blue-100 text-blue-800' :
                          att.leaveType === 'SICK_LEAVE' ? 'bg-red-100 text-red-800' :
                          att.leaveType === 'PUBLIC_HOLIDAY' ? 'bg-green-100 text-green-800' :
                          att.leaveType === 'OTHER' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {att.leaveType || 'PRESENT'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{att.remarks}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{att.markedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <button onClick={() => setPage(p => p-1)} disabled={page === 0} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
              <span className="text-sm">Page {page+1} of {data.totalPages}</span>
              <button onClick={() => setPage(p => p+1)} disabled={page >= data.totalPages-1} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default TeacherMyAttendancePage;