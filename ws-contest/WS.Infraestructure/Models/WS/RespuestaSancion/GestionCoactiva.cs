using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class GestionCoactiva
    {

        [DataMember]
        public List<MandamientoPago> MandamientoPago { get; set; }

        [DataMember]
        public List<Excepcion> Excepcion { get; set; }

        [DataMember]
        public List<Suspension> Suspension { get; set; }

        [DataMember]
        public List<Recurso> Recurso { get; set; }

        [DataMember]
        public List<SeguirEjecucion> SeguirEjecucion { get; set; }

        [DataMember]
        public List<LiquidacionCredito> LiquidacionCredito { get; set; }

        [DataMember]
        public List<Acuerdo> Acuerdo { get; set; }

        [DataMember]
        public List<Embargo> Embargo { get; set; }

        [DataMember]
        public List<Terminacion> Terminacion { get; set; }

    }
}
