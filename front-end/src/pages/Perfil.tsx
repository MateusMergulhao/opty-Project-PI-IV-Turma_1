import { useState, useEffect } from 'react';
import { User, Camera, Smartphone, Shirt, Home, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import DashboardNav from '@/components/DashboardNav';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Perfil = () => {
  const { toast } = useToast();
  const { userProfile, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',
  });

  // Load user data when component mounts or userProfile changes
  useEffect(() => {
    if (userProfile) {
      setPersonalInfo({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        birthday: userProfile.birthday || '',
      });
    }
  }, [userProfile]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    personalizedOffers: true,
    newsletter: false,
    favoriteUpdates: true,
  });

  const categories = [
    { id: 'electronics', name: 'Eletrônicos', icon: Smartphone, selected: true },
    { id: 'fashion', name: 'Moda e Vestuário', icon: Shirt, selected: true },
    { id: 'home', name: 'Casa e Decoração', icon: Home, selected: false },
    { id: 'sports', name: 'Esportes e Fitness', icon: Dumbbell, selected: true },
  ];

  const handleSavePersonalInfo = async () => {
    try {
      setIsLoading(true);

      // Call updateUserProfile from AuthContext
      await updateUserProfile({
        name: personalInfo.name,
        phone: personalInfo.phone || undefined,
        birthday: personalInfo.birthday || undefined,
      });

      toast({
        title: 'Informações atualizadas!',
        description: 'Seus dados foram salvos com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar',
        description: error.message || 'Não foi possível atualizar suas informações.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Senha alterada!',
      description: 'Sua senha foi atualizada com sucesso.',
    });

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Preferências salvas!',
      description: 'Suas configurações de notificações foram atualizadas.',
    });
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;

    if (strength <= 1) return { strength: 'Fraca', color: 'text-destructive' };
    if (strength <= 2) return { strength: 'Média', color: 'text-yellow-500' };
    return { strength: 'Forte', color: 'text-accent' };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <DashboardNav userName={userProfile?.name || 'Usuário'} />

      <div className='flex-1 container mx-auto px-4 py-8'>
        <div className='max-w-6xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-foreground mb-2'>Meu Perfil</h1>
            <p className='text-muted-foreground'>Gerencie suas informações e preferências</p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {/* Sidebar */}
            <aside className='lg:col-span-1'>
              <Card className='glass'>
                <CardContent className='p-6 text-center'>
                  {/* Avatar */}
                  <div className='relative inline-block mb-4'>
                    <div className='w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow'>
                      <User className='h-12 w-12 text-white' />
                    </div>
                    <button className='absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-md hover:shadow-lg transition-shadow'>
                      <Camera className='h-4 w-4 text-white' />
                    </button>
                  </div>

                  <h3 className='font-semibold text-lg mb-1'>{personalInfo.name || 'Usuário'}</h3>
                  <p className='text-sm text-muted-foreground mb-3'>{personalInfo.email}</p>
                  <Badge variant='secondary' className='mb-4'>
                    {userProfile?.role === 'supervisor' ? 'Supervisor' : 'Membro'}
                  </Badge>

                  <Button variant='outline' size='sm' className='w-full'>
                    <Camera className='h-4 w-4 mr-2' />
                    Editar Foto
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className='lg:col-span-3'>
              <Tabs defaultValue='personal' className='w-full'>
                <TabsList className='grid w-full grid-cols-2 lg:grid-cols-4 mb-6'>
                  <TabsTrigger value='personal'>Informações</TabsTrigger>
                  <TabsTrigger value='preferences'>Preferências</TabsTrigger>
                  <TabsTrigger value='security'>Segurança</TabsTrigger>
                  <TabsTrigger value='notifications'>Notificações</TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value='personal'>
                  <Card className='glass'>
                    <CardHeader>
                      <CardTitle>Informações Pessoais</CardTitle>
                      <CardDescription>
                        Atualize seus dados pessoais e informações de contato
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='name'>Nome Completo</Label>
                          <Input
                            id='name'
                            value={personalInfo.name}
                            onChange={(e) =>
                              setPersonalInfo({ ...personalInfo, name: e.target.value })
                            }
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='email'>E-mail</Label>
                          <Input
                            id='email'
                            type='email'
                            value={personalInfo.email}
                            disabled
                            className='bg-muted'
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='phone'>Telefone</Label>
                          <Input
                            id='phone'
                            value={personalInfo.phone}
                            onChange={(e) =>
                              setPersonalInfo({ ...personalInfo, phone: e.target.value })
                            }
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='birthday'>Data de Nascimento</Label>
                          <Input
                            id='birthday'
                            type='date'
                            value={personalInfo.birthday}
                            onChange={(e) =>
                              setPersonalInfo({ ...personalInfo, birthday: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className='flex gap-3 pt-4'>
                        <Button
                          onClick={handleSavePersonalInfo}
                          variant='gradient'
                          disabled={isLoading}
                        >
                          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                        <Button
                          variant='ghost'
                          onClick={() => {
                            if (userProfile) {
                              setPersonalInfo({
                                name: userProfile.name || '',
                                email: userProfile.email || '',
                                phone: userProfile.phone || '',
                                birthday: userProfile.birthday || '',
                              });
                            }
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value='preferences'>
                  <Card className='glass'>
                    <CardHeader>
                      <CardTitle>Preferências de Compra</CardTitle>
                      <CardDescription>
                        Personalize sua experiência de busca e recomendações
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      {/* Categories */}
                      <div>
                        <Label className='text-base font-semibold mb-3 block'>
                          Categorias Favoritas
                        </Label>
                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              className={`p-4 rounded-lg border-2 transition-all hover-lift ${
                                cat.selected
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border bg-background'
                              }`}
                            >
                              <cat.icon
                                className={`h-6 w-6 mx-auto mb-2 ${
                                  cat.selected ? 'text-primary' : 'text-muted-foreground'
                                }`}
                              />
                              <div className='text-xs font-medium'>{cat.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <Label className='text-base font-semibold mb-3 block'>Faixa de Preço</Label>
                        <div className='p-4 rounded-lg bg-muted/50'>
                          <p className='text-sm'>R$ 500 - R$ 1.500</p>
                        </div>
                      </div>

                      <Button onClick={handleSavePersonalInfo} variant='gradient'>
                        Atualizar Preferências
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value='security'>
                  <Card className='glass'>
                    <CardHeader>
                      <CardTitle>Segurança</CardTitle>
                      <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='currentPassword'>Senha Atual</Label>
                        <Input
                          id='currentPassword'
                          type='password'
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                          }
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='newPassword'>Nova Senha</Label>
                        <Input
                          id='newPassword'
                          type='password'
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                          }
                        />
                        {passwordData.newPassword && (
                          <div className='flex items-center gap-2'>
                            <div className='flex-1 h-1.5 bg-muted rounded-full overflow-hidden'>
                              <div
                                className={`h-full transition-all duration-300 ${
                                  passwordStrength.strength === 'Fraca'
                                    ? 'w-1/3 bg-destructive'
                                    : passwordStrength.strength === 'Média'
                                    ? 'w-2/3 bg-yellow-500'
                                    : 'w-full bg-accent'
                                }`}
                              />
                            </div>
                            <span className={`text-xs font-medium ${passwordStrength.color}`}>
                              {passwordStrength.strength}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='confirmPassword'>Confirmar Nova Senha</Label>
                        <Input
                          id='confirmPassword'
                          type='password'
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                          }
                        />
                      </div>

                      <Button onClick={handleChangePassword} variant='gradient'>
                        Alterar Senha
                      </Button>

                      <div className='pt-6 border-t border-border'>
                        <p className='text-sm text-muted-foreground mb-2'>
                          Proteja ainda mais sua conta
                        </p>
                        <Button variant='outline'>Ativar Autenticação de Dois Fatores</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value='notifications'>
                  <Card className='glass'>
                    <CardHeader>
                      <CardTitle>Notificações</CardTitle>
                      <CardDescription>
                        Escolha como você quer receber atualizações do Opty
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='flex items-center justify-between p-4 rounded-lg bg-muted/50'>
                        <div className='flex-1'>
                          <Label htmlFor='priceAlerts' className='font-medium cursor-pointer'>
                            Alertas de Preço
                          </Label>
                          <p className='text-sm text-muted-foreground'>
                            Receba notificações quando o preço de produtos favoritos cair
                          </p>
                        </div>
                        <Switch
                          id='priceAlerts'
                          checked={notifications.priceAlerts}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, priceAlerts: checked })
                          }
                        />
                      </div>

                      <div className='flex items-center justify-between p-4 rounded-lg bg-muted/50'>
                        <div className='flex-1'>
                          <Label htmlFor='personalizedOffers' className='font-medium cursor-pointer'>
                            Ofertas Personalizadas
                          </Label>
                          <p className='text-sm text-muted-foreground'>
                            Receba recomendações baseadas nas suas preferências
                          </p>
                        </div>
                        <Switch
                          id='personalizedOffers'
                          checked={notifications.personalizedOffers}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, personalizedOffers: checked })
                          }
                        />
                      </div>

                      <div className='flex items-center justify-between p-4 rounded-lg bg-muted/50'>
                        <div className='flex-1'>
                          <Label htmlFor='newsletter' className='font-medium cursor-pointer'>
                            Newsletter Semanal
                          </Label>
                          <p className='text-sm text-muted-foreground'>
                            Receba um resumo das melhores ofertas da semana
                          </p>
                        </div>
                        <Switch
                          id='newsletter'
                          checked={notifications.newsletter}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, newsletter: checked })
                          }
                        />
                      </div>

                      <div className='flex items-center justify-between p-4 rounded-lg bg-muted/50'>
                        <div className='flex-1'>
                          <Label htmlFor='favoriteUpdates' className='font-medium cursor-pointer'>
                            Atualizações de Favoritos
                          </Label>
                          <p className='text-sm text-muted-foreground'>
                            Receba notificações sobre produtos que você favoritou
                          </p>
                        </div>
                        <Switch
                          id='favoriteUpdates'
                          checked={notifications.favoriteUpdates}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, favoriteUpdates: checked })
                          }
                        />
                      </div>

                      <Button onClick={handleSaveNotifications} variant='gradient' className='mt-4'>
                        Salvar Preferências
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Perfil;
