# LinkedIn Post & Elevator Pitch — Healthcare Phishing Analyzer

---

## LinkedIn Post Template

**Copy and paste this to LinkedIn. Replace [YOUR_GITHUB_LINK] with your actual repo URL.**

---

🛡️ I work inside a hospital. I've seen firsthand what happens when cyber threats hit healthcare — and I'm done waiting for the next attack.

As a Spend Management Specialist at the University of Kansas Health System, my job is to make sure critical medical supplies reach the departments that need them without disruption. Every day, I coordinate time-sensitive procurement across hospital departments, work with external vendors and partners, and track inventory through institutional systems that must stay accurate and available. When those systems go down or a vendor gets compromised, it's not an IT inconvenience — it's a direct threat to patient care.

I've watched the supply chain pressure build in real time. Vendor communications get spoofed. Phishing emails target accounts payable and procurement staff with fake invoices designed to redirect payments. Social engineering campaigns impersonate the exact partners we rely on to keep operations running. And the threat actors behind it know something most people outside healthcare don't: hospitals can't afford downtime. That urgency — the fact that a delayed shipment of surgical supplies or a locked-out ordering system can cascade directly into patient outcomes — is exactly what makes healthcare such an attractive target.

Then the current Iran situation escalated and everything intensified:

→ Pay2Key ransomware hit a U.S. healthcare org (Feb 2026)
→ Handala claimed the Stryker medical device cyberattack (Mar 11) — disrupting orders, manufacturing, and shipments across a company that supplies hospitals nationwide
→ CISA issued emergency guidance on endpoint management hardening (Mar 18)
→ Pioneer Kitten confirmed exploiting VPN and cloud access at healthcare organizations

That Stryker attack hit close to home. When a medical device manufacturer's ordering and shipping systems go down because of a nation-state cyberattack, the impact flows directly into hospital supply chains like the one I manage every day. I understand what's at stake because I live in that operational chain.

And HIPAA isn't an abstract compliance exercise for me — it's a daily responsibility. The systems I work in contain protected health information. The vendor relationships I manage involve the exchange of sensitive data. Every procurement transaction, every inventory reconciliation, every cross-departmental handoff touches data that federal law requires us to protect. When a phishing email compromises those workflows, it's not just a security incident — it's a potential HIPAA violation with regulatory consequences, patient trust implications, and real harm to the people we serve.

I decided I wasn't going to sit in my current role, watching these attacks escalate, and do nothing with what I know. So I built a tool.

🔍 Healthcare Phishing Email Analyzer — what it does:

• AI-powered analysis of suspicious emails specifically targeting healthcare organizations
• MITRE ATT&CK technique mapping (T1566 family + execution, persistence, defense evasion)
• Iranian APT correlation (Pioneer Kitten, APT42, Handala, Pay2Key)
• Automated IOC extraction for SIEM correlation and threat hunting
• Healthcare-specific risk assessment — PHI exposure, EHR compromise, HIPAA violation, supply chain disruption, patient safety impact
• Incident response playbook aligned to NIST SP 800-61

🧪 Includes 5 test cases I built from real-world attack patterns:

1. HIPAA compliance credential harvest — exploiting the regulatory fear that every healthcare worker carries
2. Iran-linked EHR update malware lure — impersonating Epic Systems during a real threat escalation
3. Insurance vendor BEC / wire fraud — the exact kind of payment redirection attack that targets procurement and AP teams like the ones I work alongside
4. HR impersonation W-2 phishing — harvesting SSNs and banking info from hospital staff
5. M365 admin account ransomware dropper — targeting the IT infrastructure that clinical operations depend on

🏗️ Built with: Python, Claude AI, MITRE ATT&CK v15, CISA threat intelligence

This project didn't come from a textbook. It came from working inside a healthcare organization during an active threat period and recognizing that the gap between what I see operationally and what cybersecurity teams need to catch is something I can help close.

I built this because I refuse to be a bystander. I have the Security+ certification, the KU Cybersecurity Certificate, and three years of healthcare operations experience that gives me a perspective most entry-level candidates don't have. I know what a disrupted supply chain looks like from the hospital floor. I know what HIPAA compliance means when you're the one handling the data. And I know what these phishing emails are designed to exploit — because I've seen the downstream impact when they succeed.

GitHub: [YOUR_GITHUB_LINK]

If you work in healthcare security, SOC operations, or supply chain risk management — I'd welcome your feedback. And if your organization needs someone who understands both the threat landscape and the operational reality of keeping a hospital running, I'm actively seeking cybersecurity analyst and SOC analyst roles in Kansas City.

I'm not waiting for the next attack. I'm building the tools to stop it.

#cybersecurity #healthcaresecurity #SOCanalyst #phishing #MITREATTACK #CISA #threatintelligence #incidentresponse #infosec #IranCyberThreats #blueTeam #SecPlus #HIPAA #supplychain #healthcareIT

---

## Elevator Pitch (60-Second Conference Version)

**For: Tech conferences, ISSA-KC meetups, career fairs, networking events**

---

"Hi, I'm D'Anthony Carter-Marshall. I work in healthcare operations at the University of Kansas Health System, where I manage procurement and supply chain logistics for hospital departments. I'm also CompTIA Security+ certified and actively transitioning into cybersecurity.

Here's what led me to build my latest project: in my current role, I see firsthand how cyber threats impact healthcare operations. When a vendor gets compromised or a phishing email redirects a payment, it doesn't stay in the IT department — it hits the supply chain. Delayed medical supplies, disrupted vendor partnerships, and potential HIPAA violations that put patient data and patient care at risk. And with Iranian APTs actively targeting U.S. healthcare right now — Pay2Key, Handala hitting Stryker, CISA issuing emergency advisories — that threat is escalating in real time.

So I built a Healthcare Phishing Email Analyzer. It uses AI to analyze suspicious emails for healthcare-specific attack patterns, maps everything to MITRE ATT&CK, correlates with active Iranian threat campaigns, and outputs incident response guidance. It includes five test cases built from the exact phishing patterns I've seen targeting healthcare — vendor BEC, HIPAA scams, EHR impersonation, HR phishing.

I built it because I refuse to sit in a role where I can see the problem and not do something about it. I understand how a hospital operates from the inside — the supply chain pressure, the HIPAA obligations, the vendor dependencies — and I want to bring that perspective to a cybersecurity team. I'd love to connect."

---

## Extended Elevator Pitch (90-Second Technical Version)

**For: Security-focused audiences, CISO conversations, technical interviews**

---

"I'm D'Anthony Carter-Marshall — Security+ certified, KU Cybersecurity Certificate, currently working in healthcare operations at the University of Kansas Health System while transitioning into a dedicated cybersecurity role.

What sets me apart is that I'm not coming at healthcare security from the outside. I work inside a hospital system. Every day I coordinate time-sensitive procurement, manage vendor relationships, reconcile inventory in institutional systems, and handle workflows that touch protected health information. I've seen what happens operationally when supply chain communications get spoofed, when vendor payments get targeted by BEC attacks, and when system availability is threatened. HIPAA compliance isn't theoretical for me — it's a responsibility I carry in my current role.

That operational awareness is exactly why I built the Healthcare Phishing Email Analyzer. We're in an active escalation period — Iranian APTs are targeting healthcare specifically. Pay2Key deployed ransomware against a healthcare org in February. Handala disrupted Stryker's ordering and shipping operations on March 11th, and that's a supply chain I understand intimately because those disruptions flow directly into hospitals like mine. CISA has issued multiple advisories this month.

My tool takes a suspicious email — full headers and body — and performs deep AI-powered analysis. It outputs a threat severity rating, maps every finding to MITRE ATT&CK techniques across the kill chain, correlates with active Iranian campaigns, extracts IOCs for SIEM correlation, and provides a healthcare-specific incident response playbook aligned to NIST 800-61. The healthcare context is what makes it different — it assesses PHI exposure, EHR compromise risk, HIPAA implications, supply chain disruption potential, and patient safety impact.

I built five test cases from real attack patterns: credential harvesting via fake HIPAA notices, malware delivery through fake EHR patches, insurance vendor BEC targeting accounts payable — that one mirrors attacks I've seen target procurement teams directly — HR impersonation campaigns, and ransomware precursor IT alerts.

I built this because I'm not willing to watch these attacks escalate and wait for someone else to act. I have the operational healthcare knowledge, the security certifications, and the technical skills to make an impact on a cybersecurity team — and this project is proof of that."

---

## Talking Points for Interviews

Use these when asked "Tell me about a project you've built" or "Why cybersecurity?":

### 1. The Personal "Why"

"I work inside the University of Kansas Health System managing procurement and supply chain operations. I've seen firsthand how cyber threats affect healthcare — not as headlines, but as disrupted vendor partnerships, delayed medical supplies, and HIPAA compliance risks that directly impact patient care. I didn't want to sit in my role watching these attacks escalate and do nothing with the knowledge I have. That's what drove me to build this tool and that's what's driving my transition into cybersecurity."

### 2. The Problem

"Iranian APTs are actively targeting U.S. healthcare with phishing as the primary initial access vector. But the phishing emails targeting healthcare aren't generic — they impersonate EHR vendors like Epic, exploit HIPAA compliance anxiety, target insurance vendor payment flows that go through accounts payable and procurement teams like the one I work alongside, and harvest employee credentials through HR impersonation. Generic phishing tools don't account for these healthcare-specific patterns."

### 3. What I Built

"An AI-powered tool that analyzes suspicious emails for healthcare-specific phishing indicators, maps every finding to MITRE ATT&CK, correlates with active Iranian threat campaigns, extracts IOCs for SIEM integration, and provides an incident response playbook. The healthcare context layer is what makes it unique — it assesses PHI exposure, supply chain disruption risk, HIPAA violation potential, and patient safety impact."

### 4. The Technical Depth

"MITRE ATT&CK mapping across multiple tactics — Initial Access, Execution, Persistence, Defense Evasion, Reconnaissance. Automated IOC extraction for SIEM correlation. NIST SP 800-61 aligned response playbooks. Five test cases built from real-world attack patterns observed against healthcare organizations in 2026, including the Stryker supply chain disruption and Pay2Key healthcare ransomware campaign."

### 5. Why It Matters Now

"Built during the March 2026 Iranian cyber escalation. References real CISA advisories, real threat groups, and real attack patterns. The Stryker attack disrupted medical device ordering and shipping nationwide — as someone who manages hospital supply chain operations, I understand the downstream impact of that kind of disruption better than most cybersecurity candidates."

### 6. What It Shows About Me

"I don't wait for someone to hand me a task. I identified a gap — healthcare-specific phishing analysis during an active threat period — and I built a solution. I understand HIPAA not as an abstract framework but as a daily operational responsibility. I know what supply chain disruption looks like from inside a hospital. And I can bridge the gap between healthcare operations and cybersecurity in a way that makes a security team more effective at protecting the organization."

### 7. The HIPAA Angle (Use When They Ask About Compliance)

"HIPAA is central to everything I do in my current role. The systems I access contain PHI. The vendor relationships I manage involve sensitive data exchange. Every procurement transaction touches data that federal law requires us to protect. That's why phishing targeting healthcare is so dangerous — it's not just a security incident, it's a potential HIPAA violation with regulatory fines, patient trust damage, and real consequences for the people we care for. My tool assesses that HIPAA risk layer specifically because I understand it from the operational side."
