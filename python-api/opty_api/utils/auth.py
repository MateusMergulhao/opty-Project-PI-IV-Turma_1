"""
Auth utility functions.
"""

# --- IMPORTS ---
from opty_api.app import container
from opty_api.err.supabase_error import SupabaseError


# --- TYPES ---
from supabase_auth.types import UserResponse
from typing import Optional


# --- CODE ---
async def get_user_from_token(access_token: str) -> Optional[UserResponse]:
    """
    Get user data from access token.

    :param access_token: JWT access token.

    :return: User data dictionary or None if not found.

    :raises SupabaseError: If there is an error communicating with Supabase.
    """
    try:

        # Validate token and get user from Supabase
        supabase_user = await container['supabase_client'].auth.get_user(access_token)

        # Supabase user not found: return None
        if not supabase_user.user:
            return None

        # Return user profile
        return supabase_user

    # Error in supabase: raise custom error
    except Exception as e:
        raise SupabaseError(f'Error getting user from token: {str(e)}') from e

import secrets
from datetime import datetime, timedelta

def generate_refresh_token(days_valid: int = 7):
    token = secrets.token_urlsafe(64)
    expires_at = datetime.utcnow() + timedelta(days=days_valid)
    return token, expires_at

