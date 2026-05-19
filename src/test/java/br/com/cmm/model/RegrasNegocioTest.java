package br.com.cmm.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

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
    public void deveAtribuirNomeCorretamente() {
        Ativo ativo = new Ativo();
        ativo.setNome("Torno CNC");
        assertEquals("Torno CNC", ativo.getNome());
    }

    @Test
    public void deveAtribuirCategoriaCorretamente() {
        Ativo ativo = new Ativo();
        ativo.setCategoria("Mecânica");
        assertEquals("Mecânica", ativo.getCategoria());
    }

    @Test
    public void deveAtribuirLocalizacaoCorretamente() {
        Ativo ativo = new Ativo();
        ativo.setLocalizacao("Galpão A");
        assertEquals("Galpão A", ativo.getLocalizacao());
    }
}