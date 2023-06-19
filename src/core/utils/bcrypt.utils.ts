import * as bcrypt from 'bcrypt';

export const gerarHash = async (
  passSaltKey: string,
  salt: number,
): Promise<string> => {
  const pass = await bcrypt.hash(passSaltKey, salt);
  return pass;
};

export const compareHash = async (
  password: string,
  secret: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, secret);
};
