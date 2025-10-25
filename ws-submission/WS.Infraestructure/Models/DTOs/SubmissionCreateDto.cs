using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.DTOs
{
    [DataContract]
    public class SubmissionCreateDto
    {
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
    }
}
