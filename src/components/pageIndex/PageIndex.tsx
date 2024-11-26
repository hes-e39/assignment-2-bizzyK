// PageIndex.tsx

// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import ThemeToggle from '../themeToggle/ThemeToggle';

const PageIndex: React.FC = () => {
    const location = useLocation();
    const titles: Record<string, string> = {
        '/': 'Timers',
        '/docs': 'Documentation',
        '/add': 'Add Timer',
    };
    const pageTitle = titles[location.pathname] || 'Assignment 2 - Elizabeth Koch';

    return (
        <div className="app-container">
            <div className="theme-toggle-container">
                <ThemeToggle />
            </div>
            <h1>{pageTitle}</h1>
            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Timers
                    </NavLink>
                </li>
                <li>
                    <Link to="/docs">Documentation</Link>
                </li>
                <li>
                    <Link to="/add">Add Timer</Link>
                </li>
            </ul>
            <Outlet />
        </div>
    );
};

export default PageIndex;
