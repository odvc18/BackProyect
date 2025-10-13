using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.DTOs
{
    [DataContract]
    public class UserCreateDto
    {
        [DataMember]
        public string Email { get; set; }
        [DataMember]
        public string PasswordHash { get; set; }
        [DataMember]
        public string Role { get; set; }
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
