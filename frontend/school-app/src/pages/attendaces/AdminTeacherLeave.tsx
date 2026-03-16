import React, { useState } from 'react';
import { Button } from '@mui/material';
import TeacherLeaveCalendar from './TeacherLeaveCalendar';
import MarkTeacherAttendanceModal from './MarkTeacherAttendanceModel';
import Layout from '../../component/layout';

const AdminTeacherLeavePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Teacher Time Off Calendar</h2>
          <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
            Mark Attendance
          </Button>
        </div>
        <TeacherLeaveCalendar />

        {isModalOpen && (
          <MarkTeacherAttendanceModal
            onClose={() => setIsModalOpen(false)}
            onSaved={() => {
              // Data will refresh via query invalidation
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default AdminTeacherLeavePage;