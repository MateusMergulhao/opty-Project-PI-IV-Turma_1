# python-api/opty_api/schemas/refresh_token.py
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import Optional

class RefreshToken(BaseModel):
    _id: Optional[str] = Field(None, alias="_id")
    user_id: str
    token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())

    class Config:
        allow_population_by_field_name = True
        orm_mode = True
