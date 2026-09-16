namespace EtkinlikYonetimi.Business;

public class UserProfileDto
{
    public int Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public DateTime BirthDate { get; set; }
}