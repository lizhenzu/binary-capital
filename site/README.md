# 바이너리 자산운용 리포트 사이트

`reports/*.md`와 `journal/02_trade_journal.md`를 읽어 정적 웹사이트를 만든다 (Astro).
리포트를 커밋하면 Cloudflare Pages가 자동으로 다시 빌드·배포한다.

## 페이지
| 주소 | 내용 | 데이터 |
|---|---|---|
| `/` | 홈: 회사 판단, 시장 수치, 시나리오, 일정, 관찰 목록, 최근 리포트 | 최신 일요 준비·토요 복기의 데이터 블록 |
| `/reports/` | 보관함: 종류 탭, 검색, 주제 칩 | 모든 리포트 |
| `/reports/<파일명>/` | 리포트 상세: 목차 + 본문 | 리포트 본문 |
| `/mistakes/` | 실수 코드, 언급 횟수, 매매 규칙, 실패노트, 매매일지 원문 | journal + 리포트 본문 |
| `/about/` | 회사 소개, 원칙, 면책 고지 | 고정 |

새 리포트 맨 앞에는 데이터 블록이 있어야 한다 → `docs/03_weekly_report_template.md` "웹사이트용 데이터 블록".
데이터 블록 형식이 틀리면 빌드가 실패하고 이전 버전이 그대로 남는다(Cloudflare 대시보드의 배포 로그에서 원인 확인).

## 내 컴퓨터에서 미리 보기
```bash
cd site
npm install
npm run dev      # http://localhost:4321
```

---

## Cloudflare Pages 설정 (처음 한 번)

### 1. 가입
1. https://dash.cloudflare.com/sign-up 에서 이메일로 가입한다 (무료).
2. 받은 메일의 인증 링크를 누른다.

### 2. 저장소 연결
1. 대시보드 왼쪽 **Workers & Pages** → **Create** → **Pages** 탭 → **Connect to Git**.
2. **GitHub** 선택 → GitHub 로그인 → 앱 설치 화면에서 **Only select repositories** → `binary-capital`만 고른다.
3. 저장소 목록에서 `binary-capital` → **Begin setup**.
4. 아래처럼 입력한다.

| 항목 | 값 |
|---|---|
| Project name | `binary-capital` (주소가 `binary-capital.pages.dev`가 됨. 이미 쓰이면 다른 이름) |
| Production branch | `main` |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory (Advanced) | `site` |
| Environment variable | `NODE_VERSION` = `22` |

5. **Save and Deploy**. 1~2분 뒤 주소가 나온다.

### 3. 나만 보게 잠그기 (Cloudflare Access)
1. 프로젝트 화면 → **Settings** → **General** → **Access policy** → **Enable access policy**(또는 Manage).
2. 처음이면 Zero Trust 팀 이름을 정하라고 한다 → 아무 이름(예: `binarycapital`) 입력, **Free** 요금제 선택. 결제 수단 입력을 요구할 수 있지만 무료 요금제는 청구되지 않는다.
3. 만들어진 정책(Application)을 열어 **Policies** → 규칙을 `Include` · `Emails` · `bit2001.lee@gmail.com` 하나만 남긴다.
4. 로그인 방법은 기본값 **One-time PIN**(이메일로 6자리 코드)으로 둔다.
5. 확인: 시크릿 창에서 `https://binary-capital.pages.dev` 접속 → 이메일 입력 화면이 나오면 성공. 다른 이메일로는 코드가 오지 않는다.

> 주의: 기본 설정은 미리보기 주소(`*.binary-capital.pages.dev`)만 잠그는 경우가 있다. 3번 정책의 **Application domain**에 `binary-capital.pages.dev`(본 주소)도 들어 있는지 꼭 확인한다.

### 4. 이후 운영
- 리포트를 `main`에 커밋하면 자동 배포된다. 할 일 없음.
- 공개 전환: 3번의 Access 정책을 삭제하면 누구나 볼 수 있다. 동시에 `src/layouts/Base.astro`의 `noindex` 줄을 지우고 "비공개 운영 중" 표시를 바꾼다.
