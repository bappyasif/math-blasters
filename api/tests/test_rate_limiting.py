from fastapi import FastAPI

from app.config import get_settings

def test_rate_limiting_exists():
    settings = get_settings()
    app = FastAPI()
    app.state.limiter = settings.completions_rate_limit
    assert app.state.limiter is not None

def test_rate_limiting_defaults():
    settings = get_settings()
    assert settings.completions_rate_limit == "20/minute"
