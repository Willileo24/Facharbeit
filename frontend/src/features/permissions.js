function hasPermission(permissions, permission) {
    if (permissions.includes(permission)) {
        return true;
    }
    while (permission !== "*") {
        permission = permission.replace(/\w+(\.\*)?$/, "*");
        if (permissions.includes(permission)) {
            return true;
        }
    }
    return false;
}

module.exports = {hasPermission};