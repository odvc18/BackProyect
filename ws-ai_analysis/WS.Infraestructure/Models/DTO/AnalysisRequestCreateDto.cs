using System.Runtime.Serialization;

namespace WS.Infraestructure.Models.DTO
{
    [DataContract]
    public class AnalysisRequestCreateDto
    {
        [DataMember]
        public Guid SubmissionFileId { get; set; }

        [DataMember]
        public string FilePath { get; set; }

        [DataMember]
        public string AnalysisType { get; set; }
    }
}
