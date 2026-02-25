import { useState, useEffect } from 'react';
import {
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    Search,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useToast } from '../../../../shared/context/ToastContext';

interface AdminLayoutProps {
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
    title?: string;
}

const AdminLayout = ({ onSearch, searchPlaceholder = "Search...", title = "Community Moderation" }: AdminLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
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

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: FileText, label: 'Blog Posts', path: '/admin/all-blog-posts' },
    ];

    return (
        <div className="min-h-screen bg-brand-beige text-brand-dark flex overflow-hidden">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 ${isSidebarCollapsed ? 'lg:w-24' : 'lg:w-64'} w-64 bg-brand-beige border-r border-brand-primary transform transition-all duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
                            const isActive = location.pathname === item.path;
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

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-brand-light flex items-center justify-between px-6 lg:px-10 flex-shrink-0 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-brand-dark/60 hover:text-brand-dark transition-colors cursor-pointer">
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <h1 className="text-xl lg:text-2xl font-bold">{title}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="bg-white border border-brand-dark/10 rounded-xl py-2.5 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-brand-accent/50 transition-all font-medium text-brand-dark"
                            />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent font-bold">
                            {localStorage.getItem('admin_username')?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-brand-beige">
                    <Outlet context={{ searchQuery }} />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
