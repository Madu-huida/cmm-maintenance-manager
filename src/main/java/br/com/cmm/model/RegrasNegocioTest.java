package br.com.cmm.model;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class RegrasNegocioTest {

    // Teste 1
    @Test
    void deveCriarAtivoComStatusOnlinePorPadrao() {
        Ativo ativo = new Ativo();
        assertEquals(Ativo.StatusAtivo.ONLINE, ativo.getStatus());
    }

    // Teste 2
    @Test
    void devePermitirAlterarStatusParaOffline() {
        Ativo ativo = new Ativo();
        ativo.setStatus(Ativo.StatusAtivo.OFFLINE);
        assertEquals(Ativo.StatusAtivo.OFFLINE, ativo.getStatus());
    }

    // Teste 3
    @Test
    void deveIniciarOrdemManutencaoComStatusAberta() {
        OrdemManutencao ordem = new OrdemManutencao();
        assertEquals(OrdemManutencao.StatusOrdem.ABERTA, ordem.getStatus());
    }

    // Teste 4
    @Test
    void deveRegistrarDataDeAberturaAutomaticamente() {
        OrdemManutencao ordem = new OrdemManutencao();
        assertNotNull(ordem.getDataAbertura());
    }

    // Teste 5
    @Test
    void deveVincularAtivoAOrdem() {
        Ativo torno = new Ativo();
        torno.setNome("Torno CNC");
        
        OrdemManutencao ordem = new OrdemManutencao();
        ordem.setAtivo(torno);
        
        assertEquals("Torno CNC", ordem.getAtivo().getNome());
    }

    // Teste 6
    @Test
    void devePermitirFecharAOrdemEGravarData() {
        OrdemManutencao ordem = new OrdemManutencao();
        ordem.setStatus(OrdemManutencao.StatusOrdem.CONCLUIDA);
        ordem.setDataFechamento(LocalDateTime.now());
        
        assertEquals(OrdemManutencao.StatusOrdem.CONCLUIDA, ordem.getStatus());
        assertNotNull(ordem.getDataFechamento());
    }
}
