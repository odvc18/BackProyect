using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class RespuestaSancionRequest
    {
        [DataMember]
        public int IdProceso { get; set; }
    }

}
