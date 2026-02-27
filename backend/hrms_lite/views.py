from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from django.db import IntegrityError
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().order_by('-created_at')
    serializer_class = EmployeeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['employee_id', 'full_name', 'email', 'department']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except IntegrityError:
            return Response(
                {"detail": "Employee with this ID or Email already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all().order_by('-date', '-created_at')
    serializer_class = AttendanceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['employee__full_name', 'employee__employee_id', 'date', 'status']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except IntegrityError:
            return Response(
                {"detail": "Attendance record for this employee on this date already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

    def get_queryset(self):
        queryset = super().get_queryset()
        employee_id = self.request.query_params.get('employee_id')
        if employee_id:
            queryset = queryset.filter(employee__id=employee_id)
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(date=date)
        return queryset
