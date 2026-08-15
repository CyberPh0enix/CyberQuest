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
  lockPatternHash: "1,4,9,14,15,11,6,2" // Complex 4x4 Zigzag Hook
};

export const QUEST_HINTS = [
  {
    phase: 0,
    hints: [
      { id: "p0_h1", sender: "Mom", text: "Stop eating those oily chips while using the phone! You're leaving grease marks everywhere.", delay: 15 },
      { id: "p0_h2", sender: "Dad", text: "Try the UV flashlight from the Control Center if you're stuck on the pattern.", delay: 45 }
    ]
  },
  {
    phase: 1,
    hints: [
      { id: "p1_h1", sender: "Alex", text: "Are you in yet? Get on the Wi-Fi.", delay: 15 },
      { id: "p1_h2", sender: "Alex", text: "Password is probably still the dog's name and birth year. Check the gallery.", delay: 40 }
    ]
  },
  {
    phase: 2,
    hints: [
      { id: "p2_h0", sender: "System", text: "Clearance app provisioned.", delay: 2 },
      { id: "p2_h1", sender: "Alex", text: "Badge Generator is on the desktop. Generate your pass.", delay: 15 },
      { id: "p2_h2", sender: "Alex", text: "Careful with permissions. Don't grant access unless it actually needs it.", delay: 40 }
    ]
  }
];
