package br.com.cmm.dto;

import br.com.cmm.model.Especialidade;
import br.com.cmm.model.PerfilUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UsuarioRequest {
    @NotBlank
    private String nome;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String senha;

    private PerfilUsuario perfil;

    private Especialidade especialidade;
}
