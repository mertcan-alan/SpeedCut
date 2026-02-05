---
description: How to update version and push to GitHub
---

# Version Update & GitHub Push Workflow

After every code change, follow these steps:

## 1. Determine Version Change Type

| Change Type | Action | Example |
|-------------|--------|---------|
| Bug fix | Increment PATCH (last number) | 1.1.1 → 1.1.2 |
| New feature | Increment MINOR (middle number), reset PATCH to 0 | 1.1.2 → 1.2.0 |
| Major overhaul | Increment MAJOR (first number), reset others to 0 | 1.2.0 → 2.0.0 |

## 2. Update manifest.json

Update the `"version"` field in `manifest.json` according to the change type.

## 3. Commit and Push to GitHub

// turbo-all

```powershell
git add -A
```

```powershell
git commit -m "<commit message with version>"
```

```powershell
git pull origin main --rebase
```

```powershell
git push origin main
```

## 4. Create Tag (if releasing)

```powershell
git tag -a <version> -m "Version <version>"
```

```powershell
git push origin <version>
```
