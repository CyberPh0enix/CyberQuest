import React from 'react';
import { QUEST_CONFIG } from '../../config/quest';

export default function RouterSticker() {
  const routerUser = QUEST_CONFIG.router.username;
  const routerPass = atob(QUEST_CONFIG.router.passwordBase64);
  const ssid = QUEST_CONFIG.wifi.targetSSID;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" style={{ width: '100%', height: '100%', maxWidth: 600 }}>
      {/* Background Sticker */}
      <rect width="600" height="350" rx="16" fill="#fdfdfd" stroke="#d0d0d0" strokeWidth="2"/>
      
      {/* Outer Technical Border */}
      <rect x="20" y="20" width="560" height="310" rx="8" fill="none" stroke="#2a2a2a" strokeWidth="4"/>
      <rect x="18" y="18" width="564" height="314" rx="10" fill="none" stroke="#000" strokeWidth="1"/>

      {/* Logo Area */}
      <g transform="translate(40, 50)">
        <text x="0" y="24" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="900" fontSize="36" fill="#000000" letterSpacing="-1">NETGEAR</text>
        <text x="0" y="44" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="500" fontSize="14" fill="#666666">Nighthawk AC1900 Smart WiFi Router</text>
        <text x="0" y="60" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="700" fontSize="12" fill="#444444">Model: R7000</text>
      </g>

      {/* Admin Login Info (Primary Focus) */}
      <rect x="290" y="30" width="270" height="115" rx="6" fill="#f0f5fa" stroke="#0a84ff" strokeWidth="2"/>
      <g transform="translate(310, 55)">
        <text x="0" y="0" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="800" fontSize="15" fill="#0055a4">ROUTER ADMIN LOGIN</text>
        <text x="0" y="22" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="700" fontSize="13" fill="#333">URL: http://routerlogin.net</text>
        
        <text x="0" y="52" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="700" fontSize="14" fill="#333">Username:</text>
        <text x="85" y="53" fontFamily="'Courier New', Courier, monospace" fontWeight="700" fontSize="18" fill="#d90000">{routerUser}</text>
        
        <text x="0" y="80" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="700" fontSize="14" fill="#333">Password:</text>
        <text x="85" y="81" fontFamily="'Courier New', Courier, monospace" fontWeight="700" fontSize="18" fill="#d90000">{routerPass}</text>
      </g>

      <line x1="40" y1="160" x2="560" y2="160" stroke="#cccccc" strokeWidth="2" strokeDasharray="4 2"/>

      {/* Factory Default WiFi Info */}
      <g transform="translate(40, 190)">
        <text x="0" y="0" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="700" fontSize="14" fill="#555">Factory Default Settings:</text>
        <text x="0" y="25" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="700" fontSize="14" fill="#333">SSID: {ssid}_DEFAULT</text>
        <text x="0" y="45" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="700" fontSize="14" fill="#333">Network Key: netgear1234</text>
      </g>

      {/* Barcode Area (Proper SVG Rectangles) */}
      <g transform="translate(320, 180)">
        <rect x="0" y="0" width="4" height="40" fill="#000"/>
        <rect x="6" y="0" width="2" height="40" fill="#000"/>
        <rect x="12" y="0" width="8" height="40" fill="#000"/>
        <rect x="22" y="0" width="2" height="40" fill="#000"/>
        <rect x="26" y="0" width="6" height="40" fill="#000"/>
        <rect x="36" y="0" width="4" height="40" fill="#000"/>
        <rect x="42" y="0" width="2" height="40" fill="#000"/>
        <rect x="48" y="0" width="10" height="40" fill="#000"/>
        <rect x="60" y="0" width="4" height="40" fill="#000"/>
        <rect x="66" y="0" width="2" height="40" fill="#000"/>
        <rect x="74" y="0" width="6" height="40" fill="#000"/>
        <rect x="82" y="0" width="4" height="40" fill="#000"/>
        <rect x="88" y="0" width="2" height="40" fill="#000"/>
        <rect x="94" y="0" width="8" height="40" fill="#000"/>
        <rect x="106" y="0" width="2" height="40" fill="#000"/>
        <rect x="110" y="0" width="4" height="40" fill="#000"/>
        <rect x="118" y="0" width="6" height="40" fill="#000"/>
        <rect x="128" y="0" width="2" height="40" fill="#000"/>
        <rect x="132" y="0" width="8" height="40" fill="#000"/>
        <rect x="142" y="0" width="4" height="40" fill="#000"/>
        <rect x="148" y="0" width="2" height="40" fill="#000"/>
        <rect x="154" y="0" width="6" height="40" fill="#000"/>
        <rect x="164" y="0" width="2" height="40" fill="#000"/>
        <rect x="168" y="0" width="8" height="40" fill="#000"/>
        <rect x="180" y="0" width="4" height="40" fill="#000"/>
        <rect x="186" y="0" width="2" height="40" fill="#000"/>
        <rect x="190" y="0" width="6" height="40" fill="#000"/>
        <rect x="200" y="0" width="8" height="40" fill="#000"/>
        <rect x="210" y="0" width="4" height="40" fill="#000"/>
        <rect x="216" y="0" width="2" height="40" fill="#000"/>
        <rect x="220" y="0" width="6" height="40" fill="#000"/>
        <text x="115" y="55" fontFamily="'Courier New', Courier, monospace" fontWeight="700" fontSize="12" fill="#333" textAnchor="middle">S/N: 4N81938T0012C</text>
      </g>

      {/* MAC Address Barcode */}
      <g transform="translate(320, 250)">
        <rect x="0" y="0" width="6" height="30" fill="#000"/>
        <rect x="8" y="0" width="2" height="30" fill="#000"/>
        <rect x="12" y="0" width="4" height="30" fill="#000"/>
        <rect x="20" y="0" width="8" height="30" fill="#000"/>
        <rect x="32" y="0" width="2" height="30" fill="#000"/>
        <rect x="36" y="0" width="6" height="30" fill="#000"/>
        <rect x="46" y="0" width="2" height="30" fill="#000"/>
        <rect x="52" y="0" width="4" height="30" fill="#000"/>
        <rect x="60" y="0" width="8" height="30" fill="#000"/>
        <rect x="70" y="0" width="2" height="30" fill="#000"/>
        <rect x="76" y="0" width="6" height="30" fill="#000"/>
        <rect x="84" y="0" width="4" height="30" fill="#000"/>
        <rect x="92" y="0" width="2" height="30" fill="#000"/>
        <rect x="98" y="0" width="10" height="30" fill="#000"/>
        <rect x="110" y="0" width="4" height="30" fill="#000"/>
        <rect x="118" y="0" width="6" height="30" fill="#000"/>
        <rect x="126" y="0" width="2" height="30" fill="#000"/>
        <rect x="132" y="0" width="8" height="30" fill="#000"/>
        <rect x="142" y="0" width="4" height="30" fill="#000"/>
        <rect x="148" y="0" width="2" height="30" fill="#000"/>
        <text x="75" y="45" fontFamily="'Courier New', Courier, monospace" fontWeight="700" fontSize="12" fill="#333" textAnchor="middle">MAC: A1:B2:C3:D4:E5:F6</text>
      </g>

      {/* Regulatory Certifications */}
      <g transform="translate(40, 270)">
        <circle cx="20" cy="20" r="15" fill="none" stroke="#000" strokeWidth="2"/>
        <text x="20" y="25" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="14" fill="#000" textAnchor="middle">FC</text>
        
        <circle cx="60" cy="20" r="15" fill="none" stroke="#000" strokeWidth="2"/>
        <text x="60" y="25" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="14" fill="#000" textAnchor="middle">CE</text>

        <text x="95" y="25" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="10" fill="#888">RoHS Compliant. Made in Vietnam.</text>
      </g>
    </svg>
  );
}
