"""
User login service.
"""

# --- IMPORTS ---
from opty_api.app import container
from opty_api.err.supabase_error import SupabaseError
from supabase_auth.errors import AuthApiError


# --- TYPES ---
from supabase_auth.types import AuthResponse
from supabase_auth.types import OAuthResponse


# --- CODE ---
async def login_user(email: str, password: str) -> AuthResponse:
    """
    Login user with email and password.

    :param email: User email
    :param password: User password

    :return: AuthResponse from Supabase

    :raises SupabaseError: If there is an error with Supabase authentication
    :raises InvalidCredentialError: If the credentials are invalid
    """

    # Authenticate with Supabase
    try:
        auth_response = await container['supabase_client'].auth.sign_in_with_password({
            'email': email,
            'password': password,
        })

    # Error in supabase auth: raise custom error
    except AuthApiError as e:
        raise AuthApiError(code=e.code, status=e.status, message=e.message) from e

    # Error in supabase auth: raise custom error
    except Exception as e:
        raise SupabaseError(f'[SUPABASE  ] Login failed: {str(e)}') from e

    # Return auth response
    return auth_response


async def login_with_oauth(provider: str) -> OAuthResponse:
    """
    Login with OAuth provider (Google, GitHub, etc).

    :param provider: OAuth provider name

    :return: OAuthResponse from Supabase
    """

    # Authenticate with Supabase OAuth
    try:
        auth_response = await container['supabase_client'].auth.sign_in_with_oauth({
            'provider': provider,
        })

        # Return auth response
        return auth_response

    # Error in supabase auth: raise custom error
    except Exception as e:
        raise SupabaseError(f'[SUPABASE  ] OAuth login failed: {str(e)}') from e
