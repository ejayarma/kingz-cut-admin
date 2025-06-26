/**
 * Converts Ghana phone number to E.164 format for Firebase
 * @param phoneNumber - Ghana phone number (e.g., "0241234567", "241234567", "+233241234567")
 * @returns E.164 formatted phone number (e.g., "+233241234567")
 * @throws Error if phone number is invalid
 */
export function formatGhanaPhoneToE164(phoneNumber: string): string {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    throw new Error("Phone number must be a non-empty string");
  }

  // Remove all non-digit characters
  let digits = phoneNumber.replace(/\D/g, "");

  // Handle different Ghana phone number formats
  if (digits.startsWith("233")) {
    // Already has country code (233XXXXXXXXX)
    if (digits.length === 12) {
      return `+${digits}`;
    }
  } else if (digits.startsWith("0")) {
    // Local format with leading zero (0XXXXXXXXX)
    digits = digits.substring(1); // Remove leading 0
    if (digits.length === 9) {
      return `+233${digits}`;
    }
  } else if (digits.length === 9) {
    // Local format without leading zero (XXXXXXXXX)
    return `+233${digits}`;
  }

  throw new Error(`Invalid Ghana phone number format: ${phoneNumber}`);
}

/**
 * Converts E.164 format back to Ghana local format
 * @param e164Number - E.164 formatted number (e.g., "+233241234567")
 * @returns Ghana local format (e.g., "0241234567")
 */
export function formatE164ToGhanaLocal(e164Number: string): string {
  if (!e164Number || !e164Number.startsWith("+233")) {
    throw new Error("Invalid E.164 Ghana phone number");
  }

  const localNumber = e164Number.substring(4); // Remove "+233"
  return `0${localNumber}`;
}

/**
 * Validates if a phone number is a valid Ghana number
 * @param phoneNumber - Phone number to validate
 * @returns boolean indicating if the number is valid
 */
export function isValidGhanaPhoneNumber(phoneNumber: string): boolean {
  try {
    formatGhanaPhoneToE164(phoneNumber);
    return true;
  } catch {
    return false;
  }
}

// Ghana mobile network prefixes for additional validation
const GHANA_MOBILE_PREFIXES = [
  "20",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29", // MTN
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59", // Vodafone
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39", // AirtelTigo
];

/**
 * Enhanced validation that checks Ghana mobile network prefixes
 * @param phoneNumber - Phone number to validate
 * @returns boolean indicating if the number is a valid Ghana mobile number
 */
export function isValidGhanaMobileNumber(phoneNumber: string): boolean {
  try {
    const e164 = formatGhanaPhoneToE164(phoneNumber);
    const localPart = e164.substring(4); // Remove "+233"
    const prefix = localPart.substring(0, 2);

    return GHANA_MOBILE_PREFIXES.includes(prefix);
  } catch {
    return false;
  }
}
