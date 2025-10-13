import React, { useState, useEffect } from 'react';
import { SOURCES, PROPERTY_TYPES, STATUSES, PROGRESS_STATUSES } from '../constants';
import { validateCustomer } from '../utils/validation';
import { generateId } from '../utils/helpers';

const CustomerModal = ({ isOpen, onClose, onSave, editData }) => {
  const getInitialState = () => ({
    id: editData?.id || null,
    name: editData?.name || '',
    phone: editData?.phone || '',
    source: editData?.source || SOURCES[0],
    propertyType: editData?.propertyType || PROPERTY_TYPES[0],
    preferredArea: editData?.preferredArea || '',
    hopefulDeposit: editData?.hopefulDeposit || '',
    hopefulMonthlyRent: editData?.hopefulMonthlyRent || '',
    moveInDate: editData?.moveInDate || '',
    memo: editData?.memo || '',
    status: editData?.status || STATUSES[0],
    progress: editData?.progress || null,
    createdAt: editData?.createdAt || new Date().toISOString(),
  });

  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    setFormData(getInitialState());
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updates = { [name]: value };

    // 상태가 계약완료 또는 포기로 변경되면 진행상황을 null로
    if (name === 'status' && (value === '계약완료' || value === '포기')) {
      updates.progress = null;
    }

    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 3 && value.length <= 7) {
        value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
        value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSubmit = () => {
    const customerToSave = {
        ...formData,
        id: formData.id || generateId(),
        hopefulDeposit: parseInt(formData.hopefulDeposit, 10) || 0,
        hopefulMonthlyRent: parseInt(formData.hopefulMonthlyRent, 10) || 0,
    };

    if (validateCustomer(customerToSave)) {
      onSave(customerToSave);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{editData ? '고객 수정' : '고객 추가'}</h3>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>
        <div className="form-group">
            <label>고객명 *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="고객 이름 입력" required />
        </div>
        <div className="form-grid">
            <div className="form-group">
                <label>경로</label>
                <select name="source" value={formData.source} onChange={handleChange}>{SOURCES.map(s => <option key={s} value={s}>{s}</option>)}</select>
            </div>
            <div className="form-group">
                <label>매물종류</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange}>{PROPERTY_TYPES.map(p => <option key={p} value={p}>{p}</option>)}</select>
            </div>
            <div className="form-group">
                <label>상태</label>
                <select name="status" value={formData.status} onChange={handleChange}>{STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>
            </div>
            {(formData.status === '신규' || formData.status === '진행중') && (
              <div className="form-group">
                  <label>진행상황</label>
                  <select name="progress" value={formData.progress || ''} onChange={handleChange}>
                    <option value="">선택 안 함</option>
                    {PROGRESS_STATUSES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
              </div>
            )}
        </div>
        <div className="form-grid">
            <div className="form-group">
                <label>연락처</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handlePhoneChange} placeholder="010-xxxx-xxxx" />
            </div>
            <div className="form-group">
                <label>입주희망일</label>
                <input type="date" name="moveInDate" value={formData.moveInDate} onChange={handleChange} />
            </div>
        </div>
        <div className="form-grid">
            <div className="form-group">
                <label>희망보증금 (만원)</label>
                <input type="number" name="hopefulDeposit" value={formData.hopefulDeposit} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>희망월세 (만원)</label>
                <input type="number" name="hopefulMonthlyRent" value={formData.hopefulMonthlyRent} onChange={handleChange} />
            </div>
        </div>
        <div className="form-group">
            <label>선호지역</label>
            <textarea name="preferredArea" value={formData.preferredArea} onChange={handleChange} rows="2"></textarea>
        </div>
        <div className="form-group">
            <label>메모</label>
            <textarea name="memo" value={formData.memo} onChange={handleChange}></textarea>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">취소</button>
          <button onClick={handleSubmit} className="btn-primary">저장</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
