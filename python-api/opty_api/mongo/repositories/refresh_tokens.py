# opty_api/mongo/repositories/refresh_tokens.py
from datetime import datetime
from pymongo.collection import Collection
from pymongo import ASCENDING
from opty_api.mongo.setup.connection import db

class RefreshTokenRepository:
    def __init__(self):
        self.collection: Collection = db["refresh_tokens"]

        # Índices importantes
        # token único
        self.collection.create_index(
            [("token", ASCENDING)], unique=True, background=True
        )

        # TTL para excluir automaticamente tokens expirados
        self.collection.create_index(
            [("expires_at", ASCENDING)], expireAfterSeconds=0, background=True
        )

    def create(self, user_id: str, token: str, expires_at: datetime):
        doc = {
            "user_id": user_id,
            "token": token,
            "expires_at": expires_at,
            "created_at": datetime.utcnow(),
        }
        self.collection.insert_one(doc)
        return doc

    def get(self, token: str):
        return self.collection.find_one({"token": token})

    def delete(self, token: str):
        return self.collection.delete_one({"token": token})

    def delete_all_for_user(self, user_id: str):
        return self.collection.delete_many({"user_id": user_id})
