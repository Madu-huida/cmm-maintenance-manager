package br.com.cmm.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class RegrasNegocioTest {

    @Test
    public void deveCriarAtivoComStatusOnlinePorPadrao() {
        Ativo ativo = new Ativo();
        assertEquals(Ativo.StatusAtivo.ONLINE, ativo.getStatus());
    }

    @Test
    public void devePermitirAlterarStatusParaOffline() {
        Ativo ativo = new Ativo();
        ativo.setStatus(Ativo.StatusAtivo.OFFLINE);
        assertEquals(Ativo.StatusAtivo.OFFLINE, ativo.getStatus());
    }

    @Test
    public void devePermitirAlterarStatusParaEmManutencao() {
        Ativo ativo = new Ativo();
        ativo.setStatus(Ativo.StatusAtivo.EM_MANUTENCAO);
        assertEquals(Ativo.StatusAtivo.EM_MANUTENCAO, ativo.getStatus());
    }

    @Test
    public void deveCriarOrdemComStatusAbertaPorPadrao() {
        OrdemManutencao ordem = new OrdemManutencao();
        assertEquals(OrdemManutencao.StatusOrdem.ABERTA, ordem.getStatus());
    }

    @Test
    public void deveSuportarStatusAguardandoPeca() {
        OrdemManutencao ordem = new OrdemManutencao();
        ordem.setStatus(OrdemManutencao.StatusOrdem.AGUARDANDO_PECA);
        assertEquals(OrdemManutencao.StatusOrdem.AGUARDANDO_PECA, ordem.getStatus());
    }
}
