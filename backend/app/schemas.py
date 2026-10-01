from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    avatar_url: str | None = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    avatar_url: str | None = None

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    message: str
    user: UserResponse


class VideoCreate(BaseModel):
    title: str
    description: str | None = None
    video_url: str
    thumbnail_url: str
    user_id: int


class VideoUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    video_url: str | None = None
    thumbnail_url: str | None = None


class VideoResponse(BaseModel):
    id: int
    title: str
    description: str | None
    video_url: str
    thumbnail_url: str
    views: int
    created_at: datetime
    user_id: int
    user: UserResponse

    class Config:
        from_attributes = True


class CommentCreate(BaseModel):
    content: str
    user_id: int


class CommentResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    user_id: int
    video_id: int
    user: UserResponse

    class Config:
        from_attributes = True


class UserProfileResponse(BaseModel):
    user: UserResponse
    total_videos: int
    videos: list[VideoResponse]
