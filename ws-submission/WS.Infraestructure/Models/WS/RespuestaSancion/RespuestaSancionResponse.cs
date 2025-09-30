using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    public class RespuestaSancionResponse
    {
        [DataMember]
        public DateTime? FechaRecibidoMulta { get; set; }
        [DataMember]
        public DateTime? FechaDeRespuesta { get; set; }
        [DataMember]
        public DateTime? aud_fech { get; set; }
        [DataMember]
        public string Estado { get; set; }
        [DataMember]
        public string RadicadoDevolucion { get; set; }
        [DataMember]
        public string MotivoDevolucion { get; set; }
        [DataMember]
        public int IDDevolucion { get; set; }
        [DataMember]
        public string aud_usua { get; set; }
        [DataMember]
        public Obligaciones Obligacion { get; set; }
        [DataMember]
        public ProcesoCoactivo ProcesoCoactivo { get; set; }
        [DataMember]
        public GestionPersuasiva GestionPersuasiva { get; set; }
        [DataMember]
        public GestionCoactiva GestionCoactiva { get; set; }
        [DataMember]
        public List<Recaudo> Recaudo { get; set; }
    }

}
