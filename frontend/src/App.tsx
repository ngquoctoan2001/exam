import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ClassManagement from './components/ClassManagement';
import QuestionBank from './components/QuestionBank';
import ExamManagement from './components/ExamManagement';
import ExamPlayer from './components/ExamPlayer';
import StudentExams from './components/StudentExams';
import ManualGrading from './components/ManualGrading';
import ExamResults from './components/ExamResults';
import SystemSettings from './components/SystemSettings';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="classes" element={<ClassManagement />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="exams" element={<ExamManagement />} />
          <Route path="grading/:examId" element={<ManualGrading />} />
          <Route path="settings" element={<SystemSettings />} />
          {/* Fallback routes for now */}
          <Route path="*" element={<div className="p-8 text-center text-slate-400">Đang phát triển...</div>} />
        </Route>
        <Route path="/exam/:id" element={<ExamPlayer />} />
        <Route path="/student/exams" element={<StudentExams />} />
        <Route path="/student/result/:attemptId" element={<ExamResults />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
