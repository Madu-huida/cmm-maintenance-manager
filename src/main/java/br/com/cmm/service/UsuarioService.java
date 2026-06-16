package br.com.cmm.service;

import br.com.cmm.dto.AuthResponse;
import br.com.cmm.dto.LoginRequest;
import br.com.cmm.dto.UsuarioRequest;
import br.com.cmm.dto.UsuarioResponse;
import br.com.cmm.exception.RegraNegocioException;
import br.com.cmm.model.PerfilUsuario;
import br.com.cmm.model.Usuario;
import br.com.cmm.repository.UsuarioRepository;
import br.com.cmm.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RegraNegocioException("Credenciais inválidas"));

        if (!usuario.isAtivo() || !passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {
            throw new RegraNegocioException("Credenciais inválidas");
        }

        String token = jwtService.gerarToken(usuario.getEmail(), usuario.getPerfil().name());

        return AuthResponse.builder()
                .token(token)
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .perfil(usuario.getPerfil())
                .especialidade(usuario.getEspecialidade())
                .build();
    }

    public AuthResponse registrarGestor(UsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RegraNegocioException("E-mail já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setPerfil(PerfilUsuario.GESTOR);
        usuario.setAtivo(true);

        Usuario salvo = usuarioRepository.save(usuario);
        String token = jwtService.gerarToken(salvo.getEmail(), salvo.getPerfil().name());

        return AuthResponse.builder()
                .token(token)
                .id(salvo.getId())
                .nome(salvo.getNome())
                .email(salvo.getEmail())
                .perfil(salvo.getPerfil())
                .especialidade(salvo.getEspecialidade())
                .build();
    }

    public UsuarioResponse criarUsuario(UsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RegraNegocioException("E-mail já cadastrado");
        }

        if (request.getPerfil() == null) {
            throw new RegraNegocioException("Perfil é obrigatório");
        }

        if (request.getPerfil() == PerfilUsuario.TECNICO && request.getEspecialidade() == null) {
            throw new RegraNegocioException("Técnicos devem ter uma especialidade definida");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setPerfil(request.getPerfil());
        usuario.setEspecialidade(request.getEspecialidade());
        usuario.setAtivo(true);

        return toResponse(usuarioRepository.save(usuario));
    }

    public List<UsuarioResponse> listarTecnicos() {
        return usuarioRepository.findByPerfil(PerfilUsuario.TECNICO)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RegraNegocioException("Usuário não encontrado"));
    }

    public void encerrarConta(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException("Usuário não encontrado"));

        if (usuario.getPerfil() == PerfilUsuario.GESTOR) {
            throw new RegraNegocioException("Contas de gestor não podem ser encerradas");
        }

        if (!usuario.isAtivo()) {
            throw new RegraNegocioException("Conta já está encerrada");
        }

        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .perfil(usuario.getPerfil())
                .especialidade(usuario.getEspecialidade())
                .ativo(usuario.isAtivo())
                .build();
    }
}
