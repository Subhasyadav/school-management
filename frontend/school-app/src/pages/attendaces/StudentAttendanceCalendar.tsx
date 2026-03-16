import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Tab, Tabs, Paper, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import { useAttendance } from '../../hooks/useAttendance';
// import { useTeachers } from '../../hooks/useTeachers'; // for class list? Actually we need class list.
import { classService } from '../../api/class';
import { getMonthStartEnd, getDatesInRange } from '../../utils/dateUtils';
import type { AttendanceStatus } from '../../types/attendance';
import type { ClassRoomResponse, SubjectResponse } from '../../types/class';
import { useAttendanceRange } from '../../hooks/useAttendance';

interface StudentAttendanceCalendarProps {
  classId?: number;          // For teacher/admin, can be selected; for student/parent, fixed
  studentId?: number;         // If viewing single student
  readOnly?: boolean;         // If true, no edit actions
}

const StudentAttendanceCalendar: React.FC<StudentAttendanceCalendarProps> = ({
  classId: initialClassId,
  studentId,
  readOnly = false,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<number | undefined>(initialClassId);
  const [classes, setClasses] = useState<ClassRoomResponse[]>([]);
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { start, end } = getMonthStartEnd(currentMonth);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  // Fetch classes for teacher/admin
  useEffect(() => {
    if (!studentId) {
      classService.getAll(0, 100).then(res => setClasses(res.data.content));
    }
  }, [studentId]);

  // Fetch subjects when class changes
  useEffect(() => {
    if (selectedClassId) {
      classService.getSubjects(selectedClassId, 0, 100).then(res => {
        const subs = res.data.content;
        setSubjects(subjects);
        if (subs.length > 0) setSelectedSubjectId(subs[0].id);
      });
    } else {
      setSubjects([]);
      setSelectedSubjectId(undefined);
    }
  }, [selectedClassId]);

  const filter = useMemo(() => ({
    classId: selectedClassId,
    date: undefined,
  }), [selectedClassId]);

  const { data: attendanceData, isLoading } = useAttendanceRange(selectedClassId, start, end);

  const students = useMemo(() => {
    if (!attendanceData) return [];
    const uniqueStudents = new Map();
    attendanceData.forEach(att => {
      if (!uniqueStudents.has(att.studentId)) {
        uniqueStudents.set(att.studentId, { id: att.studentId, name: att.studentName });
      }
    });
    return Array.from(uniqueStudents.values());
  }, [attendanceData]);

  const rows = useMemo(() => {
    if (!students.length || !attendanceData) return [];
    const dateRange = getDatesInRange(start, end);
    return students.map(s => {
      const row: any = { id: s.id, studentName: s.name };
      dateRange.forEach(date => row[date] = null);
      attendanceData
        .filter(att => att.studentId === s.id && att.subjectId === selectedSubjectId)
        .forEach(att => row[att.date] = att.status);
      return row;
    });
  }, [students, attendanceData, selectedSubjectId, start, end]);

  const dateColumns: GridColDef[] = useMemo(() => {
    const cols: GridColDef[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      cols.push({
        field: dateStr,
        headerName: `${d.toLocaleDateString('en-US', { weekday: 'short' })} ${d.getDate()}`,
        width: 80,
        renderCell: (params: GridRenderCellParams) => {
          const value = params.value as AttendanceStatus | null;
          const colorMap: Record<AttendanceStatus, string> = {
            PRESENT: '#c8e6c9', // light green
            ABSENT: '#ffcdd2',   // light red
            LATE: '#fff9c4',      // light yellow
            EXCUSED: '#e1bee7',   // light purple
          };
          const labelMap: Record<AttendanceStatus, string> = {
            PRESENT: 'P',
            ABSENT: 'A',
            LATE: 'L',
            EXCUSED: 'E',
          };
          return (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: value ? colorMap[value] : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {value ? labelMap[value] : ''}
            </Box>
          );
        },
      });
    }
    return cols;
  }, [start, end]);

  const columns: GridColDef[] = [
    { field: 'studentName', headerName: 'Students', width: 200 },
    ...dateColumns,
  ];

  const absentCountRow = useMemo(() => {
    const row: any = { id: 'absentCount', studentName: 'Absent:' };
    dateColumns.forEach(col => {
      row[col.field] = rows.filter(r => r[col.field] === 'ABSENT').length;
    });
    return row;
  }, [rows, dateColumns]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedSubjectId(subjects[newValue]?.id);
  };

  if (isLoading) return <div>Loading attendance calendar...</div>;

  return (
    <Paper sx={{ height: 700, width: '100%' }}>
      {/* Class selector (if not fixed) */}
      {!studentId && (
        <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={selectedClassId || ''}
              onChange={(e) => setSelectedClassId(e.target.value as number)}
              label="Class"
            >
              {classes.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Subject tabs */}
      {subjects.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={subjects.findIndex(s => s.id === selectedSubjectId)}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {subjects.map(s => <Tab key={s.id} label={s.name} />)}
          </Tabs>
        </Box>
      )}

      {/* Absent summary row */}
      <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', p: 1, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ width: 200, fontWeight: 'bold' }}>Absent:</Box>
        {dateColumns.map(col => (
          <Box key={col.field} sx={{ width: 80, textAlign: 'center' }}>
            {absentCountRow[col.field]}
          </Box>
        ))}
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default StudentAttendanceCalendar;