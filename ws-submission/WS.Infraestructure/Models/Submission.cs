using System.Runtime.Serialization;

namespace WS.Infraestructure.Models
{
    [DataContract]
    public class Submission
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public Guid ContestId { get; set; }
        [DataMember]
        public Guid CategoryId { get; set; }
        [DataMember]
        public Guid ParticipantId { get; set; }
        [DataMember]
        public string? Title { get; set; }
        [DataMember]
        public string? Description { get; set; }
        [DataMember]
        public string Status { get; set; }
        [DataMember]
        public DateTime? SubmittedAt { get; set; }
        [DataMember]
        public DateTime CreatedAt { get; set; }
        [DataMember]
        public DateTime UpdatedAt { get; set; }
        [DataMember]
        public List<SubmissionFile>? Files { get; set; }
    }
}
