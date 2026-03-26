import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const MITRE_TECHNIQUES = {
  "T1566": { name: "Phishing", tactic: "Initial Access", url: "https://attack.mitre.org/techniques/T1566/" },
  "T1566.001": { name: "Spearphishing Attachment", tactic: "Initial Access", url: "https://attack.mitre.org/techniques/T1566/001/" },
  "T1566.002": { name: "Spearphishing Link", tactic: "Initial Access", url: "https://attack.mitre.org/techniques/T1566/002/" },
  "T1566.003": { name: "Spearphishing via Service", tactic: "Initial Access", url: "https://attack.mitre.org/techniques/T1566/003/" },
  "T1566.004": { name: "Spearphishing Voice", tactic: "Initial Access", url: "https://attack.mitre.org/techniques/T1566/004/" },
  "T1598": { name: "Phishing for Information", tactic: "Reconnaissance", url: "https://attack.mitre.org/techniques/T1598/" },
  "T1598.003": { name: "Spearphishing Link (Recon)", tactic: "Reconnaissance", url: "https://attack.mitre.org/techniques/T1598/003/" },
  "T1204.001": { name: "Malicious Link", tactic: "Execution", url: "https://attack.mitre.org/techniques/T1204/001/" },
  "T1204.002": { name: "Malicious File", tactic: "Execution", url: "https://attack.mitre.org/techniques/T1204/002/" },
  "T1078": { name: "Valid Accounts", tactic: "Persistence", url: "https://attack.mitre.org/techniques/T1078/" },
  "T1114": { name: "Email Collection", tactic: "Collection", url: "https://attack.mitre.org/techniques/T1114/" },
  "T1589": { name: "Gather Victim Identity Info", tactic: "Reconnaissance", url: "https://attack.mitre.org/techniques/T1589/" },
  "T1585": { name: "Establish Accounts", tactic: "Resource Development", url: "https://attack.mitre.org/techniques/T1585/" },
  "T1583.001": { name: "Acquire Infrastructure: Domains", tactic: "Resource Development", url: "https://attack.mitre.org/techniques/T1583/001/" },
  "T1036": { name: "Masquerading", tactic: "Defense Evasion", url: "https://attack.mitre.org/techniques/T1036/" },
  "T1656": { name: "Impersonation", tactic: "Defense Evasion", url: "https://attack.mitre.org/techniques/T1656/" },
};

const SAMPLE_EMAILS = [
  {
    name: "🏥 HIPAA Compliance — Credential Harvest",
    email: `From: compliance-alerts@hhs-gov-portal.com
To: staff@regionalhealthsystem.org
Subject: URGENT: HIPAA Compliance Violation - Immediate Action Required
Date: Mon, 24 Mar 2026 08:14:22 -0500
X-Mailer: Microsoft Outlook 16.0
Reply-To: no-reply@hhs-compliance-center.com

Dear Healthcare Professional,

Our system has detected a potential HIPAA compliance violation associated with your account. Under federal regulation 45 CFR § 164.308, you are required to verify your identity and acknowledge this notice within 24 hours to avoid disciplinary action and potential fines up to $50,000 per violation.

VIOLATION DETAILS:
- Case ID: HHS-2026-KC-4891
- Type: Unauthorized PHI Access Detected
- Date of Incident: March 22, 2026
- Affected Records: 847 patient records
- Your Role: Named as primary accessor

To review and respond to this violation notice, please access the secure compliance portal immediately:

https://hhs-compliance-verify.com/portal/verify?uid=4891&dept=nursing&action=acknowledge

You must complete the following steps:
1. Verify your identity using your institutional credentials
2. Review the violation details
3. Submit your acknowledgment form

Failure to respond within 24 hours will result in:
- Immediate account suspension
- Formal investigation by the Office for Civil Rights (OCR)
- Potential termination of employment

This notice is generated automatically by the HHS Office for Civil Rights Compliance Monitoring System.

Regards,
Dr. Sarah Mitchell
Director of Compliance Enforcement
U.S. Department of Health & Human Services
Office for Civil Rights
200 Independence Avenue, S.W.
Washington, D.C. 20201
Phone: (202) 619-0403`
  },
  {
    name: "🇮🇷 Iran-Linked APT — EHR Update Lure",
    email: `From: it-security@epic-systems-update.com
To: clinical-staff@midwesthospital.org
Subject: Critical EHR Security Patch - Epic Systems - Action Required Before EOD
Date: Tue, 25 Mar 2026 06:47:11 -0500
X-Mailer: Roundcube Webmail/1.6.1
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="----=_Part_7823_1209384756"

EPIC SYSTEMS — EMERGENCY SECURITY BULLETIN
Bulletin ID: EPIC-SEC-2026-0319
Classification: CRITICAL
Affected Systems: Epic Hyperspace, MyChart, Epic CareLink

Dear Clinical Staff,

Due to the escalating cyber threat environment targeting U.S. healthcare infrastructure, Epic Systems is deploying an emergency security patch to all partner organizations. This patch addresses a critical zero-day vulnerability (CVE-2026-21894) actively being exploited by nation-state threat actors.

THREAT CONTEXT:
Iranian-affiliated threat group "Pioneer Kitten" has been observed exploiting this vulnerability to gain unauthorized access to Electronic Health Record (EHR) systems. CISA Advisory AA24-241a confirms active targeting of U.S. healthcare organizations.

REQUIRED ACTION:
Download and install the security patch immediately:

📎 Attachment: Epic_Security_Patch_v9.4.2_CRITICAL.exe (4.7 MB)

Alternative download: https://epic-systems-update.com/patches/critical/v9.4.2

Installation Instructions:
1. Save the attached file to your desktop
2. Right-click and select "Run as Administrator"
3. Enter your network credentials when prompted
4. Restart your workstation after installation

NOTE: Your Epic session will be temporarily interrupted during the patch process. All unsaved patient records will be preserved in the system cache.

This patch must be installed before 5:00 PM CST today. Systems without the patch will be quarantined from the network per our incident response protocol.

If you experience any issues, contact the IT Help Desk at ext. 4477.

Best regards,
James Chen
Senior Security Engineer
Epic Systems Corporation
Verona, WI 53593
Direct: (608) 271-9000 x8842`
  },
  {
    name: "💰 Insurance Vendor — BEC Attack",
    email: `From: accounting@bluecross-payments.net
To: ap-department@kansascitymedical.org
Subject: RE: Outstanding Payment - Invoice #BC-2026-11847 - Past Due
Date: Wed, 26 Mar 2026 09:31:04 -0500
X-Mailer: Microsoft Outlook 16.0
References: <fake-thread-id-8847@kansascitymedical.org>
In-Reply-To: <fake-thread-id-8847@kansascitymedical.org>

Hi Accounts Payable Team,

I'm following up on our previous conversation regarding the outstanding reimbursement for Q1 2026 claims processing. Our records show that payment for Invoice #BC-2026-11847 ($247,891.33) is now 15 days past due.

Due to changes in our payment processing system, we've updated our banking information. Please use the following details for this and all future payments:

NEW WIRE TRANSFER DETAILS:
Bank: First National Bank of Commerce
Routing Number: 065305436
Account Number: 2891847563
Account Name: BlueCross Payment Processing LLC
Reference: INV-BC-2026-11847

Please process this payment by end of business Friday, March 28, to avoid any interruption to your organization's claims processing and provider network access. We've attached the updated W-9 and payment instructions for your records.

I've CC'd our regional manager, David Park, who can verify these details if needed. His direct line is (816) 555-0147.

Thank you for your prompt attention to this matter.

Best regards,
Jennifer Walsh
Senior Accounts Manager
Blue Cross Blue Shield of Kansas City
2301 Main Street
Kansas City, MO 64108
jennifer.walsh@bluecross-payments.net
Phone: (816) 395-2700`
  },
  {
    name: "🔑 HR Impersonation — W-2/Benefits Phish",
    email: `From: hr-benefits@ukhs-employee-portal.com
To: all-staff@kumed.com
Subject: Action Required: 2026 Benefits Enrollment Verification - Deadline March 28
Date: Wed, 26 Mar 2026 07:22:18 -0500
X-Priority: 1
X-Mailer: PHP Mailer 6.8

University of Kansas Health System
HUMAN RESOURCES — BENEFITS ADMINISTRATION

Dear UKHS Team Member,

As part of our annual benefits audit for FY2026, we are requiring all employees to verify their current benefits enrollment and update their tax withholding information through our new secure employee portal.

This verification is mandatory for all full-time and part-time employees and must be completed by Friday, March 28, 2026.

ACCESS THE VERIFICATION PORTAL:
https://ukhs-benefits-verify.com/employee/enrollment?ref=fy2026

You will need to verify the following:
✅ Current health insurance plan selection
✅ Dental and vision coverage
✅ 401(k) contribution percentage
✅ W-4 tax withholding status
✅ Direct deposit banking information
✅ Emergency contact information

For verification purposes, please have the following ready:
- Your UKHS Employee ID
- Social Security Number (last 4 digits for initial verification, full SSN for tax forms)
- Current banking information for direct deposit confirmation

IMPORTANT: Employees who do not complete verification by the deadline may experience a delay in their April 1 paycheck and could be temporarily defaulted to the base benefits plan.

If you have questions, please contact HR Benefits at hr-benefits@ukhs-employee-portal.com or call (913) 588-5080.

Thank you for your cooperation.

Warm regards,
Maria Santos
Director of Benefits Administration
University of Kansas Health System
Human Resources Department
3901 Rainbow Blvd, Mail Stop 3013
Kansas City, KS 66160`
  },
  {
    name: "⚠️ Ransomware Dropper — IT Alert Lure",
    email: `From: security-team@microsoft365-alerts.com
To: it-admins@healthcarekc.org
Subject: [CRITICAL] Suspicious Login Activity Detected - Your Microsoft 365 Admin Account
Date: Mon, 24 Mar 2026 22:03:44 -0500
X-Mailer: MIME-tools 5.509 (Entity 5.509)

⚠️ MICROSOFT 365 SECURITY ALERT ⚠️
Alert ID: MS365-SEC-2026-03-24-9471
Severity: CRITICAL
Timestamp: 2026-03-24T22:01:33Z

Your Microsoft 365 administrator account has been flagged for suspicious login activity from an unrecognized location:

SUSPICIOUS LOGIN DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━
IP Address: 185.141.63.47 (Tehran, Iran)
Device: Unknown Linux Device
Browser: Firefox 124.0
Login Time: 10:01 PM CST, March 24, 2026
Status: SUCCESSFUL ⚠️
Actions Taken: Accessed Exchange Admin Center, Modified mail flow rules
━━━━━━━━━━━━━━━━━━━━━━━━

If this was NOT you, your account may be compromised. Take immediate action:

🔒 SECURE YOUR ACCOUNT NOW:
https://microsoft365-alerts.com/security/verify-admin?alertid=9471

Steps to secure your account:
1. Click the link above to access the security verification portal
2. Sign in with your administrator credentials
3. Review recent activity and revoke unauthorized sessions
4. Enable additional security measures

⏰ WARNING: If no action is taken within 2 hours, your admin account will be automatically suspended to prevent further unauthorized access. This may affect your organization's email, Teams, and SharePoint services.

This alert was generated by Microsoft 365 Defender Threat Intelligence.

Microsoft Corporation
One Microsoft Way
Redmond, WA 98052
Privacy Statement: https://privacy.microsoft.com`
  }
];

const SYSTEM_PROMPT = `You are a healthcare cybersecurity phishing email analyst specializing in threats targeting U.S. healthcare organizations, with deep expertise in Iranian state-sponsored threat activity (Pioneer Kitten, Fox Kitten, APT42, Handala, Pay2Key) currently targeting healthcare infrastructure in 2026.

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

Be thorough, precise, and healthcare-specific. Reference real CISA advisories (AA24-241a), real Iranian APT groups, and current 2026 threat landscape where applicable. Every red flag must include healthcare context.`;

// ─── STYLES ───────────────────────────────────────────────────────────────────

const COLORS = {
  bg: "#0a0e17",
  bgCard: "#0f1422",
  bgCardHover: "#141a2e",
  border: "#1a2240",
  borderActive: "#2a3a6a",
  text: "#c8d3e8",
  textDim: "#5a6a8a",
  textBright: "#e8edf8",
  accent: "#00d4aa",
  accentDim: "#00d4aa33",
  critical: "#ff3b5c",
  criticalDim: "#ff3b5c22",
  high: "#ff8c42",
  highDim: "#ff8c4222",
  medium: "#ffd166",
  mediumDim: "#ffd16622",
  low: "#00d4aa",
  lowDim: "#00d4aa22",
  clean: "#4a9eff",
  cleanDim: "#4a9eff22",
  iran: "#c44dff",
  iranDim: "#c44dff22",
};

const severityColor = (level) => {
  const map = { CRITICAL: COLORS.critical, HIGH: COLORS.high, MEDIUM: COLORS.medium, LOW: COLORS.low, CLEAN: COLORS.clean };
  return map[level] || COLORS.textDim;
};
const severityBg = (level) => {
  const map = { CRITICAL: COLORS.criticalDim, HIGH: COLORS.highDim, MEDIUM: COLORS.mediumDim, LOW: COLORS.lowDim, CLEAN: COLORS.cleanDim };
  return map[level] || "transparent";
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function GlowBar({ color = COLORS.accent, delay = 0 }) {
  return (
    <div style={{
      height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      animation: `glow-slide 2s ease-in-out ${delay}s infinite alternate`,
      opacity: 0.6,
    }} />
  );
}

function Badge({ children, color, bg, style = {} }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 4,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
      color: color, background: bg,
      border: `1px solid ${color}33`,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      ...style,
    }}>
      {children}
    </span>
  );
}

function SeverityMeter({ level, score }) {
  const color = severityColor(level);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ flex: 1, height: 8, borderRadius: 4, background: COLORS.border, overflow: "hidden" }}>
        <div style={{
          width: `${score}%`, height: "100%", borderRadius: 4,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: "width 1.5s cubic-bezier(0.22,1,0.36,1)",
          boxShadow: `0 0 12px ${color}66`,
        }} />
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color, minWidth: 40, textAlign: "right" }}>
        {score}%
      </span>
    </div>
  );
}

function Card({ children, style = {}, glow = false, glowColor = COLORS.accent }) {
  return (
    <div style={{
      background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
      borderRadius: 8, padding: 20, position: "relative", overflow: "hidden",
      ...(glow ? { boxShadow: `0 0 30px ${glowColor}15, inset 0 1px 0 ${glowColor}10` } : {}),
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: COLORS.textBright, letterSpacing: "0.03em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
          {title}
        </h3>
      </div>
      {subtitle && <p style={{ margin: 0, fontSize: 12, color: COLORS.textDim, paddingLeft: 24 }}>{subtitle}</p>}
    </div>
  );
}

function LoadingAnimation() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, gap: 24 }}>
      <div style={{ position: "relative", width: 80, height: 80 }}>
        <div style={{
          position: "absolute", inset: 0, border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.accent,
          borderRadius: "50%", animation: "spin 1s linear infinite",
        }} />
        <div style={{
          position: "absolute", inset: 8, border: `3px solid ${COLORS.border}`, borderBottomColor: COLORS.critical,
          borderRadius: "50%", animation: "spin 1.5s linear infinite reverse",
        }} />
        <div style={{
          position: "absolute", inset: 16, border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.iran,
          borderRadius: "50%", animation: "spin 2s linear infinite",
        }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 20 }}>🛡️</span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textBright, marginBottom: 6 }}>
          Analyzing Email Threat Indicators
        </div>
        <div style={{ fontSize: 12, color: COLORS.textDim, animation: "pulse 2s ease-in-out infinite" }}>
          Mapping to MITRE ATT&CK · Checking Iranian APT patterns · Extracting IOCs
        </div>
      </div>
    </div>
  );
}

function RedFlagItem({ flag, index }) {
  const color = severityColor(flag.severity);
  const bg = severityBg(flag.severity);
  return (
    <div style={{
      background: bg, border: `1px solid ${color}22`, borderRadius: 6,
      padding: 14, marginBottom: 10, borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Badge color={color} bg={`${color}22`}>{flag.severity}</Badge>
          <Badge color={COLORS.textDim} bg={COLORS.border}>{flag.category}</Badge>
        </div>
        <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: "monospace" }}>RF-{String(index + 1).padStart(3, "0")}</span>
      </div>
      <div style={{ fontSize: 12, color: COLORS.textBright, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace", background: "#00000044", padding: "6px 10px", borderRadius: 4, wordBreak: "break-all" }}>
        "{flag.indicator}"
      </div>
      <p style={{ fontSize: 13, color: COLORS.text, margin: "6px 0 0 0", lineHeight: 1.5 }}>{flag.explanation}</p>
      {flag.healthcare_context && (
        <p style={{ fontSize: 12, color: COLORS.accent, margin: "6px 0 0 0", lineHeight: 1.4, fontStyle: "italic" }}>
          🏥 {flag.healthcare_context}
        </p>
      )}
    </div>
  );
}

function MitreCard({ technique }) {
  const ref = MITRE_TECHNIQUES[technique.technique_id];
  return (
    <div style={{
      background: "#0c0f1a", border: `1px solid ${COLORS.borderActive}`, borderRadius: 6,
      padding: 12, marginBottom: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
        <Badge color={COLORS.critical} bg={COLORS.criticalDim}>{technique.technique_id}</Badge>
        <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textBright }}>{technique.technique_name}</span>
      </div>
      <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>
        Tactic: <span style={{ color: COLORS.accent }}>{technique.tactic}</span>
      </div>
      <p style={{ fontSize: 12, color: COLORS.text, margin: 0, lineHeight: 1.4 }}>{technique.relevance}</p>
    </div>
  );
}

function IOCSection({ iocs }) {
  if (!iocs) return null;
  const sections = [
    { key: "suspicious_domains", label: "Domains", icon: "🌐" },
    { key: "suspicious_ips", label: "IP Addresses", icon: "📡" },
    { key: "suspicious_urls", label: "URLs", icon: "🔗" },
    { key: "suspicious_attachments", label: "Attachments", icon: "📎" },
    { key: "suspicious_email_addresses", label: "Email Addresses", icon: "✉️" },
  ];
  const hasAny = sections.some(s => iocs[s.key]?.length > 0);
  if (!hasAny) return null;
  return (
    <Card>
      <SectionHeader icon="🔍" title="Indicators of Compromise (IOCs)" subtitle="Extracted artifacts for threat hunting and SIEM correlation" />
      {sections.map(s => (iocs[s.key]?.length > 0 ? (
        <div key={s.key} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4, fontWeight: 600 }}>{s.icon} {s.label}</div>
          {iocs[s.key].map((item, i) => (
            <div key={i} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.critical,
              background: "#00000044", padding: "4px 10px", borderRadius: 4, marginBottom: 3, wordBreak: "break-all",
            }}>
              {item}
            </div>
          ))}
        </div>
      ) : null))}
    </Card>
  );
}

function ActionSection({ actions }) {
  if (!actions) return null;
  const sections = [
    { key: "immediate", label: "Immediate Actions", icon: "🚨", color: COLORS.critical },
    { key: "investigation", label: "Investigation Steps", icon: "🔬", color: COLORS.high },
    { key: "containment", label: "Containment Measures", icon: "🛡️", color: COLORS.accent },
    { key: "reporting", label: "Reporting Requirements", icon: "📋", color: COLORS.clean },
  ];
  return (
    <Card>
      <SectionHeader icon="⚡" title="Recommended Response Actions" subtitle="Incident response playbook aligned to NIST SP 800-61" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        {sections.map(s => (actions[s.key]?.length > 0 ? (
          <div key={s.key} style={{ background: "#0c0f1a", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span>{s.icon}</span> {s.label}
            </div>
            {actions[s.key].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 12, color: COLORS.text, lineHeight: 1.4 }}>
                <span style={{ color: s.color, fontWeight: 700, minWidth: 16, fontFamily: "monospace" }}>{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        ) : null))}
      </div>
    </Card>
  );
}

// ─── RESULTS DISPLAY ──────────────────────────────────────────────────────────

function AnalysisResults({ data }) {
  if (!data) return null;
  const color = severityColor(data.threat_level);
  const bg = severityBg(data.threat_level);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn 0.5s ease-out" }}>
      {/* Threat Level Header */}
      <Card glow glowColor={color} style={{ borderColor: `${color}44` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: COLORS.textDim, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
              Threat Assessment
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 28, fontWeight: 800, color: color,
                fontFamily: "'JetBrains Mono', monospace",
                textShadow: `0 0 30px ${color}44`,
              }}>
                {data.threat_level}
              </span>
              {data.iran_threat_context && (
                <Badge color={COLORS.iran} bg={COLORS.iranDim} style={{ fontSize: 10 }}>
                  🇮🇷 IRAN APT CORRELATION
                </Badge>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right", minWidth: 160 }}>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 6 }}>Confidence Score</div>
            <SeverityMeter level={data.threat_level} score={data.confidence_score} />
          </div>
        </div>
        <p style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.6, margin: 0, borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
          {data.executive_summary}
        </p>
      </Card>

      {/* Iran Threat Context */}
      {data.iran_threat_context && (
        <Card glow glowColor={COLORS.iran} style={{ borderColor: `${COLORS.iran}33` }}>
          <SectionHeader icon="🇮🇷" title="Iranian APT Threat Correlation" subtitle="Alignment with active Iranian state-sponsored healthcare campaigns (March 2026)" />
          <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6, margin: 0 }}>{data.iran_threat_context}</p>
        </Card>
      )}

      {/* Sender Analysis */}
      {data.sender_analysis && (
        <Card>
          <SectionHeader icon="📧" title="Sender Analysis" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {[
              { label: "Display Name", value: data.sender_analysis.display_name },
              { label: "Email", value: data.sender_analysis.email_address },
              { label: "Domain", value: data.sender_analysis.domain, mono: true },
              { label: "Reply-To", value: data.sender_analysis.reply_to_address || "Same as sender" },
            ].map((f, i) => (
              <div key={i} style={{ background: "#0c0f1a", padding: "10px 12px", borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: COLORS.textDim, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{f.label}</div>
                <div style={{ fontSize: 12, color: COLORS.textBright, marginTop: 4, fontFamily: f.mono ? "'JetBrains Mono', monospace" : "inherit", wordBreak: "break-all" }}>{f.value || "—"}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {data.sender_analysis.domain_spoofing && <Badge color={COLORS.critical} bg={COLORS.criticalDim}>⚠️ DOMAIN SPOOFING DETECTED</Badge>}
            {data.sender_analysis.reply_to_mismatch && <Badge color={COLORS.high} bg={COLORS.highDim}>↩️ REPLY-TO MISMATCH</Badge>}
          </div>
          {data.sender_analysis.spoofing_details && (
            <p style={{ fontSize: 12, color: COLORS.text, margin: "10px 0 0 0", lineHeight: 1.4, fontStyle: "italic" }}>
              {data.sender_analysis.spoofing_details}
            </p>
          )}
        </Card>
      )}

      {/* Red Flags */}
      {data.red_flags?.length > 0 && (
        <Card>
          <SectionHeader icon="🚩" title={`Red Flags Identified (${data.red_flags.length})`} subtitle="Each indicator mapped to healthcare-specific risk context" />
          {data.red_flags.map((flag, i) => <RedFlagItem key={i} flag={flag} index={i} />)}
        </Card>
      )}

      {/* MITRE ATT&CK */}
      {data.mitre_attack_mapping?.length > 0 && (
        <Card glow glowColor={COLORS.critical}>
          <SectionHeader icon="⚔️" title="MITRE ATT&CK Mapping" subtitle="Techniques aligned to the MITRE ATT&CK Enterprise Framework v15" />
          {data.mitre_attack_mapping.map((t, i) => <MitreCard key={i} technique={t} />)}
        </Card>
      )}

      {/* URL Analysis */}
      {data.url_analysis?.length > 0 && (
        <Card>
          <SectionHeader icon="🔗" title="URL Analysis" />
          {data.url_analysis.map((u, i) => (
            <div key={i} style={{ background: "#0c0f1a", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 12, marginBottom: 8 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.critical, wordBreak: "break-all", marginBottom: 8 }}>
                {u.url}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Badge color={severityColor(u.risk_level)} bg={severityBg(u.risk_level)}>{u.risk_level}</Badge>
                {u.indicators?.map((ind, j) => (
                  <Badge key={j} color={COLORS.textDim} bg={COLORS.border}>{ind}</Badge>
                ))}
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Social Engineering Tactics */}
      {data.social_engineering_tactics?.length > 0 && (
        <Card>
          <SectionHeader icon="🧠" title="Social Engineering Tactics" />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {data.social_engineering_tactics.map((t, i) => (
              <Badge key={i} color={COLORS.high} bg={COLORS.highDim}>{t}</Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Healthcare Risks */}
      {data.healthcare_specific_risks?.length > 0 && (
        <Card>
          <SectionHeader icon="🏥" title="Healthcare-Specific Risk Factors" />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {data.healthcare_specific_risks.map((r, i) => (
              <Badge key={i} color={COLORS.iran} bg={COLORS.iranDim}>{r}</Badge>
            ))}
          </div>
        </Card>
      )}

      {/* IOCs */}
      <IOCSection iocs={data.ioc_extraction} />

      {/* Recommended Actions */}
      <ActionSection actions={data.recommended_actions} />

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "12px 0", borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 10, color: COLORS.textDim, lineHeight: 1.6 }}>
          Healthcare Phishing Analyzer v1.0 · Built by D'Anthony Carter-Marshall · CompTIA Security+ (SY0-701)
          <br />
          Powered by Claude AI · MITRE ATT&CK Enterprise v15 · CISA Healthcare Threat Intelligence
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function HealthcarePhishingAnalyzer() {
  const [emailText, setEmailText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("analyze");
  const resultRef = useRef(null);

  const analyzeEmail = async () => {
    if (!emailText.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Analyze this email for phishing indicators. Return ONLY valid JSON.\n\n---EMAIL START---\n${emailText}\n---EMAIL END---` }],
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message || "API error");
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(clean);
      setAnalysisResult(parsed);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sample) => {
    setEmailText(sample.email);
    setAnalysisResult(null);
    setError(null);
    setActiveTab("analyze");
  };

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text,
      fontFamily: "'Satoshi', 'DM Sans', -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes glow-slide { 0% { opacity: 0.3 } 100% { opacity: 0.8 } }
        @keyframes scan { 0% { transform: translateX(-100%) } 100% { transform: translateX(200%) } }
        textarea:focus { outline: none; border-color: ${COLORS.accent} !important; box-shadow: 0 0 0 2px ${COLORS.accentDim}; }
        textarea::placeholder { color: ${COLORS.textDim}; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 30% 0%, ${COLORS.accent}08 0%, transparent 60%), radial-gradient(ellipse at 70% 100%, ${COLORS.critical}06 0%, transparent 50%)`,
        }} />
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.critical}22)`,
              border: `1px solid ${COLORS.accent}33`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
            }}>
              🛡️
            </div>
            <div>
              <h1 style={{
                margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.textBright,
                fontFamily: "'Space Grotesk', 'DM Sans', sans-serif", letterSpacing: "-0.02em",
              }}>
                Healthcare Phishing Analyzer
              </h1>
              <p style={{ margin: "4px 0 0 0", fontSize: 13, color: COLORS.textDim, lineHeight: 1.4 }}>
                AI-powered email threat analysis for healthcare organizations · MITRE ATT&CK mapped · Iran APT aware
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge color={COLORS.accent} bg={COLORS.accentDim}>MITRE ATT&CK v15</Badge>
            <Badge color={COLORS.iran} bg={COLORS.iranDim}>🇮🇷 Iran Threat Intel</Badge>
            <Badge color={COLORS.critical} bg={COLORS.criticalDim}>CISA AA24-241a</Badge>
            <Badge color={COLORS.clean} bg={COLORS.cleanDim}>HIPAA Aware</Badge>
          </div>
        </div>
        <GlowBar color={COLORS.accent} />
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 20px 40px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, marginBottom: 20, background: COLORS.bgCard, borderRadius: 8, padding: 3, border: `1px solid ${COLORS.border}` }}>
          {[
            { id: "analyze", label: "📧 Analyze Email" },
            { id: "samples", label: "🧪 Test Cases" },
            { id: "about", label: "📖 About" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: "10px 16px", border: "none", borderRadius: 6, cursor: "pointer",
                fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
                background: activeTab === tab.id ? COLORS.accent + "18" : "transparent",
                color: activeTab === tab.id ? COLORS.accent : COLORS.textDim,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Analyze Tab */}
        {activeTab === "analyze" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <SectionHeader icon="📧" title="Email Input" subtitle="Paste full email headers and body for comprehensive analysis" />
              <textarea
                value={emailText}
                onChange={e => setEmailText(e.target.value)}
                placeholder={`Paste suspicious email here, including headers...\n\nFrom: sender@example.com\nTo: you@hospital.org\nSubject: Urgent action required\nDate: ...\n\n[Email body]`}
                style={{
                  width: "100%", minHeight: 220, padding: 14, borderRadius: 6,
                  background: "#080b14", border: `1px solid ${COLORS.border}`,
                  color: COLORS.textBright, fontSize: 13, lineHeight: 1.6, resize: "vertical",
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 12 }}>
                <span style={{ fontSize: 12, color: COLORS.textDim }}>
                  {emailText.length > 0 ? `${emailText.length} characters` : "Awaiting email input"}
                </span>
                <button
                  onClick={analyzeEmail}
                  disabled={loading || !emailText.trim()}
                  style={{
                    padding: "10px 28px", border: "none", borderRadius: 6, cursor: loading || !emailText.trim() ? "not-allowed" : "pointer",
                    fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                    background: loading || !emailText.trim() ? COLORS.border : `linear-gradient(135deg, ${COLORS.accent}, #00b894)`,
                    color: loading || !emailText.trim() ? COLORS.textDim : "#000",
                    transition: "all 0.2s", letterSpacing: "0.02em",
                    boxShadow: loading || !emailText.trim() ? "none" : `0 4px 20px ${COLORS.accent}44`,
                  }}
                >
                  {loading ? "Analyzing..." : "🔍 Analyze for Threats"}
                </button>
              </div>
            </Card>

            {loading && <Card><LoadingAnimation /></Card>}
            {error && (
              <Card style={{ borderColor: `${COLORS.critical}44` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>⚠️</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.critical }}>Analysis Error</div>
                    <div style={{ fontSize: 12, color: COLORS.text, marginTop: 2 }}>{error}</div>
                  </div>
                </div>
              </Card>
            )}

            <div ref={resultRef}>
              <AnalysisResults data={analysisResult} />
            </div>
          </div>
        )}

        {/* Test Cases Tab */}
        {activeTab === "samples" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Card>
              <SectionHeader icon="🧪" title="Pre-Built Test Cases" subtitle="Real-world phishing patterns targeting healthcare organizations — click to load and analyze" />
              <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5, margin: "0 0 16px 0" }}>
                These test cases replicate phishing tactics actively used against U.S. healthcare infrastructure in 2026, including Iranian APT-style lures, credential harvesting campaigns impersonating EHR vendors, insurance BEC fraud, and HR impersonation attacks. Each case is designed to demonstrate the analyzer's detection capabilities across different attack vectors.
              </p>
            </Card>
            {SAMPLE_EMAILS.map((sample, i) => (
              <Card key={i} style={{ cursor: "pointer", transition: "all 0.2s", borderColor: COLORS.border }}
                    onClick={() => loadSample(sample)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.textBright, marginBottom: 4 }}>{sample.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace" }}>
                      {sample.email.match(/Subject: (.+)/)?.[1]?.substring(0, 70) || ""}...
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: COLORS.accent, fontWeight: 600 }}>Load & Analyze →</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card glow glowColor={COLORS.accent}>
              <SectionHeader icon="🛡️" title="About This Tool" />
              <p style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.7, margin: "0 0 16px 0" }}>
                The Healthcare Phishing Analyzer is an AI-powered email threat analysis tool designed specifically for healthcare security operations. It combines real-time AI analysis with MITRE ATT&CK technique mapping and current Iranian APT threat intelligence to provide comprehensive phishing assessments tailored to the unique risks facing U.S. healthcare organizations.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
                {[
                  { icon: "⚔️", title: "MITRE ATT&CK Mapping", desc: "Every detected technique mapped to the ATT&CK Enterprise framework with healthcare-specific context" },
                  { icon: "🇮🇷", title: "Iran APT Awareness", desc: "Correlates findings with active Iranian state-sponsored campaigns targeting U.S. healthcare (Pioneer Kitten, APT42, Handala, Pay2Key)" },
                  { icon: "🏥", title: "Healthcare Context", desc: "Analysis calibrated for healthcare-specific risks including PHI exposure, EHR compromise, and HIPAA implications" },
                  { icon: "🔍", title: "IOC Extraction", desc: "Automated extraction of domains, IPs, URLs, and email addresses for SIEM correlation and threat hunting" },
                  { icon: "📋", title: "Incident Response", desc: "Actionable response playbook aligned to NIST SP 800-61 for immediate containment and investigation" },
                  { icon: "🧠", title: "AI-Powered Analysis", desc: "Leverages Claude AI for deep contextual understanding of social engineering tactics and threat actor TTPs" },
                ].map((f, i) => (
                  <div key={i} style={{ background: "#0c0f1a", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 14 }}>
                    <div style={{ fontSize: 18, marginBottom: 8 }}>{f.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textBright, marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionHeader icon="🎯" title="Current Threat Landscape" subtitle="March 2026 — Active threats to U.S. healthcare" />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { group: "Pioneer Kitten / Fox Kitten", detail: "Confirmed intrusions via VPN exploitation and spear-phishing targeting healthcare VPN and cloud access", ref: "CISA AA24-241a" },
                  { group: "Pay2Key", detail: "Ransomware deployed against U.S. healthcare org in Feb 2026; seeking affiliates with phishing skills", ref: "Beazley/Halcyon Report" },
                  { group: "Handala", detail: "Claimed Stryker medical device attack Mar 11, 2026; targeting identity systems and endpoint management", ref: "CISA March 2026" },
                  { group: "APT42", detail: "AI-enhanced spear-phishing campaigns targeting healthcare clinical, admin, and IT staff", ref: "Unit 42 / Palo Alto" },
                ].map((t, i) => (
                  <div key={i} style={{ background: COLORS.iranDim, border: `1px solid ${COLORS.iran}22`, borderRadius: 6, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.iran }}>{t.group}</span>
                      <Badge color={COLORS.textDim} bg={COLORS.border}>{t.ref}</Badge>
                    </div>
                    <p style={{ fontSize: 12, color: COLORS.text, margin: 0, lineHeight: 1.4 }}>{t.detail}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionHeader icon="👤" title="Built By" />
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12,
                  background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.iran})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800, color: "#000", fontFamily: "'JetBrains Mono', monospace",
                }}>
                  DCM
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.textBright }}>D'Anthony Carter-Marshall</div>
                  <div style={{ fontSize: 13, color: COLORS.textDim, marginTop: 2 }}>CompTIA Security+ (SY0-701) · KU Cybersecurity Certificate</div>
                  <div style={{ fontSize: 12, color: COLORS.accent, marginTop: 2 }}>Cybersecurity Analyst · SOC · Threat Detection · Incident Response</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
