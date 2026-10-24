package br.edu.fatec.sareinep.service;

import br.edu.fatec.sareinep.model.Escola;
import br.edu.fatec.sareinep.repository.EscolaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;

@Service
public class EscolaService {

    @Autowired
    private EscolaRepository repository;

    public List<Escola> listarTodas() {
        return repository.findAll();
    }

    public Optional<Escola> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Escola salvar(Escola escola) {
        return repository.save(escola);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    // Método para os filtros
    public List<Escola> filtrar(String uf, String rede) {
        if (uf != null && !uf.isEmpty() && rede != null && !rede.isEmpty()) {
            return repository.findByUfAndRede(uf, rede);
        } else if (uf != null && !uf.isEmpty()) {
            return repository.findByUf(uf);
        } else {
            return repository.findByRede(rede);
        }
    }

    // Importação CSV
    public String importarCsv(MultipartFile arquivo) {
        int linhasLidas = 0;
        int linhasImportadas = 0;
        int linhasRejeitadas = 0;

        try (Scanner scanner = new Scanner(new InputStreamReader(arquivo.getInputStream(), StandardCharsets.ISO_8859_1))) {

            if (!scanner.hasNextLine()) return "Arquivo vazio.";

            // Lê o cabeçalho e descobre os índices corretos
            String cabecalho = scanner.nextLine();
            String[] nomesColunas = cabecalho.split(";");

            int idxCodigo = -1, idxNome = -1, idxUf = -1, idxMunicipio = -1, idxRede = -1, idxComp = -1, idxNet = -1;

            for (int i = 0; i < nomesColunas.length; i++) {
                String nome = nomesColunas[i].replace("\"", "").trim();
                if (nome.equals("CO_ENTIDADE")) idxCodigo = i;
                if (nome.equals("NO_ENTIDADE")) idxNome = i;
                if (nome.equals("SG_UF")) idxUf = i;
                if (nome.equals("NO_MUNICIPIO")) idxMunicipio = i;
                if (nome.equals("CO_REDE")) idxRede = i;
                if (nome.equals("IN_COMPUTADOR")) idxComp = i;
                if (nome.equals("IN_INTERNET")) idxNet = i;
            }

            // Lê 2000 linhas
            while (scanner.hasNextLine() && linhasLidas < 2000) {
                String linhaTexto = scanner.nextLine();
                linhasLidas++;

                try {
                    String[] colunas = linhaTexto.split(";", -1);

                    if (colunas.length <= Math.max(idxCodigo, idxNome)) {
                        throw new Exception("Linha curta.");
                    }

                    Escola escola = new Escola();

                    if (idxUf != -1) escola.setUf(limpar(colunas[idxUf]));
                    if (idxMunicipio != -1) escola.setMunicipio(limpar(colunas[idxMunicipio]));
                    if (idxNome != -1) escola.setNomeEscola(limpar(colunas[idxNome]));

                    if (idxCodigo != -1) {
                        String codStr = limpar(colunas[idxCodigo]);
                        if (codStr.isEmpty()) throw new Exception("Código vazio.");
                        escola.setCodigoEscola(Long.parseLong(codStr));
                    }

                    if (idxRede != -1) {
                        String redeCsv = limpar(colunas[idxRede]);
                        if (redeCsv.equals("1")) escola.setRede("Pública");
                        else if (redeCsv.equals("2")) escola.setRede("Privada");
                        else escola.setRede("Não Informada");
                    }

                    if (idxComp != -1) escola.setPossuiComputador(limpar(colunas[idxComp]).equals("1"));
                    if (idxNet != -1) escola.setPossuiInternet(limpar(colunas[idxNet]).equals("1"));

                    repository.save(escola);
                    linhasImportadas++;

                } catch (Exception e) {
                    linhasRejeitadas++;
                }
            }

        } catch (Exception e) {
            return "Erro ao ler o arquivo: " + e.getMessage();
        }

        return String.format("Leitura concluída: %d lidas, %d importadas, %d rejeitadas.", linhasLidas, linhasImportadas, linhasRejeitadas);
    }

    private String limpar(String texto) {
        if (texto == null) return "";
        return texto.replace("\"", "").trim();
    }
}