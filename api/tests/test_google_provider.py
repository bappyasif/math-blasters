from urllib.parse import parse_qs, urlsplit

import httpx2
import jwt
import pytest

from app.providers.google import GoogleProvider


@pytest.fixture
def base_provider():
    """returns a fresh provider for each test"""
    return GoogleProvider("client_id", "client_secret", "http://localhost:8000/")


def make_client(handler=None):
    """returns a client whose transport is served by a mock transport"""
    handler = handler or (lambda req: httpx2.Response(500))
    return httpx2.Client(transport=httpx2.MockTransport(handler))


def test_satisfies_interface(base_provider):
    assert isinstance(base_provider, GoogleProvider)


def test_authorize_url(base_provider):
    url = base_provider.authorize_url(state="state", code_challenge="code_challenge")
    params = parse_qs(urlsplit(url).query)

    assert params["client_id"] == ["client_id"]
    assert params["redirect_uri"] == ["http://localhost:8000/"]
    assert params["scope"] == ["openid email profile"]
    assert params["state"] == ["state"]
    assert params["code_challenge"] == ["code_challenge"]
    assert params["code_challenge_method"] == ["S256"]


def test_code_exchange_success(base_provider):
    def handle(req):
        assert b"grant_type=authorization_code" in req.read()
        return httpx2.Response(200, json={"access_token": "abcd", "id_token": "gho_secret123"})

    base_provider.http_client = make_client(handle)
    tokens = base_provider.exchange_code(code="test-code", code_verifier="mock_verifier")
    assert tokens["access_token"] == "abcd"
    assert tokens["id_token"] == "gho_secret123"


def test_code_exchange_failure(base_provider):
    def handle(req):
        assert b"grant_type=authorization_code" in req.read()
        return httpx2.Response(400)

    base_provider.http_client = make_client(handle)
    with pytest.raises(httpx2.HTTPError):
        base_provider.exchange_code(code="test-code", code_verifier="mock_verifier")


def test_fetch_profile_success(base_provider, monkeypatch):
    # mock jwks network to return a successful response
    base_provider.http_client = make_client(lambda req: httpx2.Response(200, json={"keys": []}))

    # simulate what a successful decoded google response would look like
    mocked_decoded_response = {
        "sub": "1234567890",
        "name": "John Doe",
        "picture": "http://example.com/johndoe.jpg",
        "email": "zj5jP@example.com",
        "email_verified": True,
    }

    # jwt.decode mock:
    monkeypatch.setattr(
        jwt.PyJWKClient,
        "get_signing_key_from_jwt",
        lambda *args, **kwargs: type("Key", (object,), {"key": "mock_key"})(),
    )
    monkeypatch.setattr(jwt, "decode", lambda *args, **kwargs: mocked_decoded_response)

    profile = base_provider.fetch_profile({"id_token": "gho_secret123"})

    assert profile.provider == "google"
    assert profile.provider_account_id == "1234567890"
    assert profile.email == "zj5jP@example.com"
    assert profile.email_verified is True
    assert profile.display_name == "John Doe"
    assert profile.avatar_url == "http://example.com/johndoe.jpg"


def test_fetch_profile_failure(base_provider):
    def handle(req):
        assert b"grant_type=authorization_code" in req.read()
        return httpx2.Response(400)

    base_provider.http_client = make_client(handle)
    with pytest.raises(httpx2.HTTPError):
        base_provider.exchange_code(code="test-code", code_verifier="mock_verifier")
