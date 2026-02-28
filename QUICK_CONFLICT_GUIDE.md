# Quick Conflict Resolution Guide

## Immediate Actions Required

### 🚨 Critical: Unrelated Histories
Your branches have **unrelated histories** (grafted branch). Standard merge will fail.

**Quick Fix Options:**

#### Option A: Allow Unrelated Histories (Quick but messy)
```bash
git merge origin/main --allow-unrelated-histories
# Then resolve conflicts in the files listed below
```

#### Option B: Cherry-pick (Recommended - Clean)
```bash
# Create new branch from main
git checkout -b update-readme-v2 origin/main

# Apply your commits
git cherry-pick 6da62f3  # Next.js upgrade commit
git cherry-pick 6ccd848  # Type safety commit

# Resolve conflicts as they appear
```

#### Option C: Rebase (Advanced)
```bash
git rebase origin/main
# Resolve conflicts during rebase
git push --force-with-lease
```

## Conflicts to Resolve

### 1. team/page.tsx (Line 135)
**Choose Main Branch Version (Safer):**
```typescript
// ✅ USE THIS (from main)
{member.name ? member.name.split(" ").filter(Boolean).map(n => n.charAt(0)).join("") : member.email?.charAt(0)?.toUpperCase() || "?"}

// ❌ NOT THIS (from current branch)
{member.name ? member.name.split(" ").map(n => n[0]).join("") : member.email[0].toUpperCase()}
```

**Why?** Main branch has:
- `filter(Boolean)` - handles empty strings
- `charAt(0)` - safer than array access
- Optional chaining `?.` - prevents crashes
- Fallback `|| "?"` - handles undefined

### 2. CSV Export Type (Keep Current Branch)
**Keep Current Branch Version:**
```typescript
// ✅ KEEP THIS (from current branch - better)
import { Prisma } from "@prisma/client";
type Event = Prisma.EventGetPayload<object>;
const csv = Papa.unparse(events.map((e: Event) => ({ ...

// ❌ NOT THIS (from main - verbose)
const csv = Papa.unparse(events.map((e: { id: string; name: string; ... }) => ({ ...
```

**Why?** Current branch uses proper Prisma type - cleaner and more maintainable.

## Files That Will Conflict

### High Priority (Resolve These First)
1. ✅ **src/app/(dashboard)/dashboard/team/page.tsx** - Use main version
2. ✅ **src/app/api/events/export/csv/route.ts** - Use current version
3. ⚠️ **package-lock.json** - Let Git auto-merge, then run `npm install`
4. ⚠️ **README.md** - Keep current branch API docs changes

### Medium Priority (Check After Merge)
5. **src/app/(marketing)/docs/page.tsx** - Keep current (x-api-key)
6. **Multiple API routes** - Keep current (error handling)

## Testing After Resolution

```bash
# 1. Install dependencies
npm install

# 2. Run linter
npm run lint

# 3. Build project
npm run build

# 4. Check for runtime errors
npm run dev
# Visit http://localhost:3000 and test key features
```

## Common Issues

### "refusing to merge unrelated histories"
```bash
# Add flag to merge command
git merge origin/main --allow-unrelated-histories
```

### Lock file conflicts
```bash
# Accept either version, then:
npm install
git add package-lock.json
git commit -m "Fix package-lock conflicts"
```

### "CONFLICT (content): Merge conflict in [file]"
1. Open the file
2. Look for conflict markers:
   ```
   <<<<<<< HEAD
   Your changes
   =======
   Their changes
   >>>>>>> origin/main
   ```
3. Choose the correct version
4. Remove conflict markers
5. `git add [file]`
6. `git commit`

## Need Help?

See `CONFLICT_ANALYSIS.md` for:
- Detailed file-by-file analysis
- 4 different merge strategies
- Complete conflict resolution steps
- Explanation of each conflict

## Quick Decision Tree

```
Do you want clean history?
├─ YES → Use Cherry-pick (Option B)
└─ NO  → Use Allow Unrelated Histories (Option A)

Is the team page conflict showing?
├─ YES → Choose main branch version (charAt)
└─ NO  → Continue

Is CSV export conflict showing?
├─ YES → Choose current branch version (Prisma type)
└─ NO  → Continue

Do other conflicts appear?
├─ YES → Check CONFLICT_ANALYSIS.md for guidance
└─ NO  → Run tests and you're done!
```

## Final Checklist

- [ ] Chose merge strategy (A, B, or C)
- [ ] Resolved team/page.tsx conflict (use main)
- [ ] Resolved CSV export conflict (use current)
- [ ] Ran `npm install`
- [ ] Ran `npm run lint` (passed)
- [ ] Ran `npm run build` (passed)
- [ ] Tested application locally
- [ ] All features work correctly
- [ ] No console errors

## Status: Ready to Merge? ✅

Once all checkboxes above are complete, your branch is ready to merge!
