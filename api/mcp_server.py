"""
MCP Server for ghkdqhrbals.github.io/portfolios

이 MCP 서버는 다음 두 가지 기능을 제공합니다:
  1. 최근 블로그 포스팅 목록 및 내용 조회
  2. 이력서(CV) 조회

실행 방법 (stdio, Claude Desktop 등과 연동):
    python api/mcp_server.py

또는 HTTP streamable 모드:
    python api/mcp_server.py --transport streamable-http --port 8080
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

import frontmatter
from mcp.server.fastmcp import FastMCP

# ─────────────────────────────────────────────
# 경로 설정
# ─────────────────────────────────────────────
BASE_DIR = Path(__file__).parent.parent          # portfolios/
DOCS_DIR = BASE_DIR / "docs"
CV_PATH  = BASE_DIR / "cv.md"
SITE_BASE_URL = "https://ghkdqhrbals.github.io/portfolios"

# ─────────────────────────────────────────────
# FastMCP 인스턴스
# ─────────────────────────────────────────────
mcp = FastMCP(
    "ghkdqhrbals-blog",
    instructions=(
        "이 서버는 황보규민의 기술 블로그(엔지니어링 로그)의 최근 포스팅과 "
        "이력서 정보를 제공합니다. "
        "get_recent_posts 로 최근 포스팅을 조회하고, "
        "get_post_content 로 특정 포스팅 내용을, "
        "get_resume 으로 이력서를 확인할 수 있습니다."
    ),
)


# ─────────────────────────────────────────────
# 내부 헬퍼
# ─────────────────────────────────────────────

def _collect_posts() -> list[dict]:
    """
    docs/ 하위의 모든 .md 파일을 재귀적으로 읽어
    front matter의 date/title/parent 정보를 수집합니다.
    date 가 없는 파일은 제외합니다.
    """
    posts: list[dict] = []

    for md_file in sorted(DOCS_DIR.rglob("*.md")):
        try:
            post = frontmatter.load(str(md_file))
        except Exception:
            continue

        date_val = post.metadata.get("date")
        title    = post.metadata.get("title", "")
        parent   = post.metadata.get("parent", "")

        if not date_val or not title:
            continue

        # date 가 문자열/datetime 모두 허용
        if isinstance(date_val, datetime):
            date_str = date_val.strftime("%Y-%m-%d")
            date_obj = date_val
        else:
            date_str = str(date_val)
            try:
                date_obj = datetime.strptime(date_str[:10], "%Y-%m-%d")
            except ValueError:
                continue

        # URL 생성: docs/Java/50.md → /portfolios/docs/Java/50/
        rel = md_file.relative_to(BASE_DIR)
        url_path = "/" + str(rel).replace("\\", "/").replace(".md", "/")
        url = SITE_BASE_URL.rstrip("/") + url_path

        # 카테고리: docs/<category>/... 첫 번째 서브폴더
        parts = rel.parts  # ('docs', 'Java', '50.md')
        category = parts[1] if len(parts) > 2 else ""

        posts.append(
            {
                "date": date_str,
                "date_obj": date_obj,
                "title": title,
                "parent": parent,
                "category": category,
                "url": url,
                "file_path": str(md_file),
            }
        )

    # 최신 날짜 순 정렬
    posts.sort(key=lambda p: p["date_obj"], reverse=True)
    return posts


def _post_summary(post: dict) -> dict:
    """file_path, date_obj 를 제거한 직렬화 가능한 요약 딕셔너리 반환."""
    return {
        "date":     post["date"],
        "title":    post["title"],
        "parent":   post["parent"],
        "category": post["category"],
        "url":      post["url"],
    }


# ─────────────────────────────────────────────
# Tools
# ─────────────────────────────────────────────

@mcp.tool()
def get_recent_posts(limit: int = 10, category: str = "") -> str:
    """
    최근 블로그 포스팅 목록을 반환합니다.

    Args:
        limit:    반환할 포스팅 수 (기본값 10, 최대 100).
        category: 특정 카테고리만 필터링할 때 사용 (예: "Java", "msa").
                  빈 문자열이면 전체 카테고리를 반환합니다.

    Returns:
        JSON 형식의 포스팅 목록 (date, title, parent, category, url).
    """
    limit = max(1, min(limit, 100))
    posts = _collect_posts()

    if category:
        posts = [p for p in posts if p["category"].lower() == category.lower()]

    result = [_post_summary(p) for p in posts[:limit]]
    return json.dumps(result, ensure_ascii=False, indent=2)


@mcp.tool()
def get_post_content(url_or_path: str) -> str:
    """
    특정 블로그 포스팅의 전체 내용(마크다운)을 반환합니다.

    Args:
        url_or_path: 포스팅의 URL(get_recent_posts 에서 얻은 url 값) 또는
                     docs/ 로 시작하는 상대 경로 (예: docs/Java/50.md).

    Returns:
        마크다운 본문 텍스트.
    """
    # URL → 상대 경로 변환
    # "https://ghkdqhrbals.github.io/portfolios/docs/Java/50/" → "docs/Java/50.md"
    path_str = url_or_path
    if path_str.startswith("http"):
        # URL에서 baseurl 이후 부분 추출
        prefix = SITE_BASE_URL.rstrip("/")
        path_str = path_str[len(prefix):].lstrip("/")
        # trailing slash 제거 후 .md 추가
        path_str = path_str.rstrip("/") + ".md"

    target = BASE_DIR / path_str
    if not target.exists():
        # index.md 시도
        alt = BASE_DIR / path_str.replace(".md", "") / "index.md"
        if alt.exists():
            target = alt
        else:
            return f"오류: '{path_str}' 파일을 찾을 수 없습니다."

    try:
        post = frontmatter.load(str(target))
        meta_lines = [f"# {post.metadata.get('title', target.stem)}"]
        if post.metadata.get("date"):
            meta_lines.append(f"**날짜**: {post.metadata['date']}")
        if post.metadata.get("parent"):
            meta_lines.append(f"**카테고리**: {post.metadata['parent']}")
        header = "\n".join(meta_lines)
        return header + "\n\n---\n\n" + post.content
    except Exception as e:
        return f"파일 읽기 오류: {e}"


@mcp.tool()
def get_resume() -> str:
    """
    황보규민의 이력서(CV) 전체 내용을 마크다운 형식으로 반환합니다.

    포함 내용:
      - 자기소개
      - 경력 (EXPERIENCE)
      - 학력 (EDUCATION)
      - 오픈소스 (OPENSOURCE)
      - 활동 (ACTIVITY)
      - 연락처 (CONTACT)

    Returns:
        마크다운 형식의 이력서 문자열.
    """
    if not CV_PATH.exists():
        return "이력서 파일을 찾을 수 없습니다."
    try:
        post = frontmatter.load(str(CV_PATH))
        return post.content
    except Exception as e:
        return f"이력서 읽기 오류: {e}"


@mcp.tool()
def list_categories() -> str:
    """
    블로그에 존재하는 카테고리 목록과 각 카테고리의 포스팅 수를 반환합니다.

    Returns:
        JSON 형식의 카테고리별 포스팅 수 딕셔너리.
    """
    posts = _collect_posts()
    counts: dict[str, int] = {}
    for p in posts:
        cat = p["category"] or "기타"
        counts[cat] = counts.get(cat, 0) + 1

    # 포스팅 수 내림차순 정렬
    sorted_counts = dict(sorted(counts.items(), key=lambda x: x[1], reverse=True))
    return json.dumps(sorted_counts, ensure_ascii=False, indent=2)


# ─────────────────────────────────────────────
# Resources
# ─────────────────────────────────────────────

@mcp.resource("blog://recent")
def resource_recent_posts() -> str:
    """최근 블로그 포스팅 10개 (JSON)."""
    posts = _collect_posts()
    result = [_post_summary(p) for p in posts[:10]]
    return json.dumps(result, ensure_ascii=False, indent=2)


@mcp.resource("blog://resume")
def resource_resume() -> str:
    """황보규민 이력서 전문 (Markdown)."""
    return get_resume()


@mcp.resource("blog://categories")
def resource_categories() -> str:
    """카테고리별 포스팅 수 (JSON)."""
    return list_categories()


# ─────────────────────────────────────────────
# 진입점
# ─────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ghkdqhrbals Blog MCP Server")
    parser.add_argument(
        "--transport",
        choices=["stdio", "streamable-http"],
        default="stdio",
        help="전송 방식 (기본값: stdio)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8080,
        help="HTTP 포트 (streamable-http 모드일 때, 기본값: 8080)",
    )
    parser.add_argument(
        "--host",
        default="0.0.0.0",
        help="HTTP 바인딩 주소 (streamable-http 모드일 때, 기본값: 0.0.0.0)",
    )
    args = parser.parse_args()

    if args.transport == "streamable-http":
        mcp.run(transport="streamable-http", host=args.host, port=args.port)
    else:
        mcp.run(transport="stdio")
