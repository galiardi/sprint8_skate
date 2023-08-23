// retorna un numero aleatorio de n digitos
// nunca retorna 0

function getRandomNumN(n = 1) {
  if (n < 1) throw new Error('El argumento no puede ser menor a 1');
  const randomNum = Math.floor(Math.random() * 10 ** n);
  // evita retornar un numero de menos de n digitos
  if (randomNum < 10 ** (n - 1)) return getRandomNumN(n);
  return randomNum;
}

export { getRandomNumN };
