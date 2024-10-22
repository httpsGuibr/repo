// Variáveis globais para armazenar os gráficos
let pieChart;
let barChartOS;
let barChartCost;
let lineChart;

function atualizarDashboard() {
    // Atualizando as estatísticas
    const totalOS = osData.length;
    const totalCost = osData.reduce((acc, os) => acc + parseFloat(os.cost), 0);
    const totalClients = new Set(osData.map(os => os.client)).size;
    const averageCost = totalOS > 0 ? (totalCost / totalOS) : 0;

    document.getElementById('total-os').textContent = totalOS;
    document.getElementById('total-cost').textContent = `R$ ${totalCost.toFixed(2)}`;
    document.getElementById('total-clients').textContent = totalClients;
    document.getElementById('average-cost').textContent = `R$ ${averageCost.toFixed(2)}`;

    // Atualizando os gráficos
    atualizarGraficos();
}

function atualizarGraficos() {
    // Preparando os dados
    const serviceCount = {};
    const monthlyCost = {};
    osData.forEach((os) => {
        // Contagem de serviços para o gráfico de pizza
        if (serviceCount[os.service]) {
            serviceCount[os.service]++;
        } else {
            serviceCount[os.service] = 1;
        }

        // Custos mensais para o gráfico de linha
        const month = os.date.slice(0, 7); // Pega apenas o ano e o mês
        if (monthlyCost[month]) {
            monthlyCost[month] += parseFloat(os.cost);
        } else {
            monthlyCost[month] = parseFloat(os.cost);
        }
    });

    // Dados para gráficos
    const serviceLabels = Object.keys(serviceCount);
    const serviceData = Object.values(serviceCount);
    const monthlyLabels = Object.keys(monthlyCost).sort();
    const monthlyData = Object.values(monthlyCost);

    // Atualizar ou criar gráfico de pizza
    if (pieChart) {
        pieChart.data.labels = serviceLabels;
        pieChart.data.datasets[0].data = serviceData;
        pieChart.update();
    } else {
        const ctxPie = document.getElementById('pie-chart').getContext('2d');
        pieChart = new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: serviceLabels,
                datasets: [{
                    data: serviceData,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                }],
            },
            options: {
                responsive: true,
            }
        });
    }

    // Atualizar ou criar gráfico de barras de OS por tipo de serviço
    if (barChartOS) {
        barChartOS.data.labels = serviceLabels;
        barChartOS.data.datasets[0].data = serviceData;
        barChartOS.update();
    } else {
        const ctxBarOS = document.getElementById('bar-chart-os').getContext('2d');
        barChartOS = new Chart(ctxBarOS, {
            type: 'bar',
            data: {
                labels: serviceLabels,
                datasets: [{
                    label: 'Número de OS por Tipo de Serviço',
                    data: serviceData,
                    backgroundColor: '#36A2EB',
                }],
            },
            options: {
                responsive: true,
            }
        });
    }

    // Atualizar ou criar gráfico de barras de custo total por serviço
    const serviceCost = {};
    osData.forEach((os) => {
        if (serviceCost[os.service]) {
            serviceCost[os.service] += parseFloat(os.cost);
        } else {
            serviceCost[os.service] = parseFloat(os.cost);
        }
    });
    const serviceCostLabels = Object.keys(serviceCost);
    const serviceCostData = Object.values(serviceCost);

    if (barChartCost) {
        barChartCost.data.labels = serviceCostLabels;
        barChartCost.data.datasets[0].data = serviceCostData;
        barChartCost.update();
    } else {
        const ctxBarCost = document.getElementById('bar-chart-cost').getContext('2d');
        barChartCost = new Chart(ctxBarCost, {
            type: 'bar',
            data: {
                labels: serviceCostLabels,
                datasets: [{
                    label: 'Custo Total por Serviço',
                    data: serviceCostData,
                    backgroundColor: '#FF6384',
                }],
            },
            options: {
                responsive: true,
            }
        });
    }

    // Atualizar ou criar gráfico de linha de custo mensal
    if (lineChart) {
        lineChart.data.labels = monthlyLabels;
        lineChart.data.datasets[0].data = monthlyData;
        lineChart.update();
    } else {
        const ctxLine = document.getElementById('line-chart').getContext('2d');
        lineChart = new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: monthlyLabels,
                datasets: [{
                    label: 'Custo Mensal Total',
                    data: monthlyData,
                    backgroundColor: '#FFCE56',
                    borderColor: '#FFCE56',
                    fill: false,
                }],
            },
            options: {
                responsive: true,
            }
        });
    }
}
