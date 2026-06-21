import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import LoginPage     from "../pages/Login/LoginPage";
import HomePage      from "../pages/Home/HomePage";
import IngestaPage   from "../pages/Ingesta/IngestaPage";
import ExamenPage    from "../pages/Examen/ExamenPage";
import CertificadoPage from "../pages/Certificado/CertificadoPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import VerificarPage from "../pages/Verificar/VerificarPage";
import AuditoriaPage from "../pages/Auditoria/AuditoriaPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/verificar" element={<VerificarPage />} />

      {/* Privadas */}
      <Route path="/ingesta"    element={<PrivateRoute><IngestaPage /></PrivateRoute>} />
      <Route path="/examen"     element={<PrivateRoute><ExamenPage /></PrivateRoute>} />
      <Route path="/certificado" element={<PrivateRoute><CertificadoPage /></PrivateRoute>} />
      <Route path="/dashboard"  element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/auditoria"  element={<PrivateRoute><AuditoriaPage /></PrivateRoute>} />
    </Routes>
  );
}

export default AppRoutes;