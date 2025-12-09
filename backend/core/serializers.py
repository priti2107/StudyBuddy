from rest_framework import serializers
from .models import Subject, Task, Resource


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at')


class TaskSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    subject_id = serializers.PrimaryKeyRelatedField(
        write_only=True, source='subject', queryset=Subject.objects.all(), required=False
    )

    class Meta:
        model = Task
        fields = (
            'id', 'user', 'subject', 'subject_id', 'title', 'description',
            'deadline', 'priority', 'status', 'estimated_time',
            'actual_time', 'tags', 'created_at'
        )
        read_only_fields = ('id', 'user', 'created_at')


class ResourceSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    subject_id = serializers.PrimaryKeyRelatedField(
        write_only=True, source='subject', queryset=Subject.objects.all(), required=False
    )
    task_id = serializers.PrimaryKeyRelatedField(
        write_only=True, source='task', queryset=Task.objects.all(), required=False
    )

    class Meta:
        model = Resource
        fields = (
            'id', 'user', 'subject', 'subject_id', 'task', 'task_id',
            'type', 'title', 'url', 'notes', 'created_at'
        )
        read_only_fields = ('id', 'user', 'created_at')
