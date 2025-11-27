"""
User login service.
"""

# --- IMPORTS ---
from opty_api.app import container
from opty_api.err.supabase_error import SupabaseError
from supabase_auth.errors import AuthApiError
from opty_api.utils.auth import generate_refresh_token
from opty_api.mongo.repositories.refresh_tokens import RefreshTokenRepository


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
        # Obter user_id do supabase
        user_id = auth_response.user.id

        # Criar refresh token interno
        refresh_repo = RefreshTokenRepository()
        refresh_token, expires_at = generate_refresh_token()
        refresh_repo.create(user_id=user_id, token=refresh_token, expires_at=expires_at)

    

    # Error in supabase auth: raise custom error
    except AuthApiError as e:
        raise AuthApiError(code=e.code, status=e.status, message=e.message) from e

    # Error in supabase auth: raise custom error
    except Exception as e:
        raise SupabaseError(f'[SUPABASE  ] Login failed: {str(e)}') from e

    # Return auth response
    return {
    "access_token": auth_response.session.access_token,  # do Supabase
    "refresh_token": refresh_token,                     # nosso
    "user": {
        "id": user_id,
        "email": auth_response.user.email
    }
}


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