import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import IngestaPage from "../pages/Ingesta/IngestaPage";
import ExamenPage from "../pages/Examen/ExamenPage";
import CertificadoPage from "../pages/Certificado/CertificadoPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import VerificarPage from "../pages/Verificar/VerificarPage";
import AuditoriaPage from "../pages/Auditoria/AuditoriaPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/ingesta" element={<IngestaPage />} />
      <Route path="/examen" element={<ExamenPage />} />
      <Route path="/certificado" element={<CertificadoPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/verificar" element={<VerificarPage />} />
      <Route path="/auditoria" element={<AuditoriaPage />} />
    </Routes>
  );
}

export default AppRoutes;