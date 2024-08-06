/**
 * 检查权限点工具函数
 * @param {*} permissionCode 元素权限点
 * @param {*} permissions 所有权限点
 */
export function checkAuthority(permissionCode, permissions) {
  let hasPermission = true;
  if (permissionCode) {
    if (permissionCode instanceof Array && permissionCode.length > 0) {
      hasPermission = permissions.some(permissions =>
        permissionCode.includes(permissions)
      );
    } else {
      hasPermission = permissions.some(item => item === permissionCode);
    }
  }
  return hasPermission;
}
