import React from "react";
import AppRoutes from "../src/routes/AppRoutes"; // adjust path if your file is in src/routes/AppRoutes.tsx

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppRoutes />
    </div>
  );
};

export default App;
