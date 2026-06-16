package br.com.cmm.service;

import br.com.cmm.dto.FecharOrdemRequest;
import br.com.cmm.dto.OrdemRequest;
import br.com.cmm.exception.RegraNegocioException;
import br.com.cmm.model.Ativo;
import br.com.cmm.model.OrdemManutencao;
import br.com.cmm.model.Usuario;
import br.com.cmm.repository.AtivoRepository;
import br.com.cmm.repository.OrdemManutencaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrdemManutencaoServiceTest {

    @Mock
    private OrdemManutencaoRepository ordemRepository;

    @Mock
    private AtivoRepository ativoRepository;

    @InjectMocks
    private OrdemManutencaoService ordemService;

    private Ativo ativo;
    private Usuario solicitante;
    private Usuario tecnico;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(ordemService, "taxaHoraPadrao", 85.0);

        ativo = new Ativo();
        ativo.setId(1L);
        ativo.setNome("Compressor");
        ativo.setStatus(Ativo.StatusAtivo.ONLINE);

        solicitante = new Usuario();
        solicitante.setId(1L);
        solicitante.setNome("Ana");

        tecnico = new Usuario();
        tecnico.setId(2L);
        tecnico.setNome("Carlos");
    }

    @Test
    void deveAlterarAtivoParaOfflineAoAbrirOmCorretiva() {
        OrdemRequest request = new OrdemRequest();
        request.setDescricao("Falha no compressor");
        request.setTipo(OrdemManutencao.TipoOrdem.CORRETIVA);
        request.setAtivoId(1L);

        when(ativoRepository.findById(1L)).thenReturn(Optional.of(ativo));
        when(ativoRepository.save(any(Ativo.class))).thenAnswer(inv -> inv.getArgument(0));
        when(ordemRepository.save(any(OrdemManutencao.class))).thenAnswer(inv -> {
            OrdemManutencao ordem = inv.getArgument(0);
            ordem.setId(10L);
            return ordem;
        });

        OrdemManutencao resultado = ordemService.abrirOrdem(request, solicitante);

        assertEquals(OrdemManutencao.TipoOrdem.CORRETIVA, resultado.getTipo());
        assertEquals(Ativo.StatusAtivo.OFFLINE, ativo.getStatus());
        verify(ativoRepository).save(ativo);
    }

    @Test
    void naoDeveAlterarAtivoAoAbrirOmPreventiva() {
        OrdemRequest request = new OrdemRequest();
        request.setDescricao("Manutenção preventiva");
        request.setTipo(OrdemManutencao.TipoOrdem.PREVENTIVA);
        request.setAtivoId(1L);

        when(ativoRepository.findById(1L)).thenReturn(Optional.of(ativo));
        when(ordemRepository.save(any(OrdemManutencao.class))).thenAnswer(inv -> inv.getArgument(0));

        ordemService.abrirOrdem(request, solicitante);

        assertEquals(Ativo.StatusAtivo.ONLINE, ativo.getStatus());
        verify(ativoRepository, never()).save(any());
    }

    @Test
    void deveCalcularCustoTotalCorretamente() {
        double custo = ordemService.calcularCustoTotal(4.0, 150.0);
        assertEquals(490.0, custo);
    }

    @Test
    void deveFecharOrdemERetornarAtivoParaOnline() {
        OrdemManutencao ordem = new OrdemManutencao();
        ordem.setId(5L);
        ordem.setStatus(OrdemManutencao.StatusOrdem.EM_ATENDIMENTO);
        ordem.setTipo(OrdemManutencao.TipoOrdem.CORRETIVA);
        ordem.setAtivo(ativo);
        ativo.setStatus(Ativo.StatusAtivo.EM_MANUTENCAO);

        FecharOrdemRequest request = new FecharOrdemRequest();
        request.setLaudoTecnico("Substituída válvula de pressão");
        request.setHorasTrabalhadas(3.0);
        request.setCustoPecas(200.0);

        when(ordemRepository.findById(5L)).thenReturn(Optional.of(ordem));
        when(ordemRepository.save(any(OrdemManutencao.class))).thenAnswer(inv -> inv.getArgument(0));
        when(ativoRepository.save(any(Ativo.class))).thenAnswer(inv -> inv.getArgument(0));

        OrdemManutencao resultado = ordemService.fecharOrdem(5L, request);

        assertEquals(OrdemManutencao.StatusOrdem.CONCLUIDA, resultado.getStatus());
        assertEquals(455.0, resultado.getCustoTotal());
        assertEquals(Ativo.StatusAtivo.ONLINE, ativo.getStatus());
        assertNotNull(resultado.getDataFechamento());
    }

    @Test
    void deveRejeitarTransicaoInvalidaDeStatus() {
        OrdemManutencao ordem = new OrdemManutencao();
        ordem.setId(3L);
        ordem.setStatus(OrdemManutencao.StatusOrdem.CONCLUIDA);
        ordem.setAtivo(ativo);

        when(ordemRepository.findById(3L)).thenReturn(Optional.of(ordem));

        assertThrows(RegraNegocioException.class, () -> ordemService.iniciarAtendimento(3L, tecnico));
    }

    @Test
    void deveTransicionarParaAguardandoPeca() {
        OrdemManutencao ordem = new OrdemManutencao();
        ordem.setId(7L);
        ordem.setStatus(OrdemManutencao.StatusOrdem.EM_ATENDIMENTO);
        ordem.setAtivo(ativo);

        when(ordemRepository.findById(7L)).thenReturn(Optional.of(ordem));
        when(ordemRepository.save(any(OrdemManutencao.class))).thenAnswer(inv -> inv.getArgument(0));
        when(ativoRepository.save(any(Ativo.class))).thenAnswer(inv -> inv.getArgument(0));

        OrdemManutencao resultado = ordemService.aguardarPeca(7L);

        assertEquals(OrdemManutencao.StatusOrdem.AGUARDANDO_PECA, resultado.getStatus());
        assertEquals(Ativo.StatusAtivo.AGUARDANDO_PECA, ativo.getStatus());
    }
}
