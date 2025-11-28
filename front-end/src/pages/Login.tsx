/**
 * IMPORTS
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Tag, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';


/**
 * CODE
 */
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const { toast } = useToast();
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);

      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo de volta ao Opty.',
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer login',
        description: error.message || 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer login',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 bg-gradient-subtle'>
      <div className='w-full max-w-md animate-fade-in'>
        {/* Logo */}
        <Link to='/' className='flex items-center justify-center gap-2 mb-8 group'>
          <div className='bg-gradient-primary p-2 rounded-lg shadow-md group-hover:shadow-glow transition-all duration-300'>
            <Tag className='h-6 w-6 text-white' />
          </div>
          <span className='text-2xl font-bold gradient-text'>Opty</span>
        </Link>

        <Card className='glass shadow-xl border-2'>
          <CardHeader className='text-center pb-6'>
            <CardTitle className='text-2xl font-bold'>Bem-vindo de volta</CardTitle>
            <CardDescription>Entre para continuar economizando</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Email Field */}
              <div className='space-y-2'>
                <Label htmlFor='email'>E-mail</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='seu@email.com'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className='pl-10'
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className='space-y-2'>
                <Label htmlFor='password'>Senha</Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className='pl-10 pr-10'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='remember'
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, rememberMe: checked as boolean })
                    }
                  />
                  <label
                    htmlFor='remember'
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
                  >
                    Lembrar-me
                  </label>
                </div>
                <Link
                  to='/forgot-password'
                  className='text-sm font-medium text-primary hover:underline'
                >
                  Esqueci minha senha
                </Link>
              </div>

              {/* Submit Button */}
              <Button type='submit' variant='gradient' className='w-full' size='lg' disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>

              {/* Divider */}
              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-border' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-card px-2 text-muted-foreground'>ou</span>
                </div>
              </div>

              {/* Social Login */}
              <div className='space-y-2'>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  size='lg'
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg className='h-5 w-5 mr-2' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    />
                    <path
                      fill='currentColor'
                      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    />
                    <path
                      fill='currentColor'
                      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    />
                    <path
                      fill='currentColor'
                      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    />
                  </svg>
                  Continuar com Google
                </Button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className='mt-6 text-center text-sm'>
              <span className='text-muted-foreground'>Não tem conta? </span>
              <Link to='/register' className='font-medium text-primary hover:underline'>
                Cadastre-se
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
