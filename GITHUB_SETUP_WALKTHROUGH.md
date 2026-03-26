# Healthcare Phishing Analyzer — GitHub Setup & Testing Walkthrough (Mac)

## Complete step-by-step guide to get this project on your GitHub and fully tested.

---

## PART 1: PREREQUISITES (One-Time Setup)

### Step 1: Install Git

1. Open **Terminal** (press Cmd + Space, type "Terminal", hit Enter)
2. Type:
```bash
git --version
```
3. If Git is installed, you'll see something like `git version 2.39.5` — skip to Step 2
4. If it's NOT installed, a popup will ask you to install **Xcode Command Line Tools** — click **Install** and wait for it to finish (this can take a few minutes)
5. After the install finishes, run `git --version` again to confirm

### Step 2: Install Python 3.10+

1. In Terminal, type:
```bash
python3 --version
```
2. If you see `Python 3.10.x` or higher, you're good — skip to Step 3
3. If not installed or the version is too old:
   - Go to https://www.python.org/downloads/
   - Click the big yellow **Download Python 3.x.x** button
   - Open the downloaded `.pkg` file and follow the installer
   - After install, close and reopen Terminal, then run `python3 --version` to confirm

### Step 3: Install a Code Editor (if you don't have one)

Download VS Code (free): https://code.visualstudio.com/
- Click "Download for Mac"
- Open the downloaded `.zip` file
- Drag the VS Code app into your Applications folder

### Step 4: Create a GitHub Account (if you don't have one)

1. Go to https://github.com
2. Sign up with your email
3. Verify your email

### Step 5: Get an Anthropic API Key (for testing the Python CLI tool)

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Go to **API Keys** in the left sidebar
4. Click **Create Key**
5. Name it something like "phishing-analyzer"
6. Copy the key — it starts with `sk-ant-...`
7. **Save this key somewhere safe. You'll need it for testing.**

> Note: Anthropic gives you some free API credits when you sign up. The analyzer uses Claude Sonnet, which costs very little per analysis. Five test cases will cost less than $0.50 total.

---

## PART 2: SET UP THE PROJECT LOCALLY

### Step 6: Create Your Project Folder

Open Terminal and run these commands one at a time:

```bash
cd ~/Desktop
mkdir healthcare-phishing-analyzer
cd healthcare-phishing-analyzer
```

### Step 7: Download the Project Files from Claude

You received three deliverables from our conversation:

1. **healthcare_phishing_analyzer.jsx** — the interactive React app
2. **healthcare-phishing-analyzer-github.tar.gz** — the GitHub project archive
3. **LINKEDIN_AND_PITCH.md** — your LinkedIn post and elevator pitches

First, move the `.tar.gz` archive to your project folder and extract it:

```bash
# Move the archive from Downloads to your project folder
cp ~/Downloads/healthcare-phishing-analyzer-github.tar.gz .

# Extract it
tar -xzf healthcare-phishing-analyzer-github.tar.gz

# Remove the archive after extracting
rm healthcare-phishing-analyzer-github.tar.gz
```

> **Tip:** If the file has a slightly different name in your Downloads folder, you can start typing the filename and press **Tab** to autocomplete it.

### Step 8: Copy the Other Files In

```bash
# Copy the React app
cp ~/Downloads/healthcare_phishing_analyzer.jsx .

# Copy the LinkedIn post (updated version)
cp ~/Downloads/LINKEDIN_AND_PITCH.md .

# Copy the walkthrough (this file — optional, for your own reference)
cp ~/Downloads/GITHUB_SETUP_WALKTHROUGH.md .
```

### Step 9: Verify Your Folder Structure

```bash
ls -la
```

You should see:

```
healthcare_phishing_analyzer.py    (main Python tool)
healthcare_phishing_analyzer.jsx   (React app)
README.md                          (project documentation)
LINKEDIN_AND_PITCH.md             (your pitches)
LICENSE                            (MIT license)
requirements.txt                   (Python dependencies)
```

If any files are missing, double-check your Downloads folder. The `.tar.gz` extraction should have produced `healthcare_phishing_analyzer.py`, `README.md`, `LICENSE`, and `requirements.txt`.

---

## PART 3: TEST THE PYTHON CLI TOOL

### Step 10: Install the Python Dependency

```bash
pip3 install anthropic
```

If you get a permissions error, try:
```bash
pip3 install --user anthropic
```

### Step 11: Set Your API Key

```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

Replace `sk-ant-your-key-here` with your actual API key from Step 5. **Keep the quotes.**

> **IMPORTANT:** This sets the key for your current Terminal session only. If you close Terminal and open a new one, you'll need to run this `export` command again before using the tool.

> **Pro tip:** To make it permanent, add the export line to your shell profile:
> ```bash
> echo 'export ANTHROPIC_API_KEY="sk-ant-your-key-here"' >> ~/.zshrc
> source ~/.zshrc
> ```
> Now it will be set every time you open Terminal.

### Step 12: List the Available Test Cases

```bash
python3 healthcare_phishing_analyzer.py --list-tests
```

You should see:
```
Available Test Cases:

  hipaa                HIPAA Compliance — Credential Harvest
  iran_ehr             Iran-Linked APT — EHR Update Lure
  insurance_bec        Insurance Vendor — BEC Attack
  hr_impersonation     HR Impersonation — W-2/Benefits Phish
  ransomware_it        Ransomware Dropper — IT Alert Lure
```

### Step 13: Run Your First Test Case

Start with the Iran-linked EHR attack — this is the most impressive demo:

```bash
python3 healthcare_phishing_analyzer.py --test iran_ehr
```

**What to expect:** After 10-20 seconds, you'll see a full color-coded report in your Terminal:
- Threat level (should be CRITICAL)
- Iran APT correlation with Pioneer Kitten reference
- Red flags with healthcare context
- MITRE ATT&CK technique mapping
- Extracted IOCs (domains, URLs, files, emails)
- Recommended response actions

### Step 14: Run All Five Test Cases

```bash
python3 healthcare_phishing_analyzer.py --test-all
```

This runs all five analyses back-to-back. Takes about 1-2 minutes total.

### Step 15: Save Results to JSON (for your portfolio)

```bash
python3 healthcare_phishing_analyzer.py --test iran_ehr --json --output iran_ehr_results.json
```

This saves the raw JSON output to a file you can include in your GitHub repo.

### Step 16: Test Interactive Mode (Paste Your Own Email)

```bash
python3 healthcare_phishing_analyzer.py --interactive
```

Paste any suspicious email text, then press **Ctrl+D** to submit it for analysis.

### Step 17: Test with a File

Create a test file and analyze it:

```bash
echo "From: fake@scam-hospital.com
Subject: URGENT: Verify your credentials now
Your account has been compromised. Click here: http://fake-login.com/verify" > test_email.txt

python3 healthcare_phishing_analyzer.py --file test_email.txt
```

---

## PART 4: PUSH TO GITHUB

### Step 18: Configure Git with Your Identity

```bash
git config --global user.name "D'Anthony Carter-Marshall"
git config --global user.email "marshalldanthony@gmail.com"
```

### Step 19: Create the GitHub Repository

1. Go to https://github.com
2. Click the **+** icon in the top right → **New repository**
3. Fill in:
   - **Repository name:** `healthcare-phishing-analyzer`
   - **Description:** `AI-powered phishing email analysis tool for healthcare cybersecurity operations. MITRE ATT&CK mapped. Iran APT aware. HIPAA context.`
   - Select **Public** (so hiring managers can see it)
   - **Do NOT** check "Add a README" (we already have one)
   - **Do NOT** check "Add .gitignore" or "Add a license" (we have these)
4. Click **Create repository**
5. You'll see a page with setup instructions — **leave this page open**, you'll need the URL

### Step 20: Initialize Git and Push

Make sure you're in the project folder (`~/Desktop/healthcare-phishing-analyzer`), then run these commands one at a time:

```bash
# Initialize the Git repository
git init

# Add all project files to staging
git add healthcare_phishing_analyzer.py README.md LICENSE requirements.txt healthcare_phishing_analyzer.jsx LINKEDIN_AND_PITCH.md

# Create your first commit
git commit -m "Initial commit: Healthcare Phishing Email Analyzer v1.0

- AI-powered phishing analysis for healthcare organizations
- MITRE ATT&CK technique mapping (T1566 family)
- Iranian APT correlation (Pioneer Kitten, APT42, Handala, Pay2Key)
- 5 healthcare-specific test cases
- NIST SP 800-61 incident response playbooks
- Built during March 2026 Iran cyber escalation"

# Connect to your GitHub repository (REPLACE YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/healthcare-phishing-analyzer.git

# Set the default branch to main
git branch -M main

# Push everything to GitHub
git push -u origin main
```

### Step 21: Handle GitHub Authentication

When you run `git push`, one of these things will happen:

**Scenario A — Browser popup:** A GitHub login window opens in Safari/Chrome. Log in and authorize. This is the easiest path.

**Scenario B — Terminal asks for username and password:** 
- Enter your GitHub **username**
- For the **password**, you need a **Personal Access Token** (GitHub doesn't accept regular passwords anymore). Follow these steps:

1. Go to GitHub.com → Click your profile picture → **Settings**
2. Scroll all the way down in the left sidebar → **Developer settings**
3. Click **Personal access tokens** → **Tokens (classic)**
4. Click **Generate new token (classic)**
5. Name it `phishing-analyzer-push`
6. Set expiration to 90 days
7. Check the **repo** checkbox (gives full repo access)
8. Click **Generate token** at the bottom
9. **Copy the token immediately** — you won't see it again
10. Go back to Terminal and paste the token as your password (Cmd+V — it won't show any characters, that's normal)

**Scenario C — Keychain popup:** macOS may ask to save credentials in Keychain — click **Always Allow**. This means you won't need to enter credentials again.

### Step 22: Verify on GitHub

1. Go to `https://github.com/YOUR_USERNAME/healthcare-phishing-analyzer`
2. You should see all your files listed
3. The README.md should render with the badges and tables formatted
4. Click through the files to make sure everything looks right

---

## PART 5: ADD SAMPLE OUTPUT TO YOUR REPO (Optional but Impressive)

This shows hiring managers what the tool produces without them needing to run it.

### Step 23: Generate and Save Sample Output

```bash
# Create a sample_output folder
mkdir sample_output

# Run each test case and save the JSON results
python3 healthcare_phishing_analyzer.py --test hipaa --json --output sample_output/hipaa_analysis.json
python3 healthcare_phishing_analyzer.py --test iran_ehr --json --output sample_output/iran_ehr_analysis.json
python3 healthcare_phishing_analyzer.py --test insurance_bec --json --output sample_output/insurance_bec_analysis.json
python3 healthcare_phishing_analyzer.py --test hr_impersonation --json --output sample_output/hr_impersonation_analysis.json
python3 healthcare_phishing_analyzer.py --test ransomware_it --json --output sample_output/ransomware_it_analysis.json
```

### Step 24: Push the Sample Output

```bash
git add sample_output/
git commit -m "Add sample analysis output for all 5 test cases"
git push
```

---

## PART 6: MAKE YOUR REPO LOOK PROFESSIONAL

### Step 25: Add Topics/Tags to Your Repository

1. On your GitHub repo page, click the ⚙️ gear icon next to "About" (right side of the page, near the top)
2. Add these **Topics** (click in the Topics field and type each one, pressing Enter after each):
   - `cybersecurity`
   - `phishing`
   - `healthcare`
   - `mitre-attack`
   - `threat-intelligence`
   - `incident-response`
   - `hipaa`
   - `soc-analyst`
   - `iran-apt`
   - `python`
3. In the **Website** field, paste your LinkedIn profile URL
4. Click **Save changes**

### Step 26: Pin This Repo to Your GitHub Profile

1. Go to your GitHub profile page (`github.com/YOUR_USERNAME`)
2. Click **Customize your pins**
3. Check the box next to `healthcare-phishing-analyzer`
4. Save — now it's the first thing anyone sees when they visit your profile

---

## PART 7: TEST THE REACT APP (Interactive Demo)

The `.jsx` file runs directly inside Claude's artifact system.

### Step 27: Test in Claude

1. Open a **new conversation** on claude.ai
2. Upload the `healthcare_phishing_analyzer.jsx` file (drag it into the chat or click the paperclip icon)
3. Type: **"Please render this React component as an artifact"**
4. The interactive app will appear in the artifact panel on the right
5. Click the **Test Cases** tab
6. Click any test case (start with "Iran-Linked APT — EHR Update Lure")
7. It will switch to the Analyze tab with the email loaded
8. Click **🔍 Analyze for Threats**
9. Wait 10-20 seconds for the full AI analysis to render

### Step 28: Take Screenshots for LinkedIn

While a completed analysis is visible in the artifact:

1. Press **Cmd + Shift + 4** to enter screenshot mode
2. Drag to select the area showing the threat assessment header, red flags, and MITRE ATT&CK mapping
3. The screenshot saves to your Desktop automatically
4. Take a second screenshot of the Test Cases tab to show all five scenarios
5. Use these screenshots in your LinkedIn post — visual proof is powerful

---

## TROUBLESHOOTING

### "command not found: python3"
Your Python installation may not be on your PATH. Try:
```bash
/usr/local/bin/python3 --version
```
If that works, use `/usr/local/bin/python3` instead of `python3` in all commands. Or reinstall Python from python.org — the official installer sets up the PATH correctly.

### "command not found: pip3"
Try:
```bash
python3 -m pip install anthropic
```
This uses Python's built-in pip module directly.

### "command not found: git"
Run `xcode-select --install` in Terminal to install the Xcode Command Line Tools, which include Git.

### "ANTHROPIC_API_KEY not set" error
Make sure you ran the `export` command in the **same Terminal window** you're running the script from:
```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```
The quotes are required. The key must start with `sk-ant-`.

### "API error: invalid_api_key"
- Double-check your key at https://console.anthropic.com/
- Make sure you copied the **entire** key (they're long)
- Generate a new key if needed

### "API error: insufficient_quota"
- You may need to add billing info at https://console.anthropic.com/
- Each analysis costs roughly $0.02-0.05 — very inexpensive

### "git push" is rejected
If you accidentally checked "Add a README" when creating the GitHub repo:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### "git push" asks for password and nothing works
You need a Personal Access Token — see Step 21 Scenario B above. GitHub no longer accepts regular account passwords for Terminal/command line operations.

### Terminal shows weird characters instead of colors
Your Terminal should support ANSI colors by default on Mac. If the output looks garbled, try running:
```bash
python3 healthcare_phishing_analyzer.py --test iran_ehr --json
```
The `--json` flag gives you clean JSON output without color formatting.

### "tar: Error opening archive" when extracting
Make sure you're pointing to the right file:
```bash
ls ~/Downloads/*.tar*
```
This will show you the exact filename. Use that exact name in the `cp` and `tar` commands.

---

## QUICK REFERENCE COMMANDS

```bash
# Run a single test
python3 healthcare_phishing_analyzer.py --test iran_ehr

# Run all tests
python3 healthcare_phishing_analyzer.py --test-all

# Interactive mode (paste email, then Ctrl+D)
python3 healthcare_phishing_analyzer.py --interactive

# Analyze a file
python3 healthcare_phishing_analyzer.py --file email.eml

# Save JSON output
python3 healthcare_phishing_analyzer.py --test iran_ehr --json --output results.json

# List test cases
python3 healthcare_phishing_analyzer.py --list-tests

# Git: stage, commit, push changes
git add .
git commit -m "your message here"
git push

# Set API key (run this every time you open a new Terminal)
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

---

## WHAT TO DO AFTER SETUP

1. ✅ Run all 5 test cases to verify everything works
2. ✅ Save sample JSON output and push to GitHub
3. ✅ Take screenshots of the React app in Claude for LinkedIn
4. ✅ Pin the repo to your GitHub profile
5. ✅ Post on LinkedIn using the template from LINKEDIN_AND_PITCH.md
6. ✅ Share the GitHub link with your ISSA-KC contacts (Aaron/Tenfold, Anita, Britney)
7. ✅ Reference this project in your recruiter conversations and interviews
8. ✅ Add the GitHub repo URL to your resume under the Cybersecurity Projects section
