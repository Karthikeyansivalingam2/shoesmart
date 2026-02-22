import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (userData) => {
        const { email, password } = userData;

        let role = 'customer';
        let name = userData.name || 'John Doe';

        // Check Hardcoded Credentials
        if (email === 'admin' && password === 'admin123') {
            role = 'admin';
            name = 'Super Admin';
        } else if (email === 'delivery' && password === 'delivery123') {
            role = 'delivery';
            name = 'Vikram Delivery';
        } else if (email.includes('admin')) {
            role = 'admin'; // Keep keyword support for flexibility
        } else if (email.includes('delivery')) {
            role = 'delivery';
        }

        const userObj = {
            name: name,
            email: email.includes('@') ? email : `${email}@stepup.com`,
            role: role,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
            id: 'USR' + Math.floor(Math.random() * 1000)
        };
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
