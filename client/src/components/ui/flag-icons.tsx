export function UzbekistanFlag({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Circular background */}
      <circle cx="12" cy="12" r="12" fill="white"/>
      
      {/* Blue stripe (top) */}
      <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12H0Z" fill="#1EB7DD"/>
      
      {/* White stripe (middle top) */}
      <rect x="0" y="7.2" width="24" height="2.4" fill="white"/>
      
      {/* Green stripe (middle bottom) */}
      <rect x="0" y="14.4" width="24" height="2.4" fill="#0BB04B"/>
      
      {/* Bottom green area */}
      <path d="M0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12H0Z" fill="#0BB04B"/>
      
      {/* Red stripes */}
      <rect x="0" y="6.8" width="24" height="0.8" fill="#CE1126"/>
      <rect x="0" y="9.6" width="24" height="0.8" fill="#CE1126"/>
      <rect x="0" y="13.6" width="24" height="0.8" fill="#CE1126"/>
      <rect x="0" y="16.4" width="24" height="0.8" fill="#CE1126"/>
      
      {/* Crescent */}
      <circle cx="7" cy="6" r="1.8" fill="white"/>
      <circle cx="7.6" cy="6" r="1.5" fill="#1EB7DD"/>
      
      {/* Stars */}
      <polygon points="11,4.5 11.2,5.1 11.8,5.1 11.3,5.5 11.5,6.1 11,5.7 10.5,6.1 10.7,5.5 10.2,5.1 10.8,5.1" fill="white"/>
      <polygon points="13.5,5 13.7,5.6 14.3,5.6 13.8,6 14,6.6 13.5,6.2 13,6.6 13.2,6 12.7,5.6 13.3,5.6" fill="white"/>
      <polygon points="15.5,6 15.7,6.6 16.3,6.6 15.8,7 16,7.6 15.5,7.2 15,7.6 15.2,7 14.7,6.6 15.3,6.6" fill="white"/>
    </svg>
  );
}

export function RussiaFlag({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Circular background */}
      <circle cx="12" cy="12" r="12" fill="white"/>
      
      {/* White stripe (top) */}
      <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12H0Z" fill="white"/>
      
      {/* Blue stripe (middle) */}
      <rect x="0" y="8" width="24" height="8" fill="#0039A6"/>
      
      {/* Red stripe (bottom) */}
      <path d="M0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12H0Z" fill="#D52B1E"/>
    </svg>
  );
}