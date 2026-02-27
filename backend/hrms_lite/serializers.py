from rest_framework import serializers
from .models import Employee, Attendance

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    employee_details = EmployeeSerializer(source='employee', read_only=True)
    employee_id = serializers.PrimaryKeyRelatedField(
        source='employee', 
        queryset=Employee.objects.all(),
        write_only=True
    )

    class Meta:
        model = Attendance
        fields = ['id', 'employee_id', 'employee_details', 'date', 'status', 'created_at']

    def validate(self, attrs):
        # Additional validation if necessary
        return attrs
