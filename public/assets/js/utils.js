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

// Exportar para uso global
window.Utils = Utils;
if (window.DateUtils) window.DateUtils = window.DateUtils;

