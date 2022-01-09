import sys
from random import randint, choice, random
from string import ascii_letters, digits, punctuation, whitespace


POPULATION_SIZE = 2048
ELITE_RATE = 0.10  # Коэффициент отбора
BEGIN = 0  # Смещение отбора
MUTATION_RATE = 0.25  # Коэффициент мутации

TARGET = 'I have never encountered any problem where genetic algorithms seemed to me the right way to attack it'
CHARS = ascii_letters + digits + punctuation + whitespace


def randstr():
    return ''.join([choice(CHARS) for i in range(len(TARGET))])


# Фитнес-функция
def fitness(value):
    return sum([abs(ord(value[j]) - ord(TARGET[j])) for j in range(len(TARGET))])


# Скрещивание
def mate(population, buffer):
    elite_size = int(POPULATION_SIZE * ELITE_RATE)

    for i in range(BEGIN, elite_size):  # Отбор (со смещением BEGIN)
        buffer[i] = population[i]

    for i in range(elite_size, POPULATION_SIZE):
        pos = randint(0, len(TARGET))
        buffer[i] = population[randint(0, POPULATION_SIZE // 2)][:pos] + \
                    population[randint(0, POPULATION_SIZE // 2)][pos:]  # Скрещивание
        if random() < MUTATION_RATE:  # Мутация
            pos = randint(0, len(TARGET) - 1)
            buffer[i] = buffer[i][:pos] + choice(CHARS) + buffer[i][pos + 1:]


def main():
    population = [randstr() for i in range(POPULATION_SIZE)]
    buffer = [randstr() for i in range(POPULATION_SIZE)]
    i = 0
    while True:
        population.sort(key=lambda c: fitness(c))
        print(f'{i:3d} {population[0]} {fitness(population[0]):4d}')
        if fitness(population[0]) == 0:
            return 0
        mate(population, buffer)
        population, buffer = buffer, population
        i += 1


if __name__ == '__main__':
    sys.exit(main())
