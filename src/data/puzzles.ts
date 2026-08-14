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
  phase1_hint1: "Alex: Hey, the network is acting up. Did you connect to the Home_Network_5G Wi-Fi yet? We need to access the gateway.",
  phase1_hint2: "Alex: If you forgot the Wi-Fi password, I think they still use the dog's name and birth year. Check their Instagram feed.",

  // Phase 2: Router Dashboard
  phase2_hint1: "Alex: Okay, you're connected. The router is at 192.168.0.1. Open Safari and log in so we can kick the rogue device.",
  phase2_hint2: "Alex: Wait, I think Dad took a photo of the sticker on the back of the router with the admin login. Check the Photos app.",

  // Phase 3: Banning MAC
  phase3_hint1: "Alex: You're in! Check the attached devices. Find the device hogging 99% of the bandwidth.",
  phase3_hint2: "Alex: Don't just click randomly. You need to manually enter the exact MAC address of the rogue device to blacklist it.",
};
