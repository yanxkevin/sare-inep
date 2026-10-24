// URL base da nossa API
const API_URL = 'http://localhost:8080/api/escolas';

let meuGrafico = null;
let todasAsEscolas = []; // Guarda os dados em memória
let paginaAtual = 0;
const itensPorPagina = 50; // Limite de 50 linhas por página

document.addEventListener('DOMContentLoaded', () => {
    carregarEscolas();
    atualizarGrafico();
});

// ==========================================
// 1. CARREGAR E PAGINAR A TABELA
// ==========================================
async function carregarEscolas() {
    try {
        const response = await fetch(API_URL);
        todasAsEscolas = await response.json();
        paginaAtual = 0;
        renderizarTabela();
    } catch (error) {
        mostrarToast('Erro ao carregar escolas.', 'error');
    }
}

function renderizarTabela() {
    const tbody = document.getElementById('tabela-escolas');
    tbody.innerHTML = '';

    // Lógica de Paginação
    const inicio = paginaAtual * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const escolasPaginadas = todasAsEscolas.slice(inicio, fim);

    escolasPaginadas.forEach(escola => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escola.id}</td>
            <td>${escola.codigoEscola}</td>
            <td>${escola.nomeEscola}</td>
            <td>${escola.uf}</td>
            <td>${escola.municipio}</td>
            <td>${escola.rede}</td>
            <td>${escola.possuiComputador ? 'Sim' : 'Não'}</td>
            <td>${escola.possuiInternet ? 'Sim' : 'Não'}</td>
            <td>
                <button class="btn-edit" onclick="prepararEdicao(${escola.id})">Editar</button>
                <button class="btn-danger" onclick="deletarEscola(${escola.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Atualiza os botões de paginação
    const totalPaginas = Math.ceil(todasAsEscolas.length / itensPorPagina);
    document.getElementById('info-pagina').innerText = `Página ${paginaAtual + 1} de ${totalPaginas > 0 ? totalPaginas : 1}`;
    document.getElementById('btn-anterior').disabled = paginaAtual === 0;
    document.getElementById('btn-proxima').disabled = fim >= todasAsEscolas.length;
}

function proximaPagina() {
    if ((paginaAtual + 1) * itensPorPagina < todasAsEscolas.length) {
        paginaAtual++;
        renderizarTabela();
    }
}

function paginaAnterior() {
    if (paginaAtual > 0) {
        paginaAtual--;
        renderizarTabela();
    }
}

// ==========================================
// 2. LÓGICA DE UF E MUNICÍPIO (INTEGRAÇÃO IBGE)
// ==========================================
async function carregarMunicipios() {
    const uf = document.getElementById('uf').value;
    const selectMunicipio = document.getElementById('municipio');

    // Limpa o select e desabilita enquanto busca
    selectMunicipio.innerHTML = '<option value="">Carregando cidades...</option>';
    selectMunicipio.disabled = true;

    if (!uf) {
        selectMunicipio.innerHTML = '<option value="">Selecione a UF primeiro...</option>';
        return;
    }

    try {
        // Conecta na API oficial do IBGE para buscar todos os municípios da UF
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        const municipios = await response.json();

        selectMunicipio.innerHTML = '<option value="">Selecione ou digite o município...</option>';

        // Ordena os municípios em ordem alfabética
        municipios.sort((a, b) => a.nome.localeCompare(b.nome));

        municipios.forEach(mun => {
            const option = document.createElement('option');
            option.value = mun.nome;
            option.innerText = mun.nome;
            selectMunicipio.appendChild(option);
        });

        // O segredo para poder digitar: o campo select permite digitação se estiver "aberto"
        selectMunicipio.disabled = false;

    } catch (error) {
        console.error("Erro ao buscar municípios no IBGE:", error);
        // Se der erro na API, permite digitar manualmente
        selectMunicipio.innerHTML = '<option value="">Digite o município...</option>';
        selectMunicipio.disabled = false;
    }
}

// ==========================================
// 3. CADASTRAR E EDITAR (CRUD)
// ==========================================
document.getElementById('escola-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('escola-id').value;
    const codigoStr = document.getElementById('codigo').value;

    if (codigoStr.length !== 8) {
        mostrarToast('O código da escola deve ter exatamente 8 dígitos.', 'error');
        return;
    }

    const escola = {
        codigoEscola: parseInt(codigoStr),
        nomeEscola: document.getElementById('nome').value,
        uf: document.getElementById('uf').value,
        municipio: document.getElementById('municipio').value,
        rede: document.getElementById('rede').value,
        possuiComputador: document.getElementById('computador').checked,
        possuiInternet: document.getElementById('internet').checked
    };

    const url = id ? `${API_URL}/${id}` : API_URL;
    const metodo = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(escola)
        });

        if (response.ok) {
            mostrarToast(id ? 'Escola atualizada!' : 'Escola cadastrada!', 'success');
            limparFormulario();
            carregarEscolas();
            atualizarGrafico();
        } else {
            mostrarToast('Erro ao salvar. Verifique os dados.', 'error');
        }
    } catch (error) {
        mostrarToast('Erro de conexão com o servidor.', 'error');
    }
});

async function prepararEdicao(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (response.ok) {
            const escola = await response.json();

            document.getElementById('escola-id').value = escola.id;
            document.getElementById('codigo').value = escola.codigoEscola;
            document.getElementById('nome').value = escola.nomeEscola;
            document.getElementById('uf').value = escola.uf;

            // Carrega os municípios do IBGE antes de tentar selecionar o valor
            await carregarMunicipios();
            document.getElementById('municipio').value = escola.municipio;

            document.getElementById('rede').value = escola.rede;
            document.getElementById('computador').checked = escola.possuiComputador;
            document.getElementById('internet').checked = escola.possuiInternet;

            document.getElementById('form-title').innerText = 'Editar Escola';
            document.getElementById('btn-salvar').innerText = 'Atualizar Escola';
            document.getElementById('btn-cancelar').style.display = 'block';

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (error) {
        mostrarToast('Erro ao buscar escola.', 'error');
    }
}

function cancelarEdicao() { limparFormulario(); }

function limparFormulario() {
    document.getElementById('escola-form').reset();
    document.getElementById('escola-id').value = '';
    document.getElementById('form-title').innerText = 'Cadastrar Nova Escola';
    document.getElementById('btn-salvar').innerText = 'Salvar Escola';
    document.getElementById('btn-cancelar').style.display = 'none';
    document.getElementById('municipio').disabled = true;
    document.getElementById('municipio').innerHTML = '<option value="">Selecione a UF primeiro...</option>';
}

async function deletarEscola(id) {
    if (confirm('Tem certeza que deseja excluir esta escola?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                mostrarToast('Escola excluída!', 'success');
                carregarEscolas();
                atualizarGrafico();
            } else {
                mostrarToast('Erro ao excluir.', 'error');
            }
        } catch (error) {
            mostrarToast('Erro de conexão.', 'error');
        }
    }
}

// ==========================================
// 4. IMPORTAÇÃO DE ARQUIVO CSV
// ==========================================
async function importarArquivo() {
    const fileInput = document.getElementById('file-input');
    const statusText = document.getElementById('import-status');

    if (fileInput.files.length === 0) {
        mostrarToast('Por favor, selecione um arquivo CSV.', 'error');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    statusText.innerText = 'Processando arquivo... isso pode demorar um pouco.';

    try {
        const response = await fetch(`${API_URL}/importar`, { method: 'POST', body: formData });
        const mensagem = await response.text();

        if (response.ok) {
            statusText.innerText = mensagem;
            mostrarToast('Importação concluída!', 'success');
            carregarEscolas();
            atualizarGrafico();
        } else {
            statusText.innerText = 'Erro na importação.';
            mostrarToast(mensagem, 'error');
        }
    } catch (error) {
        statusText.innerText = 'Erro de conexão.';
        mostrarToast('Erro ao enviar o arquivo.', 'error');
    }
}

// ==========================================
// 5. FILTROS
// ==========================================
async function aplicarFiltros() {
    const uf = document.getElementById('filtro-uf').value.trim();
    const rede = document.getElementById('filtro-rede').value;

    let url = `${API_URL}/filtro?`;
    if (uf) url += `uf=${uf}&`;
    if (rede) url += `rede=${rede}`;

    try {
        const response = await fetch(url);
        todasAsEscolas = await response.json();
        paginaAtual = 0;
        renderizarTabela();
    } catch (error) {
        mostrarToast('Erro ao filtrar.', 'error');
    }
}

// ==========================================
// 6. GRÁFICO (CHART.JS)
// ==========================================
async function atualizarGrafico() {
    try {
        const response = await fetch(API_URL);
        const escolas = await response.json();

        let publicasComInternet = 0;
        let publicasSemInternet = 0;
        let privadasComInternet = 0;
        let privadasSemInternet = 0;

        escolas.forEach(e => {
            if (e.rede === 'Pública') {
                e.possuiInternet ? publicasComInternet++ : publicasSemInternet++;
            } else if (e.rede === 'Privada') {
                e.possuiInternet ? privadasComInternet++ : privadasSemInternet++;
            }
        });

        const ctx = document.getElementById('grafico-inclusao').getContext('2d');

        if (meuGrafico) meuGrafico.destroy();

        const maiorValor = Math.max(publicasComInternet, publicasSemInternet, privadasComInternet, privadasSemInternet);

        meuGrafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Escolas Públicas', 'Escolas Privadas'],
                datasets: [
                    { label: 'Com Internet', data: [publicasComInternet, privadasComInternet], backgroundColor: '#10b981' },
                    { label: 'Sem Internet', data: [publicasSemInternet, privadasSemInternet], backgroundColor: '#ef4444' }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    title: { display: true, text: 'Inclusão Digital: Acesso à Internet por Rede de Ensino', font: { size: 16 } },
                    tooltip: { callbacks: { label: function(context) { return context.dataset.label + ': ' + context.raw + ' escolas'; } } }
                },
                scales: { y: { beginAtZero: true, suggestedMax: maiorValor + 100, title: { display: true, text: 'Quantidade de Escolas' } } }
            }
        });
    } catch (error) {
        console.error('Erro ao gerar gráfico:', error);
    }
}

function mostrarToast(mensagem, tipo) {
    const toast = document.getElementById('toast');
    toast.innerText = mensagem;
    toast.className = `toast show ${tipo}`;
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}