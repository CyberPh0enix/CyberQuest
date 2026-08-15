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

export const HINTS_REGISTRY = {
  // Phase 0: Lockscreen
  phase0_hint1: "Mom: I told you a hundred times to stop eating those oily potato chips while using your phone! You're leaving disgusting grease marks all over the glass!",
  phase0_hint2: "Dad: Just turn on the UV flashlight from the Control Center if you forgot the pattern, the grease marks usually glow under it.",

  // Phase 1: Wi-Fi OSINT
  phase1_hint1: "Alex: Hey, the network is acting up. Did you connect to the Wi-Fi yet?",
  phase1_hint2: "Alex: If you forgot the Wi-Fi password, I think they still use the dog's name and birth year. Check their Instagram feed.",

  // Phase 2: App Permission Trap
  phase2_hint0: "CyberPhoenix OS: Clearance Application Provisioned. Ready for execution.",
  phase2_hint1: "Alex: Nice! The Badge Generator app just unlocked on your desktop. Open it to claim your clearance.",
  phase2_hint2: "Alex: Just a heads up—never grant unnecessary permissions like Camera or Location to unverified apps. They teach that day one.",
};
