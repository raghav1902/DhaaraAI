import React from 'react';
import { Smartphone } from 'lucide-react';

export default function AppSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  navSections,
  isInstallable,
  handleInstallApp,
  user,
  isHindi
}) {
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Primary Sidebar Navigation */}
      <nav
        className={`no-print app-sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        aria-label="Main Navigation"
      >
        <div className="sidebar-scroll-body">
          {/* Grouped Nav Sections */}
          {navSections.map((section) => (
            <div key={section.title} className="sidebar-nav-section">
              {isSidebarOpen && (
                <div className="sidebar-section-header">
                  {section.title}
                </div>
              )}
              <div className="sidebar-nav-group">
                {section.items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        if (window.innerWidth <= 868) {
                          setIsSidebarOpen(false);
                        }
                      }}
                      title={tab.label}
                      aria-current={isActive ? 'page' : undefined}
                      className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`}
                    >
                      {isActive && <div className="sidebar-active-pill" />}
                      <div className="sidebar-nav-icon-box">
                        <Icon size={18} strokeWidth={isActive ? 2.3 : 1.8} />
                      </div>
                      <span className="sidebar-nav-label">
                        {isSidebarOpen ? tab.label : (tab.shortLabel || tab.label)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* PWA Install Button */}
          {isInstallable && isSidebarOpen && (
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
              <button
                onClick={handleInstallApp}
                title={isHindi ? 'ऐप इंस्टॉल करें' : 'Install App'}
                className="sidebar-nav-item"
              >
                <div className="sidebar-nav-icon-box" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <Smartphone size={16} />
                </div>
                <span className="sidebar-nav-label" style={{ color: 'var(--primary)' }}>
                  {isHindi ? 'ऐप इंस्टॉल करें' : 'Install App'}
                </span>
              </button>
            </div>
          )}

          {/* Sidebar Bottom Footer Cards */}
          <div className="sidebar-footer">
            <div
              className="sidebar-user-card"
              onClick={() => {
                setActiveTab('settings');
                if (window.innerWidth <= 868) setIsSidebarOpen(false);
              }}
              title="Advocate Account Settings"
            >
              <div className="sidebar-user-avatar">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              {isSidebarOpen && (
                <div className="sidebar-user-meta">
                  <div className="sidebar-user-name">
                    {user?.name || 'Advocate.user'}
                  </div>
                  <div className="sidebar-user-plan">
                    {user?.plan || 'Advocate Plan'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
