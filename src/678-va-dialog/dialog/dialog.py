from random import choice, random
import re
from enum import Enum
from typing import List, Optional

from pymorphy2 import MorphAnalyzer

from .dictionary import greeting, joke, dont_understand, goodbye, evil, IGNORE_WORDS

from algorithms.leaves import get_leaves_data, normalize_leaves_data, fill_paths
from io_util.read_json import read_map
from recommender.recommend import recommend
from ttypes.data import LeafData, ExtendedLeafData
from ttypes.node import TreeNode

dish_p = r'(\s?(блюдо)\s?)'
drink_p = r'(\s?(напиток)\s?)'
item_p = r'(\s?(блюдо|напиток)( кавказской кухни)?\s?)'
description_p = r'(\s?(описание|описать|(рассказать о))\s?)'
yes_p = r'(\s?(да|ага|угу|так точно)\s?)'
agree_p = r'(\s?(хорошо|согласен|договорились|ок|окей)\s?)'
no_p = r'(\s?(не|нет|неа|никак нет)\s?)'
thanks_p = r'(\s?(спасибо|благодарить)\s?)'
bye_p = r'(\s?(пока|(до свидание))\s?)'
recommendation_p = r'(подобрать|посоветовать|подсказать|порекомендовать|какой выбрать)'


class State(Enum):
    INITIAL = 0
    KCAL = 1
    PRICE = 2
    WHERE_TO_TASTE = 3
    DESCRIPTION = 4
    RECOMMENDATION = 5
    HELP = 6
    EVIL = 7
    COMPLETION = 8
    WHERE = 9


class Dialog:
    def __init__(self, max_angry_level: int = 3, joker_level: float = 0.1):
        self.__state: State = State.INITIAL
        self.__sentence: str = ''

        self.__morph: MorphAnalyzer = MorphAnalyzer()

        self.__angry_level: int = 0
        self.__MAX_ANGRY_LEVEL: int = max_angry_level
        self.__JOKER_COEFFICIENT: float = joker_level

        self.__root: TreeNode = read_map()
        self.__leaves_data: List[LeafData] = get_leaves_data(self.__root)
        self.__extended_leaves_data: List[ExtendedLeafData] = normalize_leaves_data(self.__leaves_data)
        fill_paths(self.__root, self.__extended_leaves_data)

    def __get_item(self, name: str) -> Optional[ExtendedLeafData]:
        for extended_leaf_data in self.__extended_leaves_data:
            if extended_leaf_data.source['name'].lower() == name:
                return extended_leaf_data
        return None

    def run(self) -> None:
        self.__print(greeting())

        while True:
            match self.__state:
                case State.INITIAL:
                    self.__initial_state()
                case State.KCAL:
                    self.__kcal_state()
                    self.__joke()
                case State.PRICE:
                    self.__price_state()
                    self.__joke()
                case State.WHERE_TO_TASTE:
                    self.__where_to_taste_state()
                    self.__joke()
                case State.DESCRIPTION:
                    self.__description_state()
                    self.__joke()
                case State.RECOMMENDATION:
                    self.__recommendation_state()
                    self.__joke()
                case State.WHERE:
                    self.__where_state()
                    self.__joke()
                case State.HELP:
                    self.__help_state()
                case State.EVIL:
                    self.__print(evil())
                    return
                case State.COMPLETION:
                    self.__print(goodbye())
                    return

    def __initial_state(self) -> None:
        self.__input()

        if re.match(r'сколько (кило)?калория', self.__sentence):
            self.__state = State.KCAL
        elif re.match(r'(какой )?калорийность', self.__sentence):
            self.__state = State.KCAL

        elif re.match(r'сколько стоить', self.__sentence):
            self.__state = State.PRICE
        elif re.match(r'почём', self.__sentence):
            self.__state = State.PRICE
        elif re.match(r'(по )?какой (цена|стоимость)', self.__sentence):
            self.__state = State.PRICE

        elif re.match(r'где (можно )?попробовать', self.__sentence):
            self.__state = State.WHERE_TO_TASTE

        elif re.match(r'где (можно )?купить', self.__sentence):
            self.__state = State.WHERE

        elif re.match(rf'{description_p}', self.__sentence):
            self.__state = State.DESCRIPTION

        elif re.match(rf'{thanks_p}?{bye_p}', self.__sentence):
            self.__state = State.COMPLETION

        elif re.match(rf'{recommendation_p}', self.__sentence):
            self.__state = State.RECOMMENDATION

        elif re.match(rf'что( ты| вы)? уметь', self.__sentence):
            self.__state = State.HELP

        if self.__state != State.INITIAL:
            self.__angry_level = 0
        else:
            self.__angry_level += 1
            if self.__angry_level == self.__MAX_ANGRY_LEVEL:
                self.__state = State.EVIL
            else:
                self.__print(dont_understand())

    def __template_state(self, callback):
        name = self.__sentence.split()[-1]
        item = self.__get_item(name)
        if item is not None:
            self.__print(callback(item))
        else:
            self.__print_unknown(name)
        self.__state = State.INITIAL

    @staticmethod
    def __kcal_choice(item: ExtendedLeafData) -> str:
        return choice((
            f'{item.source["name"]} содержит {item.source["kcal"]} килокалорий на 100 грамм.',
        ))

    def __kcal_state(self) -> None:
        self.__template_state(self.__kcal_choice)

    @staticmethod
    def __price_choice(item: ExtendedLeafData) -> str:
        return choice((
            f'{item.source["name"]} можно купить по {item.source["price"]} рублей за 100 грамм.',
            f'{item.source["name"]} продаётся по {item.source["price"]} рублей за 100 грамм.',
        ))

    def __price_state(self) -> None:
        self.__template_state(self.__price_choice)

    @staticmethod
    def __where_to_taste_choice(item: ExtendedLeafData):
        return choice((
                f'Посетите {item.source["whereToTaste"]}, чтобы попробовать {item.source["name"]}.',
                f'Посетите {item.source["whereToTaste"]} — отличное место, чтобы попробовать {item.source["name"]}.',
        ))

    def __where_to_taste_state(self) -> None:
        self.__template_state(self.__where_to_taste_choice)

    @staticmethod
    def __description_choice(item: ExtendedLeafData) -> str:
        s = ''
        if item.source['name'] == 'Хачапури':
            s += 'О, а вот и моё любимое хачапури! Как хорошо, что вы спросили о нём.\n'
        non_alcoholic = "безалкогольный " if 'alcoholic' in item.source and not item.source['alcoholic'] else ""
        is_vegetarian = 'vegetarian' in item.source and item.source['vegetarian']
        s += f'{item.source["name"]} — это {non_alcoholic}{item.source["category"].lower()}. {item.path[1]}.\n'
        s += Dialog.__kcal_choice(item) + '\n'
        s += Dialog.__price_choice(item) + '\n'
        s += 'Подойдёт для вегетарианцев.\n' if is_vegetarian else ''
        s += Dialog.__where_to_taste_choice(item)
        return s

    def __description_state(self) -> None:
        self.__template_state(self.__description_choice)

    def __where_state(self) -> None:
        p_max = 999999
        if 'не дорогой' in self.__sentence or 'дешевле' in self.__sentence:
            for word in self.__sentence.split():
                try:
                    n = int(word)
                    p_max = n
                    break
                except ValueError:
                    pass
        for word in self.__sentence.split():
            item = self.__get_item(word)
            if item is not None:
                if item.source['price'] < p_max:
                    if p_max != 999999:
                        self.__print(f'Да, такое можно приобрести дешевле {p_max} р на 100 гр')
                    self.__print(self.__description_choice(item))
                    # self.__print(self.__where_to_taste_choice(item))
                else:
                    self.__print(f'К сожалению, такое нельзя  приобрести дешевле {p_max} р на 100 гр')
                break
        else:
            self.__print('К сожалению, ничего такого не знаю')
        self.__state = State.INITIAL

    def __recommendation_state(self) -> None:
        s = re.sub(rf'{recommendation_p}', '', self.__sentence)

        typing = []
        if 'блюдо' in s:
            typing.append('Еда')
        if 'напиток' in s or 'алкоголь' in s:
            typing.append('Напитки')
        if not typing:
            typing = ['Еда', 'Напитки']

        cuisine = []
        if 'армян' in s:
            cuisine.append('Армянская кухня')
        if 'грузин' in s:
            cuisine.append('Грузинская кухня')
        if 'азер' in s:
            cuisine.append('Азербайджанская кухня')
        if 'даг' in s:
            cuisine.append('Дагестанская кухня')
        if not cuisine:
            cuisine = ['Армянская кухня', 'Грузинская кухня', 'Азербайджанская кухня', 'Дагестанская кухня']

        non_alcoholic = False
        alcoholic = False
        if 'безалкогольный' in s:
            non_alcoholic = True
        elif 'алкогольный' in s or 'алкоголь' in s:
            alcoholic = True

        vegetarian = False
        if 'вегет' in s:
            vegetarian = True

        self.__print('Какие блюда/напитки вам больше всего нравятся?')
        likes = []
        for name in self.__input().split():
            item = self.__get_item(name)
            if item is None:
                self.__print_unknown(name)
            else:
                likes.append(item.source['name'])

        self.__print('А какие вы не любите?')
        dislikes = []
        for name in self.__input().split():
            item = self.__get_item(name)
            if item is None:
                self.__print_unknown(name)
            else:
                dislikes.append(item.source['name'])

        if 'хачапури' in dislikes:
            self.__print('Не любите хачапури?! Сделаю вид, что не видел этого..')
            self.__angry_level = self.__MAX_ANGRY_LEVEL - 1

        recommendation = recommend(self.__root, self.__extended_leaves_data, likes, dislikes)

        out = []
        for extended_leaf_data in recommendation:
            if extended_leaf_data.path[1] in cuisine and \
               extended_leaf_data.path[2] in typing:
                if 'alcoholic' in extended_leaf_data.source:
                    if non_alcoholic:
                        if extended_leaf_data.source['alcoholic']:
                            continue
                    if alcoholic:
                        if not extended_leaf_data.source['alcoholic']:
                            continue
                else:
                    if vegetarian:
                        if not extended_leaf_data.source['vegetarian']:
                            continue
                out.append(extended_leaf_data)

        if out:
            self.__print('Советую:')
            for i, item in enumerate(out):
                self.__print(i)
                self.__print(self.__description_choice(item))
        else:
            self.__print('К сожалению, ничего такого не знаю')

        self.__state = State.INITIAL

    def __help_state(self) -> None:
        self.__print('Я могу рассказать о блюдах и напитках кавказской кухни, что-нибудь порекомендовать, '
                     'или же разозлиться и уйти, если будете понапрасну тратить мое время.')

        self.__state = State.INITIAL

    def __joke(self) -> None:
        if random() < self.__JOKER_COEFFICIENT:
            self.__print(joke())

    def __input(self):
        sentence = input().translate(str.maketrans('', '', r"!$%&()*,-./:;<=>?@[\]^_`{|}~"))
        words = sentence.split()
        normal_words = [self.__morph.parse(word)[0].normal_form for word in words if word not in IGNORE_WORDS]
        self.__sentence = ' '.join(normal_words)
        print(self.__sentence)
        return self.__sentence

    @staticmethod
    def __print(*args) -> None:
        print('\033[94m', *args, '\033[0m', sep='')

    @staticmethod
    def __print_unknown(name):
        Dialog.__print(choice((
            f'К сожалению, ничего не знаю о "{name}".',
            f'"{name}" — не знаю такого блюда/напитка.',
        )))

