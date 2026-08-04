import PiiScrubberTool from "./PiiScrubber";
import EmailSubjectLineTesterTool from "./EmailSubjectLineTester";
import AiTextDetectorTool from "./AiTextDetector";
import AiImageDetectorTool from "./AiImageDetector";
import PhishingUrlCheckerTool from "./PhishingUrlChecker";
import PasswordStrengthCheckerTool from "./PasswordStrengthChecker";
import SecurityHeadersCheckerTool from "./SecurityHeadersChecker";
import SslCertificateCheckerTool from "./SslCertificateChecker";
import DomainReputationCheckerTool from "./DomainReputationChecker";
import CookieConsentGeneratorTool from "./CookieConsentGenerator";
import GdprComplianceCheckerTool from "./GdprComplianceChecker";
import DataRetentionPolicyGeneratorTool from "./DataRetentionPolicyGenerator";
import EmailHeaderAnalyzerTool from "./EmailHeaderAnalyzer";
import EmailValidatorTool from "./EmailValidator";
import SpamWordCheckerTool from "./SpamWordChecker";
import EmailDeliverabilityCheckerTool from "./EmailDeliverabilityChecker";
import PrivacyPolicyAuditorTool from "./PrivacyPolicyAuditor";
import EmailPreviewGeneratorTool from "./EmailPreviewGenerator";
import SpamScoreCheckerTool from "./SpamScoreChecker";
import ConsentManagementGeneratorTool from "./ConsentManagementGenerator";
import BreachNotificationGeneratorTool from "./BreachNotificationGenerator";
import DataAnonymizationReportGeneratorTool from "./DataAnonymizationReportGenerator";

const PRIVACY_TOOL_REGISTRY = {
  "pii-scrubber": { component: PiiScrubberTool, props: {} },
  "email-subject-line-tester": { component: EmailSubjectLineTesterTool, props: {} },
  "ai-text-detector": { component: AiTextDetectorTool, props: {} },
  "ai-image-detector": { component: AiImageDetectorTool, props: {} },
  "phishing-url-checker": { component: PhishingUrlCheckerTool, props: {} },
  "password-strength-checker": { component: PasswordStrengthCheckerTool, props: {} },
  "security-headers-checker": { component: SecurityHeadersCheckerTool, props: {} },
  "ssl-certificate-checker": { component: SslCertificateCheckerTool, props: {} },
  "domain-reputation-checker": { component: DomainReputationCheckerTool, props: {} },
  "cookie-consent-generator": { component: CookieConsentGeneratorTool, props: {} },
  "gdpr-compliance-checker": { component: GdprComplianceCheckerTool, props: {} },
  "data-retention-policy-generator": { component: DataRetentionPolicyGeneratorTool, props: {} },
  "email-header-analyzer": { component: EmailHeaderAnalyzerTool, props: {} },
  "email-validator": { component: EmailValidatorTool, props: {} },
  "spam-word-checker": { component: SpamWordCheckerTool, props: {} },
  "email-deliverability-checker": { component: EmailDeliverabilityCheckerTool, props: {} },
  "privacy-policy-auditor": { component: PrivacyPolicyAuditorTool, props: {} },
  "email-preview-generator": { component: EmailPreviewGeneratorTool, props: {} },
  "spam-score-checker": { component: SpamScoreCheckerTool, props: {} },
  "consent-management-generator": { component: ConsentManagementGeneratorTool, props: {} },
  "breach-notification-generator": { component: BreachNotificationGeneratorTool, props: {} },
  "data-anonymization-report-generator": { component: DataAnonymizationReportGeneratorTool, props: {} },
};

interface PrivacyToolWrapperProps {
  toolId: string;
}

export default function PrivacyToolWrapper({ toolId }: PrivacyToolWrapperProps) {
  const entry = PRIVACY_TOOL_REGISTRY[toolId];
  if (!entry) return <p className="p-4 text-center text-red-500">Tool component not found.</p>;
  
  const Component = entry.component;
  return <Component {...entry.props} />;
}
