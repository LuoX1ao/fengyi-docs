// 解密token示例代码
// 注意：此代码不需要安装任何第三方依赖，使用JavaScript内置的Base64解码

/**
 * 解密token的函数
 * @param {string} encryptedToken - 加密后的token字符串
 * @returns {string} - 解密后的原始token
 */
function decryptToken(encryptedToken) {
  // 使用Base64解码token
  const decoded = decodeURIComponent(escape(atob(encryptedToken)));
  return decoded;
}

/**
 * 可选的简单验证token函数
 * @param {string} token - 解码后的token
 * @param {string} expectedPrefix - 预期的token前缀（可选）
 * @returns {boolean} - token是否有效
 */
function verifyToken(token, expectedPrefix = '') {
  // 简单验证：检查token是否非空且包含预期前缀
  return token && token.trim() !== '' && (expectedPrefix ? token.startsWith(expectedPrefix) : true);
}

// 示例用法
// 假设从URL查询参数中获取加密后的token
const urlParams = new URLSearchParams(window.location.search);
const encryptedToken = urlParams.get('param');

if (encryptedToken) {
  try {
    const decryptedToken = decryptToken(encryptedToken);
    console.log('解密后的token:', decryptedToken);
    
    // 验证token（示例：检查token格式是否正确）
    if (decryptedToken && decryptedToken.length > 0) {
      console.log('token验证成功');
      // 执行后续操作
    } else {
      console.error('token验证失败');
    }
  } catch (error) {
    console.error('解密失败:', error);
  }
} else {
  console.error('未找到加密的token参数');
}

// Node.js环境下的示例用法（如果外部系统是Node.js应用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { decryptToken, verifyToken };
}