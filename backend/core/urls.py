from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    SubjectViewSet,
    TaskViewSet,
    ResourceViewSet,
    DashboardView,
    signup,
    EmailLoginAPIView,
)

router = routers.DefaultRouter()
router.register(r"subjects", SubjectViewSet, basename="subjects")
router.register(r"tasks", TaskViewSet, basename="tasks")
router.register(r"resources", ResourceViewSet, basename="resources")

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/dashboard/", DashboardView.as_view(), name="dashboard"),

    # ✅ PURE EMAIL AUTH
    path("api/auth/signup/", signup, name="signup"),
    path("api/auth/login/", EmailLoginAPIView.as_view(), name="email_login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
