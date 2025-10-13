import React from 'react';

const BasicInfo = ({ customer }) => {
  if (!customer) return null;

  return (
    <div className="basic-info-container">
        <div className="info-section">
            <h4>기본 정보</h4>
            <div style={{ marginBottom: '15px' }}>
                <span style={{ fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '4px', fontSize: '12px' }}>고객명</span>
                <p style={{ margin: 0 }}>{customer.name}</p>
            </div>
            <div className="info-grid">
                <div><span>경로</span><p>{customer.source}</p></div>
                <div><span>매물종류</span><p>{customer.propertyType}</p></div>
                <div><span>상태</span><p>{customer.status}</p></div>
                <div><span>진행상황</span><p>{customer.progress || '-'}</p></div>
                <div><span>연락처</span><p>{customer.phone}</p></div>
                <div><span>입주희망일</span><p>{customer.moveInDate}</p></div>
                <div><span>희망보증금</span><p>{customer.hopefulDeposit ? `${customer.hopefulDeposit}만원` : '-'}</p></div>
                <div><span>희망월세</span><p>{customer.hopefulMonthlyRent ? `${customer.hopefulMonthlyRent}만원` : '-'}</p></div>
            </div>
        </div>
        <div className="info-section">
            <h4>선호 지역</h4>
            <p>{customer.preferredArea || '-'}</p>
        </div>
        <div className="info-section">
            <h4>메모</h4>
            <p>{customer.memo || '-'}</p>
        </div>
    </div>
  );
};

export default BasicInfo;
