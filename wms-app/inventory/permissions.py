from rest_framework import permissions

class RolePermission(permissions.BasePermission):
    """
    Grants granular access based on user roles: admin, manager, operator
    """

    def has_permission(self, request, view):
        user = request.user
        role = getattr(user, 'role', None)

        # Allow read-only access to everyone who is authenticated
        if request.method in permissions.SAFE_METHODS:
            return user.is_authenticated

        # Admin has full access
        if role == 'admin':
            return True

        # Manager: can read/write but not delete
        if role == 'manager':
            return request.method in ['GET', 'POST', 'PUT', 'PATCH']

        # Operator: read-only access only
        if role == 'operator':
            return request.method in permissions.SAFE_METHODS

        return False
