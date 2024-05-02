from django.contrib.auth.models import User
from bryckel.models import Note

from rest_framework.serializers import ModelSerializer, SerializerMethodField


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = (
            "username",
            "first_name",
            "last_name",
            "email"
        )


class FullNoteSerializer(ModelSerializer):

    username = SerializerMethodField()

    class Meta:
        model = Note
        fields = (
            "id",
            "username",
            "title",
            "text",
            "created",
            "updated"
        )

    def get_username(self, note: Note):
        return note.user.username
    

class PartNoteSerializer(ModelSerializer):

    username = SerializerMethodField()

    class Meta:
        model = Note
        fields = (
            "id",
            "username",
            "title",
            "created",
            "updated"
        )

    def get_username(self, note: Note):
        return note.user.username