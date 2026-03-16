
import React, { useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Tab, Tabs, Paper, Typography } from '@mui/material';
import { getMonthStartEnd } from '../../utils/dateUtils';
import { useTeachers } from '../../hooks/useTeacher';
import { useAllTeacherAttendance } from '../../hooks/useTeacherAttendance';
import { transformToCalendarData } from '../../utils/transformAttendance';
import type { LeaveType } from '../../types/leaveType';

const TeacherLeaveCalendar: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { start, end } = getMonthStartEnd(currentMonth);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const { data: teachersData, isLoading: teachersLoading } = useTeachers(0, 100);
  const teachers = teachersData?.content || [];
  const { data: attendanceData, isLoading: attendanceLoading } = useAllTeacherAttendance(0, 500, true);

  const rows = useMemo(() => {
    if (!teachers.length || !attendanceData) return [];
    return transformToCalendarData(
      attendanceData.content,
      teachers.map(t => ({ id: t.id, name: `${t.firstName} ${t.lastName}` })),
      start,
      end
    );
  }, [teachers, attendanceData, start, end]);

  const dateColumns: GridColDef[] = useMemo(() => {
    const cols: GridColDef[] = [];
    const current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      cols.push({
        field: dateStr,
        headerName: `${current.toLocaleDateString('en-US', { weekday: 'short' })} ${current.getDate()}`,
        width: 80,
        renderCell: (params: GridRenderCellParams) => {
          const value = params.value as LeaveType | null;
          let bgColor = 'transparent';
          let label = '';
          switch (value) {
            case 'VACATION': bgColor = '#bbdefb'; label = 'V'; break;
            case 'SICK_LEAVE': bgColor = '#ffcdd2'; label = 'S'; break;
            case 'PUBLIC_HOLIDAY': bgColor = '#c8e6c9'; label = 'H'; break;
            case 'OTHER': bgColor = '#e1bee7'; label = 'O'; break;
            default: break;
          }
          return (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: bgColor }}>
              {label}
            </Box>
          );
        },
      });
      current.setDate(current.getDate() + 1);
    }
    return cols;
  }, [start, end]);

  const columns: GridColDef[] = [
    { field: 'teacherName', headerName: 'Employees', width: 200 },
    ...dateColumns,
  ];

  const outOfOfficeRow = useMemo(() => {
    const row: any = { id: 'outOfOffice', teacherName: 'Out of office:' };
    dateColumns.forEach(col => {
      const date = col.field;
      let count = 0;
      rows.forEach(teacherRow => { if (teacherRow[date]) count++; });
      row[date] = count;
    });
    return row;
  }, [rows, dateColumns]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // TODO: Implement filtering based on tab
  };

  if (teachersLoading || attendanceLoading) return <div>Loading calendar...</div>;

  return (
    <Paper sx={{ height: 700, width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Public holidays" />
          <Tab label="Vacation" />
          <Tab label="Sick leave" />
          <Tab label="Today" />
          <Tab label={currentMonth.toLocaleString('default', { month: 'long' })} />
        </Tabs>
      </Box>

      {/* Out of office row */}
      <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', p: 1, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ width: 200, fontWeight: 'bold' }}>Out of office:</Box>
        {dateColumns.map(col => (
          <Box key={col.field} sx={{ width: 80, textAlign: 'center' }}>
            {outOfOfficeRow[col.field]}
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
        sx={{ border: 0, '& .MuiDataGrid-main': { borderTop: 'none' } }}
      />

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" fontWeight="bold" sx={{ mr: 1 }}>
          Faustino Shields
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Engineering
        </Typography>
      </Box>
    </Paper>
  );
};

export default TeacherLeaveCalendar;