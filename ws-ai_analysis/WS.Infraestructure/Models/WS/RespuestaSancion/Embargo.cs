using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class Embargo
    {
        [DataMember]
        public int IdAutoRecurso { get; set; }

        [DataMember]
        public string ValorEmbargado { get; set; }

        [DataMember]
        public DateTime aud_fech { get; set; }

    }
}
