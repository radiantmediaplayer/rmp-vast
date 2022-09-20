goog.module('validationVerificationClientMain');
const VerificationClient = goog.require('omid.verificationClient.VerificationClient');
const ValidationVerificationClient = goog.require('omid.validationVerificationScript.ValidationVerificationClient');
new ValidationVerificationClient(new VerificationClient(), 'iabtechlab.com-omid');
