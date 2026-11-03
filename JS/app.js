// Aplicación Fábrica AR

let arStarted = false;
let updateInterval = null;

// Datos de ejemplo de máquinas
const machinesData = [
    {
        id: 'cnc-01',
        name: 'Máquina CNC-01',
        status: 'running',
        temperature: 65,
        production: 85,
        marker: 'hiro'
    },
    {
        id: 'press-01',
        name: 'Prensa Hidráulica',
        status: 'running',
        pressure: 150,
        cyclesPerHour: 120,
        marker: 'kanji'
    }
];

// Iniciar AR
function startAR() {
    if (arStarted) return;
    
    document.getElementById('loading').style.display = 'block';
    document.getElementById('start-button').style.display = 'none';
    
    // Simular carga inicial
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        arStarted = true;
        
        // Renderizar panel de máquinas
        renderMachinesPanel();
        
        // Iniciar actualización de datos cada 3 segundos
        updateInterval = setInterval(updateMachineData, 3000);
        
        console.log('✅ AR iniciado correctamente');
    }, 2000);
}

// Renderizar panel de máquinas
function renderMachinesPanel() {
    const container = document.getElementById('machines-container');
    container.innerHTML = '';
    
    machinesData.forEach(machine => {
        const card = document.createElement('div');
        card.className = 'machine-card';
        
        let statusClass = machine.status === 'running' ? 'status-running' : 
                         machine.status === 'stopped' ? 'status-stopped' : 'status-maintenance';
        let statusText = machine.status === 'running' ? '● En funcionamiento' : 
                        machine.status === 'stopped' ? '● Detenida' : '● Mantenimiento';
        
        let details = '';
        if (machine.temperature) {
            details += `<p>Temperatura: ${machine.temperature}°C</p>`;
        }
        if (machine.production) {
            details += `<p>Producción: ${machine.production}%</p>`;
        }
        if (machine.pressure) {
            details += `<p>Presión: ${machine.pressure} bar</p>`;
        }
        if (machine.cyclesPerHour) {
            details += `<p>Ciclos/hora: ${machine.cyclesPerHour}</p>`;
        }
        
        card.innerHTML = `
            <h3>${machine.name}</h3>
            <p class="${statusClass}">${statusText}</p>
            ${details}
        `;
        
        container.appendChild(card);
    });
}

// Actualizar datos de máquinas (simulación)
async function updateMachineData() {
    try {
        // EN PRODUCCIÓN: Reemplazar con fetch real a tu API
        // const response = await fetch('http://tu-api.com/api/machines');
        // const data = await response.json();
        
        // Simulación de datos cambiantes
        machinesData.forEach(machine => {
            if (machine.temperature) {
                machine.temperature = Math.floor(Math.random() * 20) + 60; // 60-80°C
            }
            if (machine.production) {
                machine.production = Math.floor(Math.random() * 15) + 80; // 80-95%
            }
            if (machine.pressure) {
                machine.pressure = Math.floor(Math.random() * 30) + 140; // 140-170 bar
            }
        });
        
        // Actualizar panel
        renderMachinesPanel();
        
        console.log('📊 Datos actualizados:', new Date().toLocaleTimeString());
        
    } catch (error) {
        console.error('❌ Error al actualizar datos:', error);
    }
}

// Conectar con API real (ejemplo)
async function fetchRealTimeData() {
    try {
        const response = await fetch('http://localhost:3000/api/machines', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Actualizar machinesData con datos reales
        data.forEach(machineData => {
            const machine = machinesData.find(m => m.id === machineData.id);
            if (machine) {
                Object.assign(machine, machineData);
            }
        });
        
        renderMachinesPanel();
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Verificar soporte del navegador
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('⚠️ Tu navegador no soporta acceso a la cámara.\nUsa Chrome o Firefox actualizado.');
}

// Limpiar intervalo al cerrar página
window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});

console.log('🏭 Fábrica AR cargada correctamente');