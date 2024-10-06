// src/app.jsx

import Statistic from "./pages/statistic";
import Main from "./pages/dashboard";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Main />} />
      <Route path="/statistic/:id/:lat/:lon" element={<Statistic />} />
      {/* <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Main />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route> */}
    </Routes>
  );
}
export default App;
