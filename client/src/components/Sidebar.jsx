import React from 'react';
import { FaBolt, FaHome, FaCalendarAlt, FaNewspaper, FaTrophy, FaStar, FaBookmark, FaCog } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="logo">
                <FaBolt style={{ color: '#3b82f6' }} /> Sport<span>Flash</span>
            </div>

            <div className="nav-category">Menu</div>
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <FaHome /> Home
            </NavLink>
            <div className="nav-item">
                <FaCalendarAlt /> Matches
            </div>
            <div className="nav-item">
                <FaNewspaper /> News
            </div>
            <div className="nav-item">
                <FaTrophy /> Series
            </div>

            <div className="nav-category">My Zone (Phase 2)</div>
            <div className="nav-item"><FaStar /> Following</div>
            <div className="nav-item"><FaBookmark /> Bookmarks</div>

            <div className="nav-category">Preferences</div>
            <div className="nav-item"><FaCog /> Settings</div>
        </div>
    );
};

export default Sidebar;
