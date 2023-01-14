import {JSEncrypt} from 'js-encrypt'
// 密钥对生成 http://web.chacuo.net/netrsakeypair
const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHQW5ppAC8daKpfhd38APfOjjy\n' +
  'Ccw9WXTJRVXnHYuH3EO4k0fHA6npSbT1IDgNOdigMEMDNnjwJ+No9icbVJuajlHv\n' +
  'w4H8Q1xTJvyHfgeYOh7no2HovAXRz4TPcDu6PbJDeFhgF90Zn+WORyNR+LSNR0w6\n' +
  'xOE8c+Lkop1duOVX2QIDAQAB'
const privateKey =
  'MIICXAIBAAKBgQDHQW5ppAC8daKpfhd38APfOjjyCcw9WXTJRVXnHYuH3EO4k0fH\n' +
  'A6npSbT1IDgNOdigMEMDNnjwJ+No9icbVJuajlHvw4H8Q1xTJvyHfgeYOh7no2Ho\n' +
  'vAXRz4TPcDu6PbJDeFhgF90Zn+WORyNR+LSNR0w6xOE8c+Lkop1duOVX2QIDAQAB\n' +
  'AoGBAJcFOLJI42Xzov3j29XDzKt8bXzFgE9fZezG6HzrH74xbAKRXm2wkS+H9ed0\n' +
  'LAeaOF3xNllRCAi9stby+mD0l5oONrjNp7pg4IxrEMcuvSoyKvX8+Y4i6yhPnc29\n' +
  'AUSMxzoyvGBO9cR8ajL6wMOMZT/EpzQPTo7q3CWth+rc3N6BAkEA7m8PX+hZ5WG/\n' +
  'daU3ZabiarXiwg1YAogUhMJl+mUjLyr9QeYOTyBXCPUbP6Qa0KpkFtPXwjjz5F7E\n' +
  '86JgFaAjjQJBANXvdPYMS8etvL1ahGtPos5vc0Em/VgEAqsqfcW/fjRw5DKeldak\n' +
  'VXuHG80i805BmCwFzbj3CvR5RwI8tcom7H0CQCMOqVAMtcsISEJf/HkxxHC0NZca\n' +
  'pyoYIAw1GRFr9XRl+b7KuKfhtWpXv53n3xl3NCg3Fa40+YdGd+bqpP4JAbECQCJD\n' +
  'N3gwf/J64L9yv8Jv/qMRNmQ42lo+Si8fnwUMpim/6swwmc7GgupFuS4hatYdq0Fh\n' +
  'rJDy/84nnje9gV/e3AECQFafIYgXYciUfv7PZXz9DEn83ZRRXhymCVzOlVYGx6Ro\n' +
  'TWvF3jCwkpi69O1Ze79H3wczl+rvgoWAL1TUZ8AlaIE='
// 加密
export function encrypt (txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}
// 解密
export function decrypt (txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}
