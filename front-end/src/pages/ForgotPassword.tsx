import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  return (
    <div className='min-h-screen flex flex-col bg-gradient-subtle'>
      <Navbar />
      <main className='pt-20 md:pt-24 flex-1 container mx-auto px-4 py-10 max-w-lg'>
        <Card className='glass'>
          <CardHeader>
            <CardTitle>Recuperar Senha</CardTitle>
            <CardDescription>Informe seu e-mail para receber instruções de recuperação</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>E-mail</Label>
              <Input id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button variant='gradient' className='w-full'>Enviar</Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;