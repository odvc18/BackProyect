using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WS.Infraestructure.Models.WS.RespuestaSancion;
using WS.Repositories.WSRepository;

namespace WS.Service.WSServices
{
    public class RespuestaSancionService
    {
        private readonly RespuestaSancionRepository _repository;

        public RespuestaSancionService(RespuestaSancionRepository repository)
        {
            _repository = repository;
        }


        public async Task<RespuestaSancionResponse> RespuestaSancionAsync(RespuestaSancionRequest request)
        {
            RespuestaSancionResponse response = null;

            try
            {
                var query = await _repository.EjecutarProcedimientoAsync("RespuestaSancion", request.IdProceso);
                var queryObligacion = await _repository.EjecutarProcedimientoAsync("RespuestaSancionObligaciones", request.IdProceso);
                var queryProcesoCoactivo = await _repository.EjecutarProcedimientoAsync("RespuestaSancionProcesoCoactivos", request.IdProceso);
                var queryGestionPersuasiva = await _repository.EjecutarProcedimientoAsync("RespuestaSancionGestionPersuasiva", request.IdProceso);
                var queryManPago = await _repository.EjecutarProcedimientoAsync("RespuestaSancionMandamientoPago", request.IdProceso);
                var queryExcepcion = await _repository.EjecutarProcedimientoAsync("RespuestaSancionExcepcion", request.IdProceso);
                var querySuspension = await _repository.EjecutarProcedimientoAsync("RespuestaSancionSuspension", request.IdProceso);
                var queryRecurso = await _repository.EjecutarProcedimientoAsync("RespuestaSancionRecurso", request.IdProceso);
                var querySegEjecucion = await _repository.EjecutarProcedimientoAsync("RespuestaSancionSeguirEjecucion", request.IdProceso);
                var queryLiqCredito = await _repository.EjecutarProcedimientoAsync("RespuestaSancionLiquidacionCredito", request.IdProceso);
                var queryAcuerdo = await _repository.EjecutarProcedimientoAsync("RespuestaSancionAcuerdo", request.IdProceso);
                var queryEmbargo = await _repository.EjecutarProcedimientoAsync("RespuestaSancionEmbargo", request.IdProceso);
                var queryTerminacion = await _repository.EjecutarProcedimientoAsync("RespuestaSancionTerminacion", request.IdProceso);
                var queryRecaudo = await _repository.EjecutarProcedimientoAsync("RespuestaSancionRecaudo", request.IdProceso);

                if (query[0].Rows.Count > 0)
                {
                    var row = query[0].Rows[0];
                    response = new RespuestaSancionResponse
                    {
                        aud_fech = row["aud_fech"] != DBNull.Value ? (DateTime)row["aud_fech"] : default,
                        aud_usua = row["aud_usua"]?.ToString(),
                        Estado = row["Estado"]?.ToString(),
                        FechaDeRespuesta = row["FechaRespuesta"] != DBNull.Value ? (DateTime)row["FechaRespuesta"] : default,
                        FechaRecibidoMulta = row["FechaRecibidoMulta"] != DBNull.Value ? (DateTime)row["FechaRecibidoMulta"] : default,
                        IDDevolucion = int.Parse(row["Id_devolucion"]?.ToString()),
                        MotivoDevolucion = row["MotivoDevolucion"]?.ToString(),
                        RadicadoDevolucion = row["RadicadoDevolucion"]?.ToString()
                    };

                    // Obligaciones
                    if (queryObligacion[0].Rows.Count > 0)
                    {
                        var rowObl = queryObligacion[0].Rows[0];
                        response.Obligacion = new Obligaciones
                        {
                            idObligaciones = rowObl["idObligacion"]?.ToString(),
                            FechaCreacion = rowObl["FechaCreacion"] != DBNull.Value ? (DateTime)rowObl["FechaCreacion"] : default,
                            NroObligacion = rowObl["NroObligacion"]?.ToString(),
                            TipoMulta = rowObl["TipoMulta"]?.ToString()
                        };
                    }

                    // Proceso Coactivo
                    if (queryProcesoCoactivo[0].Rows.Count > 0)
                    {
                        var rowPC = queryProcesoCoactivo[0].Rows[0];
                        response.ProcesoCoactivo = new ProcesoCoactivo
                        {
                            AnioProcesoCoactivo = rowPC["AnioProcesoCoactivo"] != DBNull.Value ? Convert.ToInt32(rowPC["AnioProcesoCoactivo"]) : 0,
                            aud_fech = rowPC["aud_fech"] != DBNull.Value ? (DateTime)rowPC["aud_fech"] : default,
                            Codigo = rowPC["Codigo"]?.ToString(),
                            Estado = rowPC["Estado"]?.ToString(),
                            FechaCreacionObligacion = rowPC["FechaCreacionObligacion"] != DBNull.Value ? (DateTime)rowPC["FechaCreacionObligacion"] : default,
                            FechaCreacion = rowPC["FechaCreacionProceso"] != DBNull.Value ? (DateTime)rowPC["FechaCreacionProceso"] : default,
                            idObligaciones = rowPC["idObligacion"]?.ToString(),
                            idProcesoCoactivo = rowPC["idProcesoCoactivo"]?.ToString(),
                            NroObligacion = rowPC["NroObligacion"]?.ToString(),
                            TipoMulta = rowPC["TipoMulta"]?.ToString()
                        };
                    }

                    // Gestión Persuasiva
                    if (queryGestionPersuasiva[0].Rows.Count > 0)
                    {
                        var rowGP = queryGestionPersuasiva[0].Rows[0];
                        response.GestionPersuasiva = new GestionPersuasiva
                        {
                            Acuerdo = rowGP["Acuerdo"] != DBNull.Value && Convert.ToBoolean(rowGP["Acuerdo"]) ? "Si" : "No",
                            EstadoAcuerdo = rowGP["EstadoAcuerdo"]?.ToString(),
                            EstadoMulta = rowGP["EstadoMulta"]?.ToString(),
                            FechaAcuerdo = rowGP["FechaAcuerdo"] != DBNull.Value ? (DateTime)rowGP["FechaAcuerdo"] : default,
                            FechaContacto = rowGP["FechaContacto"] != DBNull.Value ? (DateTime)rowGP["FechaContacto"] : default,
                            Gestor = rowGP["Gestor"]?.ToString(),
                            IdEfectividad = rowGP["idEfectividad"] != DBNull.Value && Convert.ToBoolean(rowGP["idEfectividad"]) ? "1" : "0",
                            idTipoContacto = rowGP["idTipoContacto"]?.ToString()
                        };
                    }

                    // Gestión Coactiva
                    var gestionCoactiva = new GestionCoactiva();

                    // Mandamiento de Pago
                    if (queryManPago[0].Rows.Count > 0)
                    {
                        gestionCoactiva.MandamientoPago = new List<MandamientoPago>();
                        foreach (DataRow item in queryManPago[0].Rows)
                        {
                            gestionCoactiva.MandamientoPago.Add(new MandamientoPago
                            {
                                aud_fech = item["aud_fech"] != DBNull.Value ? (DateTime)item["aud_fech"] : default,
                                FondoDestino = item["FondoDestino"]?.ToString(),
                                idMandamientoPago = item["idMandamientoPago"]?.ToString(),
                                ValorPagarNum = item["ValorPagarNum"] != DBNull.Value ? item["ValorPagarNum"].ToString() : "0"
                            });
                        }
                    }

                    // Excepción
                    if (queryExcepcion[0].Rows.Count > 0)
                    {
                        gestionCoactiva.Excepcion = new List<Excepcion>();
                        foreach (DataRow item in queryExcepcion[0].Rows)
                        {
                            gestionCoactiva.Excepcion.Add(new Excepcion
                            {
                                aud_fech = item["aud_fech"] != DBNull.Value ? (DateTime)item["aud_fech"] : default,
                                aud_usua = item["aud_usua"]?.ToString(),
                                EstadoAceptacion = item["EstadoAceptacion"]?.ToString(),
                                IdAutoExcepcion = item["idAutoExcepcion"]?.ToString(),
                                Excepciones = item["Excepcion"]?.ToString()
                            });
                        }
                    }

                    // Suspensión
                    if (querySuspension[0].Rows.Count > 0)
                    {
                        gestionCoactiva.Suspension = new List<Suspension>();
                        foreach (DataRow item in querySuspension[0].Rows)
                        {
                            gestionCoactiva.Suspension.Add(new Suspension
                            {
                                aud_fech = item["aud_fech"] != DBNull.Value ? (DateTime)item["aud_fech"] : default,
                                IdAutoSuspension = item["idAutoSuspension"]?.ToString(),
                                MotivoSuspension = item["MotivoSuspencion"]?.ToString()
                            });
                        }
                    }

                    // Recurso
                    if (queryRecurso[0].Rows.Count > 0)
                    {
                        gestionCoactiva.Recurso = new List<Recurso>();
                        foreach (DataRow item in queryRecurso[0].Rows)
                        {
                            gestionCoactiva.Recurso.Add(new Recurso
                            {
                                aud_fech = item["aud_fech"] != DBNull.Value ? (DateTime)item["aud_fech"] : default,
                                EstadoAceptacion = item["EstadoAceptacion"]?.ToString(),
                                IdAutoRecurso = item["idAutoRecurso"]?.ToString()
                            });
                        }
                    }

                    // Seguir Ejecución
                    if (querySegEjecucion[0].Rows.Count > 0)
                    {
                        gestionCoactiva.SeguirEjecucion = new List<SeguirEjecucion>();
                        foreach (DataRow item in querySegEjecucion[0].Rows)
                        {
                            gestionCoactiva.SeguirEjecucion.Add(new SeguirEjecucion
                            {
                                aud_fech = item["aud_fech"] != DBNull.Value ? (DateTime)item["aud_fech"] : default,
                                IdSeguirEjecucion = item["idSegirEjecucion"]?.ToString()
                            });
                        }
                    }

                    // Liquidación Crédito
                    if (queryLiqCredito[0].Rows.Count > 0)
                    {
                        gestionCoactiva.LiquidacionCredito = new List<LiquidacionCredito>();
                        foreach (DataRow item in queryLiqCredito[0].Rows)
                        {
                            gestionCoactiva.LiquidacionCredito.Add(new LiquidacionCredito
                            {
                                aud_fech = item["aud_fech"] != DBNull.Value ? (DateTime)item["aud_fech"] : default,
                                Estado = item["Estado"]?.ToString(),
                                FechaPago = item["FechaPago"] != DBNull.Value ? (DateTime)item["FechaPago"] : default,
                                IdAutoAcuerdo = item["idAutoAcuerdo"]?.ToString(),
                                IdAutosInfoLiquidacionCredito = item["idAutosInfoLiquidacionCredito"]?.ToString()
                            });
                        }
                    }

                    // Acuerdo
                    if (queryAcuerdo[0].Rows.Count > 0)
                    {
                        gestionCoactiva.Acuerdo = new List<Acuerdo>();
                        foreach (DataRow item in queryAcuerdo[0].Rows)
                        {
                            gestionCoactiva.Acuerdo.Add(new Acuerdo
                            {
                                IdAutoAcuerdo = item["idAutoAcuerdo"]?.ToString(),
                                TotalAdecuado = item["TotalAdeudado"] != DBNull.Value ? item["TotalAdeudado"].ToString() : "0"
                            });
                        }
                    }

                    // Embargo
                    if (queryEmbargo[0].Rows.Count > 0)
                    {
                        gestionCoactiva.Embargo = new List<Embargo>();
                        foreach (DataRow item in queryEmbargo[0].Rows)
                        {
                            gestionCoactiva.Embargo.Add(new Embargo
                            {
                                aud_fech = item["aud_fech"] != DBNull.Value ? (DateTime)item["aud_fech"] : default,
                                IdAutoRecurso = item["idAutoEmbargo"] != DBNull.Value ? Convert.ToInt32(item["idAutoEmbargo"]) : 0,
                                ValorEmbargado = item["ValorEmbargado"] != DBNull.Value ? item["ValorEmbargado"].ToString() : "0"
                            });
                        }
                    }

                    // Terminación
                    if (queryTerminacion[0].Rows.Count > 0)
                    {
                        gestionCoactiva.Terminacion = new List<Terminacion>();
                        foreach (DataRow item in queryTerminacion[0].Rows)
                        {
                            gestionCoactiva.Terminacion.Add(new Terminacion
                            {
                                aud_fech = item["aud_fech"] != DBNull.Value ? (DateTime)item["aud_fech"] : default,
                                IdAutoTerminacion = item["idAutoTerminacion"] != DBNull.Value ? Convert.ToInt32(item["idAutoTerminacion"]) : 0,
                                MotivoTerminacion = item["MotivoTerminacion"]?.ToString()
                            });
                        }
                    }

                    response.GestionCoactiva = gestionCoactiva;

                    // Recaudo
                    if (queryRecaudo[0].Rows.Count > 0)
                    {
                        response.Recaudo = new List<Recaudo>();
                        foreach (DataRow item in queryRecaudo[0].Rows)
                        {
                            response.Recaudo.Add(new Recaudo
                            {
                                aud_fech = item["aud_fech"] != DBNull.Value ? (DateTime)item["aud_fech"] : default,
                                FechaExpedicionTitulo = item["FechaExpedicionTitulo"] != DBNull.Value ? (DateTime)item["FechaExpedicionTitulo"] : default,
                                FechaGeneracion = item["FechaGeneracion"] != DBNull.Value ? (DateTime)item["FechaGeneracion"] : default,
                                FechaPago = item["FechaPago"] != DBNull.Value ? (DateTime)item["FechaPago"] : default,
                                FechaRecepcionTitulo = item["FechaRecepcionTitulo"] != DBNull.Value ? (DateTime)item["FechaRecepcionTitulo"] : default,
                                IdEstadoPago = item.Table.Columns.Contains("idEstadoPago") && item["idEstadoPago"] != DBNull.Value ? item["idEstadoPago"].ToString() : "0",
                                IdRecaudo = item["idRecaudo"]?.ToString(),
                                Interes = item.Table.Columns.Contains("Interes") && item["Interes"] != DBNull.Value ? Convert.ToDecimal(item["Interes"]) : 0,
                                NumeroTitulo = item.Table.Columns.Contains("NumeroTitulo") && item["NumeroTitulo"] != DBNull.Value ? Convert.ToInt32(item["NumeroTitulo"]) : 0,
                                SaldoObligacion = item.Table.Columns.Contains("SaldoObligacion") && item["SaldoObligacion"] != DBNull.Value ? Convert.ToDecimal(item["SaldoObligacion"]) : 0,
                                SaldoSancion = item.Table.Columns.Contains("SaldoSancion") && item["SaldoSancion"] != DBNull.Value ? Convert.ToDecimal(item["SaldoSancion"]) : 0,
                                TipoRecaudo = item["TipoRecaudo"]?.ToString(),
                                TipoRecaudoBancario = item["TipoRecaudoBancario"]?.ToString(),
                                TipoTitulo = item["TipoTitulo"]?.ToString(),
                                ValorDepositoJudicial = item.Table.Columns.Contains("ValorDepositoJudicial") && item["ValorDepositoJudicial"] != DBNull.Value ? Convert.ToDecimal(item["ValorDepositoJudicial"]) : 0,
                                ValorPagado = item.Table.Columns.Contains("ValorPagado") && item["ValorPagado"] != DBNull.Value ? Convert.ToDecimal(item["ValorPagado"]) : 0,
                                ValorRecaudoInteres = item.Table.Columns.Contains("ValorRecaudoInteres") && item["ValorRecaudoInteres"] != DBNull.Value ? Convert.ToDecimal(item["ValorRecaudoInteres"]) : 0
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }

            return response;
        }

        public async Task<List<RespuestaSancionResponse>> RespuestaSancionMasivaAsync()
        {
            var lista = new List<RespuestaSancionResponse>();

            try
            {
                var dataTables = await _repository.EjecutarProcedimientoNoParamAsync("RespuestaSancionMasiva"); // Si el SP requiere un parámetro diferente, ajústalo

                if (dataTables[0].Rows.Count > 0)
                {
                    foreach (DataRow row in dataTables[0].Rows)
                    {
                        var response = new RespuestaSancionResponse
                        {
                            aud_fech = row.Table.Columns.Contains("aud_fechObligacion") && row["aud_fechObligacion"] != DBNull.Value ? (DateTime?)row["aud_fechObligacion"] : null,
                            aud_usua = row.Table.Columns.Contains("aud_usua") ? row["aud_usua"]?.ToString() : null,
                            Estado = row.Table.Columns.Contains("Estado") ? row["Estado"]?.ToString() : null,
                            FechaDeRespuesta = row.Table.Columns.Contains("FechaRespuesta") && row["FechaRespuesta"] != DBNull.Value ? (DateTime?)row["FechaRespuesta"] : null,
                            FechaRecibidoMulta = row.Table.Columns.Contains("FechaRecibidoMulta") && row["FechaRecibidoMulta"] != DBNull.Value ? (DateTime?)row["FechaRecibidoMulta"] : null,
                            MotivoDevolucion = row.Table.Columns.Contains("MotivoDevolucion") ? row["MotivoDevolucion"]?.ToString() : null,
                            RadicadoDevolucion = row.Table.Columns.Contains("RadicadoDevolucion") ? row["RadicadoDevolucion"]?.ToString() : null,
                            IDDevolucion = row.Table.Columns.Contains("Id_devolucion") && row["Id_devolucion"] != DBNull.Value ? Convert.ToInt32(row["Id_devolucion"]) : 0
                        };

                        // Proceso Coactivo
                        if (row.Table.Columns.Contains("idProcesoCoactivo") && row["idProcesoCoactivo"] != DBNull.Value)
                        {
                            response.ProcesoCoactivo = new ProcesoCoactivo
                            {
                                AnioProcesoCoactivo = row.Table.Columns.Contains("AnioProcesoCoactivo") && row["AnioProcesoCoactivo"] != DBNull.Value ? Convert.ToInt32(row["AnioProcesoCoactivo"]) : 0,
                                aud_fech = row.Table.Columns.Contains("aud_fechProceso") && row["aud_fechProceso"] != DBNull.Value ? (DateTime?)row["aud_fechProceso"] : null,
                                Codigo = row.Table.Columns.Contains("Codigo") && row["Codigo"] != DBNull.Value ? row["Codigo"].ToString() : null,
                                Estado = row.Table.Columns.Contains("Estado") ? row["Estado"]?.ToString() : null,
                                FechaCreacion = row.Table.Columns.Contains("FechaCreacion") && row["FechaCreacion"] != DBNull.Value ? (DateTime?)row["FechaCreacion"] : null,
                                idObligaciones = row.Table.Columns.Contains("idObligacion") ? row["idObligacion"]?.ToString() : null,
                                idProcesoCoactivo = row["idProcesoCoactivo"]?.ToString(),
                                TipoMulta = row.Table.Columns.Contains("TipoMulta") ? row["TipoMulta"]?.ToString() : null
                            };
                        }

                        // Gestión Persuasiva
                        if (row.Table.Columns.Contains("idTipoContacto") && row["idTipoContacto"] != DBNull.Value)
                        {
                            response.GestionPersuasiva = new GestionPersuasiva
                            {
                                Acuerdo = row.Table.Columns.Contains("Acuerdo") ? row["Acuerdo"]?.ToString() : null,
                                EstadoAcuerdo = row.Table.Columns.Contains("EstadoAcuerdo") ? row["EstadoAcuerdo"]?.ToString() : null,
                                EstadoMulta = row.Table.Columns.Contains("EstadoMulta") ? row["EstadoMulta"]?.ToString() : null,
                                FechaAcuerdo = row.Table.Columns.Contains("FechaAcuerdo") && row["FechaAcuerdo"] != DBNull.Value ? (DateTime?)row["FechaAcuerdo"] : null,
                                FechaContacto = row.Table.Columns.Contains("FechaContacto") && row["FechaContacto"] != DBNull.Value ? (DateTime?)row["FechaContacto"] : null,
                                Gestor = row.Table.Columns.Contains("Gestor") ? row["Gestor"]?.ToString() : null,
                                IdEfectividad = row.Table.Columns.Contains("idEfectividad") && row["idEfectividad"] != DBNull.Value ? (Convert.ToBoolean(row["idEfectividad"]) ? "1" : "0") : "0",
                                idTipoContacto = row["idTipoContacto"]?.ToString()
                            };
                        }

                        // Gestión Coactiva
                        var gestionCoactiva = new GestionCoactiva();

                        // Mandamiento de Pago
                        if (row.Table.Columns.Contains("idMandamientoPago") && row["idMandamientoPago"] != DBNull.Value)
                        {
                            gestionCoactiva.MandamientoPago = new List<MandamientoPago>
                    {
                        new MandamientoPago
                        {
                            aud_fech = row.Table.Columns.Contains("aud_fechMandamiento") && row["aud_fechMandamiento"] != DBNull.Value ? (DateTime)row["aud_fechMandamiento"] : default,
                            FondoDestino = row.Table.Columns.Contains("FondoDestino") ? row["FondoDestino"]?.ToString() : null,
                            idMandamientoPago = row["idMandamientoPago"]?.ToString(),
                            ValorPagarNum = row.Table.Columns.Contains("ValorPagarNum") && row["ValorPagarNum"] != DBNull.Value ? row["ValorPagarNum"].ToString() : "0"
                        }
                    };
                        }

                        // Excepción
                        if (row.Table.Columns.Contains("idAutoExcepcion") && row["idAutoExcepcion"] != DBNull.Value)
                        {
                            gestionCoactiva.Excepcion = new List<Excepcion>
                    {
                        new Excepcion
                        {
                            IdAutoExcepcion = row["idAutoExcepcion"].ToString(),
                            EstadoAceptacion = row.Table.Columns.Contains("EstadoAceptacion") ? row["EstadoAceptacion"]?.ToString() : null,
                            Excepciones = row.Table.Columns.Contains("Excepcion") ? row["Excepcion"]?.ToString() : null
                        }
                    };
                        }

                        // Suspensión
                        if (row.Table.Columns.Contains("idAutoSuspension") && row["idAutoSuspension"] != DBNull.Value)
                        {
                            gestionCoactiva.Suspension = new List<Suspension>
                    {
                        new Suspension
                        {
                            aud_fech = row.Table.Columns.Contains("aud_fechSuspension") && row["aud_fechSuspension"] != DBNull.Value ? (DateTime)row["aud_fechSuspension"] : default,
                            IdAutoSuspension = row["idAutoSuspension"].ToString(),
                            MotivoSuspension = row.Table.Columns.Contains("MotivoSuspencion") ? row["MotivoSuspencion"]?.ToString() : null
                        }
                    };
                        }

                        // Recurso
                        if (row.Table.Columns.Contains("idAutoRecurso") && row["idAutoRecurso"] != DBNull.Value)
                        {
                            gestionCoactiva.Recurso = new List<Recurso>
                    {
                        new Recurso
                        {
                            IdAutoRecurso = row["idAutoRecurso"].ToString(),
                            aud_fech = row.Table.Columns.Contains("aud_fechRecursos") && row["aud_fechRecursos"] != DBNull.Value ? (DateTime)row["aud_fechRecursos"] : default,
                            EstadoAceptacion = row.Table.Columns.Contains("EstadoAceptacionRecurso") ? row["EstadoAceptacionRecurso"]?.ToString() : null
                        }
                    };
                        }

                        // Seguimiento a Ejecución
                        if (row.Table.Columns.Contains("idSegirEjecucion") && row["idSegirEjecucion"] != DBNull.Value)
                        {
                            gestionCoactiva.SeguirEjecucion = new List<SeguirEjecucion>
                    {
                        new SeguirEjecucion
                        {
                            aud_fech = row.Table.Columns.Contains("aud_fechSuspension") && row["aud_fechSuspension"] != DBNull.Value ? (DateTime)row["aud_fechSuspension"] : default,
                            IdSeguirEjecucion = row["idSegirEjecucion"].ToString()
                        }
                    };
                        }

                        // Liquidación de Crédito
                        if (row.Table.Columns.Contains("idAutosInfoLiquidacionCredito") && row["idAutosInfoLiquidacionCredito"] != DBNull.Value)
                        {
                            gestionCoactiva.LiquidacionCredito = new List<LiquidacionCredito>
                    {
                        new LiquidacionCredito
                        {
                            aud_fech = row.Table.Columns.Contains("aud_fechInfoLiquidacion") && row["aud_fechInfoLiquidacion"] != DBNull.Value ? (DateTime)row["aud_fechInfoLiquidacion"] : default,
                            Estado = row.Table.Columns.Contains("Estado") ? row["Estado"]?.ToString() : null,
                            FechaPago = row.Table.Columns.Contains("FechaPago") && row["FechaPago"] != DBNull.Value ? (DateTime)row["FechaPago"] : default,
                            IdAutoAcuerdo = row.Table.Columns.Contains("idAutoAcuerdo") ? row["idAutoAcuerdo"]?.ToString() : "0",
                            IdAutosInfoLiquidacionCredito = row["idAutosInfoLiquidacionCredito"].ToString()
                        }
                    };
                        }

                        // Acuerdo
                        if (row.Table.Columns.Contains("idAutoAcuerdo") && row["idAutoAcuerdo"] != DBNull.Value)
                        {
                            gestionCoactiva.Acuerdo = new List<Acuerdo>
                    {
                        new Acuerdo
                        {
                            IdAutoAcuerdo = row["idAutoAcuerdo"].ToString(),
                            TotalAdecuado = row.Table.Columns.Contains("TotalAdeudado") && row["TotalAdeudado"] != DBNull.Value ? row["TotalAdeudado"].ToString() : "0"
                        }
                    };
                        }

                        // Embargo
                        if (row.Table.Columns.Contains("idAutoEmbargo") && row["idAutoEmbargo"] != DBNull.Value)
                        {
                            gestionCoactiva.Embargo = new List<Embargo>
                    {
                        new Embargo
                        {
                            aud_fech = row.Table.Columns.Contains("aud_fechEmbargo") && row["aud_fechEmbargo"] != DBNull.Value ? (DateTime)row["aud_fechEmbargo"] : default,
                            IdAutoRecurso = row.Table.Columns.Contains("idAutoRecurso") && row["idAutoRecurso"] != DBNull.Value ? Convert.ToInt32(row["idAutoRecurso"]) : 0,
                            ValorEmbargado = row.Table.Columns.Contains("ValorEmbargado") && row["ValorEmbargado"] != DBNull.Value ? row["ValorEmbargado"].ToString() : "0"
                        }
                    };
                        }

                        // Terminación
                        if (row.Table.Columns.Contains("idAutoTerminacion") && row["idAutoTerminacion"] != DBNull.Value)
                        {
                            gestionCoactiva.Terminacion = new List<Terminacion>
                    {
                        new Terminacion
                        {
                            aud_fech = row.Table.Columns.Contains("aud_fechTerminacion") && row["aud_fechTerminacion"] != DBNull.Value ? (DateTime)row["aud_fechTerminacion"] : default,
                            IdAutoTerminacion = row["idAutoTerminacion"] != DBNull.Value ? Convert.ToInt32(row["idAutoTerminacion"]) : 0,
                            MotivoTerminacion = row.Table.Columns.Contains("MotivoSuspencionTerminacion") ? row["MotivoSuspencionTerminacion"]?.ToString() : null
                        }
                    };
                        }

                        response.GestionCoactiva = gestionCoactiva;

                        // Recaudo
                        if (row.Table.Columns.Contains("idRecaudo") && row["idRecaudo"] != DBNull.Value)
                        {
                            response.Recaudo = new List<Recaudo>
                    {
                        new Recaudo
                        {
                            aud_fech = row.Table.Columns.Contains("aud_fechRecaudo") && row["aud_fechRecaudo"] != DBNull.Value ? (DateTime)row["aud_fechRecaudo"] : default,
                            FechaExpedicionTitulo = row.Table.Columns.Contains("FechaExpedicionTitulo") && row["FechaExpedicionTitulo"] != DBNull.Value ? (DateTime)row["FechaExpedicionTitulo"] : default,
                            FechaGeneracion = row.Table.Columns.Contains("FechaGeneracion") && row["FechaGeneracion"] != DBNull.Value ? (DateTime)row["FechaGeneracion"] : default,
                            FechaPago = row.Table.Columns.Contains("FechaPago") && row["FechaPago"] != DBNull.Value ? (DateTime)row["FechaPago"] : default,
                            FechaRecepcionTitulo = row.Table.Columns.Contains("FechaRecepcionTitulo") && row["FechaRecepcionTitulo"] != DBNull.Value ? (DateTime)row["FechaRecepcionTitulo"] : default,
                            IdRecaudo = row["idRecaudo"].ToString(),
                            IdEstadoPago = row.Table.Columns.Contains("idEstadoPago") && row["idEstadoPago"] != DBNull.Value ? row["idEstadoPago"].ToString() : "0",
                            Interes = row.Table.Columns.Contains("Interes") && row["Interes"] != DBNull.Value ? Convert.ToDecimal(row["Interes"]) : 0,
                            NumeroTitulo = row.Table.Columns.Contains("NumeroTitulo") && row["NumeroTitulo"] != DBNull.Value ? Convert.ToInt32(row["NumeroTitulo"]) : 0,
                            SaldoObligacion = row.Table.Columns.Contains("SaldoObligacion") && row["SaldoObligacion"] != DBNull.Value ? Convert.ToDecimal(row["SaldoObligacion"]) : 0,
                            SaldoSancion = row.Table.Columns.Contains("SaldoSancion") && row["SaldoSancion"] != DBNull.Value ? Convert.ToDecimal(row["SaldoSancion"]) : 0,
                            TipoRecaudo = row.Table.Columns.Contains("TipoRecaudo") ? row["TipoRecaudo"]?.ToString() : null,
                            TipoRecaudoBancario = row.Table.Columns.Contains("TipoRecaudoBancario") ? row["TipoRecaudoBancario"]?.ToString() : null,
                            TipoTitulo = row.Table.Columns.Contains("TipoTitulo") ? row["TipoTitulo"]?.ToString() : null,
                            ValorDepositoJudicial = row.Table.Columns.Contains("ValorDepositoJudicial") && row["ValorDepositoJudicial"] != DBNull.Value ? Convert.ToDecimal(row["ValorDepositoJudicial"]) : 0,
                            ValorPagado = row.Table.Columns.Contains("ValorPagado") && row["ValorPagado"] != DBNull.Value ? Convert.ToDecimal(row["ValorPagado"]) : 0,
                            ValorRecaudoInteres = row.Table.Columns.Contains("ValorRecaudoInteres") && row["ValorRecaudoInteres"] != DBNull.Value ? Convert.ToDecimal(row["ValorRecaudoInteres"]) : 0
                        }
                    };
                        }

                        lista.Add(response);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al procesar la información", ex);
            }

            return lista;
        }
    }
}
