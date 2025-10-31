import os

class ProductionConfig:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///production.db').replace('postgres://', 'postgresql://') if os.getenv('DATABASE_URL') else 'sqlite:///production.db'
    SECRET_KEY = os.getenv('SECRET_KEY', 'change-me')
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    PERMANENT_SESSION_LIFETIME = 3600

class DevelopmentConfig:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SECRET_KEY = 'dev-secret-key'
    DEBUG = True
    TESTING = False
