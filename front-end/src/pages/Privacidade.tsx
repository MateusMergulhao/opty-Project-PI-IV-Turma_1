import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Privacidade = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const logged = localStorage.getItem('logged-in') === 'true';
    if (logged && !location.pathname.startsWith('/dashboard')) {
      navigate('/dashboard', { replace: false });
      requestAnimationFrame(() => navigate('/dashboard/privacidade', { replace: true }));
    }
  }, [location.pathname, navigate]);
  return (
    <div className='min-h-screen flex flex-col bg-gradient-soft'>
      <Navbar />
      <main className='pt-20 md:pt-24 flex-1 container mx-auto px-4 py-10 max-w-5xl'>
        <Card className='glass mb-6'>
          <CardHeader>
            <CardTitle>Política de Privacidade</CardTitle>
            <CardDescription>Transparência sobre coleta, uso e proteção de dados</CardDescription>
          </CardHeader>
        </Card>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card className='glass'>
            <CardHeader>
              <CardTitle>Coleta de Dados</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>Coletamos dados como nome, email e preferências para oferecer uma experiência personalizada e segura.</p>
            </CardContent>
          </Card>

          <Card className='glass'>
            <CardHeader>
              <CardTitle>Uso dos Dados</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>Utilizamos seus dados para fornecer o serviço, melhorar funcionalidades e enviar comunicações relevantes quando autorizado.</p>
            </CardContent>
          </Card>

          <Card className='glass'>
            <CardHeader>
              <CardTitle>Compartilhamento</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>Não vendemos seus dados. Compartilhamos apenas com parceiros necessários para operação, seguindo contratos e leis.</p>
            </CardContent>
          </Card>

          <Card className='glass'>
            <CardHeader>
              <CardTitle>Direitos do Titular</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>Você pode acessar, corrigir, portar ou solicitar exclusão de seus dados. Exercite seus direitos pelo canal de contato.</p>
            </CardContent>
          </Card>

          <Card className='glass'>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>Adotamos medidas técnicas e administrativas para proteger suas informações contra acesso não autorizado.</p>
            </CardContent>
          </Card>

          <Card className='glass'>
            <CardHeader>
              <CardTitle>Cookies e Preferências</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>Usamos cookies funcionais e analíticos. Você pode gerenciar suas preferências na página de Cookies.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacidade;