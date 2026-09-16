namespace EtkinlikYonetimi.Business;

public interface IPasswordEncryptionService
{
    string Encrypt(string plainText);

    string Decrypt(string cipherText);
}