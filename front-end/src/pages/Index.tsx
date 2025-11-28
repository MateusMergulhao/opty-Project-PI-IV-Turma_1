import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, MessageCircle, Wallet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Busca Inteligente com IA',
      description:
        'Nossa IA aprende suas preferências e encontra exatamente o que você precisa, economizando seu tempo e dinheiro.',
    },
    {
      icon: TrendingUp,
      title: 'Comparação em Tempo Real',
      description:
        'Compare preços de centenas de lojas instantaneamente e veja as melhores ofertas disponíveis no mercado.',
    },
    {
      icon: MessageCircle,
      title: 'Suporte ao Vivo',
      description:
        'Equipe dedicada para ajudar você 24/7 através do nosso chat inteligente e responsivo.',
    },
    {
      icon: Wallet,
      title: 'Economia Garantida',
      description:
        'Economize até 40% em suas compras online com nossa tecnologia de análise de preços.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Cadastre-se Grátis',
      description: 'Crie sua conta em menos de 1 minuto e comece a economizar agora mesmo.',
    },
    {
      number: '2',
      title: 'Conte suas Preferências',
      description: 'Nossa IA aprende o que você gosta e personaliza suas recomendações.',
    },
    {
      number: '3',
      title: 'Encontre e Economize',
      description: 'Veja comparações personalizadas e economize em todas as suas compras.',
    },
  ];

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />

      {/* Hero Section */}
      <section className='pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero'>
        <div className='container mx-auto'>
          <div className='max-w-4xl mx-auto text-center'>
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in-up'>
              Encontre os Melhores Preços com{' '}
              <span className='gradient-text'>Inteligência Artificial</span>
            </h1>
            <p className='text-lg sm:text-xl text-muted-foreground mb-8 animate-fade-in-up max-w-2xl mx-auto'>
              Opty usa IA para comparar produtos em milhares de lojas e encontrar as melhores
              ofertas para você
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up'>
              <Button size='xl' variant='gradient' asChild>
                <Link to='/register'>Começar Grátis</Link>
              </Button>
              <Button size='xl' variant='outline' asChild>
                <a href='#features'>Ver Como Funciona</a>
              </Button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto'>
              <div className='text-center'>
                <div className='text-3xl font-bold gradient-text'>1000+</div>
                <div className='text-sm text-muted-foreground mt-1'>Lojas Comparadas</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold gradient-text'>40%</div>
                <div className='text-sm text-muted-foreground mt-1'>Economia Média</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold gradient-text'>50k+</div>
                <div className='text-sm text-muted-foreground mt-1'>Usuários Ativos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 px-4 sm:px-6 lg:px-8 bg-background'>
        <div className='container mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl sm:text-4xl font-bold text-foreground mb-4'>
              Recursos que Fazem a <span className='gradient-text'>Diferença</span>
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              Tecnologia de ponta para garantir que você sempre encontre as melhores ofertas
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {features.map((feature, index) => (
              <Card
                key={index}
                className='glass hover-lift cursor-pointer border-2 border-transparent hover:border-primary/20'
              >
                <CardContent className='p-6'>
                  <div className='w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow'>
                    <feature.icon className='h-7 w-7 text-white' />
                  </div>
                  <h3 className='text-xl font-semibold text-foreground mb-2'>{feature.title}</h3>
                  <p className='text-muted-foreground leading-relaxed'>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id='about' className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-subtle'>
        <div className='container mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl sm:text-4xl font-bold text-foreground mb-4'>
              Como <span className='gradient-text'>Funciona</span>
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              Três passos simples para começar a economizar hoje mesmo
            </p>
          </div>

          <div className='max-w-4xl mx-auto'>
            <div className='relative'>
              {/* Connecting Line */}
              <div className='hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-primary -translate-y-1/2 -z-10' />

              <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
                {steps.map((step, index) => (
                  <div key={index} className='relative'>
                    <Card className='glass hover-lift border-2 border-transparent hover:border-primary/20'>
                      <CardContent className='p-6 text-center'>
                        <div className='w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow text-2xl font-bold text-white'>
                          {step.number}
                        </div>
                        <h3 className='text-xl font-semibold text-foreground mb-2'>
                          {step.title}
                        </h3>
                        <p className='text-muted-foreground'>{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id='contact' className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-primary relative overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl' />
          <div className='absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl' />
        </div>
        
        <div className='container mx-auto relative z-10'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
              Pronto para Economizar?
            </h2>
            <p className='text-lg text-white/90 mb-8'>
              Junte-se a milhares de usuários que já estão economizando com Opty
            </p>
            
            <div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
              <Button size='xl' variant='secondary' asChild className='bg-white hover:bg-white/90 text-primary'>
                <Link to='/register'>Criar Conta Grátis</Link>
              </Button>
              <Button size='xl' variant='outline' asChild className='border-white text-primary hover:bg-white/10'>
                <Link to='/login'>Já tenho conta</Link>
              </Button>
            </div>

            {/* Benefits List */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-white/90'>
              <div className='flex items-center justify-center gap-2'>
                <CheckCircle className='h-5 w-5' />
                <span className='text-sm font-medium'>100% Gratuito</span>
              </div>
              <div className='flex items-center justify-center gap-2'>
                <CheckCircle className='h-5 w-5' />
                <span className='text-sm font-medium'>Sem Cartão de Crédito</span>
              </div>
              <div className='flex items-center justify-center gap-2'>
                <CheckCircle className='h-5 w-5' />
                <span className='text-sm font-medium'>Cancele Quando Quiser</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
