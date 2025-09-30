using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.WS.RespuestaSancion
{
    [DataContract]
    public class GestionPersuasiva
    {
        [DataMember]
        public string idTipoContacto { get; set; }

        [DataMember]
        public DateTime? FechaContacto { get; set; }

        [DataMember]
        public string IdEfectividad { get; set; }

        [DataMember]
        public string Acuerdo { get; set; }

        [DataMember]
        public DateTime? FechaAcuerdo { get; set; }

        [DataMember]
        public string EstadoAcuerdo { get; set; }

        [DataMember]
        public string Gestor { get; set; }

        [DataMember]
        public string EstadoMulta { get; set; }

    }
}
