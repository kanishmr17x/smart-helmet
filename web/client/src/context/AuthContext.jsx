import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchMe, getToken, login as apiLogin, logout as apiLogout, setToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        const bootstrap = async () => {
            const token = getToken();
            if (!token) {
                if (active) {
                    setUser(null);
                    setLoading(false);
                }
                return;
            }

            try {
                const me = await fetchMe();
                if (active) setUser(me);
            } catch {
                setToken('');
                if (active) setUser(null);
            } finally {
                if (active) setLoading(false);
            }
        };

        bootstrap();
        return () => {
            active = false;
        };
    }, []);

    const login = useCallback(async (email, password) => {
        setError('');
        const result = await apiLogin(email, password);
        setUser(result.user);
        return result.user;
    }, []);

    const logout = useCallback(() => {
        apiLogout();
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            loading,
            error,
            isAuthenticated: Boolean(user),
            login,
            logout,
            setError,
        }),
        [user, loading, error, login, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
