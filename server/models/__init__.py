from .base import db  # re-export for convenience

# Import models so metadata is registered
from .user import User  # noqa: F401
from .presentation import Presentation  # noqa: F401
from .marks import Marks  # noqa: F401
from .transcript import Transcript  # noqa: F401
from .ai_response import AIResponse  # noqa: F401
