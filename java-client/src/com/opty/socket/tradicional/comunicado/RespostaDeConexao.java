package com.opty.socket.tradicional.comunicado;

/**
 * Resposta enviada pelo servidor ao cliente após conexão.
 */
public class RespostaDeConexao extends Comunicado {
    private static final long serialVersionUID = 1L;

    private boolean sucesso;
    private String sessionId;
    private String mensagem;

    public RespostaDeConexao(boolean sucesso, String sessionId, String mensagem) {
        this.sucesso = sucesso;
        this.sessionId = sessionId;
        this.mensagem = mensagem;
    }

    public boolean isSucesso() {
        return sucesso;
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getMensagem() {
        return mensagem;
    }
}
