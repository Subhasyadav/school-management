// components/AssignmentDetailModal.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAssignment, useSubmissionsForAssignment, usePublishAssignment } from '../../hooks/useAssignments';
import SubmissionFormModal from './SubmissionFormModel';
import GradeSubmissionModal from './GradeSubmissionModel';
import { getFullUrl } from '../../utils/url';
import type { SubmissionResponse } from '../../types/assignment';

interface Props {
  assignmentId: number;
  onClose: () => void;
  onSaved: () => void;
}

const AssignmentDetailModal: React.FC<Props> = ({ assignmentId, onClose, onSaved }) => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'ADMIN' || user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';
  const isParent = user?.role === 'PARENT';

  const { data: assignment, isLoading } = useAssignment(assignmentId);
  const { data: submissionsData, refetch: refetchSubmissions } = useSubmissionsForAssignment(assignmentId, 0);
  const publishMutation = usePublishAssignment();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionResponse | null>(null);
  const [showGradeModal, setShowGradeModal] = useState(false);

  const handleSubmissionSaved = () => {
    refetchSubmissions();
    onSaved();
  };

  const handleGradeSaved = () => {
    refetchSubmissions();
    onSaved();
  };

  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish this assignment? Students will be able to see and submit it.')) return;
    try {
      await publishMutation.mutateAsync(assignmentId);
      onSaved();
    } catch (error) {
      // error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-lg p-6">Loading...</div>
      </div>
    );
  }

  if (!assignment) return null;

  // For student: find their submission from the list
  const studentSubmission = isStudent
    ? submissionsData?.content.find(sub => sub.studentId === user?.id)
    : null;

  // For parent: submissions are already filtered by backend to only their children
  const parentSubmissions = submissionsData?.content || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold">{assignment.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            assignment.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
            assignment.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {assignment.status}
          </span>
          {assignment.publishDate && (
            <span className="ml-2 text-sm text-gray-600">
              Published: {new Date(assignment.publishDate).toLocaleString()}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p><span className="font-medium">Class:</span> {assignment.className}</p>
            <p><span className="font-medium">Subject:</span> {assignment.subjectName}</p>
          </div>
          <div>
            <p><span className="font-medium">Teacher:</span> {assignment.teacherName}</p>
            <p><span className="font-medium">Due Date:</span> {new Date(assignment.dueDate).toLocaleDateString()}</p>
            {assignment.allowLateSubmission && (
              <p><span className="font-medium">Late Submission:</span> Allowed (Penalty: {assignment.latePenaltyPercent}%)</p>
            )}
            {assignment.anonymousGrading && (
              <p><span className="font-medium">Grading:</span> Anonymous</p>
            )}
          </div>
        </div>

        {assignment.description && (
          <div className="mb-4">
            <h4 className="font-semibold mb-1">Description</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{assignment.description}</p>
          </div>
        )}

        {assignment.attachmentUrl && (
          <div className="mb-4">
            <h4 className="font-semibold mb-1">Attachment</h4>
            <a
              href={getFullUrl(assignment.attachmentUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Download / View
            </a>
          </div>
        )}

        {/* Teacher Publish Button (if draft) */}
        {isTeacher && assignment.status === 'DRAFT' && (
          <div className="mb-4">
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Publish Assignment
            </button>
          </div>
        )}

        {/* Student Actions */}
        {isStudent && assignment.status === 'PUBLISHED' && (
          <div className="mb-4">
            {studentSubmission ? (
              <div className="bg-black/50 p-4 rounded-md">
                <h4 className="font-semibold mb-2">Your Submission (v{studentSubmission.version})</h4>
                <p><span className="font-medium">Submitted:</span> {new Date(studentSubmission.submissionDate).toLocaleString()}</p>
                {studentSubmission.late && (
                  <p><span className="font-medium text-orange-600">Late submission</span></p>
                )}
                <p>
                  <span className="font-medium">File:</span>{' '}
                  <a
                    href={getFullUrl(studentSubmission.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </p>
                {studentSubmission.grade && (
                  <p><span className="font-medium">Grade:</span> {studentSubmission.grade} {studentSubmission.letterGrade && `(${studentSubmission.letterGrade})`}</p>
                )}
                {studentSubmission.feedback && (
                  <div>
                    <span className="font-medium">Feedback:</span>
                    <p className="mt-1 text-gray-700">{studentSubmission.feedback}</p>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Submit Assignment
              </button>
            )}
          </div>
        )}

        {/* Teacher View: All Submissions with Grading */}
        {isTeacher && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Submissions ({submissionsData?.totalElements || 0})</h4>
            {submissionsData?.content.length === 0 ? (
              <p className="text-gray-500">No submissions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Student</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Version</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Submitted</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Late</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">File</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Grade</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissionsData?.content.map((sub) => (
                      <tr key={sub.id}>
                        <td className="px-4 py-2">{sub.studentName}</td>
                        <td className="px-4 py-2">{sub.version}</td>
                        <td className="px-4 py-2">{new Date(sub.submissionDate).toLocaleString()}</td>
                        <td className="px-4 py-2">{sub.late ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-2">
                          <a
                            href={getFullUrl(sub.fileUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View
                          </a>
                        </td>
                        <td className="px-4 py-2">
                          {sub.grade !== undefined ? (
                            <>
                              {sub.grade} {sub.letterGrade && `(${sub.letterGrade})`}
                            </>
                          ) : 'Not graded'}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => {
                              setSelectedSubmission(sub);
                              setShowGradeModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {sub.grade ? 'Update Grade' : 'Grade'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Parent View: Submissions for their children (read-only) */}
        {isParent && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Submissions</h4>
            {parentSubmissions.length === 0 ? (
              <p className="text-gray-500">No submissions yet for your child/children.</p>
            ) : (
              <div className="space-y-4">
                {parentSubmissions.map((sub) => (
                  <div key={sub.id} className="bg-gray-50 p-4 rounded-md">
                    <p><span className="font-medium">Student:</span> {sub.studentName}</p>
                    <p><span className="font-medium">Submitted:</span> {new Date(sub.submissionDate).toLocaleString()}</p>
                    {sub.late && <p className="text-orange-600">Late submission</p>}
                    <p>
                      <span className="font-medium">File:</span>{' '}
                      <a
                        href={getFullUrl(sub.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    </p>
                    {sub.grade && (
                      <p>
                        <span className="font-medium">Grade:</span> {sub.grade} {sub.letterGrade && `(${sub.letterGrade})`}
                      </p>
                    )}
                    {sub.feedback && (
                      <div>
                        <span className="font-medium">Feedback:</span>
                        <p className="mt-1 text-gray-700">{sub.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        {showSubmitModal && (
          <SubmissionFormModal
            assignmentId={assignmentId}
            onClose={() => setShowSubmitModal(false)}
            onSaved={handleSubmissionSaved}
          />
        )}

        {showGradeModal && selectedSubmission && (
          <GradeSubmissionModal
            submission={selectedSubmission}
            onClose={() => {
              setShowGradeModal(false);
              setSelectedSubmission(null);
            }}
            onSaved={handleGradeSaved}
          />
        )}
      </div>
    </div>
  );
};

export default AssignmentDetailModal;