using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.DTOs
{
    [DataContract]
    public class ContestCreateDto
    {
        [DataMember]
        public string Title { get; set; }
        [DataMember]
        public string? Description { get; set; }
        [DataMember]
        public string? Rules { get; set; }
        [DataMember]
        public string Status { get; set; }
        [DataMember]
        public DateTime StartDate { get; set; }
        [DataMember]
        public DateTime EndDate { get; set; }
        [DataMember]
        public DateTime? JudgingDate { get; set; }
        [DataMember]
        public int MaxSubmissionsPerParticipant { get; set; }
        [DataMember]
        public Guid CreatedByUserId { get; set; }
    }
}
