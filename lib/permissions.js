const userHasPermission = (user, permission) => {
    return user.permissions.has(permission);
};

const userHasPermissions = (user, permissions) => {
    return permissions.every((permission) => userHasPermission(user, permission));
};

const userHasAnyPermission = (user, permissions) => {
    return permissions.some((permission) => userHasPermission(user, permission));
};

const userHasRole = (user, role) => {
    return user.roles.cache.has(role);
};

const userHasRoles = (user, roles) => {
    return roles.every((role) => userHasRole(user, role));
};

const userHasAnyRole = (user, roles) => {
    return roles.some((role) => userHasRole(user, role));
};

const userHasChannelPermission = (user, channel, permission) => {
    return channel.permissionsFor(user).has(permission);
};

export default {
    userHasPermission,
    userHasPermissions,
    userHasAnyPermission,
    userHasRole,
    userHasRoles,
    userHasAnyRole,
    userHasChannelPermission,
};
