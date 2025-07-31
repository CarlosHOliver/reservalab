/**
 * ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
 * API JavaScript para comunicação com Supabase
 * 
 * Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação
 */

// API principal do sistema
const API = {
    /**
     * Buscar todos os blocos
     */
    async buscarBlocos() {
        try {
            const { data, error } = await supabase
                .from('blocos')
                .select('*')
                .order('nome');

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (error) {
            console.error('Erro ao buscar blocos:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Buscar laboratórios por bloco
     */
    async buscarLaboratoriosPorBloco(blocoId) {
        try {
            const { data, error } = await supabase
                .from('laboratorios')
                .select('*')
                .eq('bloco_id', blocoId)
                .eq('ativo', true)
                .order('nome');

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (error) {
            console.error('Erro ao buscar laboratórios:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Buscar laboratório por ID
     */
    async buscarLaboratorioPorId(laboratorioId) {
        try {
            const { data, error } = await supabase
                .from('laboratorios')
                .select('*')
                .eq('id', laboratorioId)
                .eq('ativo', true)
                .single();

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (error) {
            console.error('Erro ao buscar laboratório:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Buscar equipamentos por bloco
     */
    async buscarEquipamentosPorBloco(blocoId) {
        try {
            const { data, error } = await supabase
                .from('equipamentos')
                .select('*')
                .eq('bloco_id', blocoId)
                .eq('ativo', true)
                .eq('status', 'disponivel')
                .order('nome');

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (error) {
            console.error('Erro ao buscar equipamentos:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Buscar todos os equipamentos
     */
    async buscarEquipamentos() {
        try {
            const { data, error } = await supabase
                .from('equipamentos')
                .select(`
                    *,
                    blocos (nome)
                `)
                .eq('ativo', true)
                .order('nome');

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (error) {
            console.error('Erro ao buscar equipamentos:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Buscar todos os usuários
     */
    async buscarUsuarios() {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select(`
                    *,
                    blocos (nome)
                `)
                .order('nome');

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Criar novo usuário
     */
    async criarUsuario(dadosUsuario) {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .insert([dadosUsuario])
                .select();

            if (error) throw error;
            return { sucesso: true, dados: data[0] };
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Atualizar usuário
     */
    async atualizarUsuario(id, dadosUsuario) {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .update(dadosUsuario)
                .eq('id', id)
                .select();

            if (error) throw error;
            return { sucesso: true, dados: data[0] };
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Excluir usuário (soft delete)
     */
    async excluirUsuario(id) {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .update({ ativo: false })
                .eq('id', id)
                .select();

            if (error) throw error;
            return { sucesso: true, dados: data[0] };
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Verificar se login já existe
     */
    async verificarLoginExistente(login, idExcluir = null) {
        try {
            let query = supabase
                .from('usuarios')
                .select('id')
                .eq('login', login);

            if (idExcluir) {
                query = query.neq('id', idExcluir);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { sucesso: true, existe: data.length > 0 };
        } catch (error) {
            console.error('Erro ao verificar login:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Verificar se email já existe
     */
    async verificarEmailExistente(email, idExcluir = null) {
        try {
            let query = supabase
                .from('usuarios')
                .select('id')
                .eq('email', email);

            if (idExcluir) {
                query = query.neq('id', idExcluir);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { sucesso: true, existe: data.length > 0 };
        } catch (error) {
            console.error('Erro ao verificar email:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Verificar credenciais de usuário
     */
    async verificarCredenciais(login, senha) {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('id, nome, senha_hash, ativo')
                .eq('login', login)
                .eq('ativo', true)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return { sucesso: false, erro: 'Usuário não encontrado' };
                }
                throw error;
            }

            // Verificar senha usando bcrypt (assumindo que está disponível globalmente)
            if (typeof bcrypt !== 'undefined' || typeof window.bcrypt !== 'undefined') {
                const bcryptLib = typeof bcrypt !== 'undefined' ? bcrypt : window.bcrypt;
                const senhaValida = bcryptLib.compareSync(senha, data.senha_hash);
                
                if (senhaValida) {
                    return { sucesso: true, dados: { id: data.id, nome: data.nome } };
                } else {
                    return { sucesso: false, erro: 'Senha inválida' };
                }
            } else {
                // Fallback simples para teste (remover em produção)
                console.warn('bcrypt não disponível, usando verificação simples');
                return { sucesso: true, dados: { id: data.id, nome: data.nome } };
            }

        } catch (error) {
            console.error('Erro ao verificar credenciais:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Criar novo report/ocorrência
     */
    async criarReport(dadosReport) {
        try {
            const { data, error } = await supabase
                .from('reports_ocorrencias')
                .insert([dadosReport])
                .select();

            if (error) throw error;
            return { sucesso: true, dados: data[0] };
        } catch (error) {
            console.error('Erro ao criar report:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Buscar todos os reports
     */
    async buscarReports(filtros = {}) {
        try {
            let query = supabase
                .from('reports_ocorrencias')
                .select(`
                    *,
                    ciente_por_usuario:usuarios!ciente_por(nome, login)
                `)
                .order('created_at', { ascending: false });

            // Aplicar filtros se fornecidos
            if (filtros.status) {
                query = query.eq('status', filtros.status);
            }
            if (filtros.ciente !== undefined) {
                query = query.eq('ciente', filtros.ciente);
            }
            if (filtros.tipo_eventualidade) {
                query = query.eq('tipo_eventualidade', filtros.tipo_eventualidade);
            }
            if (filtros.dataInicio && filtros.dataFim) {
                query = query.gte('created_at', filtros.dataInicio)
                            .lte('created_at', filtros.dataFim);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (error) {
            console.error('Erro ao buscar reports:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Marcar report como ciente
     */
    async marcarReportCiente(reportId, usuarioId, observacoes = null) {
        try {
            const dadosAtualizacao = {
                ciente: true,
                ciente_por: usuarioId,
                ciente_em: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            if (observacoes) {
                dadosAtualizacao.observacoes_gestao = observacoes;
            }

            const { data, error } = await supabase
                .from('reports_ocorrencias')
                .update(dadosAtualizacao)
                .eq('id', reportId)
                .select();

            if (error) throw error;
            return { sucesso: true, dados: data[0] };
        } catch (error) {
            console.error('Erro ao marcar report como ciente:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Atualizar status do report
     */
    async atualizarStatusReport(reportId, novoStatus, observacoes = null) {
        try {
            const dadosAtualizacao = {
                status: novoStatus,
                updated_at: new Date().toISOString()
            };

            if (observacoes) {
                dadosAtualizacao.observacoes_gestao = observacoes;
            }

            const { data, error } = await supabase
                .from('reports_ocorrencias')
                .update(dadosAtualizacao)
                .eq('id', reportId)
                .select();

            if (error) throw error;
            return { sucesso: true, dados: data[0] };
        } catch (error) {
            console.error('Erro ao atualizar status do report:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Buscar estatísticas de reports
     */
    async buscarEstatisticasReports() {
        try {
            const [
                { data: totalReports },
                { data: reportsPendentes },
                { data: reportsResolvidos },
                { data: reportsUltimos7Dias }
            ] = await Promise.all([
                supabase.from('reports_ocorrencias').select('id'),
                supabase.from('reports_ocorrencias').select('id').eq('ciente', false),
                supabase.from('reports_ocorrencias').select('id').eq('status', 'resolvido'),
                supabase.from('reports_ocorrencias').select('id')
                    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            ]);

            return {
                sucesso: true,
                dados: {
                    total: totalReports?.length || 0,
                    pendentes: reportsPendentes?.length || 0,
                    resolvidos: reportsResolvidos?.length || 0,
                    ultimos7Dias: reportsUltimos7Dias?.length || 0
                }
            };
        } catch (error) {
            console.error('Erro ao buscar estatísticas de reports:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Buscar todos os laboratórios
     */
    async buscarLaboratorios() {
        try {
            const { data, error } = await supabase
                .from('laboratorios')
                .select(`
                    *,
                    blocos (nome)
                `)
                .eq('ativo', true)
                .order('nome');

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (error) {
            console.error('Erro ao buscar laboratórios:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Criar nova reserva
     */
    async criarReserva(dadosReserva) {
        try {
            // SIMPLIFICAÇÃO: Usar dados diretos sem conversão de timezone
            // Se o usuário escolhe 7h, gravamos 7h no banco!
            
            const { data: reservaCriada, error: errorReserva } = await supabase
                .from("reservas")
                .insert([{
                    nome_completo: dadosReserva.nomeCompleto,
                    siape_rga: dadosReserva.siapeRga,
                    email: dadosReserva.email,
                    telefone: dadosReserva.telefone,
                    data_reserva: dadosReserva.dataReserva,
                    hora_inicio: dadosReserva.horaInicio,
                    hora_fim: dadosReserva.horaFim,
                    finalidade: dadosReserva.finalidade,
                    laboratorio_id: dadosReserva.laboratorioId || null,
                    professor_acompanhante: dadosReserva.professorAcompanhante,
                    recorrencia_tipo: dadosReserva.recorrenciaTipo || "nenhuma",
                    recorrencia_fim: dadosReserva.recorrenciaFim || null
                }])
                .select('id, protocolo')
                .single();

            if (errorReserva) throw errorReserva;

            // Usar a reserva criada
            const reservaFinal = reservaCriada;

            // Se há equipamentos, associá-los à reserva
            if (dadosReserva.equipamentos && dadosReserva.equipamentos.length > 0) {
                const equipamentosReserva = dadosReserva.equipamentos.map(equipamentoId => ({
                    reserva_id: reservaFinal.id,
                    equipamento_id: equipamentoId
                }));

                const { error: errorEquipamentos } = await supabase
                    .from('reserva_equipamentos')
                    .insert(equipamentosReserva);

                if (errorEquipamentos) throw errorEquipamentos;
            }

            // Se há recorrência, criar reservas filhas
            if (dadosReserva.recorrenciaTipo && dadosReserva.recorrenciaTipo !== 'nenhuma') {
                await this.criarReservasRecorrentes(reservaFinal, dadosReserva);
            }

            return { sucesso: true, dados: reservaFinal };
        } catch (error) {
            console.error('Erro ao criar reserva:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Criar reservas recorrentes
     */
    async criarReservasRecorrentes(reservaPai, dadosReserva) {
        try {
            const datas = ReservaUtils.calcularRecorrencia(
                dadosReserva.dataReserva,
                dadosReserva.recorrenciaTipo,
                dadosReserva.recorrenciaFim
            );

            // Remover a primeira data (já criada)
            datas.shift();

            for (const data of datas) {
                // Converter data e horários para UTC de forma consistente
                // SIMPLIFICAÇÃO: Usar dados diretos para reservas recorrentes também
                const dataFormatada = data.toISOString().split("T")[0];
                
                // Criar reserva filha
                const { data: reservaFilha, error } = await supabase
                    .from('reservas')
                    .insert([{
                        protocolo: reservaPai.protocolo, // Usar o mesmo protocolo da reserva pai
                        nome_completo: dadosReserva.nomeCompleto,
                        siape_rga: dadosReserva.siapeRga,
                        email: dadosReserva.email,
                        telefone: dadosReserva.telefone,
                        data_reserva: dataFormatada,
                        hora_inicio: dadosReserva.horaInicio,
                        hora_fim: dadosReserva.horaFim,
                        finalidade: dadosReserva.finalidade,
                        laboratorio_id: dadosReserva.laboratorioId || null,
                        professor_acompanhante: dadosReserva.professorAcompanhante,
                        recorrencia_tipo: dadosReserva.recorrenciaTipo,
                        recorrencia_fim: dadosReserva.recorrenciaFim,
                        reserva_pai_id: reservaPai.id
                    }])
                    .select()
                    .single();

                if (error) throw error;

                // Associar equipamentos se houver
                if (dadosReserva.equipamentos && dadosReserva.equipamentos.length > 0) {
                    const equipamentosReserva = dadosReserva.equipamentos.map(equipamentoId => ({
                        reserva_id: reservaFilha.id,
                        equipamento_id: equipamentoId
                    }));

                    const { error: errorEquipamentos } = await supabase
                        .from('reserva_equipamentos')
                        .insert(equipamentosReserva);

                    if (errorEquipamentos) throw errorEquipamentos;
                }
            }

            return { sucesso: true };
        } catch (error) {
            console.error('Erro ao criar reservas recorrentes:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Buscar reservas por protocolo (incluindo recorrências)
     */
    async buscarReservaPorProtocolo(protocolo) {
        try {
            // Limpar protocolo de espaços e caracteres especiais
            const protocoloLimpo = protocolo.toString().trim();
            console.log('🔍 API: Buscando protocolo:', protocoloLimpo, '(original:', protocolo, ')');
            
            const { data, error } = await supabase
                .from('reservas')
                .select(`
                    *,
                    laboratorios (nome),
                    reserva_equipamentos (
                        equipamentos (nome)
                    )
                `)
                .eq('protocolo', protocoloLimpo)
                .order('data_reserva', { ascending: true })
                .order('hora_inicio', { ascending: true });

            console.log('🔍 API: Resultado da query:', { data, error });

            if (error) {
                console.error('🔍 API: Erro no Supabase:', error);
                throw error;
            }
            
            if (!data || data.length === 0) {
                console.log('🔍 API: Nenhum dado encontrado para protocolo:', protocoloLimpo);
                
                // Fazer busca alternativa mais permissiva
                console.log('🔍 API: Tentando busca alternativa...');
                const { data: dataAlternativa, error: errorAlternativo } = await supabase
                    .from('reservas')
                    .select(`
                        *,
                        laboratorios (nome),
                        reserva_equipamentos (
                            equipamentos (nome)
                        )
                    `)
                    .ilike('protocolo', `%${protocoloLimpo}%`)
                    .order('data_reserva', { ascending: true })
                    .order('hora_inicio', { ascending: true });
                
                if (errorAlternativo) {
                    console.error('🔍 API: Erro na busca alternativa:', errorAlternativo);
                    return { sucesso: false, erro: 'Reserva não encontrada' };
                }
                
                if (!dataAlternativa || dataAlternativa.length === 0) {
                    return { sucesso: false, erro: 'Reserva não encontrada' };
                }
                
                console.log('🔍 API: Encontrado via busca alternativa:', dataAlternativa);
                return { sucesso: true, dados: dataAlternativa };
            }
            
            console.log('🔍 API: Reserva(s) encontrada(s):', data);
            return { sucesso: true, dados: data };
        } catch (error) {
            console.error('🔍 API: Erro geral ao buscar reserva:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Verificar conflitos de horário
     */
    async verificarConflitos(dataReserva, horaInicio, horaFim, laboratorioId = null, equipamentosIds = []) {
        try {
            let query = supabase
                .from('reservas')
                .select(`
                    *,
                    laboratorios (nome),
                    reserva_equipamentos (
                        equipamentos (nome)
                    )
                `)
                .eq('data_reserva', dataReserva)
                .eq('status', 'aprovada');

            // Se há laboratório específico, verificar conflitos
            if (laboratorioId) {
                query = query.eq('laboratorio_id', laboratorioId);
            }

            const { data: reservas, error } = await query;
            if (error) throw error;

            const conflitos = [];

            for (const reserva of reservas) {
                const inicioExistente = new Date(`2000-01-01T${reserva.hora_inicio}`);
                const fimExistente = new Date(`2000-01-01T${reserva.hora_fim}`);
                const inicioNova = new Date(`2000-01-01T${horaInicio}`);
                const fimNova = new Date(`2000-01-01T${horaFim}`);

                // Verificar sobreposição de horários
                if (inicioNova < fimExistente && fimNova > inicioExistente) {
                    // Verificar se há conflito de laboratório
                    if (laboratorioId && reserva.laboratorio_id === laboratorioId) {
                        conflitos.push({
                            tipo: 'laboratorio',
                            reserva: reserva,
                            recurso: reserva.laboratorios?.nome
                        });
                    }

                    // Verificar conflitos de equipamentos
                    if (equipamentosIds.length > 0) {
                        const equipamentosReserva = reserva.reserva_equipamentos?.map(re => re.equipamentos?.id) || [];
                        const equipamentosConflito = equipamentosIds.filter(id => equipamentosReserva.includes(id));
                        
                        if (equipamentosConflito.length > 0) {
                            conflitos.push({
                                tipo: 'equipamento',
                                reserva: reserva,
                                equipamentos: equipamentosConflito
                            });
                        }
                    }
                }
            }

            return { sucesso: true, dados: conflitos };
        } catch (error) {
            console.error('Erro ao verificar conflitos:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Buscar reservas para calendário
     */
    async buscarReservasCalendario(dataInicio, dataFim, status = null) {
        try {
            let query = supabase
                .from('reservas')
                .select(`
                    *,
                    laboratorios (nome, blocos (nome)),
                    reserva_equipamentos (
                        equipamentos (nome, blocos (nome))
                    )
                `)
                .gte('data_reserva', dataInicio)
                .lte('data_reserva', dataFim)
                .order('data_reserva')
                .order('hora_inicio');

            // Adicionar filtro de status apenas se especificado
            if (status && status !== '') {
                query = query.eq('status', status);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (error) {
            console.error('Erro ao buscar reservas do calendário:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Buscar reservas do dia para dashboard patrimonial
     */
    async buscarReservasDia(data) {
        try {
            const { data: reservas, error } = await supabase
                .from('reservas')
                .select(`
                    *,
                    laboratorios (nome, blocos (nome)),
                    reserva_equipamentos (
                        equipamentos (nome, blocos (nome))
                    )
                `)
                .eq('data_reserva', data)
                .eq('status', 'aprovada')
                .order('hora_inicio');

            if (error) throw error;
            return { sucesso: true, dados: reservas };
        } catch (error) {
            console.error('Erro ao buscar reservas do dia:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Criar report patrimonial
     */
    async criarReportPatrimonial(dadosReport) {
        try {
            const { data, error } = await supabase
                .from('reports_patrimoniais')
                .insert([{
                    reserva_id: dadosReport.reservaId || null,
                    tipo_report: dadosReport.tipoReport,
                    descricao: dadosReport.descricao,
                    reportado_por: dadosReport.reportadoPor || 'Portaria'
                }])
                .select()
                .single();

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (error) {
            console.error('Erro ao criar report:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Buscar configurações patrimoniais
     */
    async buscarConfiguracaoPatrimonial(chave) {
        try {
            const { data, error } = await supabase
                .from('patrimonial_config')
                .select('valor')
                .eq('chave', chave)
                .single();

            if (error) throw error;
            return { sucesso: true, dados: data?.valor };
        } catch (error) {
            console.error('Erro ao buscar configuração:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Verificar senha de report patrimonial
     */
    async verificarSenhaReport(senha) {
        try {
            const resultado = await this.buscarConfiguracaoPatrimonial('senha_report');
            if (!resultado.sucesso) return { sucesso: false, erro: 'Erro ao verificar senha' };
            
            return { sucesso: true, dados: resultado.dados === senha };
        } catch (error) {
            console.error('Erro ao verificar senha:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    /**
     * Buscar formulários de acesso
     */
    async buscarFormulariosAcesso() {
        try {
            const { data, error } = await supabase
                .from('formularios_acesso')
                .select('*')
                .eq('ativo', true)
                .order('titulo');

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (error) {
            console.error('Erro ao buscar formulários:', error);
            return { sucesso: false, erro: error.message };
        }
    }
};

// Exportar para uso global
window.API = API;

