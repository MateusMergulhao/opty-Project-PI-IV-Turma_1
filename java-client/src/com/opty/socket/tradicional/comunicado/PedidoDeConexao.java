package com.opty.socket.tradicional.comunicado;

/**
 * Pedido enviado pelo cliente quando deseja se conectar.
 */
public class PedidoDeConexao extends Comunicado {
    private static final long serialVersionUID = 1L;

    private String sessionId;
    private String nomeCliente;

    public PedidoDeConexao(String sessionId, String nomeCliente) {
        this.sessionId = sessionId;
        this.nomeCliente = nomeCliente;
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getNomeCliente() {
        return nomeCliente;
    }
}
