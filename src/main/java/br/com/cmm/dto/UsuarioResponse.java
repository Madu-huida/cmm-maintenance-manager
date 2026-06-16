package br.com.cmm.dto;

import br.com.cmm.model.Especialidade;
import br.com.cmm.model.PerfilUsuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponse {
    private Long id;
    private String nome;
    private String email;
    private PerfilUsuario perfil;
    private Especialidade especialidade;
    private boolean ativo;
}
