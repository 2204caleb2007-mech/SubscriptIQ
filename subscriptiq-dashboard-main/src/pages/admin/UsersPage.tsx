import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    UserPlus,
    Shield,
    Search,
    MoreVertical,
    Mail,
    Calendar,
    CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'INTERNAL' | 'CUSTOMER';
    status: string;
    lastLogin: string | null;
    createdAt: string;
}

const UsersPage = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // New User Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'INTERNAL' // Default to Staff
    });

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/auth/users');
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
            // toast.error('Failed to load users'); // Optional to suppress if 401 redirects
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/users', formData);

            toast.success(`User ${formData.name} created successfully`);
            setIsCreating(false);
            setFormData({ name: '', email: '', password: '', role: 'INTERNAL' });
            fetchUsers();
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Failed to create user';
            toast.error(msg);
        }
    };

    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <p className="text-xl text-muted-foreground">Access Restricted</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground mt-2">Manage staff access and permissions</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <UserPlus size={20} />
                    {isCreating ? 'Cancel' : 'Add Staff Member'}
                </button>
            </div>

            {isCreating && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border p-6 rounded-xl max-w-2xl"
                >
                    <h2 className="text-xl font-semibold mb-4">Create New Account</h2>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-2 rounded-md border border-input bg-background"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full p-2 rounded-md border border-input bg-background"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full p-2 rounded-md border border-input bg-background"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <select
                                    className="w-full p-2 rounded-md border border-input bg-background"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                                >
                                    <option value="INTERNAL">Staff (Internal)</option>
                                    <option value="ADMIN">Administrator</option>
                                    <option value="CUSTOMER">Customer</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-md">
                                Create Account
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Users List */}
            <div className="border border-border rounded-xl bg-card overflow-hidden">
                <div className="p-4 border-b border-border flex items-center gap-4">
                    <Search className="text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="bg-transparent outline-none flex-1"
                    />
                </div>

                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading users...</div>
                ) : (
                    <div className="divide-y divide-border">
                        {users.map((u) => (
                            <div key={u.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {u.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{u.name}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail size={14} />
                                            {u.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                        u.role === 'INTERNAL' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                            'bg-green-500/10 text-green-500 border-green-500/20'
                                        }`}>
                                        {u.role}
                                    </div>
                                    <div className="text-sm text-muted-foreground hidden md:block">
                                        <span className="block text-xs uppercase opacity-70">Joined</span>
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </div>

                                    <div className="relative group/menu">
                                        <button className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors">
                                            <MoreVertical size={20} />
                                        </button>
                                        {/* Simple Dropdown */}
                                        <div className="absolute right-0 top-full mt-1 w-32 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 flex flex-col p-1">
                                            <button
                                                onClick={() => {
                                                    setFormData({ name: u.name, email: u.email, password: '', role: u.role });
                                                    setIsCreating(true);
                                                    // Add ID to form data for update mode vs create mode handling
                                                    // @ts-ignore
                                                    setFormData(prev => ({ ...prev, id: u.id }));
                                                }}
                                                className="text-left px-3 py-2 text-sm hover:bg-accent rounded-md"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (!confirm('Are you sure you want to delete this user?')) return;
                                                    try {
                                                        await api.delete(`/auth/users/${u.id}`);
                                                        toast.success('User deleted');
                                                        fetchUsers();
                                                    } catch (err) {
                                                        toast.error('Failed to delete user');
                                                    }
                                                }}
                                                className="text-left px-3 py-2 text-sm hover:bg-red-500/10 text-red-500 rounded-md"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersPage;
