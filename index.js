
```javascript
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function calcularInteresCompuesto(capital, tasaAnual, anos, frecuencia = 12) {
  // Fórmula: A = P(1 + r/n)^(nt)
  // A = monto final
  // P = capital inicial
  // r = tasa de interés anual (en decimal)
  // n = número de veces que se capitaliza por año
  // t = número de años
  
  const tasa = tasaAnual / 100;
  const monto = capital * Math.pow(1 + tasa / frecuencia, frecuencia * anos);
  const interes = monto - capital;
  
  return {
    capitalInicial: capital,
    montoFinal: monto,
    interesGanado: interes,
    tasaAnual: tasaAnual,
    anos: anos,
    frecuencia: frecuencia
  };
}

function generarDesglose(capital, tasaAnual, anos, frecuencia = 12) {
  // Genera un desglose año por año
  const tasa = tasaAnual / 100;
  const desglose = [];
  
  for (let ano = 0; ano <= anos; ano++) {
    const monto = capital * Math.pow(1 + tasa / frecuencia, frecuencia * ano);
    desglose.push({
      ano: ano,
      monto: monto,
      interes: monto - capital
    });
  }
  
  return desglose;
}

function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

function mostrarResultados(resultado) {
  console.log('\n' + '='.repeat(60));
  console.log('RESULTADOS DEL CÁLCULO DE INTERÉS COMPUESTO');
  console.log('='.repeat(60));
  console.log(`Capital Inicial:        ${formatearMoneda(resultado.capitalInicial)}`);
  console.log(`Tasa de Interés Anual:  ${resultado.tasaAnual}%`);
  console.log(`Período de Inversión:   ${resultado.anos} años`);
  console.log(`Frecuencia de Compuesto:${resultado.frecuencia} veces/año`);
  console.log('-'.repeat(60));
  console.log(`Interés Ganado:         ${formatearMoneda(resultado.interesGanado)}`);
  console.log(`Monto Final:            ${formatearMoneda(resultado.montoFinal)}`);
  console.log('='.repeat(60));
}

function mostrarDesglose(desglose) {
  console.log('\n' + '='.repeat(70));
  console.log('DESGLOSE AÑO POR AÑO');
  console.log('='.repeat(70));
  console.log('Año'.padEnd(8) + 'Monto Total'.padEnd(20) + 'Interés Ganado'.padEnd(20) + 'Ganancia %');
  console.log('-'.repeat(70));
  
  const capitalInicial = desglose[0].monto;
  
  for (const fila of desglose) {
    const porcentaje = ((fila.interes / capitalInicial) * 100).toFixed(2);
    console.log(
      fila.ano.toString().padEnd(8) +
      formatearMoneda(fila.monto).padEnd(20) +
      formatearMoneda(fila.interes).padEnd(20) +
      porcentaje + '%'
    );
  }
  
  console.log('='.repeat(70));
}

function calcularMetaDeInversion(capital, tasaAnual, metaMonto, frecuencia = 12) {
  // Calcula cuántos años se necesitan para alcanzar una meta
  // De A = P(1 + r/n)^(nt) despejamos t:
  // t = ln(A/P) / (n * ln(1 + r/n))
  
  if (metaMonto <= capital) {
    return { posible: false, mensaje: 'La meta debe ser mayor al capital inicial' };
  }
  
  const tasa = tasaAnual / 100;
  const tasaPeriodo = tasa / frecuencia;
  const anosNecesarios = Math.log(metaMonto / capital) / (frecuencia * Math.log(1 + tasaPeriodo));
  
  return {
    posible: true,
    anosNecesarios: anosNecesarios,
    metaMonto: metaMonto,
    capitalInicial: capital,
    tasaAnual: tasaAnual
  };
}

function mostrarMetaAlcanzada(resultado) {
  if (!resultado.posible) {
    console.log('\n' + '!'.repeat(60));
    console.log(resultado.mensaje);
    console.log('!'.repeat(60));
    return;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('CÁLCULO DE AÑOS NECESARIOS PARA ALCANZAR META');
  console.log('='.repeat(60));
  console.log(`Capital Inicial:        ${formatearMoneda(resultado.capitalInicial)}`);
  console.log(`Meta de Inversión:      ${formatearMoneda(resultado.metaMonto)}`);
  console.log(`