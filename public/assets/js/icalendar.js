/**
 * ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
 * Utilitário para geração de arquivos iCalendar (.ics)
 * 
 * Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação
 */

// Utilitário para iCalendar
const ICalendarUtils = {
    /**
     * Gerar arquivo .ics para uma reserva
     */
    gerarICS(reserva) {
        try {
            // Montar lista de recursos
            let recursos = [];
            if (reserva.laboratorios) {
                recursos.push(`Laboratório: ${reserva.laboratorios.nome}`);
            }
            if (reserva.reserva_equipamentos && reserva.reserva_equipamentos.length > 0) {
                const equipamentos = reserva.reserva_equipamentos.map(re => re.equipamentos.nome).join(', ');
                recursos.push(`Equipamentos: ${equipamentos}`);
            }

            // Determinar local
            let local = 'FAEN/UFGD';
            if (reserva.laboratorios && reserva.laboratorios.blocos) {
                local = `${reserva.laboratorios.blocos.nome} - FAEN/UFGD`;
            } else if (reserva.reserva_equipamentos && reserva.reserva_equipamentos.length > 0) {
                const primeiroEquipamento = reserva.reserva_equipamentos[0];
                if (primeiroEquipamento.equipamentos.blocos) {
                    local = `${primeiroEquipamento.equipamentos.blocos.nome} - FAEN/UFGD`;
                }
            }

            // Criar datas no formato UTC
            const dataReserva = new Date(reserva.data_reserva + 'T' + reserva.hora_inicio);
            const dataFim = new Date(reserva.data_reserva + 'T' + reserva.hora_fim);
            
            // Ajustar para fuso horário de Cuiabá (UTC-4)
            dataReserva.setHours(dataReserva.getHours() + 4);
            dataFim.setHours(dataFim.getHours() + 4);

            // Formatar datas para iCalendar (YYYYMMDDTHHMMSSZ)
            const formatarDataICS = (data) => {
                return data.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
            };

            const dtStart = formatarDataICS(dataReserva);
            const dtEnd = formatarDataICS(dataFim);
            const dtStamp = formatarDataICS(new Date());

            // Gerar UID único
            const uid = `reserva-${reserva.protocolo}@reservalab.faen.ufgd.edu.br`;

            // Montar título do evento
            const titulo = recursos.length > 0 ? recursos.join(' | ') : 'Reserva FAEN/UFGD';

            // Montar descrição
            let descricao = `Reserva aprovada no sistema ReservaLAB\\n\\n`;
            descricao += `Protocolo: ${reserva.protocolo}\\n`;
            descricao += `Solicitante: ${reserva.nome_completo}\\n`;
            descricao += `Finalidade: ${reserva.finalidade}\\n`;
            if (reserva.professor_acompanhante) {
                descricao += `Professor/Técnico: ${reserva.professor_acompanhante}\\n`;
            }
            descricao += `\\nSistema ReservaLAB - FAEN/UFGD`;

            // Quebrar linhas longas (RFC 5545)
            const quebrarLinha = (texto, limite = 75) => {
                if (texto.length <= limite) return texto;
                
                let resultado = '';
                let linha = '';
                
                for (let i = 0; i < texto.length; i++) {
                    linha += texto[i];
                    
                    if (linha.length >= limite) {
                        resultado += linha + '\r\n ';
                        linha = '';
                    }
                }
                
                if (linha) {
                    resultado += linha;
                }
                
                return resultado;
            };

            // Montar conteúdo do arquivo .ics
            const icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//ReservaLAB//FAEN UFGD//PT-BR',
                'CALSCALE:GREGORIAN',
                'METHOD:PUBLISH',
                'BEGIN:VEVENT',
                `UID:${uid}`,
                `DTSTART:${dtStart}`,
                `DTEND:${dtEnd}`,
                `DTSTAMP:${dtStamp}`,
                quebrarLinha(`SUMMARY:${titulo}`),
                quebrarLinha(`DESCRIPTION:${descricao}`),
                quebrarLinha(`LOCATION:${local}`),
                'STATUS:CONFIRMED',
                'TRANSP:OPAQUE',
                'CATEGORIES:Reserva,FAEN,UFGD',
                'BEGIN:VALARM',
                'TRIGGER:-PT15M',
                'ACTION:DISPLAY',
                'DESCRIPTION:Lembrete: Reserva em 15 minutos',
                'END:VALARM',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');

            return icsContent;

        } catch (error) {
            console.error('Erro ao gerar arquivo ICS:', error);
            throw new Error('Erro ao gerar arquivo de calendário');
        }
    },

    /**
     * Fazer download do arquivo .ics
     */
    downloadICS(reserva) {
        try {
            const icsContent = this.gerarICS(reserva);
            
            // Criar blob
            const blob = new Blob([icsContent], { 
                type: 'text/calendar;charset=utf-8' 
            });
            
            // Criar URL temporária
            const url = window.URL.createObjectURL(blob);
            
            // Criar link de download
            const link = document.createElement('a');
            link.href = url;
            link.download = `reserva-${reserva.protocolo}.ics`;
            
            // Adicionar ao DOM temporariamente e clicar
            document.body.appendChild(link);
            link.click();
            
            // Limpar
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            Utils.showToast('Arquivo de calendário baixado com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro ao fazer download do ICS:', error);
            Utils.showToast('Erro ao baixar arquivo de calendário', 'danger');
        }
    },

    /**
     * Gerar botão de download para reservas aprovadas
     */
    gerarBotaoDownload(reserva, tamanho = 'sm') {
        if (reserva.status !== 'aprovada') {
            return '';
        }

        const classes = tamanho === 'sm' ? 'btn-sm' : '';
        
        return `
            <button type="button" class="btn btn-success ${classes}" 
                    onclick="ICalendarUtils.downloadICS(${JSON.stringify(reserva).replace(/"/g, '&quot;')})"
                    title="Adicionar ao calendário pessoal">
                <i class="bi bi-calendar-plus"></i> 
                ${tamanho !== 'sm' ? 'Adicionar ao Calendário' : ''}
            </button>
        `;
    },

    /**
     * Gerar link de download para reservas aprovadas
     */
    gerarLinkDownload(reserva) {
        if (reserva.status !== 'aprovada') {
            return '';
        }

        return `
            <a href="#" class="text-success text-decoration-none" 
               onclick="ICalendarUtils.downloadICS(${JSON.stringify(reserva).replace(/"/g, '&quot;')}); return false;"
               title="Adicionar ao calendário pessoal">
                <i class="bi bi-calendar-plus"></i> Adicionar ao Calendário
            </a>
        `;
    },

    /**
     * Verificar se o navegador suporta download de arquivos
     */
    suportaDownload() {
        return !!(window.Blob && window.URL && window.URL.createObjectURL);
    },

    /**
     * Gerar URL de calendário online (Google Calendar, Outlook, etc.)
     */
    gerarURLsCalendario(reserva) {
        if (reserva.status !== 'aprovada') {
            return {};
        }

        try {
            // Montar dados básicos
            let recursos = [];
            if (reserva.laboratorios) {
                recursos.push(`Laboratório: ${reserva.laboratorios.nome}`);
            }
            if (reserva.reserva_equipamentos && reserva.reserva_equipamentos.length > 0) {
                const equipamentos = reserva.reserva_equipamentos.map(re => re.equipamentos.nome).join(', ');
                recursos.push(`Equipamentos: ${equipamentos}`);
            }

            const titulo = recursos.length > 0 ? recursos.join(' | ') : 'Reserva FAEN/UFGD';
            
            let local = 'FAEN/UFGD';
            if (reserva.laboratorios && reserva.laboratorios.blocos) {
                local = `${reserva.laboratorios.blocos.nome} - FAEN/UFGD`;
            }

            let descricao = `Reserva aprovada no sistema ReservaLAB\n\n`;
            descricao += `Protocolo: ${reserva.protocolo}\n`;
            descricao += `Solicitante: ${reserva.nome_completo}\n`;
            descricao += `Finalidade: ${reserva.finalidade}\n`;
            if (reserva.professor_acompanhante) {
                descricao += `Professor/Técnico: ${reserva.professor_acompanhante}\n`;
            }

            // Criar datas
            const dataInicio = new Date(reserva.data_reserva + 'T' + reserva.hora_inicio);
            const dataFim = new Date(reserva.data_reserva + 'T' + reserva.hora_fim);

            // Formatar para URLs
            const formatarDataURL = (data) => {
                return data.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
            };

            const dtStart = formatarDataURL(dataInicio);
            const dtEnd = formatarDataURL(dataFim);

            // URLs dos calendários online
            const urls = {
                google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&dates=${dtStart}/${dtEnd}&details=${encodeURIComponent(descricao)}&location=${encodeURIComponent(local)}`,
                
                outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(titulo)}&startdt=${dtStart}&enddt=${dtEnd}&body=${encodeURIComponent(descricao)}&location=${encodeURIComponent(local)}`,
                
                yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(titulo)}&st=${dtStart}&et=${dtEnd}&desc=${encodeURIComponent(descricao)}&in_loc=${encodeURIComponent(local)}`
            };

            return urls;

        } catch (error) {
            console.error('Erro ao gerar URLs de calendário:', error);
            return {};
        }
    },

    /**
     * Gerar dropdown com opções de calendário
     */
    gerarDropdownCalendario(reserva, tamanho = 'sm') {
        if (reserva.status !== 'aprovada') {
            return '';
        }

        const urls = this.gerarURLsCalendario(reserva);
        const classes = tamanho === 'sm' ? 'btn-sm' : '';
        const dropdownId = `dropdown-calendario-${reserva.id || Date.now()}`;

        return `
            <div class="dropdown">
                <button class="btn btn-success ${classes} dropdown-toggle" type="button" 
                        id="${dropdownId}" data-bs-toggle="dropdown" aria-expanded="false"
                        title="Adicionar ao calendário">
                    <i class="bi bi-calendar-plus"></i> 
                    ${tamanho !== 'sm' ? 'Adicionar ao Calendário' : ''}
                </button>
                <ul class="dropdown-menu" aria-labelledby="${dropdownId}">
                    <li>
                        <a class="dropdown-item" href="#" 
                           onclick="ICalendarUtils.downloadICS(${JSON.stringify(reserva).replace(/"/g, '&quot;')}); return false;">
                            <i class="bi bi-download"></i> Baixar arquivo .ics
                        </a>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    ${urls.google ? `
                        <li>
                            <a class="dropdown-item" href="${urls.google}" target="_blank">
                                <i class="bi bi-google"></i> Google Calendar
                            </a>
                        </li>
                    ` : ''}
                    ${urls.outlook ? `
                        <li>
                            <a class="dropdown-item" href="${urls.outlook}" target="_blank">
                                <i class="bi bi-microsoft"></i> Outlook
                            </a>
                        </li>
                    ` : ''}
                    ${urls.yahoo ? `
                        <li>
                            <a class="dropdown-item" href="${urls.yahoo}" target="_blank">
                                <i class="bi bi-yahoo"></i> Yahoo Calendar
                            </a>
                        </li>
                    ` : ''}
                </ul>
            </div>
        `;
    }
};

// Exportar para uso global
window.ICalendarUtils = ICalendarUtils;

