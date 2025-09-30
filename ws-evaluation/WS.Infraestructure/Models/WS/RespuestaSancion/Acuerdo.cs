using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class Acuerdo
    {

        [DataMember]
        public string IdAutoAcuerdo { get; set; }

        [DataMember]
        public string TotalAdecuado { get; set; }

    }
}
