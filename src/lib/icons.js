import { FaAndroid, FaApple, FaLinux, FaWindows } from "react-icons/fa"

// One icon per operating system; both Mac builds share the Apple logo, and
// their labels (see targets.js) tell them apart.
export const OS_ICONS = {
  windows: FaWindows,
  macos: FaApple,
  android: FaAndroid,
  ios: FaApple,
  linux: FaLinux,
}
