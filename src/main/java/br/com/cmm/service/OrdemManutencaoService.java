package br.com.cmm.service;

import br.com.cmm.dto.DashboardResponse;
import br.com.cmm.dto.FecharOrdemRequest;
import br.com.cmm.dto.OrdemRequest;
import br.com.cmm.dto.ResponderTicketRequest;
import br.com.cmm.exception.RegraNegocioException;
import br.com.cmm.model.Ativo;
import br.com.cmm.model.OrdemManutencao;
import br.com.cmm.model.PerfilUsuario;
import br.com.cmm.model.Usuario;
import br.com.cmm.repository.AtivoRepository;
import br.com.cmm.repository.OrdemManutencaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrdemManutencaoService {

    @Autowired
    private OrdemManutencaoRepository ordemRepository;

    @Autowired
    private AtivoRepository ativoRepository;

    @Value("${cmm.taxa-hora-padrao}")
    private double taxaHoraPadrao;

    public List<OrdemManutencao> listarTodas() {
        return ordemRepository.findAll();
    }

    public OrdemManutencao buscarPorId(Long id) {
        return ordemRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException("Ordem de manutenção não encontrada"));
    }

    @Transactional
    public OrdemManutencao abrirOrdem(OrdemRequest request, Usuario solicitante) {
        Ativo ativo = ativoRepository.findById(request.getAtivoId())
                .orElseThrow(() -> new RegraNegocioException("Ativo não encontrado"));

        OrdemManutencao ordem = new OrdemManutencao();
        ordem.setDescricao(request.getDescricao());
        ordem.setTipo(request.getTipo());
        ordem.setAtivo(ativo);
        ordem.setSolicitante(solicitante);
        ordem.setStatus(OrdemManutencao.StatusOrdem.ABERTA);
        ordem.setDataAbertura(LocalDateTime.now());

        if (request.getTipo() == OrdemManutencao.TipoOrdem.CORRETIVA) {
            ativo.setStatus(Ativo.StatusAtivo.OFFLINE);
            ativoRepository.save(ativo);
        }

        return ordemRepository.save(ordem);
    }

    @Transactional
    public OrdemManutencao iniciarAtendimento(Long id, Usuario tecnico) {
        if (tecnico.getPerfil() != PerfilUsuario.TECNICO) {
            throw new RegraNegocioException("Apenas técnicos podem assumir tickets");
        }

        OrdemManutencao ordem = buscarPorId(id);
        validarTransicao(ordem.getStatus(), OrdemManutencao.StatusOrdem.EM_ATENDIMENTO);

        ordem.setStatus(OrdemManutencao.StatusOrdem.EM_ATENDIMENTO);
        ordem.setTecnico(tecnico);

        Ativo ativo = ordem.getAtivo();
        ativo.setStatus(Ativo.StatusAtivo.EM_MANUTENCAO);
        ativoRepository.save(ativo);

        return ordemRepository.save(ordem);
    }

    @Transactional
    public OrdemManutencao aguardarPeca(Long id) {
        OrdemManutencao ordem = buscarPorId(id);
        validarTransicao(ordem.getStatus(), OrdemManutencao.StatusOrdem.AGUARDANDO_PECA);

        ordem.setStatus(OrdemManutencao.StatusOrdem.AGUARDANDO_PECA);

        Ativo ativo = ordem.getAtivo();
        ativo.setStatus(Ativo.StatusAtivo.AGUARDANDO_PECA);
        ativoRepository.save(ativo);

        return ordemRepository.save(ordem);
    }

    @Transactional
    public OrdemManutencao retomarAtendimento(Long id) {
        OrdemManutencao ordem = buscarPorId(id);
        validarTransicao(ordem.getStatus(), OrdemManutencao.StatusOrdem.EM_ATENDIMENTO);

        ordem.setStatus(OrdemManutencao.StatusOrdem.EM_ATENDIMENTO);

        Ativo ativo = ordem.getAtivo();
        ativo.setStatus(Ativo.StatusAtivo.EM_MANUTENCAO);
        ativoRepository.save(ativo);

        return ordemRepository.save(ordem);
    }

    @Transactional
    public OrdemManutencao fecharOrdem(Long id, FecharOrdemRequest request) {
        OrdemManutencao ordem = buscarPorId(id);

        if (ordem.getStatus() != OrdemManutencao.StatusOrdem.EM_ATENDIMENTO) {
            throw new RegraNegocioException("Somente ordens em atendimento podem ser fechadas");
        }

        if (request.getHorasTrabalhadas() < 0 || request.getCustoPecas() < 0) {
            throw new RegraNegocioException("Valores de custo não podem ser negativos");
        }

        double custoTotal = calcularCustoTotal(request.getHorasTrabalhadas(), request.getCustoPecas());

        ordem.setLaudoTecnico(request.getLaudoTecnico());
        ordem.setHorasTrabalhadas(request.getHorasTrabalhadas());
        ordem.setCustoPecas(request.getCustoPecas());
        ordem.setCustoTotal(custoTotal);
        ordem.setStatus(OrdemManutencao.StatusOrdem.CONCLUIDA);
        ordem.setDataFechamento(LocalDateTime.now());

        Ativo ativo = ordem.getAtivo();
        ativo.setStatus(Ativo.StatusAtivo.ONLINE);
        ativoRepository.save(ativo);

        return ordemRepository.save(ordem);
    }

    @Transactional
    public OrdemManutencao responderTicket(Long id, ResponderTicketRequest request, Usuario usuario) {
        OrdemManutencao ordem = buscarPorId(id);

        if (ordem.getStatus() == OrdemManutencao.StatusOrdem.CONCLUIDA
                || ordem.getStatus() == OrdemManutencao.StatusOrdem.CANCELADA) {
            throw new RegraNegocioException("Ticket já finalizado");
        }

        OrdemManutencao.StatusOrdem novoStatus = request.getStatus();

        if (novoStatus == OrdemManutencao.StatusOrdem.ABERTA) {
            throw new RegraNegocioException("Status inválido para resposta");
        }

        if (novoStatus != ordem.getStatus()) {
            validarTransicao(ordem.getStatus(), novoStatus);
        }

        if (request.getLaudoTecnico() != null && !request.getLaudoTecnico().isBlank()) {
            ordem.setLaudoTecnico(request.getLaudoTecnico());
        }

        Ativo ativo = ordem.getAtivo();

        switch (novoStatus) {
            case EM_ATENDIMENTO -> {
                ordem.setStatus(OrdemManutencao.StatusOrdem.EM_ATENDIMENTO);
                if (usuario.getPerfil() == PerfilUsuario.TECNICO) {
                    ordem.setTecnico(usuario);
                }
                ativo.setStatus(Ativo.StatusAtivo.EM_MANUTENCAO);
            }
            case AGUARDANDO_PECA -> {
                ordem.setStatus(OrdemManutencao.StatusOrdem.AGUARDANDO_PECA);
                ativo.setStatus(Ativo.StatusAtivo.AGUARDANDO_PECA);
            }
            case CONCLUIDA -> {
                if (request.getValorGasto() == null || request.getValorGasto() < 0) {
                    throw new RegraNegocioException("Informe o valor gasto na manutenção");
                }
                if (request.getLaudoTecnico() == null || request.getLaudoTecnico().isBlank()) {
                    throw new RegraNegocioException("Informe o laudo/descrição do serviço");
                }
                ordem.setLaudoTecnico(request.getLaudoTecnico());
                ordem.setCustoPecas(request.getValorGasto());
                ordem.setHorasTrabalhadas(0.0);
                ordem.setCustoTotal(request.getValorGasto());
                ordem.setStatus(OrdemManutencao.StatusOrdem.CONCLUIDA);
                ordem.setDataFechamento(LocalDateTime.now());
                if (usuario.getPerfil() == PerfilUsuario.TECNICO && ordem.getTecnico() == null) {
                    ordem.setTecnico(usuario);
                }
                ativo.setStatus(Ativo.StatusAtivo.ONLINE);
            }
            default -> throw new RegraNegocioException("Status não permitido");
        }

        ativoRepository.save(ativo);
        return ordemRepository.save(ordem);
    }

    @Transactional
    public void excluirTicket(Long id) {
        OrdemManutencao ordem = buscarPorId(id);

        if (ordem.getStatus() != OrdemManutencao.StatusOrdem.CONCLUIDA
                && ordem.getStatus() != OrdemManutencao.StatusOrdem.CANCELADA
                && ordem.getTipo() == OrdemManutencao.TipoOrdem.CORRETIVA) {
            Ativo ativo = ordem.getAtivo();
            ativo.setStatus(Ativo.StatusAtivo.ONLINE);
            ativoRepository.save(ativo);
        }

        ordemRepository.deleteById(id);
    }

    @Transactional
    public OrdemManutencao cancelarOrdem(Long id) {
        OrdemManutencao ordem = buscarPorId(id);

        if (ordem.getStatus() == OrdemManutencao.StatusOrdem.CONCLUIDA) {
            throw new RegraNegocioException("Ordens concluídas não podem ser canceladas");
        }

        ordem.setStatus(OrdemManutencao.StatusOrdem.CANCELADA);

        if (ordem.getTipo() == OrdemManutencao.TipoOrdem.CORRETIVA) {
            Ativo ativo = ordem.getAtivo();
            ativo.setStatus(Ativo.StatusAtivo.ONLINE);
            ativoRepository.save(ativo);
        }

        return ordemRepository.save(ordem);
    }

    public DashboardResponse obterDashboard() {
        List<Ativo> ativos = ativoRepository.findAll();
        List<OrdemManutencao> ordens = ordemRepository.findAll();

        long online = ativos.stream().filter(a -> a.getStatus() == Ativo.StatusAtivo.ONLINE).count();
        long offline = ativos.stream().filter(a -> a.getStatus() == Ativo.StatusAtivo.OFFLINE).count();

        double custoTotal = ordens.stream()
                .filter(o -> o.getCustoTotal() != null)
                .mapToDouble(OrdemManutencao::getCustoTotal)
                .sum();

        List<Map<String, Object>> ordensRecentes = ordens.stream()
                .sorted((a, b) -> b.getDataAbertura().compareTo(a.getDataAbertura()))
                .limit(5)
                .map(this::mapOrdemResumo)
                .toList();

        List<Map<String, Object>> ativosPorStatus = ativos.stream()
                .map(a -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("nome", a.getNome());
                    map.put("status", a.getStatus().name());
                    map.put("categoria", a.getCategoria());
                    map.put("localizacao", a.getLocalizacao());
                    return map;
                })
                .toList();

        return DashboardResponse.builder()
                .totalAtivos(ativos.size())
                .ativosOnline(online)
                .ativosOffline(offline)
                .ordensAbertas(contarPorStatus(ordens, OrdemManutencao.StatusOrdem.ABERTA))
                .ordensEmAtendimento(contarPorStatus(ordens, OrdemManutencao.StatusOrdem.EM_ATENDIMENTO))
                .ordensAguardandoPeca(contarPorStatus(ordens, OrdemManutencao.StatusOrdem.AGUARDANDO_PECA))
                .ordensConcluidas(contarPorStatus(ordens, OrdemManutencao.StatusOrdem.CONCLUIDA))
                .custoTotalHistorico(custoTotal)
                .ordensRecentes(ordensRecentes)
                .ativosPorStatus(ativosPorStatus)
                .build();
    }

    double calcularCustoTotal(double horas, double custoPecas) {
        if (horas < 0 || custoPecas < 0) {
            throw new RegraNegocioException("Valores inválidos para cálculo de custo");
        }
        return (horas * taxaHoraPadrao) + custoPecas;
    }

    private void validarTransicao(OrdemManutencao.StatusOrdem atual, OrdemManutencao.StatusOrdem destino) {
        boolean valida = switch (atual) {
            case ABERTA -> destino == OrdemManutencao.StatusOrdem.EM_ATENDIMENTO;
            case EM_ATENDIMENTO -> destino == OrdemManutencao.StatusOrdem.AGUARDANDO_PECA
                    || destino == OrdemManutencao.StatusOrdem.CONCLUIDA;
            case AGUARDANDO_PECA -> destino == OrdemManutencao.StatusOrdem.EM_ATENDIMENTO;
            default -> false;
        };

        if (!valida) {
            throw new RegraNegocioException(
                    "Transição inválida de " + atual + " para " + destino);
        }
    }

    private long contarPorStatus(List<OrdemManutencao> ordens, OrdemManutencao.StatusOrdem status) {
        return ordens.stream().filter(o -> o.getStatus() == status).count();
    }

    private Map<String, Object> mapOrdemResumo(OrdemManutencao ordem) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", ordem.getId());
        map.put("descricao", ordem.getDescricao());
        map.put("tipo", ordem.getTipo().name());
        map.put("status", ordem.getStatus().name());
        map.put("ativo", ordem.getAtivo().getNome());
        map.put("custoTotal", ordem.getCustoTotal());
        map.put("dataAbertura", ordem.getDataAbertura().toString());
        return map;
    }
}
