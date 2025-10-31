# GitHub Actions Workflows Documentation

## Table of Contents
1. [Workflow 1: Continuous Integration (CI)](#workflow-1-continuous-integration-ci)
2. [Workflow 2: TBD](#workflow-2-tbd)
3. [Workflow 3: TBD](#workflow-3-tbd)
4. [Workflow 4: TBD](#workflow-4-tbd)
5. [Workflow 5: TBD](#workflow-5-tbd)
6. [Workflow 6: TBD](#workflow-6-tbd)
7. [Workflow 7: TBD](#workflow-7-tbd)

---

## Workflow 1: Continuous Integration (CI)

### 📋 Purpose
The Continuous Integration workflow automatically validates code quality and syntax whenever changes are pushed to the main branch or a pull request is opened. This ensures that all code meets quality standards before being merged.

### 🔧 Configuration

**File Location:** `.github/workflows/ci.yml`

**Trigger Events:**
- Push to `main` branch
- Pull requests targeting `main` branch

**Runner:** `ubuntu-latest`

**Node.js Version:** 20 (LTS)

### 📝 Workflow Steps

#### Step 1: Checkout Repository
```yaml
- name: 📥 Checkout repository
  uses: actions/checkout@v4
```
**Purpose:** Downloads the repository code to the GitHub Actions runner.

**What it does:** 
- Clones the repository at the specific commit that triggered the workflow
- Makes all project files available for subsequent steps

**How to interpret:**
- ✅ Success: Repository checked out successfully
- ❌ Failure: Usually indicates repository access issues (rare)

---

#### Step 2: Set up Node.js
```yaml
- name: 🟢 Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
```
**Purpose:** Configures the Node.js environment for running JavaScript code.

**What it does:**
- Installs Node.js version 20 (LTS)
- Sets up npm package manager
- Configures PATH variables

**How to interpret:**
- ✅ Success: Node.js installed and ready
- ❌ Failure: Version not found or installation error

---

#### Step 3: Install Dependencies
```yaml
- name: 📦 Install dependencies
  run: npm install
```
**Purpose:** Installs all project dependencies defined in `package.json`.

**What it does:**
- Reads `package.json` and `dependencies`/`devDependencies`
- Downloads and installs packages (cheerio, request, eslint)
- Creates `node_modules` folder

**Expected Packages:**
- `cheerio`: ^1.0.0-rc.3 (HTML parsing)
- `request`: ^2.88.2 (HTTP requests)
- `eslint`: ^8.57.0 (code linting)

**How to interpret:**
- ✅ Success: All dependencies installed without errors
- ⚠️ Warnings: Deprecated packages (request, eslint 8.x) - these are expected
- ❌ Failure: Network issues or incompatible package versions

---

#### Step 4: Run ESLint (Code Linting)
```yaml
- name: 🔍 Run ESLint (Code Linting)
  run: npm run lint
  continue-on-error: false
```
**Purpose:** Checks code quality and style consistency across all JavaScript files.

**What it does:**
- Runs `eslint run.js src/**/*.js`
- Checks for:
  - Undefined variables
  - Unused variables
  - Missing semicolons
  - Code style issues
- Allows up to 25 warnings (current: 21 warnings)

**ESLint Configuration** (`.eslintrc.json`):
```json
{
  "env": { "node": true, "es6": true },
  "extends": "eslint:recommended",
  "rules": {
    "no-unused-vars": "warn",
    "no-undef": "warn",
    "no-console": "off",
    "semi": "warn",
    "quotes": "off"
  }
}
```

**How to interpret:**
- ✅ Success: No errors, warnings within threshold (≤25)
- ⚠️ Common Warnings:
  - `'variable' is assigned but never used` - Unused variables
  - `'variable' is not defined` - Missing variable declarations
  - `Missing semicolon` - Style issue
- ❌ Failure: Too many warnings (>25) or syntax errors

**Example Output:**
```
C:\path\to\file.js
  2:7  warning  'iridium' is assigned a value but never used  no-unused-vars
  
✖ 21 problems (0 errors, 21 warnings)
```

---

#### Step 5: Run Tests (Syntax Validation)
```yaml
- name: ✅ Run Tests (Syntax Validation)
  run: npm test
```
**Purpose:** Validates that all JavaScript files have correct syntax and can be loaded.

**What it does:**
- Runs `test.js` script
- Validates syntax of:
  - `run.js`
  - `src/satellite.js`
  - `src/iridium.js`
  - `src/utils.js`
- Uses `require.resolve()` to check if files can be loaded

**Test Script** (`test.js`):
```javascript
const filesToCheck = [
  'run.js',
  'src/satellite.js',
  'src/iridium.js',
  'src/utils.js'
];

// Validates each file can be resolved/loaded
```

**How to interpret:**
- ✅ Success Output:
  ```
  Running syntax validation...
  
  OK: run.js
  OK: src/satellite.js
  OK: src/iridium.js
  OK: src/utils.js
  
  All syntax validation tests passed!
  ```
- ❌ Failure: Syntax errors in one or more files
  ```
  FAILED: src/file.js - SyntaxError: Unexpected token
  ```

---

#### Step 6: Display Success Message
```yaml
- name: 📊 Display success message
  if: success()
  run: echo "✅ All CI checks passed successfully!"
```
**Purpose:** Confirms all checks completed successfully.

**Condition:** Only runs if all previous steps succeeded.

---

#### Step 7: Display Failure Message
```yaml
- name: ❌ Display failure message
  if: failure()
  run: echo "❌ CI checks failed. Please review the errors above."
```
**Purpose:** Alerts that one or more checks failed.

**Condition:** Only runs if any previous step failed.

---

### 📊 Interpreting Workflow Results

#### ✅ Successful Run
All steps show green checkmarks:
1. ✅ Checkout repository
2. ✅ Set up Node.js
3. ✅ Install dependencies (may show warnings)
4. ✅ Run ESLint - 21 warnings (under threshold)
5. ✅ Run Tests - All files validated
6. ✅ Success message displayed

**Action Required:** None - code is ready to merge!

---

#### ❌ Failed Run - Common Issues

**Issue 1: Linting Failures**
```
Error: Command failed: npm run lint
✖ 26 problems (0 errors, 26 warnings)
```
**Cause:** Too many code quality warnings (>25)

**Fix:**
- Review ESLint warnings in the log
- Fix unused variables or undefined references
- OR increase threshold in `package.json`: `--max-warnings=30`

---

**Issue 2: Test Failures**
```
FAILED: src/newfile.js - Error: Cannot find module
```
**Cause:** New file has syntax errors or missing dependencies

**Fix:**
- Check the specific file mentioned
- Fix syntax errors
- Ensure all required modules are imported

---

**Issue 3: Dependency Installation Failed**
```
npm ERR! code ENOTFOUND
npm ERR! network request to https://registry.npmjs.org/package failed
```
**Cause:** Network issue or package doesn't exist

**Fix:**
- Re-run the workflow (may be temporary network issue)
- Check if package names in `package.json` are correct
- Verify npm registry is accessible

---

### 🔄 Workflow Best Practices

1. **Before Pushing Code:**
   - Run `npm run lint` locally
   - Run `npm test` locally
   - Fix any issues before pushing

2. **When CI Fails:**
   - Click on the failed step in GitHub Actions
   - Read the error message carefully
   - Fix the issue locally and push again

3. **Maintaining the Workflow:**
   - Keep Node.js version updated (currently 20 LTS)
   - Update dependencies regularly
   - Adjust warning thresholds as code quality improves

---

### 📈 Workflow Metrics

**Current Project Status:**
- Files Checked: 4 JavaScript files
- Dependencies: 3 packages (cheerio, request, eslint + ~90 sub-dependencies)
- Lint Warnings: 21 (threshold: 25)
- Average Run Time: ~30-45 seconds

---

### 🔗 Related Files

- **Workflow File:** `.github/workflows/ci.yml`
- **Package Config:** `package.json`
- **ESLint Config:** `.eslintrc.json`
- **Test Script:** `test.js`

---

## Workflow 2-7: Coming Soon

Additional workflows will be documented here as they are created:
- Deployment workflows
- Scheduled tasks
- Release automation
- Security scanning
- Performance testing
- Documentation generation

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Semantic Commit Messages](https://www.conventionalcommits.org/)

---

**Last Updated:** October 31, 2025  
**Maintained By:** University Assignment Project  
**Repository:** [heavens-above](https://github.com/i230016arsaltemuri/heavens-above)
