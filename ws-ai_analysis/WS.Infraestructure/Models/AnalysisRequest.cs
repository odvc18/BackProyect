using System.Runtime.Serialization;

namespace WS.Infraestructure.Models
{
    [DataContract]
    public class AnalysisRequest
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public Guid SubmissionFileId { get; set; }
        [DataMember]
        public string FilePath { get; set; }
        [DataMember]
        public string AnalysisType { get; set; }
        [DataMember]
        public string Status { get; set; }
        [DataMember]
        public DateTime RequestedAt { get; set; }
        [DataMember]
        public DateTime? StartedAt { get; set; }
        [DataMember]
        public DateTime? CompletedAt { get; set; }
        [DataMember]
        public string? ErrorMessage { get; set; }
    }
}

