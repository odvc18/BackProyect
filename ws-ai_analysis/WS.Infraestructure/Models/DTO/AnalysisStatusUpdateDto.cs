using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.DTO
{
    [DataContract]
    public class AnalysisStatusUpdateDto
    {
        [DataMember]
        public Guid AnalysisRequestId { get; set; }

        [DataMember]
        public string Status { get; set; }

        [DataMember]
        public string? ErrorMessage { get; set; }
    }
}
