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
  // Indirect hint for the UV Smudge Attack
  h1: "Mom: I told you a hundred times to stop eating those oily potato chips while using your phone! You're leaving disgusting grease marks all over the glass!",
  
  // Indirect hint for the OSINT Instagram puzzle
  h2: "People use the most predictable passwords. Usually it's something they obsess over online—a pet's name, a significant year... You know, the kind of thing you'd post on a timeline when they first joined the family.",
  
  // Indirect hint for the Network puzzle
  h3: "I finally set up the new Netgear router! The login info is on a sticker on the back of the device. I took a picture of it and saved it to the photo gallery just in case we need to block anyone hogging the bandwidth."
};
