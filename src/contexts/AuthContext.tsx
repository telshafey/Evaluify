import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';

// Mock users directly here to avoid async login issues and provide consistent user data.
const mockUsersByRole: Record<UserRole, User> = {
    [UserRole.Teacher]: { id: 'user1', name: 'Dr. Anya Sharma', email: 'anya@example.com', role: UserRole.Teacher, registeredAt: '2023-01-15T10:00:00Z' },
    [UserRole.Examinee]: { id: 'user2', name: 'Bob Williams', email: 'bob@example.com', role: UserRole.Examinee, registeredAt: '2023-02-20T11:30:00Z' },
    [UserRole.Admin]: { id: 'user3', name: 'Charlie Brown', email: 'charlie@example.com', role: UserRole.Admin, registeredAt: '2023-01-10T09:00:00Z' },
    [UserRole.Corporate]: { id: 'user4', name: 'Ahmad M.', email: 'ahmad@example.com', role: UserRole.Corporate, registeredAt: '2023-03-05T14:00:00Z' },
    [UserRole.TrainingCompany]: { id: 'user5', name: 'Global Certs', email: 'certs@example.com', role: UserRole.TrainingCompany, registeredAt: '2023-04-01T18:00:00Z' },
};


interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    setUser(mockUsersByRole[role] || null);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;
  const userRole = user?.role ?? null;

  return (
    <AuthContext.Provider value={{ user, userRole, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- START: Moved Theme and Language Context from App.tsx ---
export type Language = 'en' | 'ar';
interface Theme {
    platformName: string;
    primaryColor: string;
}
interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}
interface LanguageContextType {
    lang: Language;
    toggleLang: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const ThemeAndLanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>({ platformName: 'evaluify', primaryColor: '#10b981' });
    const [lang, setLang] = useState<Language>('en');
    
    const toggleLang = () => setLang(prev => (prev === 'en' ? 'ar' : 'en'));

    useEffect(() => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }, [lang]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <LanguageContext.Provider value={{ lang, toggleLang }}>
                {children}
            </LanguageContext.Provider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
// --- END: Moved Theme and Language Context from App.tsx ---
