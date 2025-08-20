import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './theme-provider';
import { useLanguage } from './language-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleTheme}
      className="bg-background border-border hover:bg-muted transition-all duration-300"
      data-testid="button-theme-toggle"
    >
      {theme === 'light' ? (
        <>
          <Moon className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">
            {language === 'uz' ? 'Qorong\'u rejim' : 'Темный режим'}
          </span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">
            {language === 'uz' ? 'Oq rejim' : 'Светлый режим'}
          </span>
        </>
      )}
    </Button>
  );
}