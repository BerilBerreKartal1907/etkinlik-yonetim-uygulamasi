namespace EtkinlikYonetimi.Business;

public class UpdateProfileRequestDto
{
    public int UserId { get; set; }

    public string Email { get; set; } = string.Empty;

    public string? NewPassword { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public DateTime BirthDate { get; set; }
}