import DashboardNav from '@/components/DashboardNav';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

const Configuracoes = () => {
  const [theme, setTheme] = useState('auto');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'auto';
    setTheme(saved);
  }, []);

  const applyTheme = (value: string) => {
    localStorage.setItem('theme', value);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = value === 'dark' || (value === 'auto' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
    setTheme(value);
  };

  return (
    <div className='min-h-screen flex flex-col bg-gradient-soft'>
      <DashboardNav userName='João' />
      <div className='flex-1 container mx-auto px-4 py-10 max-w-3xl'>
        <Card className='glass'>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>Preferências de tema e experiência</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <Label>Tema</Label>
              <Select value={theme} onValueChange={applyTheme}>
                <SelectTrigger className='w-[240px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='auto'>Automático</SelectItem>
                  <SelectItem value='light'>Claro</SelectItem>
                  <SelectItem value='dark'>Escuro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer loggedIn />
    </div>
  );
};

export default Configuracoes;
