using System.Text.RegularExpressions;
using EtkinlikYonetimi.DataAccess;
using EtkinlikYonetimi.Entity;
using Microsoft.EntityFrameworkCore;

namespace EtkinlikYonetimi.Business;

public class AuthService : IAuthService
{
    private readonly AppDbContext _dbContext;
    private readonly IPasswordEncryptionService _passwordEncryptionService;

    private static readonly Regex EmailRegex = new(
        @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
        RegexOptions.Compiled);

    // En az 8 karakter, en az bir büyük harf, bir küçük harf, bir rakam
    private static readonly Regex PasswordRegex = new(
        @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$",
        RegexOptions.Compiled);

    public AuthService(AppDbContext dbContext, IPasswordEncryptionService passwordEncryptionService)
    {
        _dbContext = dbContext;
        _passwordEncryptionService = passwordEncryptionService;
    }

    public async Task<AuthResultDto> RegisterAsync(RegisterRequestDto request)
    {
        // 1. Boş alan kontrolü
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password) ||
            string.IsNullOrWhiteSpace(request.PasswordConfirm) ||
            string.IsNullOrWhiteSpace(request.FirstName) ||
            string.IsNullOrWhiteSpace(request.LastName) ||
            request.BirthDate == default)
        {
            return new AuthResultDto { Success = false, Message = "Tüm alanları doldurunuz." };
        }

        // 2. Email format kontrolü
        if (!EmailRegex.IsMatch(request.Email))
        {
            return new AuthResultDto { Success = false, Message = "Geçerli bir mail adresi giriniz." };
        }

        // 3. Parola kural kontrolü (min 8 karakter, büyük-küçük harf, rakam)
        if (!PasswordRegex.IsMatch(request.Password))
        {
            return new AuthResultDto
            {
                Success = false,
                Message = "Parola en az 8 karakter olmalı ve büyük harf, küçük harf, rakam içermelidir."
            };
        }

        // 4. Parola - parola tekrar eşleşme kontrolü
        if (request.Password != request.PasswordConfirm)
        {
            return new AuthResultDto { Success = false, Message = "Parolalar eşleşmiyor." };
        }

        // 5. Email tekillik kontrolü
        var emailExists = await _dbContext.Users
            .AnyAsync(u => u.Email == request.Email);

        if (emailExists)
        {
            return new AuthResultDto { Success = false, Message = "Bu mail adresi ile kayıtlı bir kullanıcı zaten var." };
        }

        // 6. Kullanıcıyı oluştur ve kaydet
        var user = new User
        {
            Email = request.Email,
            PasswordEncrypted = _passwordEncryptionService.Encrypt(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            BirthDate = request.BirthDate,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return new AuthResultDto { Success = true, Message = "Kayıt başarıyla oluşturuldu.", UserId = user.Id };
    }

    public async Task<AuthResultDto> LoginAsync(LoginRequestDto request)
    {
        // 1. Boş alan kontrolü
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return new AuthResultDto { Success = false, Message = "Mail adresi ve parola alanları zorunludur." };
        }

        // 2. Kullanıcıyı email ile bul
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user is null)
        {
            return new AuthResultDto { Success = false, Message = "Bu mail adresi ile kayıtlı bir kullanıcı bulunamadı." };
        }

        // 3. Parolayı çöz ve karşılaştır
        var decryptedPassword = _passwordEncryptionService.Decrypt(user.PasswordEncrypted);

        if (decryptedPassword != request.Password)
        {
            return new AuthResultDto { Success = false, Message = "Parola hatalı." };
        }

        // 4. Başarılı giriş
        return new AuthResultDto { Success = true, Message = "Giriş başarılı.", UserId = user.Id };
    }

        public async Task<AuthResultDto> UpdateProfileAsync(UpdateProfileRequestDto request)
    {
        // 1. Boş alan kontrolü (parola artık diğer alanlar gibi zorunlu)
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.NewPassword) ||
            string.IsNullOrWhiteSpace(request.FirstName) ||
            string.IsNullOrWhiteSpace(request.LastName) ||
            request.BirthDate == default)
        {
            return new AuthResultDto { Success = false, Message = "Tüm alanları doldurunuz." };
        }

        // 2. Kullanıcı var mı kontrolü
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == request.UserId);

        if (user is null)
        {
            return new AuthResultDto { Success = false, Message = "Kullanıcı bulunamadı." };
        }

        // 3. Email format kontrolü
        if (!EmailRegex.IsMatch(request.Email))
        {
            return new AuthResultDto { Success = false, Message = "Geçerli bir mail adresi giriniz." };
        }

        // 4. Email çakışma kontrolü (kendi kaydı hariç, başka bir kullanıcıya ait mi?)
        var emailBelongsToAnotherUser = await _dbContext.Users
            .AnyAsync(u => u.Email == request.Email && u.Id != request.UserId);

        if (emailBelongsToAnotherUser)
        {
            return new AuthResultDto { Success = false, Message = "Bu mail adresi başka bir kullanıcıya kayıtlı." };
        }

        // 5. Parola kural kontrolü (kayıt sayfasındaki kriterlerle aynı)
        if (!PasswordRegex.IsMatch(request.NewPassword))
        {
            return new AuthResultDto
            {
                Success = false,
                Message = "Parola en az 8 karakter olmalı ve büyük harf, küçük harf, rakam içermelidir."
            };
        }

        // 6. Alanları güncelle
        user.Email = request.Email;
        user.PasswordEncrypted = _passwordEncryptionService.Encrypt(request.NewPassword);
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.BirthDate = request.BirthDate;

        await _dbContext.SaveChangesAsync();

        return new AuthResultDto { Success = true, Message = "Profil başarıyla güncellendi.", UserId = user.Id };
    }

        public async Task<UserProfileDto?> GetProfileAsync(int userId)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            return null;
        }

        return new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email,
            Password = _passwordEncryptionService.Decrypt(user.PasswordEncrypted),
            FirstName = user.FirstName,
            LastName = user.LastName,
            BirthDate = user.BirthDate
        };
    }
}