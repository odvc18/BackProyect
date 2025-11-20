using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.DTOs
{
    [DataContract]
    public class AnalysisResultCreateDto
    {
        [DataMember]
        public Guid AnalysisRequestId { get; set; }
        [DataMember]
        public string ResultType { get; set; }
        [DataMember]
        public string ResultData { get; set; }
        [DataMember]
        public decimal? ConfidenceScore { get; set; }
        [DataMember]
        public string? Metadata { get; set; }
    }
}

