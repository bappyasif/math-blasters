from slowapi import Limiter

from app.main import create_app

from app.config import get_settings

def test_rate_limiting_exists():
    # initialize real app instance
    app = create_app()
    
    # assert that app has limiter
    assert hasattr(app.state, "limiter")
    assert app.state.limiter is not None
    
    # assert that limiter is an instance of Limiter
    assert isinstance(app.state.limiter, Limiter)

def test_rate_limiting_defaults():
    settings = get_settings()
    assert settings.completions_rate_limit == "20/minute"
