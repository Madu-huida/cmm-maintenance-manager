package br.com.cmm.repository;

import br.com.cmm.model.OrdemManutencao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdemManutencaoRepository extends JpaRepository<OrdemManutencao, Long> {
}