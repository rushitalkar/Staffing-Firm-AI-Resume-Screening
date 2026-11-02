import { Candidate, Requisition, Scorecard, AuditLogEntry, CalibrationSample } from '../types';

export const INITIAL_SCORECARDS: Record<string, Scorecard> = {
  'REQ-2024-801': {
    id: 'SC-801',
    requisitionId: 'REQ-2024-801',
    jobTitle: 'Senior Java Developer',
    clientName: 'FinTech Solutions Corp',
    department: 'Core Banking Engineering',
    experienceMinYears: 5,
    experienceMaxYears: 8,
    maxNoticeDays: 60,
    budgetMinLPA: 18,
    budgetMaxLPA: 24,
    primaryLocation: 'Noida',
    workMode: 'Hybrid',
    extractedAt: '2024-11-01T09:30:00Z',
    lastUpdated: '2024-11-01T10:15:00Z',
    rawJDText: `Role: Senior Java Developer (Immediate to 60 Days Notice)
Location: Noida (Hybrid, 2 days onsite)
Experience: 5 to 8 Years
Compensation: ₹18 - 24 LPA

Key Responsibilities:
- Design and develop scalable microservices architectures using Java 17+ and Spring Boot.
- Implement resilient REST APIs and asynchronous messaging using Apache Kafka or RabbitMQ.
- Ensure high performance, test-driven development (JUnit, Mockito), and CI/CD automation.
- Coordinate with product and QA teams in Agile sprints.

Must-Have Requirements:
1. 5+ years of production experience in Core Java & Spring Boot.
2. Proven track record building and deploying Microservices in distributed cloud environments.
3. Strong hands-on SQL and Hibernate/JPA database performance tuning.
4. Candidate must be based in or willing to relocate to Noida.
5. Notice period strictly <= 60 days.`,
    criteria: [
      {
        id: 'crit-1',
        name: 'Spring Boot & Microservices',
        category: 'must_have',
        targetValue: 'Expertise in Spring Boot, REST APIs, Microservices Architecture',
        weight: 5,
        description: 'Demonstrated hands-on experience designing and deploying production microservices.',
      },
      {
        id: 'crit-2',
        name: 'Core Java (JDK 11/17)',
        category: 'must_have',
        targetValue: 'Core Java, Collections, Multithreading, Streams',
        weight: 5,
        description: 'Strong foundation in concurrency, memory model, and object-oriented design.',
      },
      {
        id: 'crit-3',
        name: 'Relevant Experience (5-8 yrs)',
        category: 'experience',
        targetValue: '5.0 - 8.0 Years in enterprise software development',
        weight: 4,
        description: 'Senior engineer level experience leading modules.',
      },
      {
        id: 'crit-4',
        name: 'Notice Period (<= 60 days)',
        category: 'notice_period',
        targetValue: '<= 60 days (Immediate to 2 months)',
        weight: 4,
        description: 'Project onboarding deadline is strictly within 60 calendar days.',
      },
      {
        id: 'crit-5',
        name: 'Location: Noida / Hybrid',
        category: 'location',
        targetValue: 'Noida / Delhi NCR',
        weight: 3,
        description: 'Willingness to attend Noida office 2-3 days a week.',
      },
      {
        id: 'crit-6',
        name: 'Distributed Systems & Messaging',
        category: 'good_to_have',
        targetValue: 'Kafka / RabbitMQ / Docker / AWS',
        weight: 3,
        description: 'Experience with message queues and cloud infrastructure.',
      },
    ],
  },
  'REQ-2024-802': {
    id: 'SC-802',
    requisitionId: 'REQ-2024-802',
    jobTitle: 'KYC & AML Compliance Analyst',
    clientName: 'Standard Chartered Back-Office Operations',
    department: 'Financial Crime Compliance',
    experienceMinYears: 2,
    experienceMaxYears: 5,
    maxNoticeDays: 30,
    budgetMinLPA: 6,
    budgetMaxLPA: 9.5,
    primaryLocation: 'Noida',
    workMode: 'Onsite',
    extractedAt: '2024-11-01T11:00:00Z',
    lastUpdated: '2024-11-01T11:00:00Z',
    rawJDText: `Role: KYC & AML Compliance Analyst
Location: Noida Sector 62
Experience: 2 to 5 years
CTC: ₹6.0 - 9.5 LPA
Notice: Max 30 days (Immediate joiners preferred)

Scope:
- Conduct Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD) for institutional banking accounts.
- Screen customer profiles against global AML sanctions, PEP lists, and adverse media.
- Proficiency in advanced Excel (VLOOKUP, Pivot tables, reconciliation) and LexisNexis / World-Check.`,
    criteria: [
      {
        id: 'crit-b1',
        name: 'KYC / AML Due Diligence',
        category: 'must_have',
        targetValue: 'CDD, EDD, Sanctions screening, PEP verification',
        weight: 5,
        description: 'Direct experience in banking back-office KYC verification.',
      },
      {
        id: 'crit-b2',
        name: 'Advanced Excel & Data Reconciliation',
        category: 'must_have',
        targetValue: 'VLOOKUP, Pivot Tables, Case management reporting',
        weight: 4,
        description: 'Handling high-volume daily reporting spreadsheets.',
      },
      {
        id: 'crit-b3',
        name: 'Notice Period (<= 30 days)',
        category: 'notice_period',
        targetValue: '<= 30 days',
        weight: 5,
        description: 'Immediate replacement needed for operational shift.',
      },
    ],
  },
};

export const INITIAL_REQUISITIONS: Requisition[] = [
  {
    id: 'REQ-2024-801',
    clientName: 'FinTech Solutions Corp',
    title: 'Senior Java Developer',
    industry: 'IT Services',
    openPositions: 3,
    feePerPlacementINR: 65000,
    createdAt: '2024-11-01T09:30:00Z',
    slaDeadline: '2024-11-03T09:30:00Z', // 48 hours SLA
    status: 'Open',
    assignedRecruiter: 'Vikram Mehta (Senior IT Recruiter)',
    scorecard: INITIAL_SCORECARDS['REQ-2024-801'],
  },
  {
    id: 'REQ-2024-802',
    clientName: 'Standard Chartered Back-Office Operations',
    title: 'KYC & AML Compliance Analyst',
    industry: 'Banking & BFSI',
    openPositions: 5,
    feePerPlacementINR: 38000,
    createdAt: '2024-11-01T11:00:00Z',
    slaDeadline: '2024-11-03T11:00:00Z',
    status: 'Open',
    assignedRecruiter: 'Ananya Sharma (BFSI Lead)',
    scorecard: INITIAL_SCORECARDS['REQ-2024-802'],
  },
  {
    id: 'REQ-2024-803',
    clientName: 'Reliance Retail Logistics',
    title: 'Warehouse Operations Lead',
    industry: 'Retail & Consumer',
    openPositions: 2,
    feePerPlacementINR: 48000,
    createdAt: '2024-10-30T14:00:00Z',
    slaDeadline: '2024-11-01T14:00:00Z',
    status: 'Interviewing',
    assignedRecruiter: 'Rahul Gupta',
    scorecard: INITIAL_SCORECARDS['REQ-2024-801'], // placeholder
  },
];

export const INITIAL_CANDIDATES: Candidate[] = [
  // 1. Ritika Bansal - EXACT SAMPLE FROM PROMPT (Strong Match for Java JD)
  {
    id: 'CND-91022',
    name: 'Ritika Bansal',
    maskedName: 'Ritika B. (CND-91022)',
    email: 'ritika.bansal.dev@gmail.com',
    maskedEmail: 'r***.b***@gmail.com',
    phone: '+91 98110 44291',
    maskedPhone: '+91 98*** **291',
    currentRole: 'Senior Java Developer',
    currentCompany: 'Cognizant Technology Solutions',
    experienceYears: 6.5,
    keySkills: ['Java 17', 'Spring Boot', 'Microservices', 'REST APIs', 'Hibernate', 'Kafka', 'Docker', 'PostgreSQL'],
    noticeDays: 60,
    currentCTCLPA: 16.5,
    expectedCTCLPA: 21.0,
    location: 'Noida (Sector 125)',
    preferredLocations: ['Noida', 'Greater Noida', 'Delhi NCR'],
    sourceFileName: 'Ritika_Bansal_SeniorJava_6.5Y.pdf',
    fileType: 'pdf',
    uploadedAt: '2024-11-01T10:30:00Z',
    rawCVText: `RITIKA BANSAL
Email: ritika.bansal.dev@gmail.com | Phone: +91 98110 44291 | Noida, Uttar Pradesh
PROFESSIONAL SUMMARY:
Senior Java Developer with 6.5 years of experience architecting and implementing distributed microservices architectures for Tier-1 BFSI clients. Specialized in Core Java 17, Spring Boot, Spring Cloud, Apache Kafka, and Dockerized deployments on AWS.

PROFESSIONAL EXPERIENCE:
Cognizant Technology Solutions | Senior Java Developer (April 2021 - Present)
- Designed and delivered 14 resilient Spring Boot microservices processing over 3.2M transaction events daily.
- Integrated Apache Kafka event bus for real-time fraud alert propagation with sub-50ms latency.
- Refactored PostgreSQL and Hibernate ORM queries, achieving 42% query execution speedup across payment tables.
- Mentored a pod of 4 junior developers and established CI/CD pipeline using GitHub Actions & Docker.

Wipro Technologies | Java Developer (July 2018 - March 2021)
- Built robust RESTful APIs in Java 8 / 11 and Spring MVC for corporate lending portal.
- Implemented unit and integration test suites with JUnit 5 and Mockito, maintaining 88% test coverage.

EDUCATION & NOTICE:
- B.Tech in Computer Science, AKTU (2018)
- Notice Period: Official notice period is 60 calendar days (negotiable to 45 days with buyout).
- Current CTC: ₹16.5 LPA | Expected CTC: ₹21 LPA | Current Location: Noida Sector 125`,
    requisitionId: 'REQ-2024-801',
    pipelineStage: 'ai_screened',
    recruiterViewed: false,
    recruiterApprovedForClient: false,
    aiScore: {
      overallScore: 94,
      matchTier: 'Strong Match',
      mustHaveScore: 96,
      experienceScore: 95,
      noticeScore: 90,
      skillsScore: 95,
      blindScoringVerified: true,
      strengths: [
        '6.5 years direct experience perfectly fits the 5-8 year bracket',
        'Strong hands-on Spring Boot microservices architecting at enterprise scale',
        'Local resident in Noida Sector 125 (0 commute friction for hybrid policy)',
        'Notice period of 60 days strictly meets client requirement',
      ],
      gaps: [
        'Notice is at upper threshold of 60 days; confirm early release possibility',
      ],
      evidenceList: [
        {
          criterionId: 'crit-1',
          criterionName: 'Spring Boot & Microservices',
          matched: true,
          score: 98,
          evidenceQuote: 'Designed and delivered 14 resilient Spring Boot microservices processing over 3.2M transaction events daily.',
          sourceSection: 'Experience',
          reasoning: 'Verified production architecture experience with high daily transaction throughput.',
        },
        {
          criterionId: 'crit-2',
          criterionName: 'Core Java (JDK 11/17)',
          matched: true,
          score: 95,
          evidenceQuote: 'Specialized in Core Java 17, Spring Boot, Spring Cloud, Apache Kafka, and Dockerized deployments.',
          sourceSection: 'Summary',
          reasoning: 'Explicitly proficient in modern JDK 17 and enterprise design patterns.',
        },
        {
          criterionId: 'crit-3',
          criterionName: 'Relevant Experience (5-8 yrs)',
          matched: true,
          score: 95,
          evidenceQuote: 'Senior Java Developer with 6.5 years of experience architecting and implementing distributed microservices.',
          sourceSection: 'Summary',
          reasoning: '6.5 years falls exactly in the target window of 5-8 years.',
        },
        {
          criterionId: 'crit-4',
          criterionName: 'Notice Period (<= 60 days)',
          matched: true,
          score: 90,
          evidenceQuote: 'Official notice period is 60 calendar days (negotiable to 45 days with buyout).',
          sourceSection: 'Metadata',
          reasoning: 'Meets the 60-day maximum requirement with early buyout potential.',
        },
        {
          criterionId: 'crit-5',
          criterionName: 'Location: Noida / Hybrid',
          matched: true,
          score: 100,
          evidenceQuote: 'Current Location: Noida Sector 125 | Noida, Uttar Pradesh',
          sourceSection: 'Metadata',
          reasoning: 'Candidate already resides in Noida, eliminating relocation delays.',
        },
        {
          criterionId: 'crit-6',
          criterionName: 'Distributed Systems & Messaging',
          matched: true,
          score: 90,
          evidenceQuote: 'Integrated Apache Kafka event bus for real-time fraud alert propagation with sub-50ms latency.',
          sourceSection: 'Experience',
          reasoning: 'Hands-on Kafka messaging experience satisfies good-to-have criterion.',
        },
      ],
    },
    consentRecord: {
      hasConsent: true,
      consentSource: 'Job Board Opt-in',
      consentedAt: '2024-10-31T08:14:00Z',
      purpose: 'Hiring use only',
    },
  },

  // 2. Arjun Rawat - EXACT SAMPLE FROM PROMPT (Unfit for Java, Perfect for KYC)
  {
    id: 'CND-91047',
    name: 'Arjun Rawat',
    maskedName: 'Arjun R. (CND-91047)',
    email: 'arjun.rawat.ops@outlook.com',
    maskedEmail: 'a***.r***@outlook.com',
    phone: '+91 97188 92014',
    maskedPhone: '+91 97*** **014',
    currentRole: 'KYC Analyst',
    currentCompany: 'Genpact India',
    experienceYears: 3.0,
    keySkills: ['KYC', 'AML checks', 'Customer Due Diligence', 'LexisNexis', 'Excel Pivot Tables', 'Sanctions Screening'],
    noticeDays: 30,
    currentCTCLPA: 5.8,
    expectedCTCLPA: 7.5,
    location: 'Noida (Sector 62)',
    preferredLocations: ['Noida', 'Delhi'],
    sourceFileName: 'Arjun_Rawat_KYC_Analyst_3Y.docx',
    fileType: 'docx',
    uploadedAt: '2024-11-01T10:35:00Z',
    rawCVText: `ARJUN RAWAT
Phone: +91 97188 92014 | Email: arjun.rawat.ops@outlook.com | Noida Sector 62
SUMMARY:
Diligent AML/KYC Operations Analyst with 3 years of banking back-office experience. Proven expertise in performing CDD/EDD checks, Politically Exposed Persons (PEP) screening, and sanctions verification for corporate banking clients.

EXPERIENCE:
Genpact India | KYC Analyst (Nov 2021 - Present)
- Performed end-to-end Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD) for over 1,200 commercial banking clients.
- Screened transaction counterparties against OFAC, EU, and UN sanctions lists via LexisNexis WorldCompliance.
- Prepared daily KYC remediation trackers and MIS reports in Microsoft Excel utilizing VLOOKUP and dynamic Pivot Tables.
- Achieved 99.4% quality compliance rating in quarterly internal quality audits.

SKILLS & NOTICE:
- Skills: KYC, AML checks, World-Check, Sanctions Screening, Microsoft Excel (VLOOKUP, Pivot)
- Experience: 3.0 Years
- Notice Period: 30 Days (Serving notice period, LWD: Nov 30)
- Current CTC: 5.8 LPA | Expected: 7.5 LPA | Location: Noida Sector 62`,
    requisitionId: 'REQ-2024-801',
    pipelineStage: 'ai_screened',
    recruiterViewed: false,
    recruiterApprovedForClient: false,
    aiScore: {
      overallScore: 16,
      matchTier: 'Unfit',
      mustHaveScore: 8,
      experienceScore: 40,
      noticeScore: 100,
      skillsScore: 5,
      blindScoringVerified: true,
      strengths: [
        'Notice period is 30 days (serving notice, ready to join quickly)',
        'Local candidate residing in Noida Sector 62',
      ],
      gaps: [
        'Critical Domain Mismatch: Candidate is a Banking Back-Office KYC Analyst, not a Software Engineer',
        'Missing 100% of Core Java, Spring Boot, Microservices, and SQL requirements',
        'Total experience is 3.0 years vs. required 5-8 years',
      ],
      evidenceList: [
        {
          criterionId: 'crit-1',
          criterionName: 'Spring Boot & Microservices',
          matched: false,
          score: 0,
          evidenceQuote: 'No mention of Spring Boot, REST APIs, or Microservices in resume text.',
          sourceSection: 'Skills',
          reasoning: 'Candidate background is financial operations and AML checks.',
        },
        {
          criterionId: 'crit-2',
          criterionName: 'Core Java (JDK 11/17)',
          matched: false,
          score: 0,
          evidenceQuote: 'No technical Java programming or software engineering keywords detected.',
          sourceSection: 'Summary',
          reasoning: 'Completely lacking required software development competencies.',
        },
        {
          criterionId: 'crit-3',
          criterionName: 'Relevant Experience (5-8 yrs)',
          matched: false,
          score: 40,
          evidenceQuote: 'Diligent AML/KYC Operations Analyst with 3 years of banking back-office experience.',
          sourceSection: 'Summary',
          reasoning: 'Experience is 3.0 years, below the 5.0 year minimum, in a non-IT field.',
        },
        {
          criterionId: 'crit-4',
          criterionName: 'Notice Period (<= 60 days)',
          matched: true,
          score: 100,
          evidenceQuote: 'Notice Period: 30 Days (Serving notice period, LWD: Nov 30)',
          sourceSection: 'Metadata',
          reasoning: 'Serving 30-day notice, excellent availability.',
        },
        {
          criterionId: 'crit-5',
          criterionName: 'Location: Noida / Hybrid',
          matched: true,
          score: 100,
          evidenceQuote: 'Phone: +91 97188 92014 | Noida Sector 62',
          sourceSection: 'Metadata',
          reasoning: 'Resident of Noida.',
        },
      ],
    },
    consentRecord: {
      hasConsent: true,
      consentSource: 'Job Board Opt-in',
      consentedAt: '2024-10-29T14:20:00Z',
      purpose: 'Hiring use only',
    },
  },

  // 3. Pooja Nair - EXACT SAMPLE FROM PROMPT (Moderate Match: Java Developer, 4 yrs, 90 days notice)
  {
    id: 'CND-91088',
    name: 'Pooja Nair',
    maskedName: 'Pooja N. (CND-91088)',
    email: 'pooja.nair.codes@gmail.com',
    maskedEmail: 'p***.n***@gmail.com',
    phone: '+91 99450 18832',
    maskedPhone: '+91 99*** **832',
    currentRole: 'Java Developer',
    currentCompany: 'Infosys Limited',
    experienceYears: 4.0,
    keySkills: ['Java 8/11', 'Hibernate', 'REST APIs', 'Spring Framework', 'MySQL', 'JSP/Servlets'],
    noticeDays: 90,
    currentCTCLPA: 11.0,
    expectedCTCLPA: 16.0,
    location: 'Bengaluru (Willing to relocate)',
    preferredLocations: ['Bengaluru', 'Noida', 'Gurugram'],
    sourceFileName: 'Pooja_Nair_JavaDev_4Years.pdf',
    fileType: 'pdf',
    uploadedAt: '2024-11-01T10:40:00Z',
    rawCVText: `POOJA NAIR
Email: pooja.nair.codes@gmail.com | Phone: +91 99450 18832 | Bengaluru, Karnataka
SUMMARY:
Full-stack Java Developer with 4 years of experience delivering web applications using Java, Spring, Hibernate, and RESTful web services. Strong in object-oriented programming, relational schema design, and bug fixing.

EXPERIENCE:
Infosys Limited | Java Developer (Oct 2020 - Present)
- Developed and maintained 8+ REST APIs in Java 11 and Spring MVC for retail e-commerce client.
- Implemented object-relational mapping using Hibernate and JPA with MySQL database backends.
- Assisted in transitioning legacy monolithic modules into lightweight Spring services.
- Resolved over 120 critical JIRA defects during regression testing cycles.

SKILLS & ATTRIBUTES:
- Core Java, Hibernate, Spring MVC, REST APIs, JSON, XML, MySQL, Git, Eclipse
- Experience: 4.0 Years
- Notice Period: 90 Days official notice
- Expected CTC: ₹16 LPA | Current Location: Bengaluru (willing to relocate to Noida for right offer)`,
    requisitionId: 'REQ-2024-801',
    pipelineStage: 'ai_screened',
    recruiterViewed: false,
    recruiterApprovedForClient: false,
    aiScore: {
      overallScore: 64,
      matchTier: 'Moderate Match',
      mustHaveScore: 70,
      experienceScore: 70,
      noticeScore: 40,
      skillsScore: 72,
      blindScoringVerified: true,
      strengths: [
        'Solid foundation in Core Java, Hibernate, and REST API development',
        'Experience modernizing monolithic applications towards Spring services',
        'Competitive expected compensation (₹16 LPA, well within ₹18-24 LPA budget)',
      ],
      gaps: [
        'Experience is 4.0 years (JD minimum is 5.0 years)',
        'Notice Period is 90 days (Client requires max 60 days)',
        'Lacks production Kafka/messaging experience and Spring Boot microservices depth',
        'Currently based in Bengaluru, requires relocation to Noida',
      ],
      evidenceList: [
        {
          criterionId: 'crit-1',
          criterionName: 'Spring Boot & Microservices',
          matched: false,
          score: 60,
          evidenceQuote: 'Assisted in transitioning legacy monolithic modules into lightweight Spring services.',
          sourceSection: 'Experience',
          reasoning: 'Has Spring MVC and migration exposure, but lacks full autonomous microservices ownership.',
        },
        {
          criterionId: 'crit-2',
          criterionName: 'Core Java (JDK 11/17)',
          matched: true,
          score: 85,
          evidenceQuote: 'Full-stack Java Developer with 4 years of experience delivering web applications using Java, Spring, Hibernate.',
          sourceSection: 'Summary',
          reasoning: 'Strong core Java competence verified.',
        },
        {
          criterionId: 'crit-3',
          criterionName: 'Relevant Experience (5-8 yrs)',
          matched: false,
          score: 65,
          evidenceQuote: 'Experience: 4.0 Years | Oct 2020 - Present',
          sourceSection: 'Metadata',
          reasoning: '4.0 years is slightly under the 5-year requirement; requires client dispensation.',
        },
        {
          criterionId: 'crit-4',
          criterionName: 'Notice Period (<= 60 days)',
          matched: false,
          score: 40,
          evidenceQuote: 'Notice Period: 90 Days official notice',
          sourceSection: 'Metadata',
          reasoning: 'Exceeds the 60-day maximum requirement by 30 calendar days.',
        },
        {
          criterionId: 'crit-5',
          criterionName: 'Location: Noida / Hybrid',
          matched: false,
          score: 60,
          evidenceQuote: 'Current Location: Bengaluru (willing to relocate to Noida for right offer)',
          sourceSection: 'Metadata',
          reasoning: 'Relocation required; adds potential drop-off risk.',
        },
      ],
    },
    consentRecord: {
      hasConsent: true,
      consentSource: 'Candidate Portal',
      consentedAt: '2024-10-30T11:45:00Z',
      purpose: 'Hiring use only',
    },
  },

  // 4. Manpreet Singh - Strong Senior Java Developer (Submitted to Client)
  {
    id: 'CND-91095',
    name: 'Manpreet Singh',
    maskedName: 'Manpreet S. (CND-91095)',
    email: 'manpreet.s.cloud@gmail.com',
    maskedEmail: 'm***.s***@gmail.com',
    phone: '+91 98712 30911',
    maskedPhone: '+91 98*** **911',
    currentRole: 'Lead Java Engineer',
    currentCompany: 'Paytm Payments Bank',
    experienceYears: 7.2,
    keySkills: ['Java 17', 'Spring Boot', 'Microservices', 'Kafka', 'Redis', 'Docker', 'Kubernetes'],
    noticeDays: 45,
    currentCTCLPA: 19.5,
    expectedCTCLPA: 23.5,
    location: 'Noida (Sector 135)',
    preferredLocations: ['Noida', 'Gurugram'],
    sourceFileName: 'Manpreet_Singh_LeadJava_7Y.pdf',
    fileType: 'pdf',
    uploadedAt: '2024-11-01T09:45:00Z',
    rawCVText: `MANPREET SINGH
Phone: +91 98712 30911 | Email: manpreet.s.cloud@gmail.com | Noida Sector 135
SUMMARY:
7.2 years of backend engineering expertise building fault-tolerant fintech platforms. Deep expertise in Java 17, Spring Boot 3, Kafka high-throughput streaming, and Kubernetes.

WORK EXPERIENCE:
Paytm Payments Bank | Lead Java Engineer (2021 - Present)
- Owned core transaction settlement microservices handling ₹400M daily GMV with zero downtime.
- Engineered event-driven architecture using Apache Kafka and Redis cluster caching.
- Optimized Java JVM garbage collection flags reducing P99 latency by 28ms.

NOTICE & CTC:
- Notice Period: 45 days (serving notice, buyout approved)
- Current CTC: 19.5 LPA | Expected CTC: 23.5 LPA | Location: Noida Sector 135`,
    requisitionId: 'REQ-2024-801',
    pipelineStage: 'submitted_to_client',
    recruiterViewed: true,
    recruiterViewedAt: '2024-11-01T11:20:00Z',
    recruiterApprovedForClient: true,
    recruiterNotes: 'Exceptional candidate. Architected high-volume UPI settlement at Paytm. 45-day notice is verified with buyout approval letter.',
    aiScore: {
      overallScore: 97,
      matchTier: 'Strong Match',
      mustHaveScore: 99,
      experienceScore: 98,
      noticeScore: 98,
      skillsScore: 96,
      blindScoringVerified: true,
      strengths: [
        '7.2 years experience directly in high-volume FinTech banking systems',
        '45-day notice with confirmed buyout fits well within 60-day constraint',
        'Resident in Noida Sector 135, directly adjacent to client office',
      ],
      gaps: [],
      evidenceList: [
        {
          criterionId: 'crit-1',
          criterionName: 'Spring Boot & Microservices',
          matched: true,
          score: 100,
          evidenceQuote: 'Owned core transaction settlement microservices handling ₹400M daily GMV with zero downtime.',
          sourceSection: 'Experience',
          reasoning: 'Exceptional enterprise scale matching client tech stack.',
        },
        {
          criterionId: 'crit-4',
          criterionName: 'Notice Period (<= 60 days)',
          matched: true,
          score: 98,
          evidenceQuote: 'Notice Period: 45 days (serving notice, buyout approved)',
          sourceSection: 'Metadata',
          reasoning: '45 days is well within the 60-day threshold.',
        },
        {
          criterionId: 'crit-5',
          criterionName: 'Location: Noida / Hybrid',
          matched: true,
          score: 100,
          evidenceQuote: 'Phone: +91 98712 30911 | Noida Sector 135',
          sourceSection: 'Metadata',
          reasoning: 'Local candidate in Noida Sector 135.',
        },
      ],
    },
    consentRecord: {
      hasConsent: true,
      consentSource: 'Job Board Opt-in',
      consentedAt: '2024-10-28T09:00:00Z',
      purpose: 'Hiring use only',
    },
  },

  // 5. Divya Sharma - Client Shortlisted Candidate with proposed interview slot
  {
    id: 'CND-91104',
    name: 'Divya Sharma',
    maskedName: 'Divya S. (CND-91104)',
    email: 'divya.sharma.tech@gmail.com',
    maskedEmail: 'd***.s***@gmail.com',
    phone: '+91 98103 77120',
    maskedPhone: '+91 98*** **120',
    currentRole: 'Senior Software Engineer',
    currentCompany: 'HCL Technologies',
    experienceYears: 5.8,
    keySkills: ['Java', 'Spring Boot', 'Microservices', 'REST', 'PostgreSQL', 'AWS'],
    noticeDays: 30,
    currentCTCLPA: 15.0,
    expectedCTCLPA: 19.5,
    location: 'Noida (Sector 62)',
    preferredLocations: ['Noida'],
    sourceFileName: 'Divya_Sharma_SeniorJava_5.8Y.pdf',
    fileType: 'pdf',
    uploadedAt: '2024-10-31T15:00:00Z',
    rawCVText: `DIVYA SHARMA
Noida Sector 62 | +91 98103 77120 | divya.sharma.tech@gmail.com
SUMMARY:
5.8 years of hands-on experience designing cloud-native Java applications, Spring Boot microservices, and AWS ECS serverless components.

EXPERIENCE:
HCL Technologies | Senior Software Engineer (2020 - Present)
- Developed and tested 10+ REST microservices for an international wealth management client using Spring Boot.
- Implemented JWT token-based authentication and OAuth2 authorization gateways.
- Notice: 30 Days (Resigned, final date Nov 25) | Location: Noida`,
    requisitionId: 'REQ-2024-801',
    pipelineStage: 'client_shortlisted',
    recruiterViewed: true,
    recruiterViewedAt: '2024-11-01T09:50:00Z',
    recruiterApprovedForClient: true,
    clientFeedback: {
      status: 'interview_proposed',
      proposedSlot: {
        date: '2024-11-04',
        time: '14:30 IST',
        interviewType: 'Technical Round 1 (System Design & Core Java)',
        interviewer: 'Rakesh Verma (VP Engineering)',
      },
      submittedAt: '2024-11-01T14:30:00Z',
    },
    aiScore: {
      overallScore: 91,
      matchTier: 'Strong Match',
      mustHaveScore: 92,
      experienceScore: 94,
      noticeScore: 100,
      skillsScore: 90,
      blindScoringVerified: true,
      strengths: [
        '5.8 years experience fits 5-8 year bracket',
        'Immediate availability: 30 days serving notice',
        'Resident in Noida Sector 62',
      ],
      gaps: [],
      evidenceList: [
        {
          criterionId: 'crit-1',
          criterionName: 'Spring Boot & Microservices',
          matched: true,
          score: 92,
          evidenceQuote: 'Developed and tested 10+ REST microservices for an international wealth management client using Spring Boot.',
          sourceSection: 'Experience',
          reasoning: 'Proven Spring Boot banking microservices.',
        },
      ],
    },
    consentRecord: {
      hasConsent: true,
      consentSource: 'Direct Email Confirmation',
      consentedAt: '2024-10-31T09:00:00Z',
      purpose: 'Hiring use only',
    },
  },

  // 6. Sameer Khan - Duplicate Test Candidate (Duplicate of CND-91022 Ritika or previous upload)
  {
    id: 'CND-91118',
    name: 'Sameer Khan',
    maskedName: 'Sameer K. (CND-91118)',
    email: 'sameer.khan.dev@yahoo.com',
    maskedEmail: 's***.k***@yahoo.com',
    phone: '+91 98991 12345',
    maskedPhone: '+91 98*** **345',
    currentRole: 'Java Full Stack Engineer',
    currentCompany: 'TCS Noida',
    experienceYears: 6.0,
    keySkills: ['Java', 'Spring Boot', 'Angular', 'Oracle DB', 'Jenkins'],
    noticeDays: 60,
    currentCTCLPA: 14.5,
    expectedCTCLPA: 19.0,
    location: 'Greater Noida',
    preferredLocations: ['Noida', 'Greater Noida'],
    sourceFileName: 'Sameer_Khan_TCS_6Y.pdf',
    fileType: 'pdf',
    uploadedAt: '2024-11-01T10:55:00Z',
    rawCVText: `SAMEER KHAN
Greater Noida | +91 98991 12345 | sameer.khan.dev@yahoo.com
SUMMARY: 6.0 years experience developing web platforms using Java, Spring Boot, and Angular.
EXPERIENCE: Tata Consultancy Services (2018 - Present)
Built customer facing banking interfaces, integrated with Spring Boot APIs and Oracle databases.
Notice: 60 days | Expected CTC: 19 LPA`,
    requisitionId: 'REQ-2024-801',
    pipelineStage: 'ai_screened',
    recruiterViewed: false,
    recruiterApprovedForClient: false,
    aiScore: {
      overallScore: 82,
      matchTier: 'Strong Match',
      mustHaveScore: 84,
      experienceScore: 90,
      noticeScore: 90,
      skillsScore: 80,
      blindScoringVerified: true,
      strengths: ['6.0 years experience', 'Spring Boot experience in banking domain'],
      gaps: ['Frontend heavy profile (Angular); client needs backend microservices depth'],
      evidenceList: [
        {
          criterionId: 'crit-1',
          criterionName: 'Spring Boot & Microservices',
          matched: true,
          score: 82,
          evidenceQuote: 'Built customer facing banking interfaces, integrated with Spring Boot APIs.',
          sourceSection: 'Experience',
          reasoning: 'Meets Spring Boot criteria.',
        },
      ],
    },
    consentRecord: {
      hasConsent: true,
      consentSource: 'Job Board Opt-in',
      consentedAt: '2024-10-31T12:00:00Z',
      purpose: 'Hiring use only',
    },
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2024-11-01T09:30:12Z',
    userName: 'Vikram Mehta',
    userRole: 'recruiter',
    action: 'SCORE_GENERATED',
    candidateId: 'CND-91022',
    candidateMaskedName: 'Ritika B. (CND-91022)',
    requisitionId: 'REQ-2024-801',
    details: 'AI Scorecard run completed: Overall score 94%. Blind scoring mode enabled (demographics stripped).',
    ipAddress: '103.24.88.14 (Noida Office WiFi)',
  },
  {
    id: 'AUD-002',
    timestamp: '2024-11-01T11:20:44Z',
    userName: 'Vikram Mehta',
    userRole: 'recruiter',
    action: 'VIEW_CV',
    candidateId: 'CND-91095',
    candidateMaskedName: 'Manpreet S. (CND-91095)',
    requisitionId: 'REQ-2024-801',
    details: 'Recruiter opened full CV for verification before submission gate.',
    ipAddress: '103.24.88.14',
  },
  {
    id: 'AUD-003',
    timestamp: '2024-11-01T11:25:00Z',
    userName: 'Vikram Mehta',
    userRole: 'recruiter',
    action: 'SHORTLIST_SUBMITTED',
    candidateId: 'CND-91095',
    candidateMaskedName: 'Manpreet S. (CND-91095)',
    requisitionId: 'REQ-2024-801',
    details: 'Candidate submitted to Client Portal (FinTech Solutions Corp). Masked PII applied.',
    ipAddress: '103.24.88.14',
  },
  {
    id: 'AUD-004',
    timestamp: '2024-11-01T14:30:18Z',
    userName: 'Sarah Jenkins (VP Eng)',
    userRole: 'client',
    action: 'INTERVIEW_PROPOSED',
    candidateId: 'CND-91104',
    candidateMaskedName: 'Divya S. (CND-91104)',
    requisitionId: 'REQ-2024-801',
    details: 'Client proposed interview slot: 04-Nov 14:30 IST for Technical Round 1.',
    ipAddress: '49.205.112.9 (Client Mobile Session)',
  },
];

export const INITIAL_CALIBRATION_SAMPLES: CalibrationSample[] = [
  {
    candidateId: 'CND-91022',
    name: 'Ritika Bansal',
    role: 'Senior Java Developer',
    aiRank: 2,
    aiScore: 94,
    recruiterRank: 2,
    recruiterSubmitted: true,
    clientAccepted: true,
    alignment: 'Agreed',
    reasons: 'Perfect skill match and verified microservices evidence.',
  },
  {
    candidateId: 'CND-91095',
    name: 'Manpreet Singh',
    role: 'Lead Java Engineer',
    aiRank: 1,
    aiScore: 97,
    recruiterRank: 1,
    recruiterSubmitted: true,
    clientAccepted: true,
    alignment: 'Agreed',
    reasons: 'Fintech transaction experience directly matched client need.',
  },
  {
    candidateId: 'CND-91088',
    name: 'Pooja Nair',
    role: 'Java Developer',
    aiRank: 5,
    aiScore: 64,
    recruiterRank: 5,
    recruiterSubmitted: false,
    clientAccepted: false,
    alignment: 'Agreed',
    reasons: '90 days notice exceeded SLA requirement; recruiter held back.',
  },
  {
    candidateId: 'CND-91047',
    name: 'Arjun Rawat',
    role: 'KYC Analyst',
    aiRank: 8,
    aiScore: 16,
    recruiterRank: 8,
    recruiterSubmitted: false,
    clientAccepted: false,
    alignment: 'Agreed',
    reasons: 'Non-IT background. Recruiter redirected candidate to Banking Requisition REQ-802.',
  },
  {
    candidateId: 'CND-90812',
    name: 'Karan Mehra',
    role: 'Java Backend Dev',
    aiRank: 6,
    aiScore: 71,
    recruiterRank: 3,
    recruiterSubmitted: true,
    clientAccepted: true,
    alignment: 'Recruiter Promoted',
    reasons: 'AI docked points for 4.5 yrs exp, but recruiter confirmed candidate built client core API as contractor.',
  },
];
