"""GitHub sign-in provider.

Local development setup:

Each contributor registers their own GitHub OAuth App, so no client secret
is ever shared.

1. Go to GitHub -> Settings -> Developer settings -> OAuth apps -> New OAuth App
   ("Register a new application" if it is your first).
2. Fill in:
   - Application name:           Math Blasters (Local Dev)
   - Homepage URL:               http://localhost:8000
   - Authorization callback URL: http://localhost:8000/api/auth/github/callback
3. Click "Register application", then "Generate a new client secret".
4. Put both values in your own, uncommitted `.env`:

   GITHUB_CLIENT_ID="your_client_id"
   GITHUB_CLIENT_SECRET="your_client_secret"

Never commit real credentials or your `.env` file.
"""

from urllib.parse import urlencode

import httpx2

from app.providers import ProviderProfile


class GithubProvider:
    name = "github"

    def __init__(
        self,
        client_id: str,
        client_secret: str,
        redirect_uri: str,
        http_client: httpx2.Client | None = None,
    ):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.http_client = http_client or httpx2.Client()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()

    def close(self):
        self.http_client.close()

    def authorize_url(self, state: str, code_challenge: str) -> str:
        """builds a safe url-encoded string"""
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "scope": "read:user user:email",
            "state": state,
            "code_challenge": code_challenge,
            "code_challenge_method": "S256",
        }

        return f"https://github.com/login/oauth/authorize?{urlencode(params)}"

    def exchange_code(self, code: str, code_verifier: str) -> dict[str, str]:
        """exchanges an authorization code for an access token"""
        url = "https://github.com/login/oauth/access_token"
        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "redirect_uri": self.redirect_uri,
            "code": code,
            "code_verifier": code_verifier,
        }
        headers = {"Accept": "application/json"}
        response = self.http_client.post(url, data=data, headers=headers)
        response.raise_for_status()
        data = response.json()

        # its a known issue that github returns 200 even if the code is invalid
        if "error" in data:
            raise httpx2.HTTPError(
                data.get("error_description") or data.get("error", "GithubProviderError")
            )

        if not data.get("access_token"):
            raise httpx2.HTTPError("GitHub token exchange returned no access_token")

        return data

    def fetch_profile(self, tokens: dict[str, str]) -> ProviderProfile:
        """fetches user account profile, parsing provider-specific fields"""
        access_token = tokens.get("access_token")
        if not access_token:
            raise ValueError("Access token not found")

        url = "https://api.github.com"

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
        }

        # fetch user profile details
        user_response = self.http_client.get(f"{url}/user", headers=headers)
        user_response.raise_for_status()
        user_data = user_response.json()

        account_id = user_data.get("id")
        if not account_id:
            raise ValueError("Account ID not found")

        # users can edit granted scopes; without user:email, sign in with no email
        primary_email = None
        is_verified = False
        granted = tokens.get("scope")
        if granted is None or "user:email" in [s.strip() for s in granted.split(",")]:
            # the list is paginated (30 by default), so ask for the maximum page
            email_response = self.http_client.get(
                f"{url}/user/emails", params={"per_page": 100}, headers=headers
            )
            email_response.raise_for_status()
            emails_list = email_response.json()

            # no primary email: sign in without an email match
            primary_entry = next((email for email in emails_list if email.get("primary")), None)
            if primary_entry and primary_entry.get("email"):
                primary_email = primary_entry["email"]
                is_verified = primary_entry.get("verified", False)

        raw_display_name = user_data.get("name") or user_data.get("login")
        raw_avatar_url = user_data.get("avatar_url")

        # returning data as per ProviderProfile
        return ProviderProfile(
            provider=self.name,
            provider_account_id=str(account_id),
            email=primary_email,
            email_verified=is_verified,
            display_name=str(raw_display_name) if raw_display_name is not None else None,
            avatar_url=str(raw_avatar_url) if raw_avatar_url is not None else None,
        )
