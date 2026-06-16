package br.com.cmm.service;

import br.com.cmm.exception.RegraNegocioException;
import br.com.cmm.model.Ativo;
import br.com.cmm.repository.AtivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AtivoService {

    @Autowired
    private AtivoRepository ativoRepository;

    public List<Ativo> listarTodos() {
        return ativoRepository.findAll();
    }

    public Ativo buscarPorId(Long id) {
        return ativoRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException("Ativo não encontrado"));
    }

    public Ativo criar(Ativo ativo) {
        if (ativo.getStatus() == null) {
            ativo.setStatus(Ativo.StatusAtivo.ONLINE);
        }
        if (ativo.getNumeroSerie() != null && ativoRepository.existsByNumeroSerie(ativo.getNumeroSerie())) {
            throw new RegraNegocioException("Número de série já cadastrado");
        }
        return ativoRepository.save(ativo);
    }

    public Ativo atualizar(Long id, Ativo dados) {
        Ativo ativo = buscarPorId(id);
        ativo.setNome(dados.getNome());
        ativo.setCategoria(dados.getCategoria());
        ativo.setNumeroSerie(dados.getNumeroSerie());
        ativo.setLocalizacao(dados.getLocalizacao());
        if (dados.getStatus() != null) {
            ativo.setStatus(dados.getStatus());
        }
        return ativoRepository.save(ativo);
    }

    public void deletar(Long id) {
        if (!ativoRepository.existsById(id)) {
            throw new RegraNegocioException("Ativo não encontrado");
        }
        ativoRepository.deleteById(id);
    }
}
