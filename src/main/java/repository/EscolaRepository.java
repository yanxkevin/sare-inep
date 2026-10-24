package br.edu.fatec.sareinep.repository;

import br.edu.fatec.sareinep.model.Escola;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EscolaRepository extends JpaRepository<Escola, Long> {

    // Usado na importação para evitar duplicados
    Optional<Escola> findByCodigoEscola(Long codigoEscola);

    // Usados nos filtros da API
    List<Escola> findByUf(String uf);
    List<Escola> findByRede(String rede);
    List<Escola> findByUfAndRede(String uf, String rede);
}