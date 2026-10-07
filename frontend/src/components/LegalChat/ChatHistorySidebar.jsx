import React, { useState } from 'react';
import {
  Plus,
  Search,
  MessageSquare,
  Edit2,
  Trash2,
  Check,
  X,
  Clock,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import './ChatHistorySidebar.css';

export default function ChatHistorySidebar({
  conversations = [],
  activeConversationId = null,
  onSelectConversation = () => {},
  onNewChat = () => {},
  onRenameConversation = () => {},
  onDeleteConversation = () => {},
  searchQuery = '',
  onSearchChange = () => {},
  isLoadingList = false,
  isHindi = false
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Format relative timestamp (e.g. 2:30 PM, Yesterday, 28 Sep)
  const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 24 && date.getDate() === now.getDate()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      if (diffHours < 48 && date.getDate() === now.getDate() - 1) {
        return isHindi ? 'कल' : 'Yesterday';
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  // Group conversations into time buckets: Today, Yesterday, Previous 7 Days, Older
  const groupConversations = (convList) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000;
    const pastWeek = today - 7 * 86400000;

    const groups = {
      today: [],
      yesterday: [],
      pastWeek: [],
      older: []
    };

    convList.forEach((conv) => {
      const dateVal = new Date(conv.updated_at || conv.created_at || Date.now()).getTime();
      if (dateVal >= today) {
        groups.today.push(conv);
      } else if (dateVal >= yesterday) {
        groups.yesterday.push(conv);
      } else if (dateVal >= pastWeek) {
        groups.pastWeek.push(conv);
      } else {
        groups.older.push(conv);
      }
    });

    return groups;
  };

  const groups = groupConversations(conversations);

  const startEditing = (conv, e) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const handleSaveRename = (convId, e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(convId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const triggerDelete = (convId, e) => {
    e.stopPropagation();
    setDeletingId(convId);
  };

  const confirmDelete = (convId, e) => {
    e.stopPropagation();
    onDeleteConversation(convId);
    setDeletingId(null);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setDeletingId(null);
  };

  const renderConversationItem = (conv) => {
    const isActive = conv.id === activeConversationId;
    const isEditing = conv.id === editingId;
    const isDeleting = conv.id === deletingId;
    const timeLabel = formatRelativeTime(conv.updated_at || conv.created_at);

    if (isDeleting) {
      return (
        <div key={conv.id} className="history-item history-item-deleting">
          <span className="history-delete-prompt">
            <AlertTriangle size={13} className="text-danger" />
            {isHindi ? 'क्या आप हटाना चाहते हैं?' : 'Delete chat?'}
          </span>
          <div className="history-item-actions visible">
            <button
              type="button"
              className="action-btn action-btn-danger"
              onClick={(e) => confirmDelete(conv.id, e)}
              title={isHindi ? 'हटाएं' : 'Confirm Delete'}
            >
              <Check size={13} />
            </button>
            <button
              type="button"
              className="action-btn"
              onClick={cancelDelete}
              title={isHindi ? 'रद्द करें' : 'Cancel'}
            >
              <X size={13} />
            </button>
          </div>
        </div>
      );
    }

    if (isEditing) {
      return (
        <div key={conv.id} className={`history-item ${isActive ? 'active' : ''} editing`}>
          <input
            type="text"
            className="history-rename-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveRename(conv.id, e);
              if (e.key === 'Escape') handleCancelRename(e);
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
          <div className="history-item-actions visible">
            <button
              type="button"
              className="action-btn action-btn-success"
              onClick={(e) => handleSaveRename(conv.id, e)}
              title={isHindi ? 'सहेजें' : 'Save'}
            >
              <Check size={13} />
            </button>
            <button
              type="button"
              className="action-btn"
              onClick={handleCancelRename}
              title={isHindi ? 'रद्द करें' : 'Cancel'}
            >
              <X size={13} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        key={conv.id}
        className={`history-item ${isActive ? 'active' : ''}`}
        onClick={() => onSelectConversation(conv.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSelectConversation(conv.id);
          }
        }}
      >
        <span className="history-item-icon">
          <MessageSquare size={14} />
        </span>
        <div className="history-item-content">
          <span className="history-item-title" title={conv.title}>
            {conv.title || (isHindi ? 'परामर्श' : 'Consultation')}
          </span>
          {timeLabel && <span className="history-item-time">{timeLabel}</span>}
        </div>

        <div className="history-item-actions">
          <button
            type="button"
            className="action-btn"
            onClick={(e) => startEditing(conv, e)}
            title={isHindi ? 'नाम बदलें' : 'Rename'}
          >
            <Edit2 size={12} />
          </button>
          <button
            type="button"
            className="action-btn"
            onClick={(e) => triggerDelete(conv.id, e)}
            title={isHindi ? 'हटाएं' : 'Delete'}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <aside className="ask-ai-history-sidebar permanent-right">
      <div className="history-sidebar-header">
        <div className="history-header-title">
          <Clock size={15} />
          <span>{isHindi ? 'बातचीत इतिहास' : 'Chat History'}</span>
        </div>
      </div>

      {/* New Chat Primary Action */}
      <div className="history-new-chat-wrapper">
        <button
          type="button"
          className="history-new-chat-btn"
          onClick={onNewChat}
        >
          <Plus size={16} />
          <span>{isHindi ? 'नया परामर्श' : 'New Chat'}</span>
        </button>
      </div>

      {/* Search Input Filter */}
      <div className="history-search-wrapper">
        <Search size={14} className="history-search-icon" />
        <input
          type="text"
          className="history-search-input"
          placeholder={isHindi ? 'बातचीत खोजें...' : 'Search conversations...'}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="history-search-clear"
            onClick={() => onSearchChange('')}
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Conversations Scroll Container */}
      <div className="history-list-scroll">
        {isLoadingList ? (
          <div className="history-loading">
            <div className="history-spinner" />
            <span>{isHindi ? 'इतिहास लोड हो रहा है...' : 'Loading chats...'}</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="history-empty">
            <p>{isHindi ? 'कोई बातचीत नहीं मिली।' : 'No conversations found.'}</p>
            <small>{isHindi ? 'नया परामर्श शुरू करने के लिए "नया परामर्श" पर क्लिक करें।' : 'Click "New Chat" to begin.'}</small>
          </div>
        ) : (
          <>
            {/* Today Section */}
            {groups.today.length > 0 && (
              <div className="history-group">
                <div className="history-group-label">{isHindi ? 'आज' : 'Today'}</div>
                {groups.today.map(renderConversationItem)}
              </div>
            )}

            {/* Yesterday Section */}
            {groups.yesterday.length > 0 && (
              <div className="history-group">
                <div className="history-group-label">{isHindi ? 'कल' : 'Yesterday'}</div>
                {groups.yesterday.map(renderConversationItem)}
              </div>
            )}

            {/* Past 7 Days */}
            {groups.pastWeek.length > 0 && (
              <div className="history-group">
                <div className="history-group-label">{isHindi ? 'पिछले 7 दिन' : 'Previous 7 Days'}</div>
                {groups.pastWeek.map(renderConversationItem)}
              </div>
            )}

            {/* Older */}
            {groups.older.length > 0 && (
              <div className="history-group">
                <div className="history-group-label">{isHindi ? 'पुराने परामर्श' : 'Older'}</div>
                {groups.older.map(renderConversationItem)}
              </div>
            )}
          </>
        )}
      </div>

      <div className="history-footer">
        <ShieldCheck size={12} className="history-security-icon" />
        <span>{isHindi ? 'सुरक्षित व पृथक यूजर डेटा' : 'Strict User Isolation'}</span>
      </div>
    </aside>
  );
}
