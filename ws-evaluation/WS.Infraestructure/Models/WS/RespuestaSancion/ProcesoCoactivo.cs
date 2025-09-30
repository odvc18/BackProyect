using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class ProcesoCoactivo
    {
        [DataMember]
        public string idObligaciones { get; set; }

        [DataMember]
        public string NroObligacion { get; set; }

        [DataMember]
        public DateTime? FechaCreacion { get; set; }

        [DataMember]
        public DateTime? FechaCreacionObligacion { get; set; }

        [DataMember]
        public string TipoMulta { get; set; }

        [DataMember]
        public string idProcesoCoactivo { get; set; }

        [DataMember]
        public string Codigo { get; set; }

        [DataMember]
        public int AnioProcesoCoactivo { get; set; }

        [DataMember]
        public string Estado { get; set; }

        [DataMember]
        public DateTime? aud_fech { get; set; }
    }
}
