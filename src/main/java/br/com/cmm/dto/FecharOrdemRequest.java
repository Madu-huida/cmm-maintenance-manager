package br.com.cmm.dto;

import br.com.cmm.model.OrdemManutencao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class FecharOrdemRequest {
    @NotBlank
    private String laudoTecnico;

    @NotNull
    @PositiveOrZero
    private Double horasTrabalhadas;

    @NotNull
    @PositiveOrZero
    private Double custoPecas;
}
