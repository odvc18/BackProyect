using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.DTO
{
    [DataContract]
    public class AnalysisResultCreateDto
    {
        [DataMember]
        public Guid AnalysisRequestId { get; set; }

        [DataMember]
        public string ResultType { get; set; } = string.Empty;

        [DataMember]
        public string ResultData { get; set; } = string.Empty;

        [DataMember]
        public decimal? ConfidenceScore { get; set; }

        [DataMember]
        public string? Metadata { get; set; }
    }
}
