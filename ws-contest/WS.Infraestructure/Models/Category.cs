using System.Runtime.Serialization;

namespace WS.Infraestructure.Models
{
    [DataContract]
    public class Category
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public Guid ContestId { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string? Description { get; set; }
        [DataMember]
        public int? MaxSubmissions { get; set; }
        [DataMember]
        public string? AllowedFileTypes { get; set; }
        [DataMember]
        public int MaxFileSizeMb { get; set; }
        [DataMember]
        public DateTime CreatedAt { get; set; }
    }
}
