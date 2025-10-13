using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace WS.Infraestructure.Models.DTOs
{
    [DataContract]
    public class CategoryCreateDto
    {
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
    }
}
