using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class Obligaciones
    {
        [DataMember]
        public string idObligaciones { get; set; }

        [DataMember]
        public string NroObligacion { get; set; }

        [DataMember]
        public DateTime? FechaCreacion { get; set; }

        [DataMember]
        public string TipoMulta { get; set; }

    }
}
