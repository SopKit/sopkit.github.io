/**
 * SopKit Validator Utilities
 * Premium, zero-dependency validation suite for email, URL, Domain, IP, MAC, Phone, and Credit Card formats.
 * Link: https://sopkit.github.io/seotoolkit/
 */
/**
 * Validates whether the given string is a valid email address.
 * Follows RFC 5322 specification.
 */
declare function isEmail(email: string): boolean;
/**
 * Validates whether the given string is a valid URL.
 */
declare function isUrl(url: string): boolean;
/**
 * Validates whether the given string is a valid domain name.
 */
declare function isDomain(domain: string): boolean;
/**
 * Validates whether the given string is a valid IP Address (supports IPv4 and IPv6).
 */
declare function isIp(ip: string): boolean;
/**
 * Validates whether the given string is a valid MAC Address.
 */
declare function isMacAddress(mac: string): boolean;
/**
 * Validates whether the given string is a valid credit card number using Luhn Algorithm.
 */
declare function isCreditCard(cardNumber: string): boolean;

export { isCreditCard, isDomain, isEmail, isIp, isMacAddress, isUrl };
