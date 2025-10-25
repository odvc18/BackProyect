using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.DTOs
{
    [DataContract]
    public class SubmissionFileCreateDto
    {
        [DataMember]
        public Guid SubmissionId { get; set; }
        [DataMember]
        public string FileName { get; set; }
        [DataMember]
        public string OriginalName { get; set; }
        [DataMember]
        public string StoredPath { get; set; }
        [DataMember]
        public long FileSize { get; set; }
        [DataMember]
        public string MimeType { get; set; }
    }
}
