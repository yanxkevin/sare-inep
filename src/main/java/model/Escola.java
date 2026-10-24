package br.edu.fatec.sareinep.model;

import jakarta.persistence.*;

@Entity
@Table(name = "escolas")
public class Escola {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_escola", unique = true, nullable = false)
    private Long codigoEscola;

    @Column(name = "nome_escola", nullable = false)
    private String nomeEscola;

    @Column(name = "uf", length = 2)
    private String uf;

    @Column(name = "municipio")
    private String municipio;

    @Column(name = "rede")
    private String rede;

    @Column(name = "possui_computador")
    private Boolean possuiComputador;

    @Column(name = "possui_internet")
    private Boolean possuiInternet;

    // ==========================================
    // GETTERS E SETTERS (Obrigatórios para o Spring)
    // ==========================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCodigoEscola() { return codigoEscola; }
    public void setCodigoEscola(Long codigoEscola) { this.codigoEscola = codigoEscola; }

    public String getNomeEscola() { return nomeEscola; }
    public void setNomeEscola(String nomeEscola) { this.nomeEscola = nomeEscola; }

    public String getUf() { return uf; }
    public void setUf(String uf) { this.uf = uf; }

    public String getMunicipio() { return municipio; }
    public void setMunicipio(String municipio) { this.municipio = municipio; }

    public String getRede() { return rede; }
    public void setRede(String rede) { this.rede = rede; }

    public Boolean getPossuiComputador() { return possuiComputador; }
    public void setPossuiComputador(Boolean possuiComputador) { this.possuiComputador = possuiComputador; }

    public Boolean getPossuiInternet() { return possuiInternet; }
    public void setPossuiInternet(Boolean possuiInternet) { this.possuiInternet = possuiInternet; }
}