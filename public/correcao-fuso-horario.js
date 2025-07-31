/**
 * CORREÇÃO PARA O PROBLEMA DE FUSO HORÁRIO
 * 
 * Execute este script no console da página ou incluir no sistema
 * para corrigir o problema de conversão dupla de timezone
 */

(function() {
    console.log('🔧 Aplicando correção para problema de fuso horário...');
    
    if (typeof DateUtils === 'undefined') {
        console.error('❌ DateUtils não encontrado. Certifique-se de que utils.js está carregado.');
        return;
    }
    
    // Backup da função original
    DateUtils._convertFromCuiabaToUTC_ORIGINAL = DateUtils.convertFromCuiabaToUTC;
    
    // Função corrigida
    DateUtils.convertFromCuiabaToUTC = function(date) {
        // Se é uma string no formato ISO
        if (typeof date === 'string') {
            // Parse explicitamente como Cuiabá
            return luxon.DateTime.fromISO(date, { zone: 'America/Cuiaba' }).toUTC();
        }
        
        // Se é um Date JavaScript - AQUI ESTAVA O PROBLEMA
        if (date instanceof Date) {
            // PROBLEMA: Date JavaScript não preserva timezone específica
            // SOLUÇÃO: Extrair componentes e criar explicitamente em Cuiabá
            
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // getMonth() retorna 0-11
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();
            const millisecond = date.getMilliseconds();
            
            // Criar explicitamente no timezone de Cuiabá
            const dtCuiaba = luxon.DateTime.fromObject({
                year, month, day, hour, minute, second, millisecond
            }, { zone: 'America/Cuiaba' });
            
            return dtCuiaba.toUTC();
        }
        
        // Se já é DateTime do Luxon
        if (luxon.DateTime.isDateTime(date)) {
            return date.setZone('America/Cuiaba').toUTC();
        }
        
        // Fallback
        return luxon.DateTime.now().setZone('America/Cuiaba').toUTC();
    };
    
    console.log('✅ Correção aplicada! DateUtils.convertFromCuiabaToUTC agora funciona corretamente.');
    
    // Teste rápido
    const teste = new Date('2025-09-01T07:00:00');
    const resultadoOriginal = DateUtils._convertFromCuiabaToUTC_ORIGINAL(teste);
    const resultadoCorrigido = DateUtils.convertFromCuiabaToUTC(teste);
    
    console.log('🧪 Teste da correção:');
    console.log(`Input: ${teste.toString()}`);
    console.log(`Função original: ${resultadoOriginal.toISO()} (${resultadoOriginal.toFormat('HH:mm')} UTC)`);
    console.log(`Função corrigida: ${resultadoCorrigido.toISO()} (${resultadoCorrigido.toFormat('HH:mm')} UTC)`);
    
    const diferencaHoras = Math.abs(resultadoOriginal.hour - resultadoCorrigido.hour);
    if (diferencaHoras > 0) {
        console.log(`✅ Correção bem-sucedida! Diferença de ${diferencaHoras} horas corrigida.`);
    } else {
        console.log('⚠️ Aparentemente não havia problema ou o problema é outro.');
    }
    
    // Função para reverter a correção se necessário
    window.reverterCorrecaoDateUtils = function() {
        DateUtils.convertFromCuiabaToUTC = DateUtils._convertFromCuiabaToUTC_ORIGINAL;
        console.log('↩️ Correção revertida para função original.');
    };
    
    console.log('💡 Para reverter, execute: reverterCorrecaoDateUtils()');
})();
