using Azure.Core;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WS.Infraestructure.Connection;

namespace WS.Repositories.WSRepository
{
    public class RespuestaSancionRepository
    {
        private readonly AppDbContext _context;

        public RespuestaSancionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DataTableCollection> EjecutarProcedimientoAsync(string nombreProcedimiento, int idProceso)
        {
            var parametros = new[]
            {
                new SqlParameter("@IdProceso", idProceso)
            };

            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> EjecutarProcedimientoNoParamAsync(string nombreProcedimiento)
        {
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento);
        }
    }
}
