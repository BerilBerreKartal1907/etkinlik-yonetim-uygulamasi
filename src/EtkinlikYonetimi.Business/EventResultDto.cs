namespace EtkinlikYonetimi.Business;

public class EventResultDto
{
    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;

    public int? EventId { get; set; }
}