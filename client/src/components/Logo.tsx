import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  theme?: 'light' | 'dark' | 'auto';
}

export function Logo({ 
  className = '', 
  size = 'md', 
  variant = 'full',
  theme = 'auto'
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Logo icon - Modern geometric design
  const LogoIcon = () => (
    <div className={`${iconSizeClasses[size]} relative flex items-center justify-center`}>
      {/* Main container with gradient background */}
      <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-500 to-red-500 rounded-xl shadow-lg relative overflow-hidden">
        {/* Inner geometric pattern */}
        <div className="absolute inset-1 bg-white/20 rounded-lg">
          {/* Letter "O" stylized */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          {/* Letter "M" stylized */}
          <div className="absolute bottom-1 left-1 right-1 h-1 bg-white rounded-full"></div>
          <div className="absolute bottom-1 left-1 w-1 h-3 bg-white rounded-full"></div>
          <div className="absolute bottom-1 right-1 w-1 h-3 bg-white rounded-full"></div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-white rounded-full"></div>
        </div>
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-xl"></div>
      </div>
    </div>
  );

  // Logo text
  const LogoText = () => (
    <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent`}>
      OptomMarket.uz
    </span>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex ${className}`}>
        <LogoIcon />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`inline-flex ${className}`}>
        <LogoText />
      </div>
    );
  }

  // Full logo (icon + text)
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <LogoIcon />
      <LogoText />
    </div>
  );
}

// Logo variations for different use cases
export function LogoHorizontal({ className = '', size = 'md' }: Omit<LogoProps, 'variant'>) {
  return <Logo variant="full" size={size} className={className} />;
}

export function LogoIcon({ className = '', size = 'md' }: Omit<LogoProps, 'variant'>) {
  return <Logo variant="icon" size={size} className={className} />;
}

export function LogoText({ className = '', size = 'md' }: Omit<LogoProps, 'variant'>) {
  return <Logo variant="text" size={size} className={className} />;
}

// Hero logo with special styling
export function HeroLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-4 ${className}`}>
      {/* Large icon with enhanced effects */}
      <div className="w-20 h-20 relative flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-500 to-red-500 rounded-2xl shadow-2xl relative overflow-hidden animate-pulse-slow">
          {/* Enhanced inner pattern */}
          <div className="absolute inset-2 bg-white/25 rounded-xl backdrop-blur-sm">
            {/* Stylized "OM" */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 border-3 border-white rounded-full"></div>
            </div>
            <div className="absolute bottom-2 left-2 right-2 h-1.5 bg-white rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-1.5 h-4 bg-white rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-1.5 h-4 bg-white rounded-full"></div>
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-1.5 h-3 bg-white rounded-full"></div>
          </div>
          {/* Multiple shine effects */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-2xl"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-white/20 via-transparent to-transparent rounded-2xl"></div>
        </div>
      </div>
      
      {/* Large text with gradient */}
      <div className="flex flex-col">
        <span className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg">
          OptomMarket
        </span>
        <span className="text-lg lg:text-xl font-medium text-blue-100 opacity-90 -mt-1">
          .uz
        </span>
      </div>
    </div>
  );
}
