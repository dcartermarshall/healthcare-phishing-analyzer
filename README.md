# 🛡️ Healthcare Phishing Email Analyzer

**AI-powered phishing email analysis tool built for healthcare cybersecurity operations**

[![MITRE ATT&CK](https://img.shields.io/badge/MITRE%20ATT%26CK-v15-red)](https://attack.mitre.org/)
[![CISA](https://img.shields.io/badge/CISA-Healthcare%20Threat%20Intel-blue)](https://www.cisa.gov/topics/cyber-threats-and-advisories/nation-state-cyber-actors/iran)
[![Python](https://img.shields.io/badge/Python-3.10+-blue)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Overview

The Healthcare Phishing Analyzer is a specialized threat analysis tool designed for SOC analysts and cybersecurity teams protecting healthcare organizations. It uses AI-powered analysis to detect phishing indicators, map findings to the MITRE ATT&CK framework, and provide actionable incident response guidance — with deep awareness of the current Iranian state-sponsored threat landscape targeting U.S. healthcare infrastructure.

### Why Healthcare-Specific?

Healthcare organizations face unique phishing threats in 2026:

- **Iranian APT groups** (Pioneer Kitten, APT42, Handala, Pay2Key) are actively targeting U.S. healthcare with spear-phishing, credential theft, and ransomware
- **EHR system lures** impersonating Epic, Cerner, and other clinical platforms
- **HIPAA compliance scams** exploiting regulatory fear to harvest credentials
- **Insurance vendor BEC** targeting accounts payable with fraudulent wire instructions
- **HR impersonation** campaigns harvesting W-2s, SSNs, and banking information

This tool was built during the March 2026 escalation period when CISA issued multiple advisories about Iranian cyber operations against healthcare infrastructure.

---

## Features

| Feature | Description |
|---------|-------------|
| **AI-Powered Analysis** | Claude AI performs deep contextual analysis of email headers, body content, URLs, and attachments |
| **MITRE ATT&CK Mapping** | Every detected technique mapped to ATT&CK Enterprise v15 with healthcare-specific relevance |
| **Iran APT Correlation** | Automatic correlation with active Iranian threat campaigns (Pioneer Kitten, APT42, Handala, Pay2Key) |
| **IOC Extraction** | Automated extraction of suspicious domains, IPs, URLs, email addresses, and file hashes |
| **Healthcare Risk Assessment** | PHI exposure, EHR compromise, HIPAA violation, patient safety, and supply chain risk analysis |
| **Incident Response Playbook** | Actionable response steps aligned to NIST SP 800-61 |
| **Threat Severity Rating** | CRITICAL/HIGH/MEDIUM/LOW/CLEAN with confidence scoring |
| **Social Engineering Detection** | Identifies urgency tactics, authority exploitation, pretexting, and impersonation patterns |

---

## Quick Start

### Prerequisites

- Python 3.10+
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/healthcare-phishing-analyzer.git
cd healthcare-phishing-analyzer
pip install anthropic
export ANTHROPIC_API_KEY="your-api-key-here"
```

### Usage

```bash
# Analyze a single email file
python healthcare_phishing_analyzer.py --file suspicious_email.eml

# Analyze from stdin (paste email content)
python healthcare_phishing_analyzer.py --interactive

# Run all test cases
python healthcare_phishing_analyzer.py --test-all

# Run a specific test case
python healthcare_phishing_analyzer.py --test hipaa
python healthcare_phishing_analyzer.py --test iran_ehr
python healthcare_phishing_analyzer.py --test insurance_bec
python healthcare_phishing_analyzer.py --test hr_impersonation
python healthcare_phishing_analyzer.py --test ransomware_it
```

---

## Sample Output

```
╔══════════════════════════════════════════════════════════════╗
║  THREAT ASSESSMENT: CRITICAL          Confidence: 96%       ║
║  🇮🇷 IRAN APT CORRELATION DETECTED                          ║
╚══════════════════════════════════════════════════════════════╝

EXECUTIVE SUMMARY:
This email impersonates Epic Systems with a fake emergency security
patch lure, exploiting the current Iranian cyber threat to healthcare.
The executable attachment and credential harvesting link are consistent
with Pioneer Kitten / Fox Kitten initial access techniques.

RED FLAGS IDENTIFIED: 8
━━━━━━━━━━━━━━━━━━━━━━━━
[CRITICAL] Domain Spoofing: epic-systems-update.com (not epic.com)
[CRITICAL] Malicious Attachment: .exe file masquerading as security patch
[CRITICAL] Credential Harvesting: Requests network admin credentials
[HIGH]     Urgency/Pressure: "Must be installed before 5:00 PM CST today"
[HIGH]     Authority Exploitation: Impersonates Epic security engineer
[HIGH]     Iran Threat Exploitation: References real CISA advisory
[MEDIUM]   Technical Deception: References real CVE format
[MEDIUM]   Social Engineering: Creates fear of network quarantine

MITRE ATT&CK MAPPING:
━━━━━━━━━━━━━━━━━━━━━━━━
T1566.001 - Spearphishing Attachment (Initial Access)
T1566.002 - Spearphishing Link (Initial Access)
T1204.002 - Malicious File (Execution)
T1078     - Valid Accounts (Persistence)
T1036     - Masquerading (Defense Evasion)
T1656     - Impersonation (Defense Evasion)

IOCs EXTRACTED:
━━━━━━━━━━━━━━━━━━━━━━━━
Domains:  epic-systems-update.com
URLs:     https://epic-systems-update.com/patches/critical/v9.4.2
Files:    Epic_Security_Patch_v9.4.2_CRITICAL.exe
Emails:   it-security@epic-systems-update.com
```

---

## Test Cases

Five healthcare-specific phishing scenarios are included, replicating real-world attack patterns observed in 2026:

| Test Case | Attack Vector | Threat Actor Model |
|-----------|--------------|-------------------|
| HIPAA Compliance Scam | Credential harvest via fake HHS portal | Generic healthcare phishing |
| Iran-Linked EHR Update | Malware delivery via fake Epic patch | Pioneer Kitten / Fox Kitten |
| Insurance Vendor BEC | Wire fraud via spoofed Blue Cross | Business Email Compromise |
| HR Impersonation | W-2/SSN harvest via fake benefits portal | Social engineering campaign |
| IT Alert / Ransomware | Credential theft via fake M365 alert | Nation-state ransomware precursor |

---

## Architecture

```
healthcare-phishing-analyzer/
├── healthcare_phishing_analyzer.py   # Main CLI tool
├── test_cases/                       # Sample phishing emails
│   ├── hipaa_credential_harvest.eml
│   ├── iran_ehr_update_lure.eml
│   ├── insurance_bec_attack.eml
│   ├── hr_impersonation_phish.eml
│   └── ransomware_it_alert.eml
├── README.md
├── LICENSE
└── requirements.txt
```

---

## Threat Intelligence References

- [CISA: Iran-Based Cyber Actors Enabling Ransomware Attacks (AA24-241a)](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-241a)
- [CISA: Iran State-Sponsored Cyber Threat Advisories](https://www.cisa.gov/topics/cyber-threats-and-advisories/nation-state-cyber-actors/iran/publications)
- [Unit 42: March 2026 Iran Cyber Escalation](https://unit42.paloaltonetworks.com/iranian-cyberattacks-2026/)
- [Halcyon: Pay2Key Healthcare Ransomware (Feb 2026)](https://www.halcyon.ai/ransomware-research-reports/pay2key-iranian-linked-ransomware-is-back-back-again)
- [MITRE ATT&CK: Phishing T1566](https://attack.mitre.org/techniques/T1566/)
- [CloudWave: Healthcare Threat Intelligence Brief (March 2026)](https://gocloudwave.com/wp-content/uploads/2026/03/Iran_CyberBulletin_CloudWave_final.pdf)

---

## About the Author

**D'Anthony Carter-Marshall**
Cybersecurity Analyst | CompTIA Security+ (SY0-701) | KU Cybersecurity Certificate

Transitioning into cybersecurity with hands-on experience in threat detection, SIEM analysis, incident response, and penetration testing. Built this tool to address the critical gap in healthcare-specific phishing analysis during the 2026 Iranian cyber escalation targeting U.S. healthcare infrastructure.

- [LinkedIn](https://linkedin.com/in/YOUR_PROFILE)
- [GitHub](https://github.com/YOUR_USERNAME)

---

## License

MIT License — see [LICENSE](LICENSE) for details.
