using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class Recaudo
    {

        [DataMember]
        public string IdRecaudo { get; set; }

        [DataMember]
        public decimal SaldoObligacion { get; set; }

        [DataMember]
        public decimal Interes { get; set; }

        [DataMember]
        public DateTime FechaGeneracion { get; set; }

        [DataMember]
        public string IdEstadoPago { get; set; }

        [DataMember]
        public decimal ValorPagado { get; set; }

        [DataMember]
        public DateTime FechaPago { get; set; }

        [DataMember]
        public decimal SaldoSancion { get; set; }

        [DataMember]
        public string TipoRecaudo { get; set; }

        [DataMember]
        public DateTime FechaExpedicionTitulo { get; set; }

        [DataMember]
        public DateTime FechaRecepcionTitulo { get; set; }

        [DataMember]
        public int NumeroTitulo { get; set; }

        [DataMember]
        public decimal ValorDepositoJudicial { get; set; }

        [DataMember]
        public string TipoRecaudoBancario { get; set; }

        [DataMember]
        public decimal ValorRecaudoInteres { get; set; }

        [DataMember]
        public string TipoTitulo { get; set; }

        [DataMember]
        public DateTime aud_fech { get; set; }

    }
}
