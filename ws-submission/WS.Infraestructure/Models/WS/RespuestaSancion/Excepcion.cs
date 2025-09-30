using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class Excepcion
    {
        [DataMember]
        public string IdAutoExcepcion { get; set; }

        [DataMember]
        public string EstadoAceptacion { get; set; }

        [DataMember]
        public string aud_usua { get; set; }

        [DataMember]
        public DateTime aud_fech { get; set; }

        [DataMember]
        public string Excepciones { get; set; }
    }
}
