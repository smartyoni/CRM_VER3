// 매물 정보 텍스트에서 건물호실명과 연락처를 자동으로 추출하는 함수

/**
 * 매물 정보 텍스트의 2번째 줄에서 건물호실명 추출
 * @param {string} text - 매물 정보 전체 텍스트
 * @returns {string} - 추출된 건물호실명
 */
export const extractPropertyName = (text) => {
  if (!text) return '';

  const lines = text.split('\n').filter(line => line.trim() !== '');

  // 2번째 줄 반환 (인덱스 1)
  if (lines.length >= 2) {
    return lines[1].trim();
  }

  return '';
};

/**
 * 매물 정보 텍스트의 마지막 줄에서 연락처 추출
 * @param {string} text - 매물 정보 전체 텍스트
 * @returns {string} - 추출된 연락처
 */
export const extractContactNumber = (text) => {
  if (!text) return '';

  const lines = text.split('\n').filter(line => line.trim() !== '');

  // 마지막 줄 반환
  if (lines.length > 0) {
    return lines[lines.length - 1].trim();
  }

  return '';
};

/**
 * 매물 정보 텍스트 붙여넣기 시 자동으로 건물명과 연락처 추출
 * @param {string} text - 매물 정보 전체 텍스트
 * @returns {object} - { propertyName, contactNumber }
 */
export const parsePropertyDetails = (text) => {
  return {
    propertyName: extractPropertyName(text),
    contactNumber: extractContactNumber(text)
  };
};
