using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.DTOs
{
    [DataContract]
    public class ScoreCreateDto
    {
        [DataMember]
        public Guid JudgeAssignmentId { get; set; }
        [DataMember]
        public Guid? RubricCriterionId { get; set; }
        [DataMember]
        public decimal Score { get; set; }
        [DataMember]
        public string? Comments { get; set; }
    }
}

