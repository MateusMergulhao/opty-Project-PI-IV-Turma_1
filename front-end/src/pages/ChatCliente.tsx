import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import ChatMessage from '@/components/ChatMessage';
import DashboardNav from '@/components/DashboardNav';
import { useToast } from '@/hooks/use-toast';
import { useClientChat } from '@/hooks/useClientChat';
import { useAuth } from '@/hooks/useAuth';

const ChatCliente = () => {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage: sendChatMessage,
    isConnected,
    sessionId,
    connect
  } = useClientChat();

  // Check if supervisor is connected
  const hasSupervisor = messages.some(
    (msg) => msg.type === 'supervisor' || (msg.type === 'system' && msg.message.includes('Supervisor'))
  );

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Check if supervisor is connected
    if (!hasSupervisor) {
      toast({
        title: 'Supervisor não conectado',
        description: 'Sua mensagem será enviada, mas o supervisor ainda não se conectou. Aguarde um momento.',
        variant: 'default',
      });
    }

    sendChatMessage(message);
    setMessage('');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className='min-h-screen flex flex-col bg-gradient-subtle'>
      {/* Header */}
      <DashboardNav userName={userProfile?.name || 'Usuário'} />

      {/* Page Content */}
      <div className='flex-1 container mx-auto px-4 py-6'>
        {/* Page Header */}
        <div className='mb-6 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBackToDashboard}
              className='flex-shrink-0'
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <div>
              <h1 className='text-2xl font-bold text-foreground mb-1'>Suporte ao Cliente</h1>
              <p className='text-muted-foreground text-sm'>Converse com nossa equipe de suporte</p>
            </div>
          </div>

          {/* Connection Status Badge */}
          <Badge
            variant={isConnected ? 'default' : 'destructive'}
            className='flex items-center gap-2 flex-shrink-0'
          >
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-white animate-pulse' : 'bg-white'
            }`} />
            {isConnected ? 'Conectado' : 'Desconectado'}
          </Badge>
        </div>

        {/* Start Chat Screen - shown when not connected */}
        {!isConnected && !sessionId && (
          <div className='flex items-center justify-center' style={{ minHeight: 'calc(100vh - 300px)' }}>
            <Card className='p-8 glass max-w-md w-full text-center shadow-xl'>
              <div className='mb-6'>
                <div className='bg-gradient-primary p-4 rounded-full inline-block mb-4'>
                  <Send className='h-10 w-10 text-white' />
                </div>
                <h2 className='text-2xl font-bold mb-2'>Bem-vindo ao Suporte Opty</h2>
                <p className='text-muted-foreground'>
                  Clique no botão abaixo para iniciar uma conversa com nossa equipe de suporte
                </p>
              </div>
              <Button
                variant='gradient'
                size='lg'
                className='w-full'
                onClick={connect}
              >
                Iniciar Chat
              </Button>
            </Card>
          </div>
        )}

        {/* Chat Interface - shown when connected */}
        {(isConnected || sessionId) && (
          <div className='max-w-4xl mx-auto w-full'>
            {/* Ticket Info Card */}
            <Card className='mb-4 p-3 glass'>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div className='flex items-center gap-3'>
                <div>
                  <div className='text-xs text-muted-foreground'>Sessão</div>
                  <div className='font-semibold text-xs'>
                    {sessionId ? `#${sessionId.substring(0, 8)}...` : 'Aguardando...'}
                  </div>
                </div>
                <div className='h-6 w-px bg-border' />
                <div>
                  <div className='text-xs text-muted-foreground'>Status</div>
                  <div className='font-semibold text-sm text-primary'>Em atendimento</div>
                </div>
                <div className='h-6 w-px bg-border hidden sm:block' />
                <div className='hidden sm:block'>
                  <div className='text-xs text-muted-foreground'>Tempo de espera</div>
                  <div className='font-semibold text-sm text-accent'>0 min</div>
                </div>
              </div>
              <div className='text-xs text-muted-foreground mt-2'>
                Atendente: <span className='font-medium text-foreground'>Supervisor João</span>
              </div>
            </div>
            </Card>

            {/* Messages Area */}
            <Card className='glass flex flex-col overflow-hidden' style={{ height: 'calc(100vh - 320px)' }}>
              <ScrollArea className='flex-1 p-4 sm:p-6' ref={scrollAreaRef}>
              <div className='space-y-4'>
                {messages.length === 0 ? (
                  <div className='flex items-center justify-center h-full text-muted-foreground'>
                    Conectando ao servidor...
                  </div>
                ) : (
                  messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      type={msg.type}
                      message={msg.message}
                      time={msg.time}
                      senderName={msg.senderName}
                    />
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className='border-t border-border p-4 bg-background/50'>
              <div className='flex items-end gap-2'>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='flex-shrink-0'
                    onClick={() =>
                      toast({
                        title: 'Em breve',
                        description: 'Funcionalidade de anexo em desenvolvimento.',
                      })
                    }
                  >
                    <Paperclip className='h-5 w-5' />
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='flex-shrink-0'
                    onClick={() =>
                      toast({
                        title: 'Em breve',
                        description: 'Funcionalidade de emoji em desenvolvimento.',
                      })
                    }
                  >
                    <Smile className='h-5 w-5' />
                  </Button>
                </div>

                <div className='flex-1 flex gap-2'>
                  <Input
                    placeholder='Digite sua mensagem...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className='flex-1'
                  />
                  <Button
                    type='button'
                    variant='gradient'
                    size='icon'
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <Send className='h-5 w-5' />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatCliente;
