import { BrowserRouter } from "react-router-dom";
import AppRoutes from "../routes/AppRoutes";
import { AuthProvider } from "../features/auth/context/AuthContext";
import { ToastProvider } from "../shared/context/ToastContext";

function App() {
  return (
            <ToastProvider>
              <AuthProvider>
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </AuthProvider>
            </ToastProvider>
  );
}

export default App;
