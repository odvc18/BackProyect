using System.Runtime.Serialization;

namespace WS.Infraestructure.Models
{
    [DataContract]
    public class JudgeAssignment
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public Guid ContestId { get; set; }
        [DataMember]
        public Guid SubmissionId { get; set; }
        [DataMember]
        public Guid JudgeId { get; set; }
        [DataMember]
        public DateTime AssignedAt { get; set; }
        [DataMember]
        public string Status { get; set; }
        [DataMember]
        public DateTime? CompletedAt { get; set; }
    }
}

