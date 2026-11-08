import React from "react";
import logoSrc from "../assets/logo.png";

/**
 * ChipperLogo
 * Renders the actual Chipper Cash logo image.
 *
 * Props:
 *   height  – height in px (width auto-scales, default 32)
 *   className – extra Tailwind/CSS classes
 */
export const ChipperLogo = ({ height = 32, className = "" }) => (
  <img
    src={logoSrc}
    alt="Chipper Cash"
    height={height}
    style={{ height, width: "auto", display: "inline-block" }}
    className={className}
    draggable={false}
  />
);

/**
 * BackArrow
 * Standard left-pointing chevron for page back-navigation.
 * Always works as a proper ← arrow — nothing to do with the logo.
 *
 * Props:
 *   size   – icon size in px (default 22)
 *   color  – stroke color (default #111111)
 */
export const BackArrow = ({ size = 28, color = "#111111" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M15 19l-7-7 7-7"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChipperLogo;
