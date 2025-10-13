import React, { useState, useMemo } from 'react';
import { PROGRESS_STATUSES } from '../constants';

const CustomerTable = ({ customers, onSelectCustomer, onEdit, onDelete, selectedCustomerId, activeFilter, activeProgressFilter, onProgressFilterChange, allCustomers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedCustomer: null });
  const [sortConfig, setSortConfig] = useState({ key: 'moveInDate', direction: 'asc' });

  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );

    // 정렬 적용
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // null/undefined 처리
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // 숫자 비교 (보증금, 월세)
      if (sortConfig.key === 'hopefulDeposit' || sortConfig.key === 'hopefulMonthlyRent') {
        const numA = Number(aValue) || 0;
        const numB = Number(bValue) || 0;
        return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
      }

      // 문자열 비교 (고객명, 입주희망일)
      const strA = String(aValue).toLowerCase();
      const strB = String(bValue).toLowerCase();

      if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [customers, searchTerm, sortConfig]);

  const handleContextMenu = (e, customer) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY, selectedCustomer: customer });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleEdit = () => {
    if (contextMenu.selectedCustomer) {
      onEdit(contextMenu.selectedCustomer);
    }
    handleCloseContextMenu();
  };

  const handleDelete = () => {
    if (contextMenu.selectedCustomer) {
      onDelete(contextMenu.selectedCustomer);
    }
    handleCloseContextMenu();
  };

  // 진행상황별 고객 수 계산 (현재 선택된 상태에 해당하는 고객만)
  const getProgressCount = (progress) => {
    return allCustomers.filter(c =>
      (activeFilter === '전체' || c.status === activeFilter) && c.progress === progress
    ).length;
  };

  // 진행상황 탭을 표시할지 여부
  const showProgressTabs = activeFilter === '신규' || activeFilter === '진행중';

  // 정렬 핸들러
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // 정렬 아이콘 표시
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="table-container" onClick={handleCloseContextMenu}>
        <div style={{ marginBottom: '15px' }}>
            <input
                type="text"
                placeholder="고객명, 연락처 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
            />
        </div>

        {showProgressTabs && (
          <div className="progress-tabs" style={{ marginBottom: '15px' }}>
            <button
              className={`progress-tab ${!activeProgressFilter ? 'active' : ''}`}
              onClick={() => onProgressFilterChange(null)}
            >
              전체 ({allCustomers.filter(c => activeFilter === '전체' || c.status === activeFilter).length})
            </button>
            {PROGRESS_STATUSES.map(progress => (
              <button
                key={progress}
                className={`progress-tab ${activeProgressFilter === progress ? 'active' : ''} progress-${progress}`}
                onClick={() => onProgressFilterChange(progress)}
              >
                {progress} ({getProgressCount(progress)})
              </button>
            ))}
          </div>
        )}
      <table className="customer-table">
        <thead>
          <tr>
            <th>#</th>
            <th>매물종류</th>
            <th
              onClick={() => handleSort('name')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
              title="클릭하여 정렬"
            >
              고객명{getSortIcon('name')}
            </th>
            <th>연락처</th>
            <th
              onClick={() => handleSort('hopefulDeposit')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
              title="클릭하여 정렬"
            >
              희망보증금{getSortIcon('hopefulDeposit')}
            </th>
            <th
              onClick={() => handleSort('hopefulMonthlyRent')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
              title="클릭하여 정렬"
            >
              희망월세{getSortIcon('hopefulMonthlyRent')}
            </th>
            <th>선호지역</th>
            <th
              onClick={() => handleSort('moveInDate')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
              title="클릭하여 정렬"
            >
              입주희망일{getSortIcon('moveInDate')}
            </th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer, index) => (
            <tr 
              key={customer.id} 
              className={selectedCustomerId === customer.id ? 'selected' : ''}
              onClick={() => onSelectCustomer(customer)}
              onContextMenu={(e) => handleContextMenu(e, customer)}
            >
              <td>{index + 1}</td>
              <td>{customer.propertyType}</td>
              <td className="customer-name" title={customer.name}>{customer.name}</td>
              <td><a href={`sms:${customer.phone}`}>{customer.phone}</a></td>
              <td>{customer.hopefulDeposit ? `${customer.hopefulDeposit}만원` : '-'}</td>
              <td>{customer.hopefulMonthlyRent ? `${customer.hopefulMonthlyRent}만원` : '-'}</td>
              <td className="preferred-area" title={customer.preferredArea}>{customer.preferredArea}</td>
              <td>{customer.moveInDate}</td>
              <td>{customer.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {contextMenu.visible && (
        <div style={{ top: contextMenu.y, left: contextMenu.x, position: 'absolute', zIndex: 100, background: 'white', border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: '5px' }}>
            <li style={{ padding: '8px', cursor: 'pointer' }} onClick={handleEdit}>수정</li>
            <li style={{ padding: '8px', cursor: 'pointer' }} onClick={handleDelete}>삭제</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
