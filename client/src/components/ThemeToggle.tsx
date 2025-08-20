import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 px-0"
          data-testid="theme-toggle-button"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Mavzuni o'zgartirish</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card text-card-foreground border-border">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={`cursor-pointer ${theme === 'light' ? 'bg-accent' : ''}`}
          data-testid="theme-light"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Yorug'</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={`cursor-pointer ${theme === 'dark' ? 'bg-accent' : ''}`}
          data-testid="theme-dark"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Qorong'u</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={`cursor-pointer ${theme === 'system' ? 'bg-accent' : ''}`}
          data-testid="theme-system"
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>Tizim</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}