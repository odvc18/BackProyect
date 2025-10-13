using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.DTOs
{
    [DataContract]
    public class UserUpdateDto
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public string? FirstName { get; set; }
        [DataMember]
        public string? LastName { get; set; }
        [DataMember]
        public string? Phone { get; set; }
        [DataMember]
        public string? Institution { get; set; }
    }
}
