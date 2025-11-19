using System.Runtime.Serialization;

namespace WS.Infraestructure.Models
{
    [DataContract]
    public class AnalysisResult
    {
        [DataMember]
        public Guid Id { get; set; }

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

        [DataMember]
        public DateTime CreatedAt { get; set; }
    }
}
