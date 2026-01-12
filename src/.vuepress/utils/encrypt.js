// 加密解密工具
// 使用简单但更安全的加密算法替代纯Base64编码

// 加密密钥，实际项目中应该从环境变量获取
const SECRET_KEY = 'your-secret-key-change-me';

/**
 * 简单的异或加密算法
 * @param {string} text - 需要加密的文本
 * @param {string} key - 加密密钥
 * @returns {string} - 加密后的文本
 */
function xorEncrypt(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const keyCode = key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode ^ keyCode);
  }
  return result;
}

/**
 * 加密对象为安全字符串
 * @param {Object} data - 要加密的数据对象
 * @returns {string} - 加密后的字符串
 */
export function encrypt(data) {
  try {
    const jsonString = JSON.stringify(data);
    // 先进行异或加密
    const xorEncrypted = xorEncrypt(jsonString, SECRET_KEY);
    // 再进行Base64编码，确保可以在URL中安全传输
    const base64String = btoa(unescape(encodeURIComponent(xorEncrypted)));
    return base64String;
  } catch (error) {
    console.error('加密失败:', error);
    return '';
  }
}

/**
 * 解密安全字符串为对象
 * @param {string} encryptedString - 加密后的字符串
 * @returns {Object} - 解密后的数据对象
 */
export function decrypt(encryptedString) {
  try {
    if (!encryptedString) return {};
    // 先进行Base64解码
    const xorEncrypted = decodeURIComponent(escape(atob(encryptedString)));
    // 再进行异或解密
    const jsonString = xorEncrypt(xorEncrypted, SECRET_KEY);
    const data = JSON.parse(jsonString);
    return data;
  } catch (error) {
    console.error('解密失败:', error);
    return {};
  }
}