import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, ArrowLeftRight, PiggyBank } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sobre = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const logged = localStorage.getItem('logged-in') === 'true';
    if (logged && !location.pathname.startsWith('/dashboard')) {
      navigate('/dashboard', { replace: false });
      requestAnimationFrame(() => navigate('/dashboard/sobre', { replace: true }));
    }
  }, [location.pathname, navigate]);
  return (
    <div className='min-h-screen flex flex-col bg-gradient-soft'>
      <Navbar />
      <main className='pt-20 md:pt-24 flex-1 container mx-auto px-4 py-10'>
        <div className='max-w-5xl mx-auto space-y-8'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-foreground mb-2'>Sobre o Opty</h1>
            <p className='text-muted-foreground'>Comparador inteligente de preços com foco em economia</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card className='glass'>
              <CardHeader>
                <CardTitle>Missão</CardTitle>
                <CardDescription>Economia simples e transparente</CardDescription>
              </CardHeader>
              <CardContent className='text-muted-foreground'>
                <p>Conectar pessoas às melhores ofertas do mercado com praticidade.</p>
              </CardContent>
            </Card>

            <Card className='glass'>
              <CardHeader>
                <CardTitle>Tecnologia</CardTitle>
                <CardDescription>IA para comparação eficiente</CardDescription>
              </CardHeader>
              <CardContent className='text-muted-foreground'>
                <p>Usamos técnicas de coleta e análise para exibir preços atualizados.</p>
              </CardContent>
            </Card>

            <Card className='glass'>
              <CardHeader>
                <CardTitle>Valores</CardTitle>
                <CardDescription>Transparência e foco no usuário</CardDescription>
              </CardHeader>
              <CardContent className='text-muted-foreground'>
                <p>Priorizamos clareza nas informações e uma experiência agradável.</p>
              </CardContent>
            </Card>
          </div>

        <Card className='glass'>
          <CardHeader>
            <CardTitle>Como Funciona</CardTitle>
            <CardDescription>Passo a passo da busca à economia</CardDescription>
          </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div>
                <div className='w-12 h-12 rounded-lg bg-gradient-primary mb-3 shadow-glow flex items-center justify-center'>
                  <Search className='h-6 w-6 text-white' />
                </div>
                <h3 className='font-semibold mb-1'>1. Busque o produto</h3>
                <p className='text-muted-foreground'>Digite o que procura e veja opções disponíveis.</p>
              </div>
              <div>
                <div className='w-12 h-12 rounded-lg bg-secondary mb-3 shadow-lg flex items-center justify-center'>
                  <ArrowLeftRight className='h-6 w-6 text-white' />
                </div>
                <h3 className='font-semibold mb-1'>2. Compare preços</h3>
                <p className='text-muted-foreground'>Analise ofertas de várias lojas lado a lado.</p>
              </div>
              <div>
                <div className='w-12 h-12 rounded-lg bg-gradient-primary mb-3 shadow-glow flex items-center justify-center'>
                  <PiggyBank className='h-6 w-6 text-white' />
                </div>
                <h3 className='font-semibold mb-1'>3. Economize</h3>
                <p className='text-muted-foreground'>Escolha a melhor oferta e pague menos.</p>
              </div>
            </CardContent>
        </Card>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card className='glass'>
            <CardHeader>
              <CardTitle>Confiabilidade</CardTitle>
              <CardDescription>Dados atualizados e fontes verificadas</CardDescription>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>Integrações com lojas confiáveis e atualização contínua das ofertas.</p>
            </CardContent>
          </Card>
          <Card className='glass'>
            <CardHeader>
              <CardTitle>Experiência</CardTitle>
              <CardDescription>Interface clara e responsiva</CardDescription>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>Design adaptado aos modos claro/escuro e navegação fluida.</p>
            </CardContent>
          </Card>
          <Card className='glass'>
            <CardHeader>
              <CardTitle>Economia</CardTitle>
              <CardDescription>Compare e pague menos</CardDescription>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>Ferramentas de alerta e comparação para garantir o melhor preço.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sobre;