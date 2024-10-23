import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SelectCompanyPage from './SelectCompany';
import Dashboard from './Dashboard';
import ProjectManagement from './Services/admin-manager/ProjectManagement';
import UserManagement from './Services/admin-manager/UsersManagement';
import ProjectConsulting from './Services/consultant/ProjectConsulting';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/select" element={<SelectCompanyPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project-management" element={<ProjectManagement />} />
        <Route path="/project-consulting" element={<ProjectConsulting />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
