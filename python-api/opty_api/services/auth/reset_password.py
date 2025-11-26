from opty_api.utils.supabase_client import get_supabase
import os

def send_reset_email(email: str):
    supabase = get_supabase()
    redirect_url = os.getenv("RESET_REDIRECT_URL")

    return supabase.auth.reset_password_for_email(
        email,
        options={"redirectTo": redirect_url}
    )


def reset_password_with_token(access_token: str, new_password: str):
    supabase = get_supabase()

    resp = supabase.auth.update_user(
        {
            "password": new_password
        },
        access_token=access_token
    )

    return resp
