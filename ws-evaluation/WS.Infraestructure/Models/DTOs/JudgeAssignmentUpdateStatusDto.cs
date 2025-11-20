using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.DTOs
{
    [DataContract]
    public class JudgeAssignmentUpdateStatusDto
    {
        [DataMember]
        public string Id { get; set; } = string.Empty;
        
        [DataMember]
        public string Status { get; set; } = string.Empty;
    }
}

