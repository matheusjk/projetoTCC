frase = "teste encontra a frase usando python 3 muito top"

if 'python' in frase:  # fazendo busca usando o operador in do python 
    print('Achei')
else:
    print("Deu ruim")

print(frase.find('python 3')) # fazendo a busca dentro da string aqui se encontra na posicao 30

print(frase[30:])  # fazendo um slice pegando aqui da posicao 30 ate o fim da string
