from urllib.parse import parse_qs, urlsplit

import httpx2
import pytest

from app.providers import OAuthProvider, ProviderProfile
from app.providers.github import GithubProvider

TOKENS = {"access_token": "gho_secret123", "scope": "read:user,user:email", "token_type": "bearer"}


# helpers
def make_provider(handler=None) -> GithubProvider:
    """returns a provider whose http client is served by a mock transport"""
    handler = handler or (lambda req: httpx2.Response(500))
    client = httpx2.Client(transport=httpx2.MockTransport(handler))
    return GithubProvider(
        "client_id", "client_secret", "http://localhost:8000/", http_client=client
    )


def profile_handler(user: dict, emails: list[dict]):
    """returns a handler serving /user and /user/emails"""

    def handle(req):
        assert req.headers["Authorization"] == "Bearer gho_secret123"
        if req.url.path == "/user/emails":
            return httpx2.Response(200, json=emails)
        return httpx2.Response(200, json=user)

    return handle


def test_satisfies_protocol():
    assert isinstance(make_provider(), OAuthProvider)


def test_authorize_url():
    url = make_provider().authorize_url(state="test-state", code_challenge="test-challenge")
    params = parse_qs(urlsplit(url).query)

    assert params["client_id"] == ["client_id"]
    assert params["redirect_uri"] == ["http://localhost:8000/"]
    assert params["scope"] == ["read:user user:email"]
    assert params["state"] == ["test-state"]
    assert params["code_challenge"] == ["test-challenge"]
    assert params["code_challenge_method"] == ["S256"]


def test_exchange_code():
    def handle(req):
        body = req.read()
        assert b"client_secret=client_secret" in body
        assert b"code=test-code" in body
        assert b"code_verifier=mock_verifier" in body
        return httpx2.Response(200, json={"access_token": "gho_secret123"})

    tokens = make_provider(handle).exchange_code(code="test-code", code_verifier="mock_verifier")
    assert tokens["access_token"] == "gho_secret123"


def test_exchange_code_oauth_error_trapping():
    """github reports an invalid code with a 200 and an error body"""
    provider = make_provider(lambda req: httpx2.Response(200, json={"error": "invalid_code"}))

    with pytest.raises(httpx2.HTTPError, match="invalid_code"):
        provider.exchange_code(code="test-code", code_verifier="mock_verifier")


def test_exchange_code_without_access_token():
    provider = make_provider(lambda req: httpx2.Response(200, json={"token_type": "bearer"}))

    with pytest.raises(httpx2.HTTPError, match="access_token"):
        provider.exchange_code(code="test-code", code_verifier="mock_verifier")


def test_fetch_user_profile():
    user = {"id": 987, "name": "Doe", "login": "d", "avatar_url": "img"}
    emails = [{"email": "doe@example.com", "primary": True, "verified": True}]
    profile = make_provider(profile_handler(user, emails)).fetch_profile(TOKENS)

    assert isinstance(profile, ProviderProfile)
    assert profile.provider == "github"
    assert profile.provider_account_id == "987"
    assert profile.email == "doe@example.com"
    assert profile.email_verified is True
    assert profile.display_name == "Doe"
    assert profile.avatar_url == "img"


def test_fetch_user_profile_without_name_and_unverified_email():
    user = {"id": 987, "name": None, "login": "d", "avatar_url": None}
    emails = [
        {"email": "other@example.com", "primary": False, "verified": True},
        {"email": "doe@example.com", "primary": True, "verified": False},
    ]
    profile = make_provider(profile_handler(user, emails)).fetch_profile(TOKENS)

    assert profile.display_name == "d"
    assert profile.avatar_url is None
    assert profile.email == "doe@example.com"
    assert profile.email_verified is False


def test_fetch_user_profile_without_primary_email():
    user = {"id": 987, "name": "Doe", "login": "d", "avatar_url": "img"}
    emails = [{"email": "other@example.com", "primary": False, "verified": True}]
    profile = make_provider(profile_handler(user, emails)).fetch_profile(TOKENS)

    assert profile.email is None
    assert profile.email_verified is False


def test_fetch_user_profile_requests_full_email_page():
    seen = {}

    def handle(req):
        if req.url.path == "/user/emails":
            seen["per_page"] = req.url.params.get("per_page")
            return httpx2.Response(200, json=[])
        return httpx2.Response(200, json={"id": 1, "login": "d"})

    make_provider(handle).fetch_profile(TOKENS)
    assert seen["per_page"] == "100"


def test_fetch_user_profile_when_email_scope_not_granted():
    def handle(req):
        assert req.url.path != "/user/emails"
        return httpx2.Response(200, json={"id": 987, "login": "d"})

    tokens = {**TOKENS, "scope": "read:user"}
    profile = make_provider(handle).fetch_profile(tokens)

    assert profile.provider_account_id == "987"
    assert profile.email is None
    assert profile.email_verified is False
