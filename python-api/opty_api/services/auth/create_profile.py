"""
Service for creating user profile in MongoDB (for OAuth users).
"""

# --- IMPORTS ---
from opty_api.app import container
from opty_api.err.already_exists_error import AlreadyExistsError


# --- TYPES ---
from opty_api.schemas.user import User


# --- CODE ---
async def create_user_profile(profile_data: dict) -> User:
    """
    Create a user profile in MongoDB without creating in Supabase.
    Used for OAuth users where Supabase user already exists.

    :param profile_data: User profile data.

    :return: Created user profile.

    :raises AlreadyExistsError: If user profile already exists.
    :raises MongoUnavailableError: If MongoDB operation fails.
    """

    # Check if user already exists in MongoDB by supabase_id
    existing_user = await container['user_repository'].get_by_supabase_id(profile_data['supabase_id'])
    if existing_user:
        raise AlreadyExistsError('User profile already exists')

    # Check if user already exists by email
    existing_user_by_email = await container['user_repository'].get_by_email(profile_data['email'])
    if existing_user_by_email:
        raise AlreadyExistsError('User with this email already exists')

    # Create user profile document
    user_document: User = {
        'supabase_id': profile_data['supabase_id'],
        'email': profile_data['email'],
        'name': profile_data.get('name', 'User'),
        'phone': profile_data.get('phone'),
        'birthday': profile_data.get('birthday'),
        'is_active': True,
        'role': 'user',
        'avatar_url': profile_data.get('avatar_url'),
    }

    # Insert user profile into MongoDB
    created_user = await container['user_repository'].add_user(user_document)

    # Return created profile
    return created_user
