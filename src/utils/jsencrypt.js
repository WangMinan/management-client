import {JSEncrypt} from 'js-encrypt'
// 密钥对生成 http://web.chacuo.net/netrsakeypair
const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHQW5ppAC8daKpfhd38APfOjjy\n' +
  'Ccw9WXTJRVXnHYuH3EO4k0fHA6npSbT1IDgNOdigMEMDNnjwJ+No9icbVJuajlHv\n' +
  'w4H8Q1xTJvyHfgeYOh7no2HovAXRz4TPcDu6PbJDeFhgF90Zn+WORyNR+LSNR0w6\n' +
  'xOE8c+Lkop1duOVX2QIDAQAB'
// 加密
export function encrypt (txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}
