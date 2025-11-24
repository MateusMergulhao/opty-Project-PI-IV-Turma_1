import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Search, ArrowLeftRight, PiggyBank, Shield, LineChart, Megaphone } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Cookies = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({
    functional: true,
    analytics: true,
    marketing: false,
  });
  useEffect(() => {
    const logged = localStorage.getItem('logged-in') === 'true';
    if (logged && !location.pathname.startsWith('/dashboard')) {
      navigate('/dashboard', { replace: false });
      requestAnimationFrame(() => navigate('/dashboard/cookies', { replace: true }));
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const saved = localStorage.getItem('cookie-prefs');
    if (saved) {
      try {
        setPrefs(JSON.parse(saved));
      } catch {
        setPrefs({ functional: true, analytics: true, marketing: false });
      }
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-prefs', JSON.stringify(prefs));
    const isLogged = localStorage.getItem('logged-in') === 'true';
    const target = isLogged || location.pathname.startsWith('/dashboard') ? '/dashboard' : '/';
    navigate(target, { replace: true });
  };

  const dismiss = () => {
    localStorage.setItem('cookie-consent', 'dismissed');
    const isLogged = localStorage.getItem('logged-in') === 'true';
    const target = isLogged || location.pathname.startsWith('/dashboard') ? '/dashboard' : '/';
    navigate(target, { replace: true });
  };

  return (
    <div className='min-h-screen flex flex-col bg-gradient-soft'>
      <Navbar />
      <main className='pt-20 md:pt-24 flex-1 container mx-auto px-4 py-10 max-w-5xl'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch'>
          <Card className='glass h-full'>
            <CardHeader>
              <CardTitle>Política de Cookies</CardTitle>
              <CardDescription>Como usamos cookies para oferecer uma experiência melhor</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4 text-muted-foreground'>
              <p>Cookies são pequenos arquivos salvos no seu dispositivo. Eles ajudam a lembrar suas preferências, medir desempenho e oferecer conteúdo relevante.</p>
              <div className='flex gap-2'>
                <Button variant='outline' onClick={dismiss}>Rejeitar</Button>
                <Button variant='gradient' onClick={accept}>Aceitar</Button>
              </div>
            </CardContent>
          </Card>

          <Card className='glass h-full'>
            <CardHeader>
              <CardTitle>Tipos de Cookies</CardTitle>
              <CardDescription>Necessários, funcionais, analíticos e marketing</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3 text-muted-foreground'>
              <div className='flex items-start gap-3'>
                <div className='w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow'>
                  <Shield className='h-5 w-5 text-white' />
                </div>
                <div>
                  <span className='font-medium text-foreground'>Necessários</span>
                  <p className='text-sm'>Indispensáveis para o funcionamento do site. Não podem ser desativados.</p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shadow-lg'>
                  <Search className='h-5 w-5 text-white' />
                </div>
                <div>
                  <span className='font-medium text-foreground'>Funcionais</span>
                  <p className='text-sm'>Melhoram a experiência lembrando preferências e configurações.</p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow'>
                  <LineChart className='h-5 w-5 text-white' />
                </div>
                <div>
                  <span className='font-medium text-foreground'>Analíticos</span>
                  <p className='text-sm'>Ajudam a medir desempenho e uso para aprimorar o produto.</p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shadow-lg'>
                  <Megaphone className='h-5 w-5 text-white' />
                </div>
                <div>
                  <span className='font-medium text-foreground'>Marketing</span>
                  <p className='text-sm'>Utilizados para personalização de ofertas e campanhas.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className='glass mt-6'>
          <CardHeader>
            <CardTitle>Preferências de Cookies</CardTitle>
            <CardDescription>Escolha quais categorias deseja habilitar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='flex items-center justify-between p-3 rounded-xl bg-muted/40'>
                <div>
                  <Label htmlFor='functional' className='font-medium cursor-pointer'>Funcionais</Label>
                  <p className='text-sm text-muted-foreground'>Lembram suas escolhas e aprimoram a experiência.</p>
                </div>
                <Switch id='functional' checked={prefs.functional} onCheckedChange={(v) => setPrefs({ ...prefs, functional: v })} />
              </div>
              <div className='flex items-center justify-between p-3 rounded-xl bg-muted/40'>
                <div>
                  <Label htmlFor='analytics' className='font-medium cursor-pointer'>Analíticos</Label>
                  <p className='text-sm text-muted-foreground'>Coletam estatísticas de uso para melhorias.</p>
                </div>
                <Switch id='analytics' checked={prefs.analytics} onCheckedChange={(v) => setPrefs({ ...prefs, analytics: v })} />
              </div>
              <div className='flex items-center justify-between p-3 rounded-xl bg-muted/40'>
                <div>
                  <Label htmlFor='marketing' className='font-medium cursor-pointer'>Marketing</Label>
                  <p className='text-sm text-muted-foreground'>Personalizam ofertas e recomendações.</p>
                </div>
                <Switch id='marketing' checked={prefs.marketing} onCheckedChange={(v) => setPrefs({ ...prefs, marketing: v })} />
              </div>
            </div>
            <div className='flex gap-2 pt-4'>
              <Button variant='outline' onClick={() => localStorage.setItem('cookie-prefs', JSON.stringify(prefs))}>Salvar Preferências</Button>
              <Button variant='gradient' onClick={accept}>Aceitar e Continuar</Button>
            </div>
          </CardContent>
        </Card>

        <Card className='glass mt-6'>
          <CardHeader>
            <CardTitle>Como usamos cookies no seu fluxo</CardTitle>
            <CardDescription>Relacionados aos passos de busca, comparação e economia</CardDescription>
          </CardHeader>
          <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <div className='w-12 h-12 rounded-lg bg-secondary mb-3 shadow-lg flex items-center justify-center'>
                <Search className='h-6 w-6 text-white' />
              </div>
              <h3 className='font-semibold mb-1'>Busque o produto</h3>
              <p className='text-sm text-muted-foreground'>Cookies funcionais ajudam a lembrar preferências de busca.</p>
            </div>
            <div>
              <div className='w-12 h-12 rounded-lg bg-gradient-primary mb-3 shadow-glow flex items-center justify-center'>
                <ArrowLeftRight className='h-6 w-6 text-white' />
              </div>
              <h3 className='font-semibold mb-1'>Compare preços</h3>
              <p className='text-sm text-muted-foreground'>Cookies analíticos melhoram o desempenho na comparação.</p>
            </div>
            <div>
              <div className='w-12 h-12 rounded-lg bg-secondary mb-3 shadow-lg flex items-center justify-center'>
                <PiggyBank className='h-6 w-6 text-white' />
              </div>
              <h3 className='font-semibold mb-1'>Economize</h3>
              <p className='text-sm text-muted-foreground'>Cookies de marketing personalizam ofertas para você pagar menos.</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;