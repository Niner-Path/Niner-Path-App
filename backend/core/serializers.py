from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from core.models import JobPreference

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "has_completed_questionnaire"]

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "has_completed_questionnaire")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        validated_data["has_completed_questionnaire"] = validated_data.get("has_completed_questionnaire", False)
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            has_completed_questionnaire=validated_data["has_completed_questionnaire"]
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data["email"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        return user


class JobPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPreference
        fields = ["keywords", "location"]

        def create(self, validated_data):
            print(validated_data)   #TEST PRINT
            user = self.content["request"].user
            validated_data["user"] = user
            return super().create(validated_data)
        