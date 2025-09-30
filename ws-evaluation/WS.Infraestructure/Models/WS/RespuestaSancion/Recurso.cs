using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class Recurso
    {
        [DataMember]
        public string IdAutoRecurso { get; set; }

        [DataMember]
        public string EstadoAceptacion { get; set; }

        [DataMember]
        public DateTime aud_fech { get; set; }

    }
}
