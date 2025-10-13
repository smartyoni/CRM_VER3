import React, { useState } from 'react';
import { STATUSES } from '../constants';

const FilterSidebar = ({ activeFilter, onFilterChange, customers, meetings, activities, isMobileOpen, onMobileClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getLastActivityDate = (customerId) => {
    const customerActivities = activities.filter(a => a.customerId === customerId);
    if (customerActivities.length === 0) return null;
    const sorted = customerActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
    return new Date(sorted[0].date);
  };

  const getDaysDiff = (date1, date2) => {
    const diff = Math.abs(date1 - date2);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusCount = (status) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (status === '전체') return customers.length;

    // 미팅 기반 필터
    if (status === '오늘미팅') {
      return customers.filter(c => {
        const customerMeetings = meetings.filter(m => m.customerId === c.id);
        return customerMeetings.some(m => {
          const meetingDate = new Date(m.date);
          meetingDate.setHours(0, 0, 0, 0);
          return meetingDate.getTime() === today.getTime();
        });
      }).length;
    }
    if (status === '미팅일확정') {
      return customers.filter(c => {
        const customerMeetings = meetings.filter(m => m.customerId === c.id);
        return customerMeetings.some(m => {
          const meetingDate = new Date(m.date);
          meetingDate.setHours(0, 0, 0, 0);
          return meetingDate > today;
        });
      }).length;
    }

    // 활동 기반 필터
    if (status === '오늘접촉') {
      return customers.filter(c => {
        const lastActivity = getLastActivityDate(c.id);
        if (!lastActivity) return false;
        const activityDate = new Date(lastActivity);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === today.getTime();
      }).length;
    }
    if (status === '연락할고객') {
      return customers.filter(c => {
        const lastActivity = getLastActivityDate(c.id);
        if (!lastActivity) return false;
        return getDaysDiff(today, lastActivity) >= 2;
      }).length;
    }
    if (status === '일주일무접촉') {
      return customers.filter(c => {
        const lastActivity = getLastActivityDate(c.id);
        if (!lastActivity) return false;
        return getDaysDiff(today, lastActivity) >= 7;
      }).length;
    }
    if (status === '신규무접촉') {
      return customers.filter(c => {
        return c.status === '신규' && activities.filter(a => a.customerId === c.id).length === 0;
      }).length;
    }
    if (status === '진행중무접촉') {
      return customers.filter(c => {
        if (c.status !== '진행중') return false;
        const lastActivity = getLastActivityDate(c.id);
        if (!lastActivity) return true;
        return getDaysDiff(today, lastActivity) >= 3;
      }).length;
    }

    return customers.filter(c => c.status === status).length;
  };

  const allStatuses = [
    '전체',
    ...STATUSES,
    '오늘미팅',
    '미팅일확정',
    '오늘접촉',
    '연락할고객',
    '일주일무접촉',
    '신규무접촉',
    '진행중무접촉'
  ];

  const handleFilterClick = (status) => {
    onFilterChange(status);
    onMobileClose(); // 모바일에서 필터 선택 시 사이드바 닫기
  };

  return (
    <aside className={`filter-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="filter-header">
        {!isCollapsed && <h4>필터</h4>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="btn-close desktop-only">
          {isCollapsed ? '☰' : '✕'}
        </button>
        <button onClick={onMobileClose} className="btn-close mobile-only">
          ✕
        </button>
      </div>
      {!isCollapsed && (
        <ul className="filter-list">
          {allStatuses.map(status => (
            <li
              key={status}
              className={`filter-item ${activeFilter === status ? 'active' : ''}`}
              onClick={() => handleFilterClick(status)}
            >
              <span>{status}</span>
              <span className="count-badge">{getStatusCount(status)}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default FilterSidebar;
