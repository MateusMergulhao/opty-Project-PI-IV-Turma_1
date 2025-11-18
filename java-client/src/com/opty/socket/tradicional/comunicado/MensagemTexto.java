package com.opty.socket.tradicional.comunicado;

import java.time.Instant;

/**
 * Mensagem de texto enviada entre cliente e supervisor.
 */
public class MensagemTexto extends Comunicado {

    private static final long serialVersionUID = 1L;

    private String sessionId;
    private String remetente;
    private String conteudo;
    private Instant timestamp;

    public MensagemTexto(String sessionId, String remetente, String conteudo) {
        this.sessionId = sessionId;
        this.remetente = remetente;
        this.conteudo = conteudo;
        this.timestamp = Instant.now();
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getRemetente() {
        return remetente;
    }

    public String getConteudo() {
        return conteudo;
    }

    public Instant getTimestamp() {
        return timestamp;
    }
}
