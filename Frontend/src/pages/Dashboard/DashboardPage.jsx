import ConsoleLayout from "../../layouts/ConsoleLayout";
import { DataGrid } from "@mui/x-data-grid";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import Box from "@mui/material/Box";
import "./DashboardPage.css";
import KpiCard from "../../components/kpiCard";
import certIcon from "../../assets/certificate-svgrepo-com.svg";
import userIcon from "../../assets/users-group-rounded-svgrepo-com.svg";
import aprovedIcon from "../../assets/approved-aproved-certificate-svgrepo-com.svg";
import { height, width } from "@mui/system";


const kpis = [
  {
    label: "Certificaciones emitidas",
    value: "12,847",
    icon: certIcon,
    color: "bg-green-100",
  },
  {
    label: "Candidatos activos",
    value: "3,412",
    icon: userIcon,
    color: "bg-blue-100",
  },
  {
    label: "Tasa de aprobación",
    value: "74%",
    icon: aprovedIcon,
    color: "bg-yellow-100",
  },
];

const margin = {top: 10, bottom: 30, left: 50, right: 24};
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  "Page A",
  "Page B",
  "Page C",
  "Page D",
  "Page E",
  "Page F",
  "Page G",
];

const series = [
  { data: pData, label: "pv" },
];

function DashboardPage() {
  return (
    <main>
      <ConsoleLayout title="Dashboard">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {kpis.map((kpi, i) => (
            <KpiCard key={i} {...kpi} />
          ))}
        </div>

        <div className="flex gap-3 w-full">
          <div className="flex-1 bg-white border rounded-xl p-4 min-w-0">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Certificaciones por mes</h2>
            <Box sx={{width:'100%', height:300}}>
              <LineChart
                series={series}
                xAxis={[{ scaleType: "point", data: xLabels, height: 28 }]}
                yAxis={[{ width: 50 }]}
                margin={margin}
              />
            </Box>
          </div>
          <div className="flex-1 bg-white border rounded-xl p-4 min-w-0">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Certificaciones por pais</h2>
            <Box sx={{width:'100%', height:300}}>
              <BarChart
                series={series}
                xAxis={[{data:xLabels, height:28}]}
                yAxis={[{width:50}]}
                margin={margin}
              />
            </Box>
          </div>
        </div>
      </ConsoleLayout>
    </main>
  );
}

export default DashboardPage;
