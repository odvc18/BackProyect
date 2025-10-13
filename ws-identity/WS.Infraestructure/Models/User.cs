using System.Runtime.Serialization;

namespace WS.Infraestructure.Models
{
    [DataContract]
    public class User
    {
        [DataMember]
        public Guid Id { get; set; }
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
        [DataMember]
        public bool IsActive { get; set; }
        [DataMember]
        public DateTime CreatedAt { get; set; }
        [DataMember]
        public DateTime UpdatedAt { get; set; }
    }
}
