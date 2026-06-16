package br.com.cmm.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ordens_manutencao")
public class OrdemManutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descricao;

    private String laudoTecnico;

    @Column(nullable = false)
    private LocalDateTime dataAbertura = LocalDateTime.now();

    private LocalDateTime dataFechamento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusOrdem status = StatusOrdem.ABERTA;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoOrdem tipo;

    private Double horasTrabalhadas;

    private Double custoPecas;

    private Double custoTotal;

    @ManyToOne
    @JoinColumn(name = "ativo_id", nullable = false)
    private Ativo ativo;

    @ManyToOne
    @JoinColumn(name = "tecnico_id")
    private Usuario tecnico;

    @ManyToOne
    @JoinColumn(name = "solicitante_id")
    private Usuario solicitante;

    public enum StatusOrdem {
        ABERTA,
        EM_ATENDIMENTO,
        AGUARDANDO_PECA,
        CONCLUIDA,
        CANCELADA
    }

    public enum TipoOrdem {
        PREVENTIVA,
        CORRETIVA
    }
}
