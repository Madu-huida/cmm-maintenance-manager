package br.com.cmm.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ativos")
public class Ativo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 50)
    private String categoria;

    @Column(name = "numero_serie", unique = true, length = 50)
    private String numeroSerie;

    @Column(nullable = false, length = 100)
    private String localizacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAtivo status = StatusAtivo.ONLINE;

    public enum StatusAtivo {
        ONLINE,
        OFFLINE,
        EM_MANUTENCAO,
        AGUARDANDO_PECA
    }
}