from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password

from .models import Subject, Task, Resource
from .serializers import SubjectSerializer, TaskSerializer, ResourceSerializer

User = get_user_model()

# =========================================================
# ✅ ✅ PURE EMAIL LOGIN (NO TokenObtainPairView USED)
# =========================================================

class EmailLoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid email or password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(password):
            return Response(
                {"error": "Invalid email or password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Generate JWT tokens manually
        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "email": user.email,
        })


# =========================================================
# ✅ SIGNUP
# =========================================================

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def signup(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=400)

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password
    )
    user.save()

    return Response({"message": "Account created successfully"}, status=201)


# =========================================================
# ✅ SUBJECT
# =========================================================

class SubjectViewSet(viewsets.ModelViewSet):
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Subject.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# =========================================================
# ✅ TASK
# =========================================================

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by('deadline')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def set_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get("status")

        if new_status not in dict(Task.STATUS_CHOICES):
            return Response({"error": "Invalid status"}, status=400)

        task.status = new_status
        task.save()

        return Response(TaskSerializer(task).data)


# =========================================================
# ✅ RESOURCE
# =========================================================

class ResourceViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resource.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# =========================================================
# ✅ DASHBOARD
# =========================================================

class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()

        data = {
            "total_subjects": user.subjects.count(),
            "pending_tasks": user.tasks.filter(status='todo').count(),
            "completed_tasks": user.tasks.filter(status='completed').count(),
            "study_streak": 7,

            "today_tasks": TaskSerializer(
                user.tasks.filter(deadline__date=today), many=True
            ).data,

            "upcoming_deadlines": TaskSerializer(
                user.tasks.filter(deadline__date__gt=today).order_by('deadline')[:10],
                many=True
            ).data,
        }

        return Response(data)
