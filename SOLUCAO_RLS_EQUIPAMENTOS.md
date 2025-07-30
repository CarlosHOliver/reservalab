# Solução para Erro de RLS (Row Level Security) - Equipamentos

## 🚨 Problema Identificado
Erro: "new row violates row-level security policy for table 'equipamentos'"

## 🔧 Soluções Disponíveis

### ✅ Solução 1: Desabilitar RLS (Mais Rápida)

1. **Acesse o Supabase Dashboard**
   - Vá para https://supabase.com/dashboard
   - Selecione seu projeto ReservaLAB

2. **Abra o SQL Editor**
   - No menu lateral, clique em "SQL Editor"

3. **Execute o comando:**
   ```sql
   ALTER TABLE equipamentos DISABLE ROW LEVEL SECURITY;
   ```

4. **Clique em "Run" para executar**

### ✅ Solução 2: Criar Políticas RLS (Mais Segura)

Execute o script completo no SQL Editor:

```sql
-- Habilitar RLS
ALTER TABLE equipamentos ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações para usuários autenticados
CREATE POLICY "Permitir todas operações equipamentos" ON equipamentos
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Ou políticas específicas:
CREATE POLICY "Permitir inserção equipamentos" ON equipamentos
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Permitir leitura equipamentos" ON equipamentos
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Permitir atualização equipamentos" ON equipamentos
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir exclusão equipamentos" ON equipamentos
    FOR DELETE
    TO authenticated
    USING (true);
```

### ✅ Solução 3: Usar Script Completo

Execute o arquivo `fix_rls_equipamentos.sql` no SQL Editor do Supabase.

## 🧪 Como Testar se Funcionou

1. **No console do navegador, execute:**
   ```javascript
   // Carregar script de diagnóstico
   const script = document.createElement('script');
   script.src = '../assets/js/diagnostico-rls.js';
   document.head.appendChild(script);
   
   // Após carregar, execute:
   diagnosticarProblemaRLS();
   ```

2. **Ou teste diretamente no sistema:**
   - Vá para a aba "Equipamentos"
   - Clique em "Novo Equipamento"
   - Preencha os dados obrigatórios
   - Tente salvar

## 🔍 Verificação Manual

Execute no SQL Editor para verificar o status:

```sql
-- Verificar se RLS está ativado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'equipamentos';

-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'equipamentos';
```

## 🚀 Solução Rápida via Console

Se você tem acesso ao console do navegador:

```javascript
// Teste rápido de inserção
const equipamentoTeste = {
    nome: 'Teste RLS',
    patrimonio: `TEST-${Date.now()}`,
    bloco_id: 1,
    local: 'Teste',
    status: 'disponivel',
    ativo: true
};

supabase
    .from('equipamentos')
    .insert([equipamentoTeste])
    .then(result => {
        if (result.error) {
            console.error('❌ Ainda há erro:', result.error);
        } else {
            console.log('✅ Funcionando!', result.data);
        }
    });
```

## 📋 Checklist de Verificação

- [ ] Acesso ao Supabase Dashboard
- [ ] SQL Editor aberto
- [ ] Comando executado com sucesso
- [ ] Teste no sistema funcionando
- [ ] Equipamento criado sem erro

## 🆘 Se Ainda Não Funcionar

1. **Verifique as permissões do seu usuário no Supabase**
2. **Confirme que você está no projeto correto**
3. **Tente recarregar a página do sistema**
4. **Execute o diagnóstico completo:**
   ```javascript
   diagnosticarProblemaRLS();
   ```

## 💡 Explicação Técnica

**Row Level Security (RLS)** é um recurso de segurança do PostgreSQL que permite controlar quais linhas um usuário pode ver ou modificar. No Supabase, quando RLS está ativado sem políticas adequadas, as operações são bloqueadas por padrão.

A solução mais simples para desenvolvimento é desabilitar o RLS. Para produção, recomenda-se criar políticas específicas.

---

**Após seguir qualquer uma dessas soluções, o sistema de equipamentos deve funcionar normalmente!** ✅
