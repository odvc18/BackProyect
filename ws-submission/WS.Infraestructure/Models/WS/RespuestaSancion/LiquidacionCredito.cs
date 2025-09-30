using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class LiquidacionCredito
    {

        [DataMember]
        public string IdAutosInfoLiquidacionCredito { get; set; }

        [DataMember]
        public string Estado { get; set; }

        [DataMember]
        public DateTime? FechaPago { get; set; }

        [DataMember]
        public string IdAutoAcuerdo { get; set; }

        [DataMember]
        public DateTime aud_fech { get; set; }

    }
}
