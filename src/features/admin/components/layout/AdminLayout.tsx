import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useToast } from '../../../../shared/context/ToastContext';
import AdminSidebar from '../common/AdminSidebar';
import AdminHeader from '../common/AdminHeader';

interface AdminLayoutProps {
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
    title?: string;
}

const AdminLayout = ({ onSearch, searchPlaceholder = "Search...", title = "Community Moderation" }: AdminLayoutProps) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user_id');
            localStorage.removeItem('admin_username');
            localStorage.removeItem('admin_role');
            localStorage.removeItem('admin_token_timestamp');
            showToast('success', 'Logged Out', 'Successfully logged out from admin panel');
            navigate('/admin');
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearch) onSearch(query);
    };

    return (
        <div className="h-screen bg-brand-beige text-brand-dark flex overflow-hidden">
            <AdminSidebar
                isSidebarOpen={isSidebarOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                handleLogout={handleLogout}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-brand-beige">
                <AdminHeader
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    title={title}
                    searchQuery={searchQuery}
                    handleSearchChange={handleSearchChange}
                    searchPlaceholder={searchPlaceholder}
                />

                {/* Content Area */}
                <div className="flex-1">
                    <Outlet context={{ searchQuery }} />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
