import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SubjectManagement from './components/SubjectManagement';
import ClassManagement from './components/ClassManagement';
import TeacherManagement from './components/TeacherManagement';
import StudentManagement from './components/StudentManagement';
import QuestionBank from './components/QuestionBank';
import ExamManagement from './components/ExamManagement';
import SubmissionList from './components/SubmissionList';
import ManualGrading from './components/ManualGrading';
import SystemSettings from './components/SystemSettings';
import ExamCreate from './components/ExamCreate';
import ExamPlayer from './components/ExamPlayer';
import ExamResults from './components/ExamResults';
import StudentExams from './components/StudentExams';
import ExamA4View from './components/ExamA4View';
import GradingOverview from './components/GradingOverview';
import AcademicTranscript from './components/AcademicTranscript';
import Profile from './components/Profile';
import api from './services/api';

// Wrapper to fetch exam data for Print View
const ExamA4ViewWrapper = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    if (examId) {
      api.get(`/exams/${examId}`).then(res => setExam(res.data));
    }
  }, [examId]);

  return <ExamA4View exam={exam} />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin/Teacher Routes */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="subjects" element={<SubjectManagement />} />
          <Route path="classes" element={<ClassManagement />} />
          <Route path="teachers" element={<TeacherManagement />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="exams" element={<ExamManagement />} />
          <Route path="exams/create" element={<ExamCreate />} />
          <Route path="exams/:examId/print" element={<ExamA4ViewWrapper />} />
          <Route path="profile" element={<Profile />} />
          <Route path="grading/list/:examId" element={<SubmissionList />} />
          <Route path="grading/:attemptId" element={<ManualGrading />} />
          <Route path="transcript" element={<AcademicTranscript />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="*" element={<div className="p-8 text-center text-slate-400">Đang phát triển...</div>} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<Layout />}>
          <Route index element={<Navigate to="/student/exams" replace />} />
          <Route path="exams" element={<StudentExams />} />
          <Route path="transcript" element={<AcademicTranscript />} />
          <Route path="profile" element={<Profile />} />
          <Route path="results/:attemptId" element={<ExamResults />} />
        </Route>

        <Route path="/exam/:id" element={<ExamPlayer />} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
