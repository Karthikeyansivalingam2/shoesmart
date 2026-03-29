import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect admin role requirements to the admin login page
        const isAdminRoute = roles && roles.includes('admin');
        const loginPath = isAdminRoute ? "/admin/login" : "/login";
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(user.role)) {
        // Redirect to appropriate dashboard or home if role mismatch
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
