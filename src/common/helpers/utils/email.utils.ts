export function validateEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export function maskEmail(email: string) {
  const [username, domain] = email.split('@');
  const maskedUsername = username[0] + username.slice(1).replace(/./g, '*');
  const [domainName, domainExtension] = domain.split('.');
  const maskedDomain =
    domainName.slice(0, 1) + domainName.slice(1).replace(/./g, '*');

  return `${maskedUsername}@${maskedDomain}.${domainExtension}`;
}
