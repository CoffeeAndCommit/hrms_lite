from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, AttendanceViewSet, DashboardAPIView

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'attendances', AttendanceViewSet)

urlpatterns = [
    path('api/dashboard/', DashboardAPIView.as_view(), name='dashboard'),
    path('api/', include(router.urls)),
]
