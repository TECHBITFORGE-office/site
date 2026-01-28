import json
import uuid
import os
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List


class l:
    def __init__(self, filename: str = "users.json"):
        self.filename = filename
        if not os.path.exists(self.filename):
            self._init_file()

    # ---------------- INTERNAL HELPERS ----------------

    def _init_file(self):
        with open(self.filename, "w", encoding="utf-8") as f:
            json.dump({"data": []}, f, indent=4)

    def _load(self) -> Dict[str, Any]:
        try:
            with open(self.filename, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {"data": []}

    def _save(self, data: Dict[str, Any]):
        with open(self.filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

    def _now(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    # ---------------- USER AUTH ----------------

    def find_user_by_apikey(self, api_key: str) -> Optional[Dict[str, Any]]:
        return next(
            (u for u in self._load()["data"]
             if u.get("backend_api_key") == api_key),
            None
        )

    def find_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        return next(
            (u for u in self._load()["data"]
             if u.get("id") == user_id),
            None
        )

    def find_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        return next(
            (u for u in self._load()["data"]
             if u.get("email", "").lower() == email.lower()),
            None
        )

    # ---------------- USER REGISTRATION ----------------

    def register_user(
        self,
        full_name: str,
        email: str,
        avatar_url: Optional[str] = "",
        github_node_id: Optional[str] = ""
    ) -> Optional[str]:

        data = self._load()

        if any(u["email"].lower() == email.lower() for u in data["data"]):
            return None

        user_id = str(uuid.uuid4())
        backend_api_key = f"sk-apinow-v1-{uuid.uuid4().hex}"

        new_user = {
            "id": user_id,
            "created_at": self._now(),
            "updated_at": self._now(),
            "full_name": full_name,
            "email": email,
            "avatar_url": avatar_url,
            "github_node_id": github_node_id,
            "backend_api_key": backend_api_key,

            # subscription / usage
            "subscription_status": "inactive",
            "subscription_plan": None,
            "subscription_end_date": None,
            "is_pro": False,
            "RPM_limit": 8,

            # repos
            "repo_name": {"data": []},

            # metrics
            "total_tokens_used": 0,
            "monthly_tokens_used": 0,
            "last_model_used": []
        }

        data["data"].append(new_user)
        self._save(data)
        return user_id

    # ---------------- REPOSITORY MANAGEMENT ----------------

    def make_repo(
        self,
        repo_name: str,
        user_id_or_key: str,
        extracted: List[Dict[str, Any]]
    ) -> bool:

        data = self._load()

        user = next(
            (
                u for u in data["data"]
                if u.get("id") == user_id_or_key
                or u.get("backend_api_key") == user_id_or_key
            ),
            None
        )

        if not user:
            return False

        repo_files = extracted[0].get("files", [])

        if not repo_files:
            return False

        repo = {
            "repo_id": str(uuid.uuid4()),
            "file": {
                f["file_name"]: f["content"]
                for f in repo_files
                if f.get("file_name") and f.get("content")
            }
        }

        user.setdefault("repo_name", {}).setdefault("data", [])
        user["repo_name"]["data"].append({repo_name: repo})
        user["updated_at"] = self._now()

        self._save(data)
        return True

    def find_repo_by_id(
        self,
        user_id: str,
        repo_id: str
    ) -> Optional[Dict[str, Any]]:

        user = self.find_user_by_id(user_id)
        if not user:
            return None

        for repo_entry in user.get("repo_name", {}).get("data", []):
            for repo_name, repo in repo_entry.items():
                if repo.get("repo_id") == repo_id:
                    return {
                        "repo_name": repo_name,
                        "repo_data": repo
                    }
        return None

    def update_repo(
        self,
        user_id: str,
        repo_id: str,
        updated_files: Dict[str, str]
    ) -> bool:

        data = self._load()
        user = next((u for u in data["data"] if u["id"] == user_id), None)

        if not user:
            return False

        for repo_entry in user.get("repo_name", {}).get("data", []):
            for _, repo in repo_entry.items():
                if repo.get("repo_id") == repo_id:
                    repo["file"] = updated_files
                    user["updated_at"] = self._now()
                    self._save(data)
                    return True

        return False
