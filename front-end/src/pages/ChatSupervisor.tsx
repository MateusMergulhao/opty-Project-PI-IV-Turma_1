import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Tag,
  Send,
  Paperclip,
  Smile,
  Menu,
  LogOut,
  MoreVertical,
  CheckCircle,
  User,
  Mail,
  Calendar,
  MessageSquare,
  ChevronRight,
  Clock,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import ChatMessage from '@/components/ChatMessage';
import { useToast } from '@/hooks/use-toast';
import { useSupervisorChat } from '@/hooks/useSupervisorChat';
import { useSupervisorQueue } from '@/hooks/useSupervisorQueue';
import { useAuth } from '@/hooks/useAuth';

const ChatSupervisor = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Hook to manage queue of available sessions (only enabled when no active session)
  const { availableSessions, isConnected: queueConnected, acceptSession } = useSupervisorQueue({
    enabled: activeSessionId === null
  });

  // Hook to manage active chat session (only connects when sessionId is set)
  const {
    messages,
    sendMessage: sendChatMessage,
    isConnected: chatConnected,
    isPaired,
    error,
  } = useSupervisorChat({ sessionId: activeSessionId });

  // Show toast when there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Erro ao conectar',
        description: error.includes('Session not found')
          ? 'Sessão não encontrada. Verifique se o ID está correto.'
          : error,
        variant: 'destructive',
      });

      // Reset to queue view after showing error
      setTimeout(() => {
        setActiveSessionId(null);
      }, 2000);
    }
  }, [error, toast]);

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
    if (!activeSessionId) return;

    sendChatMessage(message);
    setMessage('');
  };

  const handleAcceptSession = (sessionId: string) => {
    acceptSession(sessionId);
    setActiveSessionId(sessionId);
    toast({
      title: 'Sessão aceita',
      description: `Entrando na sessão #${sessionId.substring(0, 8)}...`,
    });
  };

  const handleLeaveSession = () => {
    setActiveSessionId(null);
    setMessage('');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Logout realizado!',
        description: 'Até logo!',
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer logout',
        description: error.message || 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  // If no active session, show queue view
  if (!activeSessionId) {
    return (
      <div className='min-h-screen flex flex-col bg-gradient-subtle'>
        <header className='bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'>
          <div className='container mx-auto px-4 py-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <Link to='/' className='flex items-center gap-2 group'>
                  <div className='bg-gradient-primary p-2 rounded-lg shadow-md group-hover:shadow-glow transition-all duration-300'>
                    <Tag className='h-5 w-5 text-white' />
                  </div>
                  <span className='text-xl font-bold gradient-text'>Opty</span>
                </Link>
                <div className='h-6 w-px bg-border' />
                <h1 className='text-lg font-semibold text-foreground'>Fila de Atendimento</h1>
              </div>

              <div className='flex items-center gap-3'>
                <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  queueConnected ? 'bg-accent/10' : 'bg-destructive/10'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    queueConnected ? 'bg-accent animate-pulse' : 'bg-destructive'
                  }`} />
                  <span className={`text-sm font-medium ${
                    queueConnected ? 'text-accent' : 'text-destructive'
                  }`}>
                    {queueConnected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                <Button variant='ghost' size='icon' onClick={handleLogout}>
                  <LogOut className='h-5 w-5' />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className='flex-1 container mx-auto px-4 py-6 max-w-6xl'>
          <div className='mb-6'>
            <div className='flex items-center justify-between mb-2'>
              <h2 className='text-2xl font-bold'>Sessões Aguardando Atendimento</h2>
              <Badge variant='secondary' className='text-sm'>
                <Users className='h-3 w-3 mr-1' />
                {availableSessions.length} {availableSessions.length === 1 ? 'sessão' : 'sessões'}
              </Badge>
            </div>
            <p className='text-muted-foreground'>
              Clique em 'Atender' para entrar em uma sessão de chat com o cliente
            </p>
          </div>

          {availableSessions.length === 0 ? (
            <Card className='glass p-12 text-center'>
              <div className='flex flex-col items-center gap-4'>
                <div className='bg-muted/50 p-6 rounded-full'>
                  <MessageSquare className='h-12 w-12 text-muted-foreground' />
                </div>
                <div>
                  <h3 className='text-lg font-semibold mb-2'>Nenhuma sessão aguardando</h3>
                  <p className='text-muted-foreground'>
                    As novas sessões aparecerão aqui automaticamente quando clientes iniciarem um chat
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {availableSessions.map((session) => (
                <Card key={session.sessionId} className='glass hover:shadow-glow transition-all duration-300'>
                  <CardHeader>
                    <div className='flex items-start justify-between'>
                      <div>
                        <CardTitle className='text-base mb-1'>
                          Sessão #{session.sessionId.substring(0, 8)}
                        </CardTitle>
                        <p className='text-xs text-muted-foreground'>
                          ID: {session.sessionId}
                        </p>
                      </div>
                      <Badge variant='destructive' className='text-xs'>
                        Aguardando
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex items-center gap-2 text-sm'>
                      <Clock className='h-4 w-4 text-muted-foreground' />
                      <span className='text-muted-foreground'>Tempo de espera:</span>
                      <span className='font-medium'>
                        {session.waitingTimeMinutes}m {session.waitingTimeSeconds}s
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <Calendar className='h-4 w-4 text-muted-foreground' />
                      <span className='text-muted-foreground'>Criado:</span>
                      <span className='font-medium text-xs'>
                        {new Date(session.createdAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <Button
                      variant='gradient'
                      className='w-full'
                      onClick={() => handleAcceptSession(session.sessionId)}
                    >
                      <User className='h-4 w-4 mr-2' />
                      Atender
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Active chat view
  return (
    <div className='min-h-screen flex flex-col bg-gradient-subtle'>
      {/* Header */}
      <header className='bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link to='/' className='flex items-center gap-2 group'>
                <div className='bg-gradient-primary p-2 rounded-lg shadow-md group-hover:shadow-glow transition-all duration-300'>
                  <Tag className='h-5 w-5 text-white' />
                </div>
                <span className='text-xl font-bold gradient-text hidden sm:block'>Opty</span>
              </Link>
              <div className='h-6 w-px bg-border hidden sm:block' />
              <h1 className='text-lg font-semibold text-foreground'>Chat com Cliente</h1>
            </div>

            <div className='flex items-center gap-3'>
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full ${
                chatConnected ? 'bg-accent/10' : 'bg-destructive/10'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  chatConnected ? 'bg-accent animate-pulse' : 'bg-destructive'
                }`} />
                <span className={`text-sm font-medium ${
                  chatConnected ? 'text-accent' : 'text-destructive'
                }`}>
                  {isPaired ? 'Pareado' : chatConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <Button variant='ghost' size='icon' onClick={handleLogout}>
                <LogOut className='h-5 w-5' />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Content */}
      <div className='flex-1 container mx-auto px-4 py-6'>
        <div className='max-w-4xl mx-auto w-full'>
          {/* Session Info Card */}
          <Card className='mb-4 p-3 glass'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <div>
                  <div className='text-xs text-muted-foreground'>Sessão</div>
                  <div className='font-semibold text-xs'>
                    #{activeSessionId.substring(0, 8)}...
                  </div>
                </div>
                <div className='h-6 w-px bg-border' />
                <div>
                  <div className='text-xs text-muted-foreground'>Status</div>
                  <div className='font-semibold text-sm text-accent'>
                    {isPaired ? 'Pareado' : 'Conectando...'}
                  </div>
                </div>
              </div>
              <Button
                variant='destructive'
                size='sm'
                onClick={handleLeaveSession}
              >
                Sair da Sessão
              </Button>
            </div>
          </Card>

          {/* Messages Area */}
          <Card className='glass flex flex-col overflow-hidden' style={{ height: 'calc(100vh - 320px)' }}>
            <ScrollArea className='flex-1 p-4 sm:p-6' ref={scrollAreaRef}>
              <div className='space-y-4'>
                {messages.length === 0 ? (
                  <div className='flex items-center justify-center h-full text-muted-foreground'>
                    {isPaired ? 'Aguardando mensagens...' : 'Conectando à sessão...'}
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
                    disabled={!message.trim() || !isPaired}
                  >
                    <Send className='h-5 w-5' />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatSupervisor;
