using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class Suspension
    {
        [DataMember]
        public string IdAutoSuspension { get; set; }

        [DataMember]
        public string MotivoSuspension { get; set; }

        [DataMember]
        public DateTime aud_fech { get; set; }
    }
}
