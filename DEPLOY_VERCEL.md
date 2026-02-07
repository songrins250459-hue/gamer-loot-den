배포 준비 안내 (Vercel)

1) Vercel 프로젝트 생성
- Vercel에 로그인 → New Project → Git Repository 연결(이미 푸시한 `https://github.com/songrins250459-hue/gamer-loot-den.git`)

2) 환경변수 설정 (Project → Settings → Environment Variables)
- `VITE_SUPABASE_URL` = https://qyxcfocbractvmtvbakd.supabase.co
- `VITE_SUPABASE_PUBLISHABLE_KEY` = sb_publishable_PcbGvmTqPTkllYm7oJfZgQ_xDSab5o4
- (서버 전용) `SUPABASE_SERVICE_ROLE_KEY` = sb_secret_... (SET IN Vercel Secrets, NOT exposed to client)
- `TOSS_SECRET_KEY` = (토스 시크릿, 서버 전용)

3) 빌드 설정
- Framework Preset: Other
- Build Command: `npm run build`
- Output Directory: `dist`

4) 배포 (웹 UI)
- 프로젝트 설정 후 "Deploy" → Vercel이 자동으로 빌드 및 배포합니다.

5) 로컬에서 CLI로 배포 (선택)
- `npm i -g vercel` (설치)
- `vercel login` 또는 `vercel --token <YOUR_TOKEN>`
- `vercel --prod`

6) Edge Functions
- Supabase Edge Functions (approve-payment) 은 Supabase Functions로 배포하세요. Vercel에는 서버less 함수가 있지만, DB 서비스 역할 키는 Supabase Functions에서 관리하는 것이 안전합니다.

참고: 배포 후 환경 변수에 따라 앱이 정상 동작하지 않으면 로그(Deploy → Logs)를 확인해 주세요.





