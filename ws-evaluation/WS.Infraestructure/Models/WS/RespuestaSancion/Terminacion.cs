using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class Terminacion
    {
        [DataMember]
        public int IdAutoTerminacion { get; set; }

        [DataMember]
        public string MotivoTerminacion { get; set; }

        [DataMember]
        public DateTime aud_fech { get; set; }
    }
}
