from django.urls import path
from bryckel.views import UserAPIView, NoteAPIView, NoteParamAPIView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("auth/v1", UserAPIView.as_view(), name="user_api"),
    path("auth/v1/refresh", TokenRefreshView.as_view(), name="refresh_api"),
    path("api/v1/note", NoteAPIView.as_view(), name="note_api"),
    path("api/v1/note/<int:id>", NoteParamAPIView.as_view(), name="note_param_api"),
]
