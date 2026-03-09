import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SubjectManagement from './components/SubjectManagement';
import ClassManagement from './components/ClassManagement';
import TeacherManagement from './components/TeacherManagement';
import StudentManagement from './components/StudentManagement';
import QuestionBank from './components/QuestionBank';
import ExamManagement from './components/ExamManagement';
import ManualGrading from './components/ManualGrading';
import SystemSettings from './components/SystemSettings';
import ExamCreate from './components/ExamCreate';
import ExamTake from './components/ExamTake';
import ExamResults from './components/ExamResults';
import StudentExams from './components/StudentExams';

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
          <Route path="grading/:examId" element={<ManualGrading />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="*" element={<div className="p-8 text-center text-slate-400">Đang phát triển...</div>} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<Layout />}>
          <Route index element={<Navigate to="/student/exams" replace />} />
          <Route path="exams" element={<StudentExams />} />
          <Route path="results/:attemptId" element={<ExamResults />} />
        </Route>

        <Route path="/exam/:examId" element={<ExamTake />} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
