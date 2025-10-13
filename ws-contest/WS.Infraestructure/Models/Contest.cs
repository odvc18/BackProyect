using System.Runtime.Serialization;

namespace WS.Infraestructure.Models
{
    [DataContract]
    public class Contest
    {
        [DataMember]
        public Guid Id { get; set; }
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
        [DataMember]
        public DateTime CreatedAt { get; set; }
        [DataMember]
        public DateTime UpdatedAt { get; set; }
        [DataMember]
        public List<Category>? Categories { get; set; }
    }
}
