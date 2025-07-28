-- Script para corrigir protocolos de reservas recorrentes
-- Este script atualiza reservas filhas para usar o protocolo da reserva pai

-- Atualizar reservas filhas para usar o protocolo da reserva pai
UPDATE reservas 
SET protocolo = (
    SELECT pai.protocolo 
    FROM reservas pai 
    WHERE pai.id = reservas.reserva_pai_id
)
WHERE reserva_pai_id IS NOT NULL
  AND protocolo != (
    SELECT pai.protocolo 
    FROM reservas pai 
    WHERE pai.id = reservas.reserva_pai_id
  );

-- Verificar resultado
SELECT 
    r.protocolo,
    r.data_reserva,
    r.reserva_pai_id,
    CASE 
        WHEN r.reserva_pai_id IS NULL THEN 'RESERVA PAI'
        ELSE 'RESERVA FILHA'
    END as tipo_reserva,
    COUNT(*) OVER (PARTITION BY r.protocolo) as total_reservas_protocolo
FROM reservas r
WHERE r.recorrencia_tipo != 'nenhuma'
   OR r.reserva_pai_id IS NOT NULL
ORDER BY r.protocolo, r.data_reserva;
