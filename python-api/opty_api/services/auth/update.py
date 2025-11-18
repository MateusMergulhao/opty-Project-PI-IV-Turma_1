"""
User profile update service.
"""

# --- IMPORTS ---
from opty_api.app import container
from opty_api.err.empty_update_error import EmptyUpdateError


# --- TYPES ---
from opty_api.schemas.auth.update.endpoint import UserUpdatePayload
from opty_api.schemas.user import User


# --- CODE ---
async def update_user_profile(supabase_id: str, update_data: UserUpdatePayload) -> User:
    """
    Update user profile.

    :param supabase_id: Supabase user ID
    :param update_data: Data to update
    :return: Updated User object

    :raises EmptyUpdateError: If no data is provided for update
    """

    # Prepare update data
    data = update_data.model_dump(exclude_none=True)

    # Nothing to update: raise custom error
    if data == {}:
        raise EmptyUpdateError('No data provided for update')

    # Update in MongoDB
    result = await container['user_repository'].update_by_supabase_id(supabase_id=supabase_id, update_data=data)

    # Return updated user
    return result
