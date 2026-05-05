# GitHub Pages 배포 방법

대상 저장소:

```text
https://github.com/sklee935/pianopwa
```

배포 후 예상 주소:

```text
https://sklee935.github.io/pianopwa/
```

## 방법 1: GitHub 웹사이트에서 업로드

가장 쉬운 방법입니다.

1. 이 프로젝트 ZIP을 압축 해제합니다.
2. GitHub에서 `sklee935/pianopwa` 저장소로 이동합니다.
3. `Add file` → `Upload files`를 누릅니다.
4. 압축 해제한 폴더 안의 파일과 폴더를 전부 드래그합니다.
   - `index.html`이 저장소 루트에 있어야 합니다.
   - `pianopwa_github_ready` 폴더 자체를 올리는 것이 아니라, 그 안의 파일을 올려야 합니다.
5. `Commit changes`를 누릅니다.
6. 저장소의 `Settings` → `Pages`로 이동합니다.
7. `Build and deployment`에서 다음처럼 선택합니다.
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/(root)`
8. `Save`를 누릅니다.
9. 잠시 뒤 아래 주소로 접속합니다.

```text
https://sklee935.github.io/pianopwa/
```

## 방법 2: 터미널에서 push

Git이 설치되어 있고 GitHub 로그인이 되어 있으면 아래 명령을 사용할 수 있습니다.

```bash
git clone https://github.com/sklee935/pianopwa.git
cd pianopwa
# 이 프로젝트 파일들을 pianopwa 폴더 안으로 복사한 뒤
git add .
git commit -m "Initial free PWA"
git push origin main
```

그 다음 GitHub에서 `Settings` → `Pages` 설정을 켭니다.

## 주의

- 무료 유지 모드이므로 API 키를 넣지 마세요.
- 학생 이름과 진도는 브라우저 localStorage에만 저장됩니다.
- 실제 학생 개인정보를 많이 수집하지 않는 방향으로 운영하세요.
- 앱이 업데이트되었는데 예전 화면이 계속 보이면 브라우저 새로고침을 한 번 해보세요.
