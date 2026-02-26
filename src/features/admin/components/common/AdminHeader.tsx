import { Menu, X, Search } from 'lucide-react';

interface AdminHeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    title: string;
    searchQuery: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchPlaceholder: string;
}

const AdminHeader = ({ isSidebarOpen, setIsSidebarOpen, title, searchQuery, handleSearchChange, searchPlaceholder }: AdminHeaderProps) => {
    return (
        <header className="h-20 bg-brand-light/95 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 flex-shrink-0 sticky top-0 z-30 border-b border-brand-dark/5">
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
    );
};

export default AdminHeader;
