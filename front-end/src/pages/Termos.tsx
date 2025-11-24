import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Termos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const logged = localStorage.getItem('logged-in') === 'true';
    if (logged && !location.pathname.startsWith('/dashboard')) {
      navigate('/dashboard', { replace: false });
      requestAnimationFrame(() => navigate('/dashboard/termos', { replace: true }));
    }
  }, [location.pathname, navigate]);
  return (
    <div className='min-h-screen flex flex-col bg-gradient-soft'>
      <Navbar />
      <main className='pt-20 md:pt-24 flex-1 container mx-auto px-4 py-10 max-w-5xl'>
        <Card className='glass mb-6'>
          <CardHeader>
            <CardTitle>Termos de Uso</CardTitle>
            <CardDescription>Diretrizes para uso do Opty com segurança e transparência</CardDescription>
          </CardHeader>
        </Card>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card className='glass'>
            <CardHeader>
              <CardTitle>Aceitação dos Termos</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>Ao utilizar o Opty, você concorda com estes termos e com nossas políticas associadas. Se não concordar, interrompa o uso do serviço.</p>
            </CardContent>
          </Card>

          <Card className='glass'>
            <CardHeader>
              <CardTitle>Uso do Serviço</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>O Opty oferece comparação de preços e informações de produtos. Você se compromete a usar o serviço de forma lícita e respeitosa.</p>
            </CardContent>
          </Card>

          <Card className='glass'>
            <CardHeader>
              <CardTitle>Conta e Segurança</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>Mantenha suas credenciais em sigilo. Informe-nos se notar qualquer acesso não autorizado ou atividade suspeita em sua conta.</p>
            </CardContent>
          </Card>

          <Card className='glass'>
            <CardHeader>
              <CardTitle>Propriedade Intelectual</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>Marcas, conteúdos e elementos visuais do Opty são protegidos. Não é permitido uso indevido sem autorização prévia.</p>
            </CardContent>
          </Card>

          <Card className='glass'>
            <CardHeader>
              <CardTitle>Limitação de Responsabilidade</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>Nos esforçamos pela precisão das informações, mas não garantimos disponibilidade, preços ou condições das lojas parceiras.</p>
            </CardContent>
          </Card>

          <Card className='glass'>
            <CardHeader>
              <CardTitle>Alterações e Contato</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <p>Estes termos podem mudar. Quando houver alterações importantes, comunicaremos. Em caso de dúvidas, acesse a área de contato.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Termos;