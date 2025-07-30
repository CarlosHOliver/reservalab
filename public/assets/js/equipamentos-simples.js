/**
 * Script simples para testar equipamentos
 */

// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Página carregada, iniciando teste...');
    
    // Mostrar loading
    document.getElementById('loadingEquipamentos').style.display = 'block';
    document.getElementById('viewCards').style.display = 'none';
    
    try {
        // Testar conexão com API
        console.log('Testando API...');
        const resultado = await API.buscarEquipamentos();
        console.log('Resultado da API:', resultado);
        
        if (resultado.sucesso && resultado.dados) {
            console.log('Dados encontrados:', resultado.dados.length, 'equipamentos');
            
            // Processar dados
            const equipamentos = resultado.dados.map(equip => ({
                ...equip,
                bloco_nome: equip.blocos?.nome || 'N/A'
            }));
            
            // Renderizar cards simples
            renderizarCardsSimples(equipamentos);
            
            // Atualizar contador
            document.getElementById('totalEquipamentos').textContent = `${equipamentos.length} equipamentos encontrados`;
            
        } else {
            console.error('Erro na API:', resultado.erro);
            mostrarErroSimples('Erro ao buscar dados: ' + resultado.erro);
        }
        
    } catch (error) {
        console.error('Erro geral:', error);
        mostrarErroSimples('Erro geral: ' + error.message);
    } finally {
        // Esconder loading
        document.getElementById('loadingEquipamentos').style.display = 'none';
    }
});

function renderizarCardsSimples(equipamentos) {
    const container = document.getElementById('viewCards');
    
    if (equipamentos.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <h5>Nenhum equipamento encontrado</h5>
                <p>Não há equipamentos cadastrados no sistema.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    equipamentos.forEach(equip => {
        const statusClass = equip.status === 'disponivel' ? 'success' : equip.status === 'em_manutencao' ? 'warning' : 'danger';
        const statusText = equip.status === 'disponivel' ? 'Disponível' : equip.status === 'em_manutencao' ? 'Em Manutenção' : 'Inativo';
        
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${equip.nome}</h5>
                        <p class="card-text">
                            <strong>Patrimônio:</strong> ${equip.patrimonio}<br>
                            <strong>Bloco:</strong> ${equip.bloco_nome}<br>
                            <strong>Local:</strong> ${equip.local}
                        </p>
                        <span class="badge bg-${statusClass}">${statusText}</span>
                        ${equip.permitir_uso_compartilhado ? '<span class="badge bg-info ms-1">Compartilhado</span>' : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    container.style.display = 'block';
}

function mostrarErroSimples(mensagem) {
    const container = document.getElementById('viewCards');
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger">
                <h5>Erro</h5>
                <p>${mensagem}</p>
            </div>
        </div>
    `;
    container.style.display = 'block';
}

// Funções globais para os botões
window.buscarEquipamentos = function() {
    console.log('Busca executada');
};

window.aplicarFiltros = function() {
    console.log('Filtros aplicados');
};

window.alterarVisualizacao = function(tipo) {
    console.log('Visualização alterada para:', tipo);
};
