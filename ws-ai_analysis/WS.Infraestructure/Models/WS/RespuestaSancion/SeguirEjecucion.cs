using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class SeguirEjecucion
    {
        [DataMember]
        public string IdSeguirEjecucion { get; set; }
        
        [DataMember]
        public DateTime aud_fech { get; set; }
    }
}
