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
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            const div = document.createElement('div');
            div.id = 'toastContainer';
            div.style.position = 'fixed';
            div.style.top = '20px';
            div.style.right = '20px';
            div.style.zIndex = '1050';
            document.body.appendChild(div);
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
    }
};

const DateUtils = {
    // Fuso horário de Cuiabá (UTC-4)
    TIMEZONE_OFFSET_CUIABA: -4 * 60, // em minutos

    /**
     * Converte uma data/hora UTC para o fuso horário de Cuiabá.
     * @param {Date} date Objeto Date em UTC.
     * @returns {Date} Objeto Date no fuso horário de Cuiabá.
     */
    convertToCuiabaTime(date) {
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        return new Date(utc + (this.TIMEZONE_OFFSET_CUIABA * 60000));
    },

    /**
     * Converte uma data/hora no fuso horário de Cuiabá para UTC.
     * @param {Date} date Objeto Date no fuso horário de Cuiabá.
     * @returns {Date} Objeto Date em UTC.
     */
    convertFromCuiabaToUTC(date) {
        const cuiabaTime = date.getTime() - (this.TIMEZONE_OFFSET_CUIABA * 60000);
        return new Date(cuiabaTime - (date.getTimezoneOffset() * 60000));
    },

    /**
     * Formata uma data para exibição (DD/MM/AAAA).
     * @param {string | Date} dateString Data em formato string ou objeto Date.
     * @returns {string} Data formatada.
     */
    formatarData(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    },

    /**
     * Formata uma hora para exibição (HH:MM).
     * @param {string} timeString Hora em formato string (HH:MM:SS ou HH:MM).
     * @returns {string} Hora formatada.
     */
    formatarHora(timeString) {
        if (!timeString) return '';
        const parts = timeString.split(':');
        return `${parts[0]}:${parts[1]}`;
    },

    /**
     * Formata uma data e hora para exibição (DD/MM/AAAA HH:MM).
     * @param {string | Date} dateTimeString Data e hora em formato string ou objeto Date.
     * @returns {string} Data e hora formatada.
     */
    formatarDataHora(dateTimeString) {
        const date = new Date(dateTimeString);
        const formattedDate = this.formatarData(date);
        const formattedTime = this.formatarHora(date.toTimeString());
        return `${formattedDate} ${formattedTime}`;
    },

    /**
     * Obtém a data atual no fuso horário de Cuiabá.
     * @returns {Date} Objeto Date representando a data e hora atual em Cuiabá.
     */
    getCurrentCuiabaDate() {
        const now = new Date();
        return this.convertToCuiabaTime(now);
    },

    /**
     * Obtém a data de amanhã no fuso horário de Cuiabá.
     * @returns {Date} Objeto Date representando a data de amanhã em Cuiabá.
     */
    getTomorrowCuiabaDate() {
        const today = this.getCurrentCuiabaDate();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow;
    }
};

// Exportar para uso global
window.Utils = Utils;
window.DateUtils = DateUtils;

