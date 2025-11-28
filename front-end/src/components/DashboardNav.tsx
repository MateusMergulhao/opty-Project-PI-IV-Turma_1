/**
 * IMPORTS
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tag, Search, User, Bell, LogOut, Settings, Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";


/**
 * TYPES
 */
interface DashboardNavProps {
  onSearch?: (query: string) => void;
  userName?: string;
}


/**
 * CODE
 */

const DashboardNav = ({ onSearch, userName = "Usuário" }: DashboardNavProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
  };


  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado!",
        description: "Até logo!",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    }
  };


  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group flex-shrink-0">
            <div className="bg-gradient-primary p-2 rounded-lg shadow-md group-hover:shadow-glow transition-all duration-300">
              <Tag className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">Opty</span>
          </Link>

          {/* User Menu & Notifications - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden lg:block font-medium">{userName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/chat/cliente" className="cursor-pointer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat Suporte
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="gradient" className="w-full mt-2">
                Buscar
              </Button>
            </form>

            {/* Mobile Links */}
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/perfil" onClick={() => setIsMobileMenuOpen(false)}>
                  <User className="mr-2 h-4 w-4" />
                  Meu Perfil
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/chat/cliente" onClick={() => setIsMobileMenuOpen(false)}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat Suporte
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start relative">
                <Bell className="mr-2 h-4 w-4" />
                Notificações
                <Badge variant="destructive" className="ml-auto">
                  3
                </Badge>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default DashboardNav;
