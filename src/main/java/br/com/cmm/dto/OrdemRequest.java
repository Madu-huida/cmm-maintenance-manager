package br.com.cmm.dto;

import br.com.cmm.model.OrdemManutencao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrdemRequest {
    @NotBlank
    private String descricao;

    @NotNull
    private OrdemManutencao.TipoOrdem tipo;

    @NotNull
    private Long ativoId;
}
