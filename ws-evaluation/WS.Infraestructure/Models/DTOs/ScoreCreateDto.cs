using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.DTOs
{
    [DataContract]
    public class ScoreCreateDto
    {
        [DataMember]
        public Guid JudgeAssignmentId { get; set; }

        [DataMember]
        public Guid RubricCriterionId { get; set; }

        [DataMember]
        public decimal ScoreValue { get; set; }

        [DataMember]
        public string? Comments { get; set; }
    }
}
