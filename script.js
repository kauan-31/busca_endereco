async function smartSearch() {
    const input = document.getElementById('fullAddress').value;
    const container = document.getElementById('results-container');
    const loader = document.getElementById('loader');
    
    // Regex simples para tentar separar por vírgulas: Rua, Cidade, UF
    const parts = input.split(',').map(p => p.trim());
    
    if (parts.length < 3) {
        alert("Para melhor resultado, use o formato: Rua, Cidade, UF");
        return;
    }

    const rua = parts[0];
    const cidade = parts[1];
    const uf = parts[2].substring(0, 2).toUpperCase();

    loader.classList.remove('hidden');
    container.innerHTML = "";

    try {
        const response = await fetch(`https://viacep.com.br/ws/${uf}/${cidade}/${rua}/json/`);
        const data = await response.json();
        loader.classList.add('hidden');

        if (!data.length) {
            container.innerHTML = "<p style='color: #ef4444'>Nenhum resultado encontrado.</p>";
            return;
        }

        // Mostramos apenas os 3 primeiros resultados para não poluir
        data.slice(0, 3).forEach(item => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <div class="cep-badge">CEP: ${item.cep}</div>
                <div style="color: #94a3b8; font-size: 0.8rem">LOGRADOURO</div>
                <div style="margin-bottom: 10px">${item.logradouro}</div>
                <div style="color: #94a3b8; font-size: 0.8rem">BAIRRO</div>
                <div>${item.bairro} - ${item.localidade}/${item.uf}</div>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        loader.classList.add('hidden');
        alert("Erro na conexão.");
    }
}