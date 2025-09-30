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

  // Logo icon - Modern 3D design with Uzbekistan colors
  const LogoIcon = () => (
    <div className={`${iconSizeClasses[size]} relative flex items-center justify-center`}>
      {/* 3D effect shadow layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-red-700 rounded-2xl transform translate-x-0.5 translate-y-0.5 opacity-40 blur-sm"></div>
      
      {/* Main container with gradient background - Uzbekistan flag colors */}
      <div className="relative w-full h-full bg-gradient-to-br from-blue-600 via-green-500 to-red-600 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
        
        {/* Inner content with glass effect */}
        <div className="absolute inset-1.5 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-xl">
          
          {/* Letter "O" - Shopping cart style */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* Outer circle */}
            <div className="w-6 h-6 border-[3px] border-white rounded-full relative shadow-lg">
              {/* Inner dot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Shopping cart handle */}
          <div className="absolute top-2 right-2 w-1.5 h-3 bg-white rounded-full shadow-md"></div>
          <div className="absolute top-2 right-1.5 w-3 h-1.5 bg-white rounded-full shadow-md"></div>
          
          {/* Bottom accent line */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full shadow-md"></div>
        </div>
        
        {/* Animated shine effect */}
        <div className="absolute -top-full left-0 w-full h-full bg-gradient-to-b from-white/40 via-white/10 to-transparent animate-shine"></div>
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-3 h-3 bg-white/20 rounded-bl-full"></div>
      </div>
    </div>
  );

  // Logo text - Modern styling
  const LogoText = () => (
    <div className="flex flex-col leading-tight">
      <span className={`${textSizeClasses[size]} font-black bg-gradient-to-r from-blue-600 via-green-600 to-red-600 bg-clip-text text-transparent tracking-tight hover:tracking-wide transition-all duration-300`}>
        OptomMarket
      </span>
      <span className={`text-xs ${size === 'lg' ? 'text-sm' : ''} ${size === 'xl' ? 'text-base' : ''} font-semibold text-gray-500 dark:text-gray-400 -mt-1`}>
        .uz
      </span>
    </div>
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

// Hero logo with special styling - text only version
export function HeroLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* Large text with gradient - No icon */}
      <div className="flex flex-col">
        <span className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg">
          OptomMarket
        </span>
        <span className="text-base md:text-lg lg:text-xl font-medium text-blue-100 opacity-90 -mt-1">
          .uz
        </span>
      </div>
    </div>
  );
}
