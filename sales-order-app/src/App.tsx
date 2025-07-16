import { BrowserRouter as Router, Routes, Route } from "react-router";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardHome from "./page/DashboardHome";
import SalesOrderPage from "./page/SalesOrderPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="sales-orders" element={<SalesOrderPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
