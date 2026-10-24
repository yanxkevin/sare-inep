package br.edu.fatec.sareinep.controller;

import br.edu.fatec.sareinep.model.Escola;
import br.edu.fatec.sareinep.service.EscolaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/escolas")
public class EscolaController {

    @Autowired
    private EscolaService service;

    // GET - Listar todas
    @GetMapping
    public ResponseEntity<List<Escola>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    // GET - Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Escola> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST - Cadastrar
    @PostMapping
    public ResponseEntity<Escola> cadastrar(@RequestBody Escola escola) {
        return ResponseEntity.status(201).body(service.salvar(escola));
    }

    // PUT - Atualizar
    @PutMapping("/{id}")
    public ResponseEntity<Escola> atualizar(@PathVariable Long id, @RequestBody Escola escola) {
        if (service.buscarPorId(id).isPresent()) {
            escola.setId(id);
            return ResponseEntity.ok(service.salvar(escola));
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE - Excluir
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (service.buscarPorId(id).isPresent()) {
            service.deletar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // POST - Importar CSV
    @PostMapping("/importar")
    public ResponseEntity<String> importarArquivo(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Por favor, selecione um arquivo válido.");
        }

        try {
            String resultado = service.importarCsv(file);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao importar: " + e.getMessage());
        }
    }

    // GET - Filtros
    @GetMapping("/filtro")
    public ResponseEntity<List<Escola>> filtrar(
            @RequestParam(value = "uf", required = false) String uf,
            @RequestParam(value = "rede", required = false) String rede) {

        if ((uf == null || uf.isEmpty()) && (rede == null || rede.isEmpty())) {
            return ResponseEntity.ok(service.listarTodas());
        }

        List<Escola> escolasFiltradas = service.filtrar(uf, rede);
        return ResponseEntity.ok(escolasFiltradas);
    }
}