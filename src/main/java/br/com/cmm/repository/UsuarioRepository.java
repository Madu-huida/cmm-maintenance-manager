package br.com.cmm.repository;

import br.com.cmm.model.PerfilUsuario;
import br.com.cmm.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Usuario> findByPerfil(PerfilUsuario perfil);
}
