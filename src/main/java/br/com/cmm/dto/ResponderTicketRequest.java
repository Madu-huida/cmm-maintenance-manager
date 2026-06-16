package br.com.cmm.dto;

import br.com.cmm.model.OrdemManutencao;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class ResponderTicketRequest {

    @NotNull
    private OrdemManutencao.StatusOrdem status;

    private String laudoTecnico;

    @PositiveOrZero
    private Double valorGasto;
}
