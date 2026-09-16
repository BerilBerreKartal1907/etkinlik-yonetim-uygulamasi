using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace EtkinlikYonetimi.Business;

public class PasswordEncryptionService : IPasswordEncryptionService
{
    private readonly byte[] _key;

    public PasswordEncryptionService(IConfiguration configuration)
    {
        var keyText = configuration["EncryptionSettings:Key"];

        if (string.IsNullOrEmpty(keyText) || keyText.Length != 32)
        {
            throw new InvalidOperationException(
                "EncryptionSettings:Key ayarı eksik veya 32 karakter uzunluğunda değil.");
        }

        _key = Encoding.UTF8.GetBytes(keyText);
    }

    public string Encrypt(string plainText)
    {
        using var aes = Aes.Create();
        aes.Key = _key;
        aes.GenerateIV();

        using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
        using var memoryStream = new MemoryStream();

        // IV'yi (initialization vector) şifreli verinin başına ekliyoruz,
        // çözerken tekrar aynı IV'yi kullanabilmek için.
        memoryStream.Write(aes.IV, 0, aes.IV.Length);

        using (var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
        using (var writer = new StreamWriter(cryptoStream))
        {
            writer.Write(plainText);
        }

        return Convert.ToBase64String(memoryStream.ToArray());
    }

    public string Decrypt(string cipherText)
    {
        var fullCipher = Convert.FromBase64String(cipherText);

        using var aes = Aes.Create();
        aes.Key = _key;

        var iv = new byte[aes.BlockSize / 8];
        var cipher = new byte[fullCipher.Length - iv.Length];

        Array.Copy(fullCipher, 0, iv, 0, iv.Length);
        Array.Copy(fullCipher, iv.Length, cipher, 0, cipher.Length);

        aes.IV = iv;

        using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
        using var memoryStream = new MemoryStream(cipher);
        using var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
        using var reader = new StreamReader(cryptoStream);

        return reader.ReadToEnd();
    }
}