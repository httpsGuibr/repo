let editIndex = -1; // Variável para rastrear o índice da linha que está sendo editada

document.getElementById('maintenance-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const client = document.getElementById('client').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const cost = document.getElementById('cost').value;

    if (client && service && date && cost) {
        if (editIndex === -1) {
            addMaintenance(client, service, date, cost);
        } else {
            updateMaintenance(editIndex, client, service, date, cost);
        }
        document.getElementById('maintenance-form').reset();
        editIndex = -1; // Reseta o índice após a edição
    }
});

function addMaintenance(client, service, date, cost) {
    const table = document.getElementById('maintenance-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const clientCell = newRow.insertCell(0);
    const serviceCell = newRow.insertCell(1);
    const dateCell = newRow.insertCell(2);
    const costCell = newRow.insertCell(3);
    const actionCell = newRow.insertCell(4);

    clientCell.innerText = client;
    serviceCell.innerText = service;
    dateCell.innerText = date;
    costCell.innerText = `R$ ${parseFloat(cost).toFixed(2)}`;
    actionCell.innerHTML = `<button onclick="editRow(this)">Editar</button> <button onclick="deleteRow(this)">Excluir</button>`;

    newRow.appendChild(clientCell);
    newRow.appendChild(serviceCell);
    newRow.appendChild(dateCell);
    newRow.appendChild(costCell);
    newRow.appendChild(actionCell);
}

function editRow(button) {
    const row = button.parentNode.parentNode;
    const cells = row.getElementsByTagName('td');
    
    // Preencher os campos do formulário com os valores da linha selecionada
    document.getElementById('client').value = cells[0].innerText;
    document.getElementById('service').value = cells[1].innerText;
    document.getElementById('date').value = cells[2].innerText;
    document.getElementById('cost').value = cells[3].innerText.replace('R$ ', '');

    editIndex = row.rowIndex - 1; // Rastrear o índice da linha que está sendo editada
}

function updateMaintenance(index, client, service, date, cost) {
    const table = document.getElementById('maintenance-table').getElementsByTagName('tbody')[0];
    const row = table.rows[index];

    // Atualizar as células com os novos valores
    row.cells[0].innerText = client;
    row.cells[1].innerText = service;
    row.cells[2].innerText = date;
    row.cells[3].innerText = `R$ ${parseFloat(cost).toFixed(2)}`;
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

// Função para gerar o PDF
document.getElementById('generate-pdf').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Adicionar título ao PDF
    doc.setFontSize(18);
    doc.text('Lista de Manutenções - AdmCar', 14, 16);
    doc.setFontSize(12);
    doc.text('Gerado em: ' + new Date().toLocaleString(), 14, 22);

    // Pegar as linhas da tabela
    const rows = [];
    const table = document.getElementById('maintenance-table').getElementsByTagName('tbody')[0];
    for (let i = 0; i < table.rows.length; i++) {
        const client = table.rows[i].cells[0].innerText;
        const service = table.rows[i].cells[1].innerText;
        const date = table.rows[i].cells[2].innerText;
        const cost = table.rows[i].cells[3].innerText;
        rows.push([client, service, date, cost]);
    }

    // Adicionar cabeçalhos ao PDF
    const headers = [["Cliente", "Serviço", "Data", "Custo (R$)"]];
    
    // Adicionar a tabela no PDF
    doc.autoTable({
        head: headers,
        body: rows,
        startY: 30,
    });

    // Salvar o PDF
    doc.save('manutencoes_admcar.pdf');
});
