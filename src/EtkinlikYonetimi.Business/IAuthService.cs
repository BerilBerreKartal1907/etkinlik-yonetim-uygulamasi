namespace EtkinlikYonetimi.Business;

public interface IAuthService
{
    Task<AuthResultDto> RegisterAsync(RegisterRequestDto request);

    Task<AuthResultDto> LoginAsync(LoginRequestDto request);

    Task<AuthResultDto> UpdateProfileAsync(UpdateProfileRequestDto request);

    Task<UserProfileDto?> GetProfileAsync(int userId);
}