using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class MandamientoPago
    {
        [DataMember]
        public string idMandamientoPago { get; set; }

        [DataMember]
        public string ValorPagarNum { get; set; }

        [DataMember]
        public string FondoDestino { get; set; }

        [DataMember]
        public DateTime? aud_fech { get; set; }
    }
}
