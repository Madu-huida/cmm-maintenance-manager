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

    // Relacionamento: Várias ordens podem pertencer a um Ativo
    @ManyToOne
    @JoinColumn(name = "ativo_id", nullable = false)
    private Ativo ativo;

    public enum StatusOrdem {
        ABERTA, 
        EM_ANDAMENTO, 
        CONCLUIDA, 
        CANCELADA
    }
}