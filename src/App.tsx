import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import AppRoutes from "../src/routes/AppRoutes"; // adjust path if your file is in src/routes/AppRoutes.tsx

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    </Provider>
  );
};

export default App;
