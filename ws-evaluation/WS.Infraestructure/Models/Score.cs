using System;
using System.Runtime.Serialization;

namespace WS.Infraestructure.Models
{
    [DataContract]
    public class Score
    {
        [DataMember]
        public Guid Id { get; set; }

        [DataMember]
        public Guid JudgeAssignmentId { get; set; }

        [DataMember]
        public Guid RubricCriterionId { get; set; }

        [DataMember]
        public decimal ScoreValue { get; set; }

        [DataMember]
        public string? Comments { get; set; }

        [DataMember]
        public DateTime ScoredAt { get; set; }
    }
}
