namespace EtkinlikYonetimi.Business;

public class AuthResultDto
{
    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;

    public int? UserId { get; set; }
}