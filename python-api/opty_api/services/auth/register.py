"""
User registration service.
"""

# --- IMPORTS ---
from opty_api.app import container
from opty_api.err.already_exists_error import AlreadyExistsError
from opty_api.err.supabase_error import SupabaseError


# --- TYPES ---
from opty_api.schemas.user import User
from supabase_auth.types import AuthResponse


# --- CODE ---
async def register_user(user_data: User) -> AuthResponse:
    """
    Register a new user in Supabase and create user profile in MongoDB.

    :param user_data: User data for registration.

    :return: AuthResponse from Supabase.

    :raises AlreadyExistsError: If user with the same email already exists.
    :raises SupabaseError: If Supabase registration fails.
    :raises MongoUnavailableError: If MongoDB operation fails.
    """

    # Check if user already exists in MongoDB
    user = await container['user_repository'].get_by_email(user_data['email'])
    if user:
        raise AlreadyExistsError('User with this email already exists')

    # Create user in Supabase Auth
    try:
        auth_response = await container['supabase_client'].auth.sign_up({
            'email': user_data['email'],
            'password': user_data['password'],
        })

    # Supabase registration failed: raise custom error
    except Exception as e:
        raise SupabaseError(f'[SUPABASE  ] registration failed: {str(e)}') from e

    # User creation failed: raise custom error
    if not auth_response.user:
        raise SupabaseError('[SUPABASE  ] Failed to create user in Supabase')

    # Get the created Supabase user
    supabase_user = auth_response.user

    # Create user profile document
    user_document: User = {
        'supabase_id': supabase_user.id,
        'email': user_data['email'],
        'name': user_data['name'],
        'phone': user_data['phone'],
        'birthday': user_data['birthday'],
        'is_active': True,
        'role': 'user',
        'avatar_url': None,
    }

    # Insert user profile into MongoDB
    await container['user_repository'].add_user(user_document)

    # Return response
    return auth_response
