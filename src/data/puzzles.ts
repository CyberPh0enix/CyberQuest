// Simple base64 encoding to obfuscate answers from casual source-code inspection
// Usage: atob(ENCRYPTED_ANSWERS.dogName) === "buster"

export const ENCRYPTED_ANSWERS = {
  osint: {
    petName: "YnVzdGVy", // "buster"
    birthYear: "MjAyMw==" // "2023"
  },
  network: {
    rogueMac: "MDA6MUE6MkI6M0M6NEQ6NUU=" // "00:1A:2B:3C:4D:5E"
  },
  lockPatternHash: "2,1,0,3,4,5,8,7,6"
};

export const HINTS_REGISTRY = {
  h1: "System Admin: Did you forget the passcode again? I told you not to trace an 'S' shape with your greasy fingers...",
  h2: "Look at Alex's recent posts. When did he get that dog?",
  h3: "Network anomaly detected. Look for the MAC address consuming abnormal bandwidth."
};
