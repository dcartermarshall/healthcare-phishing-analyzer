#!/usr/bin/env python3
"""
Healthcare Phishing Email Analyzer
===================================
AI-powered phishing email analysis for healthcare cybersecurity operations.
Maps findings to MITRE ATT&CK, correlates with Iranian APT campaigns,
and provides actionable incident response guidance.

Author: D'Anthony Carter-Marshall
Cert:   CompTIA Security+ (SY0-701)
Date:   March 2026

References:
    - CISA AA24-241a: Iran-Based Cyber Actors Enabling Ransomware Attacks
    - MITRE ATT&CK Enterprise v15: T1566 Phishing family
    - Unit 42: March 2026 Iran Cyber Escalation Brief
    - Halcyon/Beazley: Pay2Key Healthcare Ransomware (Feb 2026)
"""

import json
import sys
import os
import argparse
import textwrap
from datetime import datetime

try:
    import anthropic
except ImportError:
    print("Error: anthropic package required. Install with: pip install anthropic")
    sys.exit(1)


# ─── CONFIGURATION ─────────────────────────────────────────────────────────────

ANALYSIS_MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 4096

SYSTEM_PROMPT = """You are a healthcare cybersecurity phishing email analyst specializing in threats targeting U.S. healthcare organizations, with deep expertise in Iranian state-sponsored threat activity (Pioneer Kitten, Fox Kitten, APT42, Handala, Pay2Key) currently targeting healthcare infrastructure in 2026.

Analyze the provided email for phishing indicators. Return your analysis as valid JSON only — no markdown, no backticks, no preamble. Use this exact structure:

{
  "threat_level": "CRITICAL|HIGH|MEDIUM|LOW|CLEAN",
  "confidence_score": 0-100,
  "executive_summary": "2-3 sentence summary of the threat",
  "iran_threat_context": "If relevant, explain how this aligns with current Iranian APT healthcare targeting campaigns. Reference specific threat groups and CISA advisories if applicable. If not relevant, set to null.",
  "sender_analysis": {
    "display_name": "...",
    "email_address": "...",
    "domain": "...",
    "domain_spoofing": true/false,
    "spoofing_details": "...",
    "reply_to_mismatch": true/false,
    "reply_to_address": "..."
  },
  "red_flags": [
    {
      "category": "Domain Spoofing|Urgency/Pressure|Credential Harvesting|Impersonation|Malicious Link|Malicious Attachment|Social Engineering|Financial Fraud|Data Exfiltration|Authority Exploitation",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "indicator": "specific text or element from the email",
      "explanation": "why this is a red flag",
      "healthcare_context": "why this is particularly dangerous in a healthcare setting"
    }
  ],
  "mitre_attack_mapping": [
    {
      "technique_id": "T1566.001",
      "technique_name": "...",
      "tactic": "...",
      "relevance": "how this technique applies to this specific email"
    }
  ],
  "url_analysis": [
    {
      "url": "...",
      "risk_level": "CRITICAL|HIGH|MEDIUM|LOW",
      "indicators": ["typosquatting", "credential harvest form", "suspicious TLD", "no HTTPS", "IP-based URL", "URL shortener"]
    }
  ],
  "social_engineering_tactics": ["list of specific SE tactics used"],
  "healthcare_specific_risks": ["PHI exposure", "EHR compromise", "HIPAA violation", "patient safety impact", "insurance fraud", "supply chain compromise"],
  "recommended_actions": {
    "immediate": ["step 1", "step 2"],
    "investigation": ["step 1", "step 2"],
    "containment": ["step 1", "step 2"],
    "reporting": ["step 1", "step 2"]
  },
  "ioc_extraction": {
    "suspicious_domains": [],
    "suspicious_ips": [],
    "suspicious_urls": [],
    "suspicious_attachments": [],
    "suspicious_email_addresses": []
  }
}

Be thorough, precise, and healthcare-specific. Reference real CISA advisories (AA24-241a), real Iranian APT groups, and current 2026 threat landscape where applicable. Every red flag must include healthcare context."""


# ─── MITRE ATT&CK REFERENCE ────────────────────────────────────────────────────

MITRE_TECHNIQUES = {
    "T1566": ("Phishing", "Initial Access"),
    "T1566.001": ("Spearphishing Attachment", "Initial Access"),
    "T1566.002": ("Spearphishing Link", "Initial Access"),
    "T1566.003": ("Spearphishing via Service", "Initial Access"),
    "T1566.004": ("Spearphishing Voice", "Initial Access"),
    "T1598": ("Phishing for Information", "Reconnaissance"),
    "T1598.003": ("Spearphishing Link (Recon)", "Reconnaissance"),
    "T1204.001": ("Malicious Link", "Execution"),
    "T1204.002": ("Malicious File", "Execution"),
    "T1078": ("Valid Accounts", "Persistence"),
    "T1114": ("Email Collection", "Collection"),
    "T1589": ("Gather Victim Identity Info", "Reconnaissance"),
    "T1585": ("Establish Accounts", "Resource Development"),
    "T1583.001": ("Acquire Infrastructure: Domains", "Resource Development"),
    "T1036": ("Masquerading", "Defense Evasion"),
    "T1656": ("Impersonation", "Defense Evasion"),
}


# ─── DISPLAY UTILITIES ──────────────────────────────────────────────────────────

class Colors:
    """ANSI color codes for terminal output."""
    RED = "\033[91m"
    YELLOW = "\033[93m"
    GREEN = "\033[92m"
    BLUE = "\033[94m"
    MAGENTA = "\033[95m"
    CYAN = "\033[96m"
    WHITE = "\033[97m"
    DIM = "\033[90m"
    BOLD = "\033[1m"
    RESET = "\033[0m"


def severity_color(level: str) -> str:
    """Return ANSI color for severity level."""
    colors = {
        "CRITICAL": Colors.RED,
        "HIGH": Colors.YELLOW,
        "MEDIUM": Colors.CYAN,
        "LOW": Colors.GREEN,
        "CLEAN": Colors.BLUE,
    }
    return colors.get(level, Colors.DIM)


def print_header():
    """Print application header."""
    print(f"""
{Colors.CYAN}{'═' * 66}
{Colors.BOLD}  🛡️  HEALTHCARE PHISHING EMAIL ANALYZER{Colors.RESET}
{Colors.DIM}  AI-Powered Threat Analysis for Healthcare Security Operations
  MITRE ATT&CK v15 | Iran APT Aware | CISA AA24-241a
{Colors.CYAN}{'═' * 66}{Colors.RESET}
""")


def print_results(data: dict):
    """Format and display analysis results."""
    level = data.get("threat_level", "UNKNOWN")
    score = data.get("confidence_score", 0)
    color = severity_color(level)

    # Threat Assessment Header
    print(f"""
{color}{'╔' + '═' * 64 + '╗'}
{'║'} {Colors.BOLD}THREAT ASSESSMENT: {level:<20} Confidence: {score}%{' ' * (18 - len(str(score)))}{'║'}{Colors.RESET}{color}
{'║'}{' ' * 64}{'║'}""")

    if data.get("iran_threat_context"):
        print(f"{'║'}  🇮🇷 IRAN APT CORRELATION DETECTED{' ' * 30}{'║'}")

    print(f"{'╚' + '═' * 64 + '╝'}{Colors.RESET}")

    # Executive Summary
    print(f"\n{Colors.BOLD}EXECUTIVE SUMMARY:{Colors.RESET}")
    for line in textwrap.wrap(data.get("executive_summary", "N/A"), width=64):
        print(f"  {line}")

    # Iran Threat Context
    if data.get("iran_threat_context"):
        print(f"\n{Colors.MAGENTA}{Colors.BOLD}🇮🇷 IRAN APT THREAT CORRELATION:{Colors.RESET}")
        for line in textwrap.wrap(data["iran_threat_context"], width=64):
            print(f"  {Colors.MAGENTA}{line}{Colors.RESET}")

    # Sender Analysis
    sender = data.get("sender_analysis", {})
    if sender:
        print(f"\n{Colors.BOLD}SENDER ANALYSIS:{Colors.RESET}")
        print(f"  {'━' * 50}")
        print(f"  Display Name: {sender.get('display_name', 'N/A')}")
        print(f"  Email:        {sender.get('email_address', 'N/A')}")
        print(f"  Domain:       {sender.get('domain', 'N/A')}")
        if sender.get("domain_spoofing"):
            print(f"  {Colors.RED}⚠️  DOMAIN SPOOFING DETECTED{Colors.RESET}")
            print(f"     {sender.get('spoofing_details', '')}")
        if sender.get("reply_to_mismatch"):
            print(f"  {Colors.YELLOW}↩️  Reply-To Mismatch: {sender.get('reply_to_address', 'N/A')}{Colors.RESET}")

    # Red Flags
    flags = data.get("red_flags", [])
    if flags:
        print(f"\n{Colors.BOLD}RED FLAGS IDENTIFIED: {len(flags)}{Colors.RESET}")
        print(f"  {'━' * 50}")
        for i, flag in enumerate(flags, 1):
            fc = severity_color(flag.get("severity", ""))
            print(f"  {fc}[{flag['severity']:<8}]{Colors.RESET} {flag['category']}")
            print(f"           {Colors.DIM}\"{flag['indicator']}\"{Colors.RESET}")
            for line in textwrap.wrap(flag.get("explanation", ""), width=55):
                print(f"           {line}")
            if flag.get("healthcare_context"):
                print(f"           {Colors.CYAN}🏥 {flag['healthcare_context']}{Colors.RESET}")
            print()

    # MITRE ATT&CK Mapping
    mitre = data.get("mitre_attack_mapping", [])
    if mitre:
        print(f"{Colors.BOLD}MITRE ATT&CK MAPPING:{Colors.RESET}")
        print(f"  {'━' * 50}")
        for t in mitre:
            tid = t.get("technique_id", "")
            print(f"  {Colors.RED}{tid:<12}{Colors.RESET} {t.get('technique_name', '')} ({t.get('tactic', '')})")
            for line in textwrap.wrap(t.get("relevance", ""), width=52):
                print(f"              {Colors.DIM}{line}{Colors.RESET}")
        print()

    # URL Analysis
    urls = data.get("url_analysis", [])
    if urls:
        print(f"{Colors.BOLD}URL ANALYSIS:{Colors.RESET}")
        print(f"  {'━' * 50}")
        for u in urls:
            uc = severity_color(u.get("risk_level", ""))
            print(f"  {uc}[{u['risk_level']}]{Colors.RESET} {u['url']}")
            indicators = ", ".join(u.get("indicators", []))
            print(f"         Indicators: {indicators}")
        print()

    # Social Engineering Tactics
    se = data.get("social_engineering_tactics", [])
    if se:
        print(f"{Colors.BOLD}SOCIAL ENGINEERING TACTICS:{Colors.RESET}")
        for t in se:
            print(f"  • {t}")
        print()

    # Healthcare-Specific Risks
    risks = data.get("healthcare_specific_risks", [])
    if risks:
        print(f"{Colors.BOLD}HEALTHCARE-SPECIFIC RISKS:{Colors.RESET}")
        for r in risks:
            print(f"  {Colors.MAGENTA}⚕️  {r}{Colors.RESET}")
        print()

    # IOCs
    iocs = data.get("ioc_extraction", {})
    has_iocs = any(iocs.get(k) for k in iocs)
    if has_iocs:
        print(f"{Colors.BOLD}INDICATORS OF COMPROMISE (IOCs):{Colors.RESET}")
        print(f"  {'━' * 50}")
        labels = {
            "suspicious_domains": "Domains",
            "suspicious_ips": "IPs",
            "suspicious_urls": "URLs",
            "suspicious_attachments": "Files",
            "suspicious_email_addresses": "Emails",
        }
        for key, label in labels.items():
            items = iocs.get(key, [])
            if items:
                print(f"  {label}:")
                for item in items:
                    print(f"    {Colors.RED}{item}{Colors.RESET}")
        print()

    # Recommended Actions
    actions = data.get("recommended_actions", {})
    if actions:
        print(f"{Colors.BOLD}RECOMMENDED RESPONSE ACTIONS:{Colors.RESET}")
        print(f"  {'━' * 50}")
        sections = [
            ("immediate", "🚨 Immediate", Colors.RED),
            ("investigation", "🔬 Investigation", Colors.YELLOW),
            ("containment", "🛡️ Containment", Colors.CYAN),
            ("reporting", "📋 Reporting", Colors.BLUE),
        ]
        for key, label, c in sections:
            steps = actions.get(key, [])
            if steps:
                print(f"\n  {c}{Colors.BOLD}{label}:{Colors.RESET}")
                for i, step in enumerate(steps, 1):
                    for j, line in enumerate(textwrap.wrap(step, width=55)):
                        prefix = f"    {i}. " if j == 0 else "       "
                        print(f"{prefix}{line}")

    # Footer
    print(f"""
{Colors.DIM}{'─' * 66}
Healthcare Phishing Analyzer v1.0
Built by D'Anthony Carter-Marshall | CompTIA Security+ (SY0-701)
Powered by Claude AI | MITRE ATT&CK v15 | CISA Healthcare Intel
Analysis timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
{'─' * 66}{Colors.RESET}
""")


# ─── TEST CASES ─────────────────────────────────────────────────────────────────

TEST_CASES = {
    "hipaa": {
        "name": "HIPAA Compliance — Credential Harvest",
        "email": """From: compliance-alerts@hhs-gov-portal.com
To: staff@regionalhealthsystem.org
Subject: URGENT: HIPAA Compliance Violation - Immediate Action Required
Date: Mon, 24 Mar 2026 08:14:22 -0500
Reply-To: no-reply@hhs-compliance-center.com

Dear Healthcare Professional,

Our system has detected a potential HIPAA compliance violation associated with your account. Under federal regulation 45 CFR § 164.308, you are required to verify your identity and acknowledge this notice within 24 hours to avoid disciplinary action and potential fines up to $50,000 per violation.

VIOLATION DETAILS:
- Case ID: HHS-2026-KC-4891
- Type: Unauthorized PHI Access Detected
- Date of Incident: March 22, 2026
- Affected Records: 847 patient records

To review and respond to this violation notice, please access the secure compliance portal immediately:
https://hhs-compliance-verify.com/portal/verify?uid=4891&dept=nursing&action=acknowledge

Failure to respond within 24 hours will result in immediate account suspension, formal OCR investigation, and potential termination.

Regards,
Dr. Sarah Mitchell
Director of Compliance Enforcement
U.S. Department of Health & Human Services"""
    },

    "iran_ehr": {
        "name": "Iran-Linked APT — EHR Update Lure",
        "email": """From: it-security@epic-systems-update.com
To: clinical-staff@midwesthospital.org
Subject: Critical EHR Security Patch - Epic Systems - Action Required Before EOD
Date: Tue, 25 Mar 2026 06:47:11 -0500

EPIC SYSTEMS — EMERGENCY SECURITY BULLETIN
Bulletin ID: EPIC-SEC-2026-0319
Classification: CRITICAL

Due to the escalating cyber threat environment targeting U.S. healthcare infrastructure, Epic Systems is deploying an emergency security patch. This patch addresses a critical zero-day vulnerability (CVE-2026-21894) actively being exploited by nation-state threat actors.

THREAT CONTEXT:
Iranian-affiliated threat group "Pioneer Kitten" has been observed exploiting this vulnerability to gain unauthorized access to EHR systems. CISA Advisory AA24-241a confirms active targeting.

REQUIRED ACTION:
Download and install the security patch immediately:
Attachment: Epic_Security_Patch_v9.4.2_CRITICAL.exe (4.7 MB)
Alternative: https://epic-systems-update.com/patches/critical/v9.4.2

Installation: Right-click "Run as Administrator" and enter your network credentials when prompted.

This patch must be installed before 5:00 PM CST today.

James Chen
Senior Security Engineer, Epic Systems Corporation"""
    },

    "insurance_bec": {
        "name": "Insurance Vendor — BEC Attack",
        "email": """From: accounting@bluecross-payments.net
To: ap-department@kansascitymedical.org
Subject: RE: Outstanding Payment - Invoice #BC-2026-11847 - Past Due
Date: Wed, 26 Mar 2026 09:31:04 -0500
In-Reply-To: <fake-thread-id-8847@kansascitymedical.org>

Hi Accounts Payable Team,

Following up on the outstanding reimbursement for Q1 2026 claims processing. Payment for Invoice #BC-2026-11847 ($247,891.33) is now 15 days past due.

Due to changes in our payment processing system, we've updated our banking information:

NEW WIRE TRANSFER DETAILS:
Bank: First National Bank of Commerce
Routing Number: 065305436
Account Number: 2891847563
Account Name: BlueCross Payment Processing LLC

Please process by end of business Friday, March 28, to avoid claims processing interruption.

Jennifer Walsh
Senior Accounts Manager
Blue Cross Blue Shield of Kansas City
jennifer.walsh@bluecross-payments.net"""
    },

    "hr_impersonation": {
        "name": "HR Impersonation — W-2/Benefits Phish",
        "email": """From: hr-benefits@ukhs-employee-portal.com
To: all-staff@kumed.com
Subject: Action Required: 2026 Benefits Enrollment Verification - Deadline March 28
Date: Wed, 26 Mar 2026 07:22:18 -0500

University of Kansas Health System
HUMAN RESOURCES — BENEFITS ADMINISTRATION

Dear UKHS Team Member,

As part of our annual benefits audit for FY2026, all employees must verify their current benefits enrollment through our new secure employee portal.

ACCESS THE VERIFICATION PORTAL:
https://ukhs-benefits-verify.com/employee/enrollment?ref=fy2026

You will need to verify:
- Health insurance plan selection
- 401(k) contribution percentage
- W-4 tax withholding status
- Direct deposit banking information

Please have ready: UKHS Employee ID, Social Security Number, and current banking information.

Employees who do not complete verification by the deadline may experience a delay in their April 1 paycheck.

Maria Santos
Director of Benefits Administration
University of Kansas Health System"""
    },

    "ransomware_it": {
        "name": "Ransomware Dropper — IT Alert Lure",
        "email": """From: security-team@microsoft365-alerts.com
To: it-admins@healthcarekc.org
Subject: [CRITICAL] Suspicious Login Activity Detected - Your Microsoft 365 Admin Account
Date: Mon, 24 Mar 2026 22:03:44 -0500

MICROSOFT 365 SECURITY ALERT
Severity: CRITICAL

Your Microsoft 365 administrator account has been flagged for suspicious login activity:

SUSPICIOUS LOGIN DETAILS:
IP Address: 185.141.63.47 (Tehran, Iran)
Device: Unknown Linux Device
Login Time: 10:01 PM CST, March 24, 2026
Status: SUCCESSFUL
Actions Taken: Accessed Exchange Admin Center, Modified mail flow rules

SECURE YOUR ACCOUNT NOW:
https://microsoft365-alerts.com/security/verify-admin?alertid=9471

If no action is taken within 2 hours, your admin account will be automatically suspended, affecting email, Teams, and SharePoint.

Microsoft 365 Defender Threat Intelligence"""
    },
}


# ─── CORE ANALYSIS ──────────────────────────────────────────────────────────────

def analyze_email(email_text: str) -> dict:
    """Send email to Claude API for phishing analysis."""
    client = anthropic.Anthropic()

    message = client.messages.create(
        model=ANALYSIS_MODEL,
        max_tokens=MAX_TOKENS,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": f"Analyze this email for phishing indicators. Return ONLY valid JSON.\n\n---EMAIL START---\n{email_text}\n---EMAIL END---"
            }
        ],
    )

    response_text = ""
    for block in message.content:
        if hasattr(block, "text"):
            response_text += block.text

    # Clean and parse JSON
    cleaned = response_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    return json.loads(cleaned)


# ─── CLI INTERFACE ───────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Healthcare Phishing Email Analyzer — AI-powered threat analysis",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""
        Examples:
            python healthcare_phishing_analyzer.py --file email.eml
            python healthcare_phishing_analyzer.py --interactive
            python healthcare_phishing_analyzer.py --test iran_ehr
            python healthcare_phishing_analyzer.py --test-all
            python healthcare_phishing_analyzer.py --list-tests
        """),
    )
    parser.add_argument("--file", "-f", help="Path to email file (.eml or .txt)")
    parser.add_argument("--interactive", "-i", action="store_true", help="Interactive mode — paste email content")
    parser.add_argument("--test", "-t", choices=list(TEST_CASES.keys()), help="Run a specific test case")
    parser.add_argument("--test-all", action="store_true", help="Run all test cases")
    parser.add_argument("--list-tests", action="store_true", help="List available test cases")
    parser.add_argument("--json", action="store_true", help="Output raw JSON instead of formatted display")
    parser.add_argument("--output", "-o", help="Save JSON output to file")

    args = parser.parse_args()

    # Check for API key
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print(f"{Colors.RED}Error: ANTHROPIC_API_KEY environment variable not set.{Colors.RESET}")
        print("Set it with: export ANTHROPIC_API_KEY='your-key-here'")
        sys.exit(1)

    print_header()

    # List test cases
    if args.list_tests:
        print(f"{Colors.BOLD}Available Test Cases:{Colors.RESET}\n")
        for key, tc in TEST_CASES.items():
            print(f"  {Colors.CYAN}{key:<20}{Colors.RESET} {tc['name']}")
        print(f"\n  Run with: python healthcare_phishing_analyzer.py --test <name>")
        return

    # Determine email content
    email_text = None

    if args.file:
        try:
            with open(args.file, "r") as f:
                email_text = f.read()
            print(f"{Colors.DIM}Loaded: {args.file}{Colors.RESET}\n")
        except FileNotFoundError:
            print(f"{Colors.RED}Error: File not found: {args.file}{Colors.RESET}")
            sys.exit(1)

    elif args.test:
        tc = TEST_CASES[args.test]
        email_text = tc["email"]
        print(f"{Colors.CYAN}Test Case: {tc['name']}{Colors.RESET}\n")

    elif args.test_all:
        for key, tc in TEST_CASES.items():
            print(f"\n{'=' * 66}")
            print(f"{Colors.CYAN}{Colors.BOLD}TEST CASE: {tc['name']}{Colors.RESET}")
            print(f"{'=' * 66}")
            try:
                result = analyze_email(tc["email"])
                if args.json:
                    print(json.dumps(result, indent=2))
                else:
                    print_results(result)
                if args.output:
                    output_file = f"{args.output}_{key}.json"
                    with open(output_file, "w") as f:
                        json.dump(result, f, indent=2)
                    print(f"{Colors.DIM}Saved: {output_file}{Colors.RESET}")
            except Exception as e:
                print(f"{Colors.RED}Error analyzing {key}: {e}{Colors.RESET}")
        return

    elif args.interactive:
        print("Paste the suspicious email below (press Ctrl+D or Ctrl+Z when done):\n")
        try:
            email_text = sys.stdin.read()
        except KeyboardInterrupt:
            print("\nCancelled.")
            return

    else:
        parser.print_help()
        return

    if not email_text or not email_text.strip():
        print(f"{Colors.RED}Error: No email content provided.{Colors.RESET}")
        sys.exit(1)

    # Run analysis
    print(f"{Colors.DIM}Analyzing email for phishing indicators...{Colors.RESET}")
    print(f"{Colors.DIM}Mapping to MITRE ATT&CK | Checking Iran APT patterns | Extracting IOCs{Colors.RESET}\n")

    try:
        result = analyze_email(email_text)
    except json.JSONDecodeError as e:
        print(f"{Colors.RED}Error: Failed to parse analysis response: {e}{Colors.RESET}")
        sys.exit(1)
    except Exception as e:
        print(f"{Colors.RED}Error: Analysis failed: {e}{Colors.RESET}")
        sys.exit(1)

    # Output
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print_results(result)

    if args.output:
        with open(args.output, "w") as f:
            json.dump(result, f, indent=2)
        print(f"{Colors.DIM}Results saved to: {args.output}{Colors.RESET}")


if __name__ == "__main__":
    main()
