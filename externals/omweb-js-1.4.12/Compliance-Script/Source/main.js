goog.module('complianceVerificationClientMain');
const VerificationClient = goog.require('omid.verificationClient.VerificationClient');
const ComplianceVerificationClient = goog.require('omid.complianceVerificationScript.ComplianceVerificationClient');
new ComplianceVerificationClient(new VerificationClient(), 'iabtechlab.com-omid');
