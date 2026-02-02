import { BrowserRouter } from "react-router-dom";
import AppRoutes from "../routes/AppRoutes";
import { AuthProvider } from "../features/auth/context/AuthContext";
import { ToastProvider } from "../shared/context/ToastContext";

import { ChatProvider } from "../features/chat/context/ChatContext";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ChatProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
