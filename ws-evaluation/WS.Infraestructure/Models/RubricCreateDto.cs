using System;
using System.Runtime.Serialization;

namespace WS.Infraestructure.Models
{
    [DataContract]
    public class RubricCreateDto
    {
        [DataMember]
        public Guid ContestId { get; set; }

        [DataMember]
        public string CriterionName { get; set; }

        [DataMember]
        public string? Description { get; set; }

        [DataMember]
        public decimal MaxScore { get; set; }

        [DataMember]
        public decimal Weight { get; set; }

        [DataMember]
        public int CriteriaOrder { get; set; }
    }
}
