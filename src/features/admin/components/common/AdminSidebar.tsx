import { LayoutDashboard, FileText, ChevronRight, ChevronLeft, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
    isSidebarOpen: boolean;
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: (collapsed: boolean) => void;
    handleLogout: () => void;
}

const AdminSidebar = ({ isSidebarOpen, isSidebarCollapsed, setIsSidebarCollapsed, handleLogout }: AdminSidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: FileText, label: 'Blog Posts', path: '/admin/all-blog-posts' },
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 ${isSidebarCollapsed ? 'lg:w-24' : 'lg:w-64'} w-64 bg-brand-beige border-r border-brand-primary transform transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full">
                <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} px-6 h-20 bg-[#CEDEBD] shrink-0 transition-all mb-6`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(111,154,78,0.2)] flex-shrink-0">
                            {localStorage.getItem('admin_username')?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        {!isSidebarCollapsed && (
                            <span className="text-xl font-bold tracking-tight whitespace-nowrap text-brand-dark">{localStorage.getItem('admin_username') || 'Admin'}</span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="hidden lg:flex p-1.5 hover:bg-brand-dark/5 rounded-lg text-brand-dark/40 hover:text-brand-dark transition-colors ml-2 cursor-pointer"
                    >
                        {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {menuItems.map((item, idx) => {
                        const isActive = location.pathname === item.path || (location.state?.from === 'dashboard' && item.path === '/admin/dashboard') || (location.state?.from === 'all-blog-posts' && item.path === '/admin/all-blog-posts');
                        return (
                            <button
                                key={idx}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl font-bold text-sm transition-all duration-300 ${isActive ? 'bg-[#CEDEBD36] text-brand-accent border border-brand-light' : 'text-brand-primary hover:bg-brand-light/50 hover:text-brand-dark'}`}
                                title={isSidebarCollapsed ? item.label : ''}
                            >
                                <item.icon size={20} className="flex-shrink-0" />
                                {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                <div className="px-4 mt-auto pb-10 border-t border-brand-dark/5 pt-6">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-medium transition-all cursor-pointer`}
                        title={isSidebarCollapsed ? 'Logout' : ''}
                    >
                        <LogOut size={20} className="shrink-0" />
                        {!isSidebarCollapsed && <span className="whitespace-nowrap">Logout</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
