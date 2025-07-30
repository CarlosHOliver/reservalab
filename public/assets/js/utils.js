/**
 * ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
 * Utilitários Gerais
 * 
 * Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação
 */

const Utils = {
    /**
     * Exibe um toast de notificação.
     */
    showToast(message, type = 'info', duration = 3000) {
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.style.position = 'fixed';
            toastContainer.style.top = '20px';
            toastContainer.style.right = '20px';
            toastContainer.style.zIndex = '1050';
            document.body.appendChild(toastContainer);
        }

        const toastId = `toast-${Date.now()}`;
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        const toastEl = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastEl, { delay: duration });
        toast.show();

        toastEl.addEventListener('hidden.bs.toast', function () {
            toastEl.remove();
        });
    },

    /**
     * Formata telefone para padrão (99) 99999-9999 ou (99) 9999-9999
     */
    formatarTelefone(valor) {
        if (!valor) return '';
        valor = valor.replace(/\D/g, '');
        if (valor.length > 11) valor = valor.slice(0, 11);
        if (valor.length > 10) {
            return valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (valor.length > 6) {
            return valor.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
        } else if (valor.length > 2) {
            return valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else {
            return valor;
        }
    },

    /**
     * Capitaliza a primeira letra de uma string.
     */
    capitalize(s) {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    },

    /**
     * Debounce para funções.
     */
    debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    },

    /**
     * Exibe um loading simples em um container.
     */
    showLoading(container, message = 'Carregando...') {
        if (container) {
            container.innerHTML = `<div class="d-flex align-items-center gap-2"><span class="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span> <span>${message}</span></div>`;
        }
    },

    /**
     * Remove o loading de um container.
     */
    hideLoading(container) {
        if (container) {
            container.innerHTML = '';
        }
    },

    /**
     * Adiciona mensagem de erro a um campo do formulário.
     */
    adicionarErro(campoId, mensagem) {
        const campo = document.getElementById(campoId);
        if (!campo) return;
        campo.classList.add('is-invalid');
        let feedback = campo.parentElement.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            campo.parentElement.appendChild(feedback);
        }
        feedback.textContent = mensagem;
    },

    /**
     * Remove mensagem de erro de um campo do formulário.
     */
    removerErro(campoId) {
        const campo = document.getElementById(campoId);
        if (!campo) return;
        campo.classList.remove('is-invalid');
        let feedback = campo.parentElement.querySelector('.invalid-feedback');
        if (feedback) feedback.textContent = '';
    },

    /**
     * Valida todos os campos obrigatórios do formulário.
     * Retorna true se válido, false se houver campos inválidos.
     */
    validarFormulario(form) {
        let valido = true;
        // Seleciona todos os campos obrigatórios visíveis
        const campos = form.querySelectorAll('[required]:not([type=hidden]):not([disabled])');
        campos.forEach(campo => {
            if (!campo.value || campo.classList.contains('is-invalid')) {
                campo.classList.add('is-invalid');
                valido = false;
            } else {
                campo.classList.remove('is-invalid');
            }
        });
        return valido;
    }
};

// Utilitários de data/hora para fuso horário de Cuiabá usando Luxon
const DateUtils = {
    ZONA: 'America/Cuiaba',

    /**
     * Retorna um DateTime Luxon na zona de Cuiabá a partir de uma string ou Date.
     */
    toCuiaba(dt) {
        if (typeof dt === 'string') {
            return luxon.DateTime.fromISO(dt, { zone: this.ZONA });
        } else if (dt instanceof Date) {
            return luxon.DateTime.fromJSDate(dt, { zone: this.ZONA });
        } else if (luxon.DateTime.isDateTime(dt)) {
            return dt.setZone(this.ZONA);
        }
        return luxon.DateTime.now().setZone(this.ZONA);
    },

    /**
     * Converte uma data/hora UTC para Cuiabá (DateTime Luxon)
     */
    convertToCuiabaTime(date) {
        return this.toCuiaba(date);
    },

    /**
     * Converte uma data/hora de Cuiabá para UTC (DateTime Luxon)
     */
    convertFromCuiabaToUTC(date) {
        return this.toCuiaba(date).toUTC();
    },

    /**
     * Formata uma data para exibição (DD/MM/AAAA)
     */
    formatarData(dt) {
        return this.toCuiaba(dt).toFormat('dd/MM/yyyy');
    },

    /**
     * Formata uma hora para exibição (HH:mm)
     */
    formatarHora(dt) {
        return this.toCuiaba(dt).toFormat('HH:mm');
    },

    /**
     * Formata uma data e hora para exibição (DD/MM/AAAA HH:mm)
     */
    formatarDataHora(dt) {
        return this.toCuiaba(dt).toFormat('dd/MM/yyyy HH:mm');
    },

    /**
     * Obtém a data atual em Cuiabá (DateTime Luxon)
     */
    getCurrentCuiabaDate() {
        return luxon.DateTime.now().setZone(this.ZONA);
    },

    /**
     * Obtém a data mínima para reservas (hoje, formato ISO)
     */
    getDataMinima() {
        return this.getCurrentCuiabaDate().toISODate();
    },

    /**
     * Obtém a data máxima para reservas (2 meses à frente, formato ISO)
     */
    getDataMaxima() {
        return this.getCurrentCuiabaDate().plus({ months: 2 }).toISODate();
    }
};

// Utilitários específicos para reservas
const ReservaUtils = {
    /**
     * Calcular datas para recorrência
     */
    calcularRecorrencia(dataInicial, tipoRecorrencia, dataFim) {
        if (!dataInicial || !tipoRecorrencia || tipoRecorrencia === 'nenhuma' || !dataFim) {
            return [new Date(dataInicial)];
        }

        const datas = [];
        const dataInicio = new Date(dataInicial);
        const dataLimite = new Date(dataFim);
        const dataAtual = new Date(dataInicio);

        // Incluir a data inicial
        datas.push(new Date(dataAtual));

        while (dataAtual < dataLimite) {
            switch (tipoRecorrencia) {
                case 'diaria':
                    dataAtual.setDate(dataAtual.getDate() + 1);
                    break;
                case 'semanal':
                    dataAtual.setDate(dataAtual.getDate() + 7);
                    break;
                case 'mensal':
                    dataAtual.setMonth(dataAtual.getMonth() + 1);
                    break;
                default:
                    return datas; // Se tipo inválido, retorna apenas a data inicial
            }

            // Verificar se a nova data não ultrapassou o limite
            if (dataAtual <= dataLimite) {
                datas.push(new Date(dataAtual));
            }
        }

        return datas;
    },

    /**
     * Formatar status da reserva para exibição
     */
    formatarStatus(status) {
        const statusMap = {
            'pendente': { texto: 'Pendente', classe: 'bg-warning' },
            'aprovada': { texto: 'Aprovada', classe: 'bg-success' },
            'rejeitada': { texto: 'Rejeitada', classe: 'bg-danger' },
            'cancelada': { texto: 'Cancelada', classe: 'bg-secondary' }
        };

        return statusMap[status] || { texto: 'Desconhecido', classe: 'bg-secondary' };
    },

    /**
     * Verificar se uma reserva está em andamento
     */
    isReservaEmAndamento(dataReserva, horaInicio, horaFim) {
        try {
            const agora = DateUtils.getCurrentCuiabaDate();
            const dataReservaDate = DateUtils.toCuiaba(dataReserva);
            
            // Verificar se é o mesmo dia
            if (!agora.hasSame(dataReservaDate, 'day')) {
                return false;
            }

            // Criar DateTime para início e fim da reserva
            const inicioReserva = dataReservaDate.set({
                hour: parseInt(horaInicio.split(':')[0]),
                minute: parseInt(horaInicio.split(':')[1])
            });
            
            const fimReserva = dataReservaDate.set({
                hour: parseInt(horaFim.split(':')[0]),
                minute: parseInt(horaFim.split(':')[1])
            });

            // Verificar se o horário atual está entre o início e fim da reserva
            return agora >= inicioReserva && agora <= fimReserva;
        } catch (error) {
            console.error('Erro ao verificar se reserva está em andamento:', error);
            return false;
        }
    }
};

// Exportar para uso global
window.Utils = Utils;
window.DateUtils = DateUtils;
window.ReservaUtils = ReservaUtils;

