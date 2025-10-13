import React, { useState } from 'react';
import { ACTIVITY_TYPES } from '../../constants';
import { generateId, formatDateTime } from '../../utils/helpers';

const ActivityTab = ({ customerId, activities, onSaveActivity, onDeleteActivity }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [viewingActivity, setViewingActivity] = useState(null);

  const customerActivities = activities
    .filter(a => a.customerId === customerId)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신순 정렬

  const handleSave = (activityData) => {
    onSaveActivity(activityData);
    setIsAdding(false);
    setEditingActivity(null);
  };

  const formatActivityDate = (dateTime) => {
    if (!dateTime) return '';
    return dateTime.slice(0, 10);
  };

  const formatActivityTime = (dateTime) => {
    if (!dateTime) return '';
    const time = dateTime.slice(11, 16);
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour < 12 ? '오전' : '오후';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${period} ${displayHour}:${minutes}`;
  };

  const ActivityViewModal = ({ activity, onClose }) => {
    const [followUps, setFollowUps] = useState(activity.followUps || []);
    const [editingFollowUpId, setEditingFollowUpId] = useState(null);
    const [newFollowUpContent, setNewFollowUpContent] = useState('');

    const handleAddFollowUp = () => {
      if (!newFollowUpContent.trim()) return;

      const followUp = {
        id: generateId(),
        date: new Date().toISOString(),
        content: newFollowUpContent,
        createdAt: new Date().toISOString()
      };
      const updatedFollowUps = [...followUps, followUp];
      const updatedActivity = { ...activity, followUps: updatedFollowUps };
      handleSave(updatedActivity);
      setFollowUps(updatedFollowUps);
      setNewFollowUpContent('');
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        handleAddFollowUp();
      }
    };

    const handleDeleteFollowUp = (followUpId) => {
      if (confirm('이 후속 기록을 삭제하시겠습니까?')) {
        const updatedFollowUps = followUps.filter(f => f.id !== followUpId);
        const updatedActivity = { ...activity, followUps: updatedFollowUps };
        handleSave(updatedActivity);
        setFollowUps(updatedFollowUps);
      }
    };

    const handleEditFollowUp = (followUpId, updatedContent) => {
      const updatedFollowUps = followUps.map(f =>
        f.id === followUpId ? { ...f, content: updatedContent } : f
      );
      const updatedActivity = { ...activity, followUps: updatedFollowUps };
      handleSave(updatedActivity);
      setFollowUps(updatedFollowUps);
      setEditingFollowUpId(null);
    };

    const sortedFollowUps = [...followUps].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
          <div className="modal-header">
            <h3>활동 상세 - {activity.type}</h3>
            <button className="btn-close" onClick={onClose}>×</button>
          </div>
          <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#7f8c8d', fontSize: '14px' }}>활동유형</strong>
              <p style={{ margin: '5px 0', fontSize: '16px' }}>{activity.type}</p>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#7f8c8d', fontSize: '14px' }}>활동일시</strong>
              <p style={{ margin: '5px 0', fontSize: '16px' }}>{formatDateTime(activity.date)}</p>
            </div>
            <div style={{ marginBottom: '25px' }}>
              <strong style={{ color: '#7f8c8d', fontSize: '14px' }}>활동 내용</strong>
              <p style={{ margin: '5px 0', fontSize: '16px', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{activity.content}</p>
            </div>

            <div style={{ borderTop: '2px solid #e0e0e0', paddingTop: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#7f8c8d', fontSize: '14px' }}>📝 후속 기록 ({followUps.length})</strong>
              </div>

              <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '5px', padding: '10px', marginBottom: '15px' }}>
                <textarea
                  value={newFollowUpContent}
                  onChange={(e) => setNewFollowUpContent(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="후속 기록을 입력하세요... (Ctrl+Enter로 입력)"
                  style={{
                    width: '100%',
                    padding: '8px',
                    minHeight: '60px',
                    border: 'none',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button onClick={handleAddFollowUp} className="btn-primary" style={{ fontSize: '12px', padding: '6px 16px' }}>
                    입력
                  </button>
                </div>
              </div>

              {sortedFollowUps.length > 0 ? (
                sortedFollowUps.map(followUp => (
                  <div key={followUp.id} style={{ background: '#f8f9fa', padding: '12px', borderRadius: '5px', marginBottom: '10px', borderLeft: '3px solid var(--primary-blue)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', color: '#7f8c8d' }}>{formatDateTime(followUp.date)}</span>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => setEditingFollowUpId(followUp.id)}
                          style={{ fontSize: '11px', padding: '3px 8px' }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteFollowUp(followUp.id)}
                          className="btn-secondary"
                          style={{ fontSize: '11px', padding: '3px 8px' }}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    {editingFollowUpId === followUp.id ? (
                      <div>
                        <textarea
                          defaultValue={followUp.content}
                          onBlur={(e) => handleEditFollowUp(followUp.id, e.target.value)}
                          style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '1.5' }}>{followUp.content}</p>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>후속 기록이 없습니다.</p>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn-primary">닫기</button>
          </div>
        </div>
      </div>
    );
  };

  const ActivityForm = ({ activity, onCancel }) => {
    const [formData, setFormData] = useState(
      activity || { type: ACTIVITY_TYPES[0], date: new Date().toISOString().slice(0, 16), content: '' }
    );

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const activityToSave = { ...formData, id: formData.id || generateId(), customerId };
        handleSave(activityToSave);
    };

    return (
      <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>활동 추가 - 여의도근무 여성분(렌코양창룸방)</h3>
            <button className="btn-close" onClick={onCancel}>×</button>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>활동 유형 *</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>활동일시 *</label>
              <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>활동 내용 *</label>
              <textarea name="content" value={formData.content} onChange={handleChange} placeholder="활동 내용을 입력하세요"></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={onCancel} className="btn-secondary">취소</button>
            <button onClick={handleSubmit} className="btn-primary">저장</button>
          </div>
        </div>
      </div>
    );
  };

  // viewingActivity가 변경되었을 때 최신 데이터로 업데이트
  const currentViewingActivity = viewingActivity
    ? customerActivities.find(a => a.id === viewingActivity.id)
    : null;

  return (
    <div className="activity-tab">
      {!isAdding && !editingActivity && <button onClick={() => setIsAdding(true)}>+ 활동 추가</button>}
      {isAdding && <ActivityForm onCancel={() => setIsAdding(false)} />}

      {editingActivity ? (
        <ActivityForm activity={editingActivity} onCancel={() => setEditingActivity(null)} />
      ) : customerActivities.length > 0 ? (
        <table className="customer-table" style={{ marginTop: '15px' }}>
          <thead>
            <tr>
              <th>활동날짜</th>
              <th>활동시간</th>
              <th>활동유형</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {customerActivities.map(activity => (
              <tr key={activity.id}>
                <td>{formatActivityDate(activity.date)}</td>
                <td>{formatActivityTime(activity.date)}</td>
                <td
                  onClick={() => setViewingActivity(activity)}
                  style={{
                    cursor: 'pointer',
                    color: 'var(--primary-blue)',
                    textDecoration: 'underline'
                  }}
                >
                  {activity.type}
                  {activity.followUps && activity.followUps.length > 0 && (
                    <span style={{ marginLeft: '5px', fontSize: '12px', color: '#7f8c8d' }}>
                      💬{activity.followUps.length}
                    </span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => setEditingActivity(activity)}
                    style={{ fontSize: '12px', padding: '4px 8px', marginRight: '5px' }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDeleteActivity(activity.id)}
                    className="btn-secondary"
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          등록된 활동이 없습니다.
        </div>
      )}

      {currentViewingActivity && <ActivityViewModal activity={currentViewingActivity} onClose={() => setViewingActivity(null)} />}
    </div>
  );
};

export default ActivityTab;
