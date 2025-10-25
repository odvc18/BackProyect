using System.Runtime.Serialization;

namespace WS.Infraestructure.Models
{
    [DataContract]
    public class SubmissionFile
    {
        [DataMember]
        public Guid Id { get; set; }
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
        [DataMember]
        public bool UploadCompleted { get; set; } = false;
        [DataMember]
        public DateTime CreatedAt { get; set; }
    }
}
