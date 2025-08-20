import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from './language-provider';
import { Link, useLocation } from 'wouter';
import { Search, Globe, X } from 'lucide-react';
import logoImage from '@assets/optombazar logo_1755690917356.png';

export function MobileTopNav() {
  const { language, setLanguage } = useLanguage();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-background shadow-md z-50 md:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img 
            src={logoImage} 
            alt="Optombazar.uz" 
            className="h-8 w-auto"
          />
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="p-2"
          >
            {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('uz')}>
                🇺🇿 O'zbek
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ru')}>
                🇷🇺 Русский
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Bar (Expandable) */}
      {showSearch && (
        <div className="px-4 pb-3 border-t border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder={language === 'uz' ? 'Qidiruv...' : 'Поиск...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button
              type="submit"
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-red-500 hover:to-blue-600"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </nav>
  );
}