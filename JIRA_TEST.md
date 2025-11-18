# Jira Integration Test

> **Issue**: KAN-1
> **Purpose**: GitHub-Jira 연동 테스트
> **Date**: 2025-11-18

## 테스트 내용

이 파일은 Jira와 GitHub의 연동이 정상적으로 작동하는지 확인하기 위한 테스트 파일입니다.

### 연동 확인 사항

1. ✅ 커밋 메시지에 [KAN-1] 포함 시 Jira 이슈에 커밋 표시
2. ✅ PR 제목에 [KAN-1] 포함 시 Jira 이슈에 PR 표시
3. ✅ PR merge 시 Jira 이슈 상태 자동 변경 (옵션)

### 연동 성공 확인 방법

**Jira에서 확인**:
1. KAN-1 이슈 페이지 접속
2. 우측 "Development" 섹션 확인
3. Commits, Pull Requests 항목에 이 작업이 표시되는지 확인

**기대 결과**:
```
Development
├─ 1 commit
│  └─ test: Jira 연동 테스트 [KAN-1]
└─ 1 pull request
   └─ [KAN-1] Jira-GitHub 연동 테스트
```

---

**테스트 완료 후 이 파일은 삭제해도 됩니다.**
