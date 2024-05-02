from bryckel.models import Note
from bryckel.serializers import UserSerializer, FullNoteSerializer, PartNoteSerializer

from django.contrib.auth.models import User
from django.db.models import Q

from rest_framework.decorators import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_202_ACCEPTED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN, HTTP_409_CONFLICT

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import Token, RefreshToken

import requests


class UserAPIView(APIView):

    authentication_classes = [JWTAuthentication]

    def get(self, request: Request):
        user: User = request.user
        user_data = UserSerializer(user).data
        return Response(user_data, status=HTTP_200_OK)
    
    def post(self, request: Request):
        access_token = request.data.get("access_token")
        if not access_token:
            return Response(status=HTTP_400_BAD_REQUEST)
        else:
            response = requests.get("https://www.googleapis.com/oauth2/v3/userinfo", headers={
                "Authorization": f"Bearer {access_token}"
            })
            if response.status_code == 200:
                response_data = response.json()
                email: str = response_data["email"]
                user_filter = User.objects.filter(email=email)
                if user_filter.exists():
                    user = user_filter.get()
                    token: Token = RefreshToken.for_user(user)
                    token_data = {
                        "access": str(token.access_token),
                        "refresh": str(token)
                    }
                    return Response(data=token_data, status=HTTP_200_OK)
                else:
                    user_data = {
                        "first_name": response_data["given_name"],
                        "last_name": response_data["family_name"],
                        "username": email.split("@")[0]
                    }
                    return Response(data=user_data, status=HTTP_202_ACCEPTED)
            else:
                return Response({"message": "Bad Token"}, status=HTTP_401_UNAUTHORIZED)
    
    def put(self, request: Request):
        access_token, username, first_name, last_name = request.data.get("access_token"), request.data.get("username"), request.data.get("first_name"), request.data.get("last_name")
        if not access_token:
            return Response(status=HTTP_400_BAD_REQUEST)
        else:
            response = requests.get("https://www.googleapis.com/oauth2/v3/userinfo", headers={
                "Authorization": f"Bearer {access_token}"
            })
            if response.status_code == 200:
                response_data = response.json()
                email: str = response_data["email"]
                user_filter = User.objects.filter(Q(email=email) | Q(username=username))
                if user_filter.exists():
                    user = user_filter.first()
                    if user.username == username:
                        return Response(data={"FIELD": "USERNAME"}, status=HTTP_409_CONFLICT)
                    else:
                        return Response(data={"FIELD": "EMAIL"}, status=HTTP_409_CONFLICT)
                else:
                    user = User(username=username, first_name=first_name, last_name=last_name, email=email)
                    user.set_password(email[::-1])
                    user.save()
                    token: Token = RefreshToken.for_user(user)
                    token_data = {
                        "access": str(token.access_token),
                        "refresh": str(token)
                    }
                    return Response(data=token_data, status=HTTP_201_CREATED)
            else:
                return Response(status=HTTP_401_UNAUTHORIZED)


class NoteAPIView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        user = request.user
        note_filter = Note.objects.filter(user=user).order_by("-updated")
        notes = PartNoteSerializer(note_filter, many=True).data
        data = {"notes": notes}
        return Response(data=data, status=HTTP_200_OK)

    def post(self, request: Request):
        user = request.user
        title = request.data.get("title")
        if not title:
            return Response(status=HTTP_400_BAD_REQUEST)
        else:
            note = Note(user=user, title=title, text="")
            note.save()
            note_data = PartNoteSerializer(note).data
            return Response(data=note_data, status=HTTP_201_CREATED)
    

class NoteParamAPIView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, id: int):
        user = request.user
        note_filter = Note.objects.filter(user=user, id=id)
        if note_filter.exists():
            note = note_filter.get()
            note_data = FullNoteSerializer(note).data
            return Response(data=note_data, status=HTTP_200_OK)
        else:
            return Response(status=HTTP_403_FORBIDDEN)

    def put(self, request: Request, id: int):
        user = request.user
        new_text = request.data.get("text")
        new_title = request.data.get("title")
        if new_text == None or new_title == None:
            return Response(status=HTTP_400_BAD_REQUEST)
        else:
            note_filter = Note.objects.filter(user=user, id=id)
            if note_filter.exists():
                note = note_filter.get()
                note.text = new_text
                note.title = new_title
                note.save()
                return Response(status=HTTP_204_NO_CONTENT)
            else:
                return Response(status=HTTP_403_FORBIDDEN)
            
    def delete(self, request: Request, id: int):
        user = request.user
        note_filter = Note.objects.filter(user=user, id=id)
        if note_filter.exists():
            note = note_filter.get()
            note.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        else:
            return Response(status=HTTP_403_FORBIDDEN)