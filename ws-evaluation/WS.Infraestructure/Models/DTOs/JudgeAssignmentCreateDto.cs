using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.DTOs
{
    [DataContract]
    public class JudgeAssignmentCreateDto
    {
        [DataMember]
        public Guid ContestId { get; set; }
        [DataMember]
        public Guid SubmissionId { get; set; }
        [DataMember]
        public Guid JudgeId { get; set; }
    }
}

