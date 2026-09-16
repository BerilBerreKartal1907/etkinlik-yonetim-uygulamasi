namespace EtkinlikYonetimi.Entity;

public class User
{
    public int Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string PasswordEncrypted { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public DateTime BirthDate { get; set; }

    public DateTime CreatedAt { get; set; }

    // Navigation property: bu kullanıcının oluşturduğu etkinlikler
    public ICollection<Event> Events { get; set; } = new List<Event>();
}