using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace WS.Infraestructure.Models.DTOs
{
    [DataContract]
    public class ContestUpdateDto
    {
        [DataMember]
        public string Title { get; set; }
        [DataMember]
        public string? Description { get; set; }
        [DataMember]
        public string? Rules { get; set; }
        [DataMember]
        public string Status { get; set; }
        [DataMember]
        public DateTime EndDate { get; set; }
        [DataMember]
        public DateTime? JudgingDate { get; set; }
        [DataMember]
        public Guid Id { get; set; }
    }
}
